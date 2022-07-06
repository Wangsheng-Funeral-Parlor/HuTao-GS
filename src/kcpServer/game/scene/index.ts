import BaseClass from '#/baseClass'
import { PacketContext } from '#/packet'
import GuestBeginEnterScene from '#/packets/GuestBeginEnterScene'
import PlayerEnterScene, { PlayerEnterSceneNotify } from '#/packets/PlayerEnterScene'
import ScenePlayerLocation from '#/packets/ScenePlayerLocation'
import SceneTime from '#/packets/SceneTime'
import uidPrefix from '#/utils/uidPrefix'
import DungeonData from '$/gameData/data/DungeonData'
import SceneData from '$/gameData/data/SceneData'
import AbilityManager from '$/manager/abilityManager'
import EntityManager from '$/manager/entityManager'
import Player from '$/player'
import Vector from '$/utils/vector'
import World from '$/world'
import Logger from '@/logger'
import { SceneEnterReasonEnum, SceneEnterTypeEnum } from '@/types/enum/scene'
import { ClientState } from '@/types/enum/state'
import { ScenePlayerInfo } from '@/types/game/playerInfo'
import { PlayerWorldSceneInfo } from '@/types/game/scene'
import { SceneTeamAvatar } from '@/types/game/team'
import { getTimeSeconds } from '@/utils/time'
import SceneBlock from './sceneBlock'
import SceneTag from './sceneTag'

const logger = new Logger('GSCENE', 0xefa8ec)

export default class Scene extends BaseClass {
  world: World

  id: number
  type: string
  enterSceneToken: number

  sceneTagList: SceneTag[]
  sceneBlockList: SceneBlock[]

  abilitymanager: AbilityManager
  entityManager: EntityManager
  playerList: Player[]

  timestampSceneTime: number
  timestamp: number
  paused: boolean

  dieY: number

  isLocked: boolean
  beginTime: number

  lastLocUpdate: number
  lastTimeUpdate: number

  destroyed: boolean

  constructor(world: World, sceneId: number) {
    super()

    this.world = world

    this.id = sceneId
    this.enterSceneToken = Math.floor(Math.random() * 1e4)

    this.sceneTagList = []
    this.sceneBlockList = []

    this.abilitymanager = new AbilityManager(this)
    this.entityManager = new EntityManager(this)

    this.playerList = []

    this.dieY = 0

    super.initHandlers(this)
  }

  private async loadSceneData() {
    const { id } = this
    const sceneData = await SceneData.getScene(id)

    this.type = sceneData.Type || 'SCENE_WORLD'

    this.sceneTagList = sceneData?.Tag?.map(tagData => new SceneTag(this, tagData)) || []
    this.sceneBlockList = Object.keys(sceneData?.Block || {}).map(e => new SceneBlock(this, parseInt(e)))

    this.dieY = sceneData?.DieY || 0
    this.isLocked = !!sceneData?.IsLocked
  }

  private async loadSceneBlocks() {
    const { id, host, sceneBlockList } = this

    logger.debug(uidPrefix('LOAD', host), 'ID:', id, 'Loading non dynamic groups...')
    Logger.mark('SceneLoadBlock')

    for (let block of sceneBlockList) {
      if (this.destroyed) {
        logger.debug(uidPrefix('LOAD', host), 'ID:', id, 'Abort load non dynamic groups.')
        Logger.clearMarks('SceneLoadBlock')
        return
      }
      await block.initNew()
    }

    logger.debug(uidPrefix('LOAD', host), 'ID:', id, 'Loaded non dynamic groups.')
    Logger.measure('Block load', 'SceneLoadBlock')
  }

  get broadcastContextList(): PacketContext[] {
    return this.playerList.map(player => player.context)
  }

  get host(): Player {
    return this.world.host
  }

  get sceneTime(): number {
    const { timestampSceneTime, timestamp, paused } = this
    if (paused) return timestampSceneTime
    return Math.floor(timestampSceneTime + (Date.now() - timestamp))
  }

  set sceneTime(v) {
    this.timestampSceneTime = v
    this.timestamp = Date.now()

    SceneTime.broadcastNotify(this.broadcastContextList)
  }

  // TODO: implement it :p
  async init(_userData: any, fullInit: boolean) {
    await this.initNew(fullInit)
  }

  async initNew(fullInit: boolean) {
    const { entityManager, enterSceneToken } = this
    const scenePerfMark = `SceneInit-${enterSceneToken}`

    Logger.mark(scenePerfMark)

    await this.loadSceneData()

    entityManager.init()

    this.beginTime = Date.now()
    this.sceneTime = 0

    // Don't wait for scene blocks to load
    if (fullInit) this.loadSceneBlocks()

    Logger.measure('Scene init', scenePerfMark)
  }

  async destroy() {
    const { world, entityManager, sceneBlockList } = this
    const { sceneList } = world

    this.destroyed = true

    await entityManager.destroy()

    for (let sceneBlock of sceneBlockList) await sceneBlock.unload()

    if (sceneList.includes(this)) sceneList.splice(sceneList.indexOf(this), 1)
  }

  pause() {
    const { world, paused, sceneTime } = this
    if (paused || world.mpMode) return

    this.paused = true
    this.sceneTime = sceneTime
  }

  unpause() {
    const { timestampSceneTime, paused } = this
    if (!paused) return

    this.paused = false
    this.sceneTime = timestampSceneTime
  }

  async join(
    context: PacketContext,
    pos: Vector,
    rot: Vector,
    enterType: SceneEnterTypeEnum = SceneEnterTypeEnum.ENTER_NONE,
    enterReason: SceneEnterReasonEnum = SceneEnterReasonEnum.NONE
  ): Promise<boolean> {
    const { world, id, host, enterSceneToken, sceneTagList, playerList, beginTime } = this
    const { player } = context
    const { state, currentScene, pos: playerPos, rot: playerRot } = player

    let sceneType = (state & 0x0F00)
    switch (enterReason) {
      case SceneEnterReasonEnum.DUNGEON_ENTER:
        sceneType = ClientState.SCENE_DUNGEON
        break
      case SceneEnterReasonEnum.DUNGEON_QUIT:
        sceneType = ClientState.SCENE_WORLD
        break
    }

    // Set client state
    player.state = ClientState.PRE_ENTER_SCENE | sceneType

    player.nextScene = this

    if (currentScene) await player.currentScene.leave(context)

    logger.debug(uidPrefix('JOIN', host, 0xefef00), `UID: ${player.uid} ID: ${id} Pos: [${Math.floor(pos.X)},${Math.floor(pos.Y)},${Math.floor(pos.Z)}] Type: ${SceneEnterTypeEnum[enterType]} Reason: ${SceneEnterReasonEnum[enterReason]}`)

    if (!world.isHost(player)) await GuestBeginEnterScene.sendNotify(host.context, this, player)

    const playerEnterSceneData: PlayerEnterSceneNotify = {
      sceneId: id,
      pos: pos.export(),
      sceneBeginTime: beginTime.toString(),
      type: enterType,
      targetUid: host.uid,
      worldLevel: world.level,
      enterSceneToken,
      isFirstLoginEnterScene: enterReason === SceneEnterReasonEnum.LOGIN,
      sceneTagIdList: sceneTagList.filter(tag => tag.isActive()).map(tag => tag.id),
      enterReason,
      worldType: 1,
      sceneTransaction: `${id}-${host.uid}-${getTimeSeconds()}-33696`
    }

    if (currentScene && playerPos) {
      const prevPos = new Vector()
      prevPos.copy(playerPos)

      playerEnterSceneData.prevSceneId = currentScene.id
      playerEnterSceneData.prevPos = prevPos
    }

    const dungeonData = await DungeonData.getDungeonByScene(id)
    if (dungeonData) playerEnterSceneData.dungeonId = dungeonData.Id

    PlayerEnterScene.sendNotify(context, playerEnterSceneData)

    player.sceneEnterType = enterType

    player.currentScene = this
    player.nextScene = null

    if (!playerList.includes(player)) playerList.push(player)

    playerPos.copy(pos)
    playerRot.copy(rot)

    await player.emit('SceneJoin', this, context)

    // Set client state
    player.state = ClientState.ENTER_SCENE | sceneType

    return true
  }

  async leave(context: PacketContext) {
    const { id, host, playerList } = this
    const { player } = context
    const { uid } = player

    // Check if player is in scene
    if (!playerList.includes(player)) return

    logger.debug(uidPrefix('QUIT', host, 0xffff00), `UID: ${uid} ID: ${id}`)

    // Set client state
    player.state = ClientState.POST_LOGIN | (player.state & 0x0F00)

    player.currentScene = null
    playerList.splice(playerList.indexOf(player), 1)

    await player.emit('SceneLeave', this, context)
    await this.emit('PlayerLeave', player)

    // Destroy scene if no player is inside
    if (playerList.length > 0 || player.nextScene === this) return

    await this.destroy()
  }

  exportSceneTeamAvatarList(): SceneTeamAvatar[] {
    const { playerList } = this
    return [].concat(...playerList.map(player => player.teamManager.exportSceneTeamAvatarList()))
  }

  exportSceneInfo(): PlayerWorldSceneInfo {
    const { id, sceneTagList, isLocked } = this

    return {
      sceneId: id,
      sceneTagIdList: sceneTagList.filter(tag => tag.isActive()).map(tag => tag.id),
      isLocked
    }
  }

  exportScenePlayerInfoList(): ScenePlayerInfo[] {
    return this.playerList.map(p => p.exportScenePlayerInfo())
  }

  /**Events**/

  // SceneUpdate
  async handleSceneUpdate() {
    const { id, sceneBlockList, playerList, broadcastContextList, lastLocUpdate, lastTimeUpdate } = this

    for (let sceneBlock of sceneBlockList) await sceneBlock.emit('Update')

    if (lastLocUpdate == null || Date.now() - lastLocUpdate > 5e3) {
      this.lastLocUpdate = Date.now()
      await ScenePlayerLocation.broadcastNotify(broadcastContextList, {
        sceneId: id,
        playerLocList: playerList.map(player => player.exportLocationInfo()),
        vehicleLocList: []
      })
    }

    if (lastTimeUpdate == null || Date.now() - lastTimeUpdate > 10e3) {
      this.lastTimeUpdate = Date.now()
      await SceneTime.broadcastNotify(broadcastContextList)
    }
  }
}