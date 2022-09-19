import BaseClass from '#/baseClass'
import EntityAuthorityChange from '#/packets/EntityAuthorityChange'
import SceneEntityAppear from '#/packets/SceneEntityAppear'
import SceneEntityDisappear from '#/packets/SceneEntityDisappear'
import uidPrefix from '#/utils/uidPrefix'
import Entity from '$/entity'
import Avatar from '$/entity/avatar'
import Player from '$/player'
import Scene from '$/scene'
import Vector from '$/utils/vector'
import Logger from '@/logger'
import { ClientStateEnum, EntityTypeEnum } from '@/types/enum'
import { ProtEntityTypeEnum, SceneEnterTypeEnum, VisionTypeEnum } from '@/types/proto/enum'

const logger = new Logger('ENTITY', 0x00a0ff)

export const WORLD_VIEW_DIST = 128
export const DEFAULT_VIEW_DIST = 256
export const GRID_SIZE = 64
export const DEFAULT_ENTITY_LIMIT = 32
export const ENTITY_LIMIT = {
  [EntityTypeEnum.Monster]: 12,
  [EntityTypeEnum.Gadget]: 128,
  [EntityTypeEnum.Chest]: 128
}

interface EntityLoadState {
  stateChanged: boolean
  loaded: boolean
}

function getPrefix(player: Player, visionType: VisionTypeEnum): string {
  return uidPrefix(VisionTypeEnum[visionType].split('_')[1]?.slice(0, 4)?.padEnd(4, ' ') || '????', player, 0xe0a000)
}

export default class EntityManager extends BaseClass {
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

  paramBuffer: { [uid: number]: { [visionType: number]: number } }
  appearQueue: { [uid: number]: { [visionType: number]: Entity[] } }
  disappearQueue: { [uid: number]: { [visionType: number]: number[] } }

  viewDistance: number

  constructor(scene: Scene) {
    super()

    this.scene = scene

    this.registeredEntityMap = {}
    this.entityGridMap = {}
    this.entityIdCounter = {}

    this.paramBuffer = {}
    this.appearQueue = {}
    this.disappearQueue = {}

    this.viewDistance = 0

    super.initHandlers(scene)
  }

  private getNextEntityId(protEntityType: ProtEntityTypeEnum, forceSetId?: number): number {
    const { entityIdCounter } = this

    if (entityIdCounter[protEntityType] == null) entityIdCounter[protEntityType] = Math.floor(Math.random() * 0x10000)

    if (forceSetId != null) {
      entityIdCounter[protEntityType] = forceSetId & 0xFFFFFF
      return forceSetId
    }

    entityIdCounter[protEntityType]++
    entityIdCounter[protEntityType] %= 0x10000

    return (protEntityType << 24) | entityIdCounter[protEntityType]
  }

  private isGridAvailable(player: Player, entity: Entity): boolean {
    const { entityGridCountMap } = player
    const { entityType, gridHash } = entity

    const entityLimit = ENTITY_LIMIT[entityType] || DEFAULT_ENTITY_LIMIT
    const entityCount = entityGridCountMap[gridHash]?.[entityType] || 0

    return entityCount < entityLimit
  }

  private isEntityLoadable(player: Player, entity: Entity, loaded: boolean): boolean {
    const { scene, viewDistance } = this
    const { state, currentScene, currentAvatar } = player

    return (
      entity.isOnScene &&
      (state & 0xF0FF) >= (ClientStateEnum.ENTER_SCENE | ClientStateEnum.PRE_ENTER_SCENE_DONE) &&
      entity.distanceTo2D(currentAvatar) <= viewDistance &&
      scene === currentScene &&
      (loaded || this.isGridAvailable(player, entity))
    )
  }

  private canLoadEntity(player: Player, entity: Entity): boolean {
    const { loadedEntityIdList } = player
    return !loadedEntityIdList.includes(entity.entityId) && this.isEntityLoadable(player, entity, false)
  }

  private canUnloadEntity(player: Player, entity: Entity, force: boolean = false) {
    const { loadedEntityIdList } = player
    return loadedEntityIdList.includes(entity.entityId) && (force || !this.isEntityLoadable(player, entity, true))
  }

  private addEntityToMap(entity: Entity) {
    const { entityGridMap, viewDistance } = this
    const { entityId, entityType, motion } = entity
    const { grid } = motion.pos
    const { hash, x: X, y: Y, z: Z } = grid

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

  private playerLoadEntity(player: Player, entity: Entity, visionType: VisionTypeEnum, param?: number): EntityLoadState {
    const { loadedEntityIdList, entityGridCountMap } = player
    const { entityId, entityType, gridHash } = entity

    const canLoad = this.canLoadEntity(player, entity)

    if (canLoad) {
      loadedEntityIdList.push(entityId)

      const entityCountMap = entityGridCountMap[gridHash] = entityGridCountMap[gridHash] || {}
      if (entityCountMap[entityType] == null) entityCountMap[entityType] = 0
      entityCountMap[entityType]++

      this.appearQueuePush(player, entity, visionType, param)

      if (entity.updateAuthorityPeer()) EntityAuthorityChange.addEntity(entity)
    }

    return {
      stateChanged: canLoad,
      loaded: loadedEntityIdList.includes(entityId)
    }
  }

  private playerUnloadEntity(player: Player, entity: Entity, visionType: VisionTypeEnum, force: boolean = false): EntityLoadState {
    const { loadedEntityIdList, entityGridCountMap } = player
    const { entityId, entityType, gridHash } = entity

    const canUnload = this.canUnloadEntity(player, entity, force)

    if (canUnload) {
      loadedEntityIdList.splice(loadedEntityIdList.indexOf(entityId), 1)

      const entityCountMap = entityGridCountMap[gridHash]
      if (entityCountMap?.[entityType] != null) {
        entityCountMap[entityType]--
        if (entityCountMap[entityType] < 0) logger.debug('Entity count < 0, WTF?')
      }

      this.disappearQueuePush(player, entityId, visionType)

      if (entity.updateAuthorityPeer()) EntityAuthorityChange.addEntity(entity)
    }

    return {
      stateChanged: canUnload,
      loaded: loadedEntityIdList.includes(entityId)
    }
  }

  init() {
    const { scene } = this

    this.viewDistance = scene.type === 'SCENE_WORLD' ? WORLD_VIEW_DIST : DEFAULT_VIEW_DIST
  }

  async destroy() {
    const { registeredEntityMap } = this
    for (const key in registeredEntityMap) await this.unregister(registeredEntityMap[key], true)
  }

  getEntity(entityId: number, onScene: boolean = false): Entity | null {
    const entity = this.registeredEntityMap[entityId]
    if (!entity || (onScene && !entity.isOnScene)) return null

    return entity
  }

  getNearbyEntityList(entity: Entity): Entity[] {
    const { entityGridMap } = this
    const { gridHash } = entity

    const entityGrid = entityGridMap[gridHash]
    if (!entityGrid) return []

    const { nearbyHash } = entityGrid
    const nearbyEntityMap = {}

    for (const hash of nearbyHash) {
      const grid = entityGridMap[hash]
      if (!grid) continue

      const { entityTypeMap } = grid
      for (const type in entityTypeMap) Object.assign(nearbyEntityMap, entityTypeMap[type] || {})
    }

    return Object.values(nearbyEntityMap)
  }

  async register(entity: Entity): Promise<void> {
    const { manager } = entity

    if (manager === this) return
    if (manager) await manager.unregister(entity)

    entity.manager = this
    entity.entityId = this.getNextEntityId(entity.protEntityType, entity.entityId)

    const { entityId } = entity

    this.registeredEntityMap[entityId] = entity

    await entity.emit('Register')

    logger.verbose('Register:', entityId)
  }

  async unregister(entity: Entity, batch: boolean = false): Promise<void> {
    const { manager, entityId } = entity

    if (manager !== this) return
    if (this.getEntity(entityId, true)) await this.remove(entity, VisionTypeEnum.VISION_REMOVE, undefined, batch)

    logger.verbose('Unregister:', entityId)

    await entity.emit('Unregister')

    delete this.registeredEntityMap[entityId]

    entity.manager = null
    entity.entityId = null
  }

  async add(entity: Entity, visionType: VisionTypeEnum = VisionTypeEnum.VISION_BORN, param?: number, seqId?: number, batch: boolean = false): Promise<void> {
    if (entity.manager !== this) await this.register(entity)

    const { scene } = this
    const { playerList, broadcastContextList } = scene
    const { entityId, motion } = entity

    this.addEntityToMap(entity)

    // Set entity state
    entity.isOnScene = true

    motion.sceneTime = null
    motion.reliableSeq = null

    if (batch) logger.verbose('Add:', entityId)
    else logger.debug('Add:', entityId)

    for (const player of playerList) {
      const { stateChanged } = this.playerLoadEntity(player, entity, visionType, param)
      if (stateChanged && !batch) await this.appearQueueFlush(player, seqId)
    }

    await EntityAuthorityChange.broadcastNotify(broadcastContextList)
    await entity.emit('OnScene')
  }

  async remove(entity: Entity | number, visionType: VisionTypeEnum = VisionTypeEnum.VISION_MISS, seqId?: number, batch: boolean = false): Promise<void> {
    const targetEntity = typeof entity === 'number' ? this.getEntity(entity) : entity

    if (targetEntity == null) return

    const { scene } = this
    const { playerList, broadcastContextList } = scene
    const { entityId } = targetEntity

    // Reset entity state
    targetEntity.authorityPeerId = null
    targetEntity.isOnScene = false

    if (batch) logger.verbose('Remove:', entityId)
    else logger.debug('Remove:', entityId)

    for (const player of playerList) {
      const { stateChanged } = this.playerUnloadEntity(player, targetEntity, visionType, true)
      if (stateChanged) {
        await this.updateAllEntity(player)
        if (!batch) await this.disappearQueueFlush(player, seqId)
      }
    }

    this.removeEntityFromMap(targetEntity)

    await EntityAuthorityChange.broadcastNotify(broadcastContextList)
    await targetEntity.emit('OffScene')
  }

  async replace(oldEntity: Entity, newEntity: Entity, seqId?: number) {
    const { entityId: oldEntityId } = oldEntity

    logger.debug('Replace:', oldEntity.entityId, '->', newEntity.entityId)

    await this.remove(oldEntity, VisionTypeEnum.VISION_REPLACE, seqId)
    await this.add(newEntity, VisionTypeEnum.VISION_REPLACE, oldEntityId, seqId)
  }

  async updateEntity(entity: Entity) {
    const { scene } = this
    const { playerList, broadcastContextList } = scene
    const { entityId, entityType, gridHash: oldHash } = entity

    logger.debug('Update EntityID:', entityId)

    // Update entity grid
    this.removeEntityFromMap(entity)
    this.addEntityToMap(entity)

    const { gridHash: newHash } = entity

    for (const player of playerList) {
      const { entityGridCountMap } = player

      const oldEntityCountMap = entityGridCountMap[oldHash]
      if (oldEntityCountMap?.[entityType] != null) oldEntityCountMap[entityType]--

      const newEntityCountMap = entityGridCountMap[newHash] = entityGridCountMap[newHash] || {}
      if (newEntityCountMap[entityType] == null) newEntityCountMap[entityType] = 0
      newEntityCountMap[entityType]++

      const loadState = this.playerLoadEntity(player, entity, VisionTypeEnum.VISION_MEET)
      if (!loadState.stateChanged && loadState.loaded) {
        const unloadState = this.playerUnloadEntity(player, entity, VisionTypeEnum.VISION_MISS)
        if (unloadState.stateChanged) await this.updateAllEntity(player)
      }
    }

    if (entityType === EntityTypeEnum.Avatar) await this.updateAllEntity((<Avatar>entity).player)

    await EntityAuthorityChange.broadcastNotify(broadcastContextList)
    scene.emit('EntityUpdate', entity)
  }

  async updateAllEntity(player: Player) {
    const { scene } = this
    const { broadcastContextList } = scene
    const { currentAvatar, loadedEntityIdList } = player

    const nearbyEntityList = this.getNearbyEntityList(currentAvatar)
    const seenEntityIdList: number[] = []

    for (const entity of nearbyEntityList) {
      const { entityId } = entity

      if (loadedEntityIdList.includes(entityId)) this.playerUnloadEntity(player, entity, VisionTypeEnum.VISION_MISS)
      else this.playerLoadEntity(player, entity, VisionTypeEnum.VISION_MEET)

      seenEntityIdList.push(entityId)
    }

    const missingEntityIdList = loadedEntityIdList.filter(entityId => !seenEntityIdList.includes(entityId))
    for (const entityId of missingEntityIdList) {
      const entity = this.getEntity(entityId, true)
      if (!entity) continue

      this.playerUnloadEntity(player, entity, VisionTypeEnum.VISION_MISS)
    }

    await EntityAuthorityChange.broadcastNotify(broadcastContextList)
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

    for (const visionType in appearQueue) {
      const param = paramBuffer[visionType]
      const queue = appearQueue[visionType].splice(0).filter(entity => entity.manager === this)
      if (queue.length === 0) continue

      if (queue.length <= 4) {
        for (const entity of queue) logger.debug(getPrefix(player, parseInt(visionType)), 'A', 'EntityID:', entity.entityId)
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

    for (const visionType in disappearQueue) {
      const queue = disappearQueue[visionType]
      if (queue.length === 0) continue

      if (queue.length <= 4) {
        for (const entityId of queue) logger.debug(getPrefix(player, parseInt(visionType)), 'D', 'EntityID:', entityId)
      } else {
        logger.debug(getPrefix(player, parseInt(visionType)), 'D', `x${queue.length}`)
      }

      await SceneEntityDisappear.sendNotify(context, queue.splice(0), parseInt(visionType))
    }
  }

  async flushAll(seqId?: number) {
    const { scene } = this
    const { playerList } = scene

    for (const player of playerList) {
      await this.disappearQueueFlush(player, seqId)
      await this.appearQueueFlush(player, seqId)
    }
  }

  /**Events**/
  async handlePlayerJoin(player: Player, sceneEnterType: SceneEnterTypeEnum, seqId: number) {
    const { scene } = this
    const { broadcastContextList } = scene
    const { currentAvatar } = player

    if (!currentAvatar) return // Shouldn't happen, but just in case...

    let visionType: VisionTypeEnum
    switch (sceneEnterType) {
      case SceneEnterTypeEnum.ENTER_GOTO:
      case SceneEnterTypeEnum.ENTER_GOTO_BY_PORTAL:
        visionType = VisionTypeEnum.VISION_TRANSPORT
        break
      default:
        visionType = VisionTypeEnum.VISION_BORN
    }

    // Add avatar to scene
    await this.add(currentAvatar, visionType, undefined, seqId)

    // Clear avatar motion params
    currentAvatar.motion.params = []

    const entityList = this.getNearbyEntityList(currentAvatar)
    for (const entity of entityList) this.playerLoadEntity(player, entity, visionType)

    // Send notify
    await this.appearQueueFlush(player, seqId)
    await EntityAuthorityChange.broadcastNotify(broadcastContextList)

    logger.debug('PlayerJoin event handled.')
  }

  async handlePlayerLeave(player: Player) {
    const { scene } = this
    const { broadcastContextList } = scene
    const { loadedEntityIdList, missedEntityIdList, entityGridCountMap } = player

    const entityList = loadedEntityIdList.splice(0)

    for (const entityId of entityList) {
      const entity = this.getEntity(entityId, true)
      if (!entity) continue

      if (entity.updateAuthorityPeer()) EntityAuthorityChange.addEntity(entity)
    }

    missedEntityIdList.push(...entityList)

    for (const hash in entityGridCountMap) delete entityGridCountMap[hash]

    // Send notify
    await EntityAuthorityChange.broadcastNotify(broadcastContextList)
  }
}