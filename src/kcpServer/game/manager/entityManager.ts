import SceneEntityAppear from '#/packets/SceneEntityAppear'
import SceneEntityDisappear from '#/packets/SceneEntityDisappear'
import uidPrefix from '#/utils/uidPrefix'
import Entity from '$/entity'
import Player from '$/player'
import Scene from '$/scene'
import Vector from '$/utils/vector'
import Logger from '@/logger'
import { ProtEntityTypeEnum, VisionTypeEnum } from '@/types/enum/entity'
import { ClientState } from '@/types/enum/state'

const logger = new Logger('ENTITY', 0x00a0ff)

export const WORLD_VIEW_DIST = 128
export const DEFAULT_VIEW_DIST = 256
export const GRID_SIZE = 64
export const DEFAULT_ENTITY_LIMIT = 32
export const ENTITY_LIMIT = {
  [ProtEntityTypeEnum.PROT_ENTITY_MONSTER]: 12,
  [ProtEntityTypeEnum.PROT_ENTITY_GADGET]: 128,
  [ProtEntityTypeEnum.PROT_ENTITY_NPC]: 128
}

function getPrefix(player: Player, vistionType: VisionTypeEnum): string {
  return uidPrefix(VisionTypeEnum[vistionType].split('_')[1]?.slice(0, 4)?.padEnd(4, ' ') || '????', player, 0xe0a000)
}

export default class EntityManager {
  scene: Scene

  registeredEntityMap: { [entityId: number]: Entity }
  entityGridMap: {
    [hash: number]: {
      nearbyHash: number[]
      entityTypeMap: {
        [entityType: number]: { [entityId: number]: Entity }
      }
    }
  }
  entityIdCounter: { [entityType: number]: number }
  gridCache: { [uid: number]: { [entityType: number]: { [hash: number]: number } } }

  activeEntityList: Entity[]

  paramBuffer: { [uid: number]: { [visionType: number]: number } }
  appearQueue: { [uid: number]: { [visionType: number]: Entity[] } }
  disappearQueue: { [uid: number]: { [visionType: number]: number[] } }

  viewDistance: number

  loop: NodeJS.Timer

  constructor(scene: Scene) {
    this.scene = scene

    this.registeredEntityMap = {}
    this.entityGridMap = {}
    this.gridCache = {}
    this.entityIdCounter = {}

    this.activeEntityList = []

    this.paramBuffer = {}
    this.appearQueue = {}
    this.disappearQueue = {}

    this.viewDistance = scene.type === 'SCENE_WORLD' ? WORLD_VIEW_DIST : DEFAULT_VIEW_DIST

    this.loop = setInterval(this.update.bind(this), 1e3)
  }

  private addEntityToMap(entity: Entity) {
    const { entityGridMap, viewDistance } = this
    const { entityId, entityType, motionInfo } = entity
    const { grid } = motionInfo.pos
    const { hash, X, Y, Z } = grid

    const { nearbyHash, entityTypeMap } = (entityGridMap[hash] = entityGridMap[hash] || {
      nearbyHash: [],
      entityTypeMap: {}
    })
    const entityMap = (entityTypeMap[entityType] = entityTypeMap[entityType] || {})

    entityMap[entityId] = entity
    entity.gridHash = hash

    if (nearbyHash.length > 0) return

    const r = Math.ceil(viewDistance / GRID_SIZE)

    const sX = X - r
    const sY = Y - r
    const sZ = Z - r

    const eX = X + r
    const eY = Y + r
    const eZ = Z + r

    const vec = new Vector()

    for (let x = sX; x <= eX; x++) {
      for (let y = sY; y <= eY; y++) {
        for (let z = sZ; z <= eZ; z++) {
          vec.set(x, y, z)
          nearbyHash.push(vec.hash)
        }
      }
    }
  }

  private removeEntityFromMap(entity: Entity) {
    const { entityGridMap } = this
    const { entityId, entityType, gridHash } = entity

    const entityMap = entityGridMap[gridHash]?.entityTypeMap?.[entityType]
    if (!entityMap) return

    delete entityMap[entityId]
    entity.gridHash = null
  }

  async destroy() {
    const { registeredEntityMap, loop } = this

    clearInterval(loop)

    for (let key in registeredEntityMap) await this.unregister(registeredEntityMap[key], true)
    await this.update()
  }

  async update() {
    const { scene, activeEntityList, gridCache } = this
    const { playerList } = scene

    // Clear cache
    for (let uid in gridCache) {
      for (let hash in gridCache[uid]) delete gridCache[uid][hash]
    }

    // Update active entity
    const activeEntities = activeEntityList.splice(0)
    for (let entity of activeEntities) {
      const { entityId, motionInfo, gridHash } = entity
      const { hash } = motionInfo.pos.grid

      if (gridHash === hash) continue

      logger.debug('Grid change:', gridHash, '->', hash, 'EntityID:', entityId)

      this.removeEntityFromMap(entity)
      this.addEntityToMap(entity)
    }

    // Is it not obvious?
    for (let player of playerList) this.updatePlayer(player)
  }

  async updatePlayer(player: Player, visionType: VisionTypeEnum = VisionTypeEnum.VISION_MEET, waitFlush: boolean = false, seqId?: number): Promise<void> {
    const { state, currentAvatar, loadedEntityIdList } = player

    if ((state & 0xF0FF) < (ClientState.ENTER_SCENE | ClientState.PRE_ENTER_SCENE_DONE)) return

    const entityList = this.getNearbyEntityList(currentAvatar)
    const seenEntityIdList = []

    for (let entity of entityList) {
      const { entityId } = entity
      const loaded = loadedEntityIdList.includes(entityId)
      const canLoad = this.canLoadEntity(player, entity)

      if (!loaded && canLoad) {
        loadedEntityIdList.push(entityId)
        this.appearQueuePush(player, entity, visionType)
      }

      if (canLoad) seenEntityIdList.push(entityId)
    }

    const missingEntities = loadedEntityIdList.filter(id => !seenEntityIdList.includes(id))
    for (let entityId of missingEntities) {
      loadedEntityIdList.splice(loadedEntityIdList.indexOf(entityId), 1)
      this.disappearQueuePush(player, entityId, VisionTypeEnum.VISION_MISS)
    }

    // Flush data
    if (waitFlush) {
      await this.disappearQueueFlush(player, seqId)
      await this.appearQueueFlush(player, seqId)
    } else {
      this.disappearQueueFlush(player, seqId)
      this.appearQueueFlush(player, seqId)
    }
  }

  isGridAvailable(player: Player, entity: Entity) {
    const { entityGridMap, gridCache } = this
    const { uid, loadedEntityIdList } = player
    const { entityType, gridHash } = entity

    const entityMap = entityGridMap[gridHash]?.entityTypeMap?.[entityType]
    if (!entityMap) return true

    const playerGridCache = gridCache[uid] = gridCache[uid] || {}
    const entTypeGridCache = playerGridCache[entityType] = playerGridCache[entityType] || {}

    const cache = entTypeGridCache[gridHash]
    if (cache != null) {
      if (cache <= 0) return false

      entTypeGridCache[gridHash]--
      return true
    }

    const entityLimit = ENTITY_LIMIT[entityType] || DEFAULT_ENTITY_LIMIT

    let count = 0
    for (let entityId in entityMap) {
      if (!loadedEntityIdList.includes(parseInt(entityId))) continue

      count++
      if (count >= entityLimit) {
        entTypeGridCache[gridHash] = 0
        return false
      }
    }

    entTypeGridCache[gridHash] = entityLimit - count
    return true
  }

  canLoadEntity(player: Player, entity: Entity): boolean {
    const { scene, viewDistance } = this
    const { state, currentScene, currentAvatar, loadedEntityIdList } = player
    const distance = entity.distanceTo2D(currentAvatar)
    const loaded = loadedEntityIdList.includes(entity.entityId)

    return (
      (state & 0xF0FF) >= (ClientState.ENTER_SCENE | ClientState.PRE_ENTER_SCENE_DONE) &&
      distance <= viewDistance &&
      scene === currentScene &&
      (loaded || this.isGridAvailable(player, entity))
    )
  }

  getNextEntityId(entityType: ProtEntityTypeEnum): number {
    const { entityIdCounter } = this

    if (entityIdCounter[entityType] == null) entityIdCounter[entityType] = Math.floor(Math.random() * 0x10000)

    entityIdCounter[entityType]++
    entityIdCounter[entityType] %= 0x10000

    return (entityType << 24) | entityIdCounter[entityType]
  }

  getEntity(entityId: number): Entity | null {
    const entity = this.registeredEntityMap[entityId]
    if (!entity || !entity.isOnScene) return null

    return entity
  }

  getNearbyEntityList(entity: Entity): Entity[] {
    const { entityGridMap } = this
    const { gridHash } = entity

    const entityGrid = entityGridMap[gridHash]
    if (!entityGrid) return []

    const { nearbyHash } = entityGrid
    const nearbyEntityMap = {}

    for (let hash of nearbyHash) {
      const grid = entityGridMap[hash]
      if (!grid) continue

      const { entityTypeMap } = grid
      for (let type in entityTypeMap) Object.assign(nearbyEntityMap, entityTypeMap[type] || {})
    }

    return Object.values(nearbyEntityMap)
  }

  async register(entity: Entity): Promise<void> {
    if (entity.manager === this) return
    if (entity.manager) await entity.manager.unregister(entity)

    entity.manager = this
    entity.entityId = this.getNextEntityId(entity.entityType)

    this.registeredEntityMap[entity.entityId] = entity

    await entity.emit('Register')

    logger.verbose('Register:', entity.entityId)
  }

  async unregister(entity: Entity, verbose: boolean = false): Promise<void> {
    if (entity.manager !== this) return
    if (this.getEntity(entity.entityId)) await this.remove(entity, VisionTypeEnum.VISION_REMOVE, undefined, undefined, verbose)

    logger.verbose('Unregister:', entity.entityId)

    await entity.emit('Unregister')

    delete this.registeredEntityMap[entity.entityId]

    entity.manager = null
    entity.entityId = null
  }

  async add(entity: Entity, vistionType: VisionTypeEnum = VisionTypeEnum.VISION_BORN, param?: number, immediate: boolean = false, seqId?: number, verbose: boolean = false): Promise<void> {
    if (entity.manager !== this) await this.register(entity)

    const { scene, activeEntityList } = this
    const { playerList } = scene
    const { entityId, motionInfo } = entity

    this.addEntityToMap(entity)
    activeEntityList.push(entity)

    // Set entity state
    entity.isOnScene = true

    motionInfo.sceneTime = null
    motionInfo.reliableSeq = null

    if (verbose) logger.verbose('Add:', entityId)
    else logger.debug('Add:', entityId)

    for (let player of playerList) {
      const { loadedEntityIdList } = player
      if (loadedEntityIdList.includes(entityId) || (!immediate && !this.canLoadEntity(player, entity))) continue

      loadedEntityIdList.push(entityId)
      this.appearQueuePush(player, entity, vistionType, param)

      if (!immediate) continue

      this.appearQueueFlush(player, seqId)
    }
  }

  async remove(entity: Entity | number, vistionType: VisionTypeEnum = VisionTypeEnum.VISION_MISS, immediate: boolean = false, seqId?: number, verbose: boolean = false): Promise<void> {
    const targetEntity = typeof entity === 'number' ? this.getEntity(entity) : entity

    if (targetEntity == null) return

    const { scene, activeEntityList } = this
    const { playerList } = scene
    const { entityId } = targetEntity

    this.removeEntityFromMap(targetEntity)
    activeEntityList.splice(activeEntityList.indexOf(targetEntity), 1)

    // Reset entity state
    targetEntity.isOnScene = false

    if (verbose) logger.verbose('Remove:', entityId)
    else logger.debug('Remove:', entityId)

    for (let player of playerList) {
      const { loadedEntityIdList } = player
      if (!loadedEntityIdList.includes(entityId)) continue

      loadedEntityIdList.splice(loadedEntityIdList.indexOf(entityId), 1)
      this.disappearQueuePush(player, entityId, vistionType)

      if (!immediate) continue

      this.disappearQueueFlush(player, seqId)
    }
  }

  async replace(oldEntity: Entity, newEntity: Entity, immediate: boolean = false, seqId?: number) {
    const { scene } = this
    const { playerList } = scene

    logger.debug('Replace:', oldEntity.entityId, '->', newEntity.entityId)

    for (let player of playerList) {
      const { loadedEntityIdList } = player
      const oldEntityId = oldEntity.entityId
      const oldLoaded = loadedEntityIdList.includes(oldEntityId)

      if (oldLoaded) await this.remove(oldEntity, VisionTypeEnum.VISION_REPLACE, immediate, seqId)
      if (immediate || this.canLoadEntity(player, newEntity)) await this.add(newEntity, oldLoaded ? VisionTypeEnum.VISION_REPLACE : VisionTypeEnum.VISION_BORN, oldLoaded ? oldEntityId : undefined, immediate, seqId)
    }
  }

  /**Queue functions**/
  appearQueuePush(player: Player, entity: Entity, visionType: VisionTypeEnum, param?: number) {
    const { paramBuffer, appearQueue } = this
    const { uid } = player

    paramBuffer[uid] = paramBuffer[uid] || {}
    paramBuffer[uid][visionType] = param

    appearQueue[uid] = appearQueue[uid] || {}
    appearQueue[uid][visionType] = appearQueue[uid][visionType] || []
    appearQueue[uid][visionType].push(entity)
  }

  disappearQueuePush(player: Player, entityId: number, visionType: VisionTypeEnum) {
    const { disappearQueue } = this
    const { uid } = player

    disappearQueue[uid] = disappearQueue[uid] || {}
    disappearQueue[uid][visionType] = disappearQueue[uid][visionType] || []
    disappearQueue[uid][visionType].push(entityId)
  }

  async appearQueueFlush(player: Player, seqId?: number) {
    const { uid, context } = player
    const paramBuffer = this.paramBuffer[uid] || {}
    const appearQueue = this.appearQueue[uid] || {}

    context.seqId = seqId || null

    for (let visionType in appearQueue) {
      const param = paramBuffer[visionType]
      const queue = appearQueue[visionType].splice(0).filter(entity => entity.manager === this)
      if (queue.length === 0) continue

      if (queue.length <= 4) {
        for (let entity of queue) logger.debug(getPrefix(player, parseInt(visionType)), 'A', 'EntityID:', entity.entityId)
      } else {
        logger.debug(getPrefix(player, parseInt(visionType)), 'A', `x${queue.length}`)
      }

      await SceneEntityAppear.sendNotify(context, queue, parseInt(visionType), param)
    }
  }

  async disappearQueueFlush(player: Player, seqId?: number) {
    const { uid, context } = player
    const disappearQueue = this.disappearQueue[uid] || {}

    context.seqId = seqId || null

    for (let visionType in disappearQueue) {
      const queue = disappearQueue[visionType]
      if (queue.length === 0) continue

      if (queue.length <= 4) {
        for (let entityId of queue) logger.debug(getPrefix(player, parseInt(visionType)), 'D', 'EntityID:', entityId)
      } else {
        logger.debug(getPrefix(player, parseInt(visionType)), 'D', `x${queue.length}`)
      }

      await SceneEntityDisappear.sendNotify(context, queue.splice(0), parseInt(visionType))
    }
  }
}