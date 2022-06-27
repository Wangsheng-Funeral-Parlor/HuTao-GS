import BaseClass from '#/baseClass'
import Player from '$/player'
import LastState from './lastState'
import Scene from '$/scene'
import { OnlinePlayerInfo } from '@/types/game/playerInfo'
import { ClientReconnectReasonEnum, QuitReasonEnum } from '@/types/enum/mp'
import { SceneEnterReasonEnum, SceneEnterTypeEnum } from '@/types/enum/scene'
import PlayerQuitFromMp from '#/packets/PlayerQuitFromMp'
import WorldPlayerRTT from '#/packets/WorldPlayerRTT'
import { PacketContext } from '#/packet'
import LeaveWorld from '#/packets/LeaveWorld'
import WorldPlayerInfo from '#/packets/WorldPlayerInfo'
import SceneTeamUpdate from '#/packets/SceneTeamUpdate'
import WorldPlayerLocation from '#/packets/WorldPlayerLocation'
import ClientReconnect from '#/packets/ClientReconnect'
import SceneKickPlayer from '#/packets/SceneKickPlayer'
import Game from '..'
import ChatChannel from '$/chat/chatChannel'
import { SystemHintTypeEnum } from '@/types/enum/chat'
import WorldData from '$/gameData/data/WorldData'
import SceneData from '$/gameData/data/SceneData'
import WorldUserData from '@/types/user/WorldUserData'
import Logger from '@/logger'
import uidPrefix from '#/utils/uidPrefix'
import { performance } from 'perf_hooks'

const logger = new Logger('GWORLD', 0xefc8cc)

export default class World extends BaseClass {
  game: Game
  host: Player

  id: number
  mainSceneId: number

  sceneList: Scene[]
  mpSceneList: Scene[]
  playerList: Player[]

  hostLastState: LastState

  mpMode: boolean

  peerIdCounter: number
  lastRttNotify: number
  lastLocNotify: number

  constructor(hostPlayer: Player) {
    super()

    this.game = hostPlayer.game
    this.host = hostPlayer

    this.sceneList = []
    this.mpSceneList = []
    this.playerList = []

    this.hostLastState = new LastState(this)

    this.peerIdCounter = 0
    this.mpMode = false

    super.initHandlers(this.host)
  }

  get broadcastContextList(): PacketContext[] {
    return this.playerList.map(player => player.context)
  }

  get level(): number {
    return this.host.worldLevel
  }

  init(userData: WorldUserData) {
    const { id, lastStateData } = userData

    this.id = id
    this.hostLastState.init(lastStateData)
  }

  initNew(worldId: number) {
    this.id = worldId

    const data = WorldData.getWorld(worldId)
    if (!data) return

    const { MainSceneId } = data

    this.mainSceneId = MainSceneId

    const mainSceneData = SceneData.getScene(MainSceneId)
    if (mainSceneData) this.hostLastState.initNew(mainSceneData)
  }

  async destroy() {
    const { sceneList, mpSceneList, playerList } = this

    while (playerList.length > 0) {
      const player = playerList[0]
      if (player.isHost()) await this.leave(player.context)
      else await this.leave(player.context, QuitReasonEnum.KICK_BY_HOST_LOGOUT, ClientReconnectReasonEnum.CLIENT_RECONNNECT_QUIT_MP)
    }

    while (sceneList.length > 0) await sceneList.shift().destroy()
    while (mpSceneList.length > 0) await mpSceneList.shift().destroy()
  }

  getNextPeerId() {
    return ++this.peerIdCounter
  }

  isHost(player: Player) {
    return player === this.host
  }

  getScene(sceneId: number, fullInit: boolean = true) {
    const sceneList = this.mpMode ? this.mpSceneList : this.sceneList

    // check if scene already loaded
    let scene = sceneList.find(s => s.id === sceneId)
    if (scene) return scene

    // check if scene data exists
    if (!SceneData.getScene(sceneId)) return null

    // create new scene
    scene = new Scene(this, sceneId)

    if (fullInit) {
      performance.mark('SceneInitSync')

      sceneList.push(scene)
      scene.initNew(true)

      performance.measure('Scene init sync', 'SceneInitSync')
    } else {
      scene.initNew(false)
    }

    return scene
  }

  async removeScene(sceneId: number): Promise<void> {
    const sceneList = this.mpMode ? this.mpSceneList : this.sceneList

    const scene = sceneList.find(s => s.id === sceneId)
    if (!scene) return

    await scene.destroy()
    sceneList.splice(sceneList.indexOf(scene), 1)
  }

  async join(context: PacketContext): Promise<boolean> {
    const { player } = context

    if (!player || player.currentWorld === this) return false

    performance.mark('WorldJoin')

    const { mainSceneId, host, playerList, hostLastState } = this
    const { sceneId, pos, rot } = hostLastState

    const isHost = this.isHost(player)

    const scene = isHost ? (this.getScene(sceneId) || this.getScene(mainSceneId)) : host.currentScene
    if (!scene) {
      performance.clearMarks('WorldJoin')
      return false
    }

    const enterPos = isHost ? pos : host.pos
    const enterRot = isHost ? rot : host.rot
    const enterType = isHost ? SceneEnterTypeEnum.ENTER_SELF : SceneEnterTypeEnum.ENTER_OTHER
    const enterReason = isHost ? SceneEnterReasonEnum.LOGIN : SceneEnterReasonEnum.TEAM_JOIN

    player.currentWorld = this
    player.peerId = this.getNextPeerId()
    playerList.push(player)

    if (!await scene.join(context, enterPos, enterRot, enterType, enterReason)) {
      player.currentWorld = null
      player.peerId = null
      playerList.splice(playerList.indexOf(player), 1)

      performance.clearMarks('WorldJoin')
      return false
    }

    performance.measure('World join', 'WorldJoin')
    return true
  }

  async leave(context: PacketContext, quitReason: QuitReasonEnum = QuitReasonEnum.INVALID, clientReconnectReason: ClientReconnectReasonEnum = ClientReconnectReasonEnum.CLIENT_RECONNNECT_NONE) {
    const { game, playerList, hostLastState } = this
    const { player, seqId } = context
    const { currentScene } = player

    // Check if player is in world
    if (!playerList.includes(player)) return false

    const isHost = this.isHost(player)

    // Save last state
    if (isHost) hostLastState.saveState()

    // Send quit reason
    if (quitReason !== QuitReasonEnum.INVALID) await PlayerQuitFromMp.sendNotify(context, quitReason)

    // Leave scene
    if (currentScene) currentScene.leave(context)

    // Send mp leave system hint
    if (!isHost) await game.chatManager.sendPublic(this, 0, ChatChannel.createSystemHint(player, SystemHintTypeEnum.CHAT_LEAVE_WORLD))

    player.currentWorld = null
    player.peerId = null
    playerList.splice(playerList.indexOf(player), 1)

    await LeaveWorld.sendNotify(context)

    const { broadcastContextList } = this
    for (let broadcastCtx of broadcastContextList) broadcastCtx.seqId = seqId

    await WorldPlayerInfo.broadcastNotify(broadcastContextList)
    await SceneTeamUpdate.broadcastNotify(broadcastContextList)

    // Notify reconnect if needed
    if (clientReconnectReason !== ClientReconnectReasonEnum.CLIENT_RECONNNECT_NONE) {
      await ClientReconnect.sendNotify(context, clientReconnectReason)
    }

    return true
  }

  async kick(uid: number): Promise<boolean> {
    const { host, playerList, broadcastContextList } = this

    const player = playerList.find(p => p.uid === uid)
    if (!player) return false

    logger.debug(uidPrefix('KICK', host), `UID: ${uid}`)

    await SceneKickPlayer.broadcastNotify(broadcastContextList, host, player)
    return this.leave(player.context, QuitReasonEnum.KICK_BY_HOST, ClientReconnectReasonEnum.CLIENT_RECONNNECT_QUIT_MP)
  }

  async changeToMp() {
    const { host, hostLastState, mpMode } = this
    const { teamManager, currentWorld, currentScene, context, pos, rot } = host
    if (mpMode || currentWorld !== this) return

    logger.debug(uidPrefix('MODE', host), 'SP -> MP')

    hostLastState.saveState()
    this.mpMode = true

    teamManager.getTeam().clear()
    await this.getScene(currentScene.id).join(context, pos, rot, SceneEnterTypeEnum.ENTER_GOTO, SceneEnterReasonEnum.HOST_FROM_SINGLE_TO_MP)
  }

  async changeToSingle() {
    const { host, playerList, mpMode } = this
    const { currentWorld } = host
    if (!mpMode || currentWorld !== this) return

    logger.debug(uidPrefix('MODE', host), 'MP -> SP')

    for (let player of playerList) await this.kick(player.uid)

    await this.leave(host.context, QuitReasonEnum.HOST_NO_OTHER_PLAYER, ClientReconnectReasonEnum.CLIENT_RECONNNECT_QUIT_MP)
  }

  exportWorldPlayerInfoList(): OnlinePlayerInfo[] {
    return this.playerList.map(p => p.exportOnlinePlayerInfo())
  }

  exportUserData(): WorldUserData {
    const { id, hostLastState } = this

    return {
      id,
      lastStateData: hostLastState.exportUserData()
    }
  }

  /**Internal Events**/

  // WorldUpdate
  async handleWorldUpdate() {
    const { playerList, mpMode, broadcastContextList, lastRttNotify, lastLocNotify } = this
    const now = Date.now()

    const sceneList = mpMode ? this.mpSceneList : this.sceneList
    for (let scene of sceneList) scene.emit('SceneUpdate')

    if (lastRttNotify == null || now - lastRttNotify > 1e3) {
      this.lastRttNotify = now

      await WorldPlayerRTT.broadcastNotify(broadcastContextList, {
        playerRttList: playerList.map(player => player.exportRttInfo())
      })
    }

    if (!mpMode) return

    if (lastLocNotify == null || now - lastLocNotify > 5e3) {
      this.lastLocNotify = now

      await WorldPlayerLocation.broadcastNotify(broadcastContextList, {
        playerWorldLocList: playerList.map(player => player.exportWorldLocationInfo()).filter(info => info != null)
      })
    }
  }
}