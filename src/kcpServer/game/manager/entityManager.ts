import Logger from '@/logger'
import Entity from '$/entity'
import Player from '$/player'
import Scene from '$/scene'
import { ProtEntityTypeEnum, VisionTypeEnum } from '@/types/enum/entity'
import SceneEntityAppear from '#/packets/SceneEntityAppear'
import SceneEntityDisappear from '#/packets/SceneEntityDisappear'
import { ClientState } from '@/types/enum/state'
import uidPrefix from '#/utils/uidPrefix'

const logger = new Logger('ENTITY', 0x00a0ff)

export const VIEW_DIST = 128
export const GRID_SIZE = 64
export const ENTITY_LIMIT = 12

function getPrefix(player: Player, vistionType: VisionTypeEnum): string {
  return uidPrefix(VisionTypeEnum[vistionType].split('_')[1]?.slice(0, 4)?.padEnd(4, ' ') || '????', player, 0xe0a000)
}

export default class EntityManager {
  scene: Scene

  registeredEntityMap: { [entityId: number]: Entity }
  onSceneEntityMap: { [entityId: number]: Entity }
  entityIdCounter: { [entityType: number]: number }
  gridCache: { [uid: number]: { [hash: number]: number } }
  paramBuffer: { [uid: number]: { [visionType: number]: number } }
  appearQueue: { [uid: number]: { [visionType: number]: Entity[] } }
  disappearQueue: { [uid: number]: { [visionType: number]: number[] } }

  loop: NodeJS.Timer

  constructor(scene: Scene) {
    this.scene = scene

    this.registeredEntityMap = {}
    this.onSceneEntityMap = {}
    this.gridCache = {}
    this.entityIdCounter = {}
    this.paramBuffer = {}
    this.appearQueue = {}
    this.disappearQueue = {}

    for (let i = 0; i <= 14; i++) this.entityIdCounter[i] = Math.floor(Math.random() * 0x10000)

    this.loop = setInterval(this.update.bind(this), 100)
  }

  async destroy() {
    const { registeredEntityMap, loop } = this

    clearInterval(loop)

    for (let key in registeredEntityMap) await this.unregister(registeredEntityMap[key], true)
    await this.update()
  }

  async update() {
    const { scene, gridCache } = this
    const { playerList } = scene

    for (let uid in gridCache) {
      for (let hash in gridCache[uid]) delete gridCache[uid][hash]
    }

    for (let player of playerList) {
      await this.updatePlayer(player)
    }
  }

  async updatePlayer(player: Player, waitFlush: boolean = false, seqId?: number): Promise<void> {
    const { onSceneEntityMap } = this
    const { state, loadedEntityIdList } = player

    if ((state & 0xF0FF) < (ClientState.ENTER_SCENE | ClientState.PRE_ENTER_SCENE_DONE)) return

    const seenEntities = []

    for (let key in onSceneEntityMap) {
      const entityId = parseInt(key)
      const entity = onSceneEntityMap[entityId]
      const loaded = loadedEntityIdList.includes(entityId)
      const canLoad = this.canLoadEntity(player, entity)

      if (!loaded && canLoad) {
        loadedEntityIdList.push(entityId)
        this.appearQueuePush(player, entity, VisionTypeEnum.VISION_MEET)
      }

      if (canLoad) seenEntities.push(entityId)
    }

    const missingEntities = loadedEntityIdList.filter(id => !seenEntities.includes(id))
    for (let entityId of missingEntities) {
      loadedEntityIdList.splice(loadedEntityIdList.indexOf(entityId), 1)
      this.disappearQueuePush(player, entityId, VisionTypeEnum.VISION_MISS)
    }

    // Send data
    if (waitFlush) {
      await this.disappearQueueFlush(player, seqId)
      await this.appearQueueFlush(player, seqId)
    } else {
      this.disappearQueueFlush(player, seqId)
      this.appearQueueFlush(player, seqId)
    }
  }

  isGridAvailable(player: Player, entity: Entity) {
    const { onSceneEntityMap, gridCache } = this
    const { uid, loadedEntityIdList } = player
    const { grid } = entity?.motionInfo?.pos || {}

    if (!grid) return false

    if (gridCache[uid] == null) gridCache[uid] = {}

    const { hash } = grid
    const cache = gridCache[uid][hash]
    if (cache != null) {
      if (cache <= 0) return false

      gridCache[uid][hash]--
      return true
    }

    let count = 0
    for (let entityId in onSceneEntityMap) {
      const ent = onSceneEntityMap[entityId]
      if (!loadedEntityIdList.includes(parseInt(entityId)) || !ent.gridEqual(grid)) continue

      count++
      if (count >= ENTITY_LIMIT) {
        gridCache[uid][hash] = 0
        return false
      }
    }

    gridCache[uid][hash] = ENTITY_LIMIT - count
    return true
  }

  canLoadEntity(player: Player, entity: Entity): boolean {
    const { scene } = this
    const { state, currentScene, currentAvatar, loadedEntityIdList } = player
    const distance = entity.distanceTo(currentAvatar)
    const loaded = loadedEntityIdList.includes(entity.entityId)

    return (
      (state & 0xF0FF) >= (ClientState.ENTER_SCENE | ClientState.PRE_ENTER_SCENE_DONE) &&
      distance <= VIEW_DIST &&
      scene === currentScene &&
      (loaded || this.isGridAvailable(player, entity))
    )
  }

  getNextEntityId(entityType: ProtEntityTypeEnum): number {
    const { entityIdCounter } = this

    entityIdCounter[entityType]++
    entityIdCounter[entityType] %= 0x10000

    return (entityType << 24) | entityIdCounter[entityType]
  }

  getEntity(entityId: number): Entity | null {
    return this.onSceneEntityMap[entityId] || null
  }

  async register(entity: Entity): Promise<void> {
    if (entity.manager === this) return
    if (entity.manager) await entity.manager.unregister(entity)

    this.registeredEntityMap[entity.entityId] = entity
    entity.manager = this
    entity.entityId = this.getNextEntityId(entity.entityType)

    await entity.emit('Register')

    logger.verbose('Register:', entity.entityId)
  }

  async unregister(entity: Entity, verbose: boolean = false): Promise<void> {
    if (entity.manager !== this) return

    logger.verbose('Unregister:', entity.entityId)

    await entity.emit('Unregister')

    if (this.getEntity(entity.entityId)) await this.remove(entity, undefined, undefined, undefined, verbose)

    delete this.registeredEntityMap[entity.entityId]
    entity.manager = null
    entity.entityId = null
  }

  async add(entity: Entity, vistionType: VisionTypeEnum = VisionTypeEnum.VISION_BORN, param?: number, immediate: boolean = false, seqId?: number, verbose: boolean = false): Promise<void> {
    if (entity.manager !== this) await this.register(entity)

    this.onSceneEntityMap[entity.entityId] = entity
    entity.motionInfo.sceneTime = null
    entity.motionInfo.reliableSeq = null
    entity.isOnScene = true

    const { entityId } = entity
    const { playerList } = this.scene

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
    const { scene, onSceneEntityMap } = this
    const targetEntity = typeof entity === 'number' ? onSceneEntityMap[entity] : entity

    delete onSceneEntityMap[targetEntity.entityId]
    targetEntity.isOnScene = false

    const { entityId } = targetEntity
    const { playerList } = scene

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
      const queue = appearQueue[visionType]
      if (queue.length === 0) continue

      for (let entity of queue) logger.debug(getPrefix(player, parseInt(visionType)), 'A', entity.entityId)
      await SceneEntityAppear.sendNotify(context, queue.splice(0), parseInt(visionType), param)
    }
  }

  async disappearQueueFlush(player: Player, seqId?: number) {
    const { uid, context } = player
    const disappearQueue = this.disappearQueue[uid] || {}

    context.seqId = seqId || null

    for (let visionType in disappearQueue) {
      const queue = disappearQueue[visionType]
      if (queue.length === 0) continue

      for (let entityId of queue) logger.debug(getPrefix(player, parseInt(visionType)), 'D', entityId)
      await SceneEntityDisappear.sendNotify(context, queue.splice(0), parseInt(visionType))
    }
  }
}