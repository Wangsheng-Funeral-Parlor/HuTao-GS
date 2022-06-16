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

const viewDistance = 128

function getPrefix(player: Player, vistionType: VisionTypeEnum): string {
  return uidPrefix(VisionTypeEnum[vistionType].split('_')[1]?.slice(0, 4)?.padEnd(4, ' ') || '????', player, 0xe0a000)
}

export default class EntityManager {
  scene: Scene

  entityMap: { [entityId: number]: Entity }
  entityIdCounter: { [entityType: number]: number }
  paramBuffer: { [uid: number]: { [visionType: number]: number } }
  appearQueue: { [uid: number]: { [visionType: number]: Entity[] } }
  disappearQueue: { [uid: number]: { [visionType: number]: number[] } }

  loop: NodeJS.Timer

  constructor(scene: Scene) {
    this.scene = scene
    this.entityMap = {}
    this.entityIdCounter = {}
    this.paramBuffer = {}
    this.appearQueue = {}
    this.disappearQueue = {}

    for (let i = 0; i <= 14; i++) this.entityIdCounter[i] = Math.floor(Math.random() * 0x10000)

    this.loop = setInterval(this.update.bind(this), 100)
  }

  async destroy() {
    const { entityMap, loop } = this

    clearInterval(loop)

    for (let key in entityMap) await this.unregister(entityMap[key])
    await this.update()
  }

  async update() {
    const { playerList } = this.scene
    for (let player of playerList) {
      await this.updatePlayer(player)
    }
  }

  async updatePlayer(player: Player, waitFlush: boolean = false, seqId?: number): Promise<void> {
    const { entityMap } = this
    const { state, loadedEntityIdList } = player

    if ((state & 0xF0FF) < (ClientState.ENTER_SCENE | ClientState.PRE_ENTER_SCENE_DONE)) return

    const seenEntities = []

    for (let key in entityMap) {
      const entityId = parseInt(key)
      const entity = entityMap[entityId]
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

  canLoadEntity(player: Player, entity: Entity) {
    const { scene } = this
    const { state, currentScene, currentAvatar } = player
    const distance = entity.distanceTo(currentAvatar)

    return (
      (state & 0xF0FF) >= (ClientState.ENTER_SCENE | ClientState.PRE_ENTER_SCENE_DONE) &&
      distance <= viewDistance &&
      scene === currentScene
    )
  }

  getNextEntityId(entityType: ProtEntityTypeEnum) {
    const { entityIdCounter } = this

    entityIdCounter[entityType]++
    entityIdCounter[entityType] %= 0x10000

    return (entityType << 24) | entityIdCounter[entityType]
  }

  getEntity(entityId: number) {
    return this.entityMap[entityId]
  }

  async register(entity: Entity): Promise<void> {
    if (entity.manager === this) return
    if (entity.manager) await entity.manager.unregister(entity)

    entity.manager = this
    entity.entityId = this.getNextEntityId(entity.entityType)

    await entity.emit('Register')

    logger.verbose('Register:', entity.entityId)
  }

  async unregister(entity: Entity): Promise<void> {
    if (entity.manager !== this) return

    logger.verbose('Unregister:', entity.entityId)

    await entity.emit('Unregister')

    if (this.getEntity(entity.entityId)) await this.remove(entity)

    entity.manager = null
    entity.entityId = null
  }

  async add(entity: Entity, vistionType: VisionTypeEnum = VisionTypeEnum.VISION_BORN, param?: number, immediate: boolean = false, seqId?: number): Promise<void> {
    if (entity.manager !== this) await this.register(entity)

    this.entityMap[entity.entityId] = entity
    entity.motionInfo.sceneTime = null
    entity.motionInfo.reliableSeq = null
    entity.isOnScene = true

    const { entityId } = entity
    const { playerList } = this.scene

    logger.debug('Add:', entityId)

    for (let player of playerList) {
      const { loadedEntityIdList } = player
      if (loadedEntityIdList.includes(entityId) || !this.canLoadEntity(player, entity)) continue

      loadedEntityIdList.push(entityId)
      this.appearQueuePush(player, entity, vistionType, param)

      if (!immediate) continue

      this.appearQueueFlush(player, seqId)
    }
  }

  async remove(entity: Entity | number, vistionType: VisionTypeEnum = VisionTypeEnum.VISION_MISS, immediate: boolean = false, seqId?: number): Promise<void> {
    const { scene, entityMap } = this
    const targetEntity = typeof entity === 'number' ? entityMap[entity] : entity

    delete this.entityMap[targetEntity.entityId]
    targetEntity.isOnScene = false

    const { entityId } = targetEntity
    const { playerList } = scene

    logger.debug('Remove:', entityId)

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
      const { currentScene, currentAvatar, loadedEntityIdList } = player
      const sameScene = (scene === currentScene)
      const oldEntityId = oldEntity.entityId
      const oldLoaded = loadedEntityIdList.includes(oldEntityId)
      const newDistance = newEntity.distanceTo(currentAvatar)
      const newCanLoad = (newDistance <= viewDistance && sameScene)

      if (oldLoaded) await this.remove(oldEntity, VisionTypeEnum.VISION_REPLACE, immediate, seqId)
      if (newCanLoad) await this.add(newEntity, oldLoaded ? VisionTypeEnum.VISION_REPLACE : VisionTypeEnum.VISION_BORN, oldLoaded ? oldEntityId : undefined, immediate, seqId)
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