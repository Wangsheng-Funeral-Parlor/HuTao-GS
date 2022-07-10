import Client from '#/client'
import DummyClient from '#/dummyClient'
import { PacketContext } from '#/packet'
import ActivityScheduleInfo from '#/packets/ActivityScheduleInfo'
import AllWidgetData from '#/packets/AllWidgetData'
import AvatarData from '#/packets/AvatarData'
import AvatarSatiationData from '#/packets/AvatarSatiationData'
import CoopData from '#/packets/CoopData'
import DoSetPlayerBornData from '#/packets/DoSetPlayerBornData'
import FinishedParentQuest from '#/packets/FinishedParentQuest'
import GachaSimpleInfo from '#/packets/GachaSimpleInfo'
import OpenStateUpdate from '#/packets/OpenStateUpdate'
import PlayerData from '#/packets/PlayerData'
import PlayerLogin from '#/packets/PlayerLogin'
import PlayerProp from '#/packets/PlayerProp'
import PlayerRechargeData from '#/packets/PlayerRechargeData'
import PlayerStore from '#/packets/PlayerStore'
import QuestList from '#/packets/QuestList'
import StoreWeightLimit from '#/packets/StoreWeightLimit'
import Player from '$/player'
import World from '$/world'
import config from '@/config'
import Logger from '@/logger'
import { MpSettingTypeEnum } from '@/types/enum/mp'
import { PlayerPropEnum } from '@/types/enum/player'
import { ClientState } from '@/types/enum/state'
import { OnlinePlayerInfo } from '@/types/game/playerInfo'
import UserData from '@/types/user'
import { getJsonAsync, setJsonAsync } from '@/utils/json'
import KcpServer from '..'
import hash from '../../utils/hash'
import ActivityManager from './manager/activityManager'
import { ChatManager } from './manager/chatManager'
import ShopManager from './manager/shopManager'

export default class Game {
  server: KcpServer

  chatManager: ChatManager
  shopManager: ShopManager
  activityManager: ActivityManager

  playerMap: { [auid: string]: Player }

  constructor(server: KcpServer) {
    this.server = server

    this.chatManager = new ChatManager(this)
    this.shopManager = new ShopManager(this)
    this.activityManager = new ActivityManager(this)

    this.playerMap = {}

    this.createServerPlayer()
  }

  async createServerPlayer() {
    try {
      const { server } = this

      const client = new DummyClient(server)
      client.setUid('1', 1)

      // create new player
      const player = new Player(this, client)
      const { props, profile, avatarList } = player

      this.playerMap['1'] = player
      client.player = player

      // set player data
      await player.initNew(10000046, config.serverName)
      player.setLevel(60, false)

      player.noAuthority = true

      // set born location
      player.hostWorld.hostLastState.init({
        sceneId: 3,
        pos: { X: -657.9599609375, Y: 219.54281616210938, Z: 266.7440490722656 },
        rot: { Y: 180 }
      })

      // set avatar data
      const huTao = avatarList[0]
      huTao.level = 90

      // set profile data
      props.set(PlayerPropEnum.PROP_PLAYER_MP_SETTING_TYPE, MpSettingTypeEnum.MP_SETTING_ENTER_FREELY)

      profile.signature = 'QiQi?'
      profile.birthday = { month: 7, day: 15 }
      profile.unlockedNameCardIdList = [210059]
      profile.nameCardId = 210059
      profile.showAvatarList.push(huTao)
      profile.showNameCardIdList = [210059]

      // login
      await this.playerLogin(player.context)
    } catch (err) {
      console.log('Failed to create server player:', err)
    }
  }

  private async loadUserData(auid: string): Promise<false | UserData> {
    return getJsonAsync(`data/user/${hash(auid).slice(5, -5)}.json`, false)
  }

  private async saveUserData(auid: string, player: Player): Promise<boolean> {
    return setJsonAsync(`data/user/${hash(auid).slice(5, -5)}.json`, player.exportUserData())
  }

  private async newLogin(context: PacketContext): Promise<Player> {
    const { playerMap } = this
    const { client } = context
    const { auid } = client

    await DoSetPlayerBornData.sendNotify(context)
    await PlayerLogin.response(context)

    // Set client state
    client.state = ClientState.PICK_TWIN

    const player = new Player(this, client)

    playerMap[auid] = player
    client.player = player

    return player
  }

  async getUid(auid: string) {
    const userData = await this.loadUserData(auid)
    if (!userData) return parseInt('1' + hash(auid).slice(0, 5))

    return userData.uid
  }

  async playerLogin(context: PacketContext, mpWorld?: World): Promise<Player> {
    const { server, playerMap, activityManager } = this
    const { client } = context
    const { auid } = client
    if (auid == null) return null

    let player: Player = client.player

    // Logged in with another device
    if (!player && !mpWorld && playerMap[auid]) await server.disconnect(playerMap[auid].client.id, 4)

    if (!player) {
      const userData = await this.loadUserData(auid)

      // No user data, create new player
      if (!userData) return this.newLogin(context)

      if (mpWorld) {
        return null
      } else {
        player = new Player(this, client)
        await player.init(userData) // Load user data

        playerMap[auid] = player
        client.player = player
      }
    }

    const loginPerfMark = `Login-${auid}`
    Logger.mark(loginPerfMark)

    // Set client state
    client.state = ClientState.LOGIN

    await player.windyRce('login')

    await PlayerProp.sendNotify(context, PlayerPropEnum.PROP_PLAYER_RESIN)

    await ActivityScheduleInfo.sendNotify(context)
    await activityManager.sendAllActivityInfo(context)

    await PlayerData.sendNotify(context)
    await OpenStateUpdate.sendNotify(context)
    await StoreWeightLimit.sendNotify(context)
    await PlayerStore.sendNotify(context)
    await AvatarData.sendNotify(context)
    await AvatarSatiationData.sendNotify(context)
    await FinishedParentQuest.sendNotify(context)
    await QuestList.sendNotify(context)
    await PlayerProp.sendNotify(context, PlayerPropEnum.PROP_IS_MP_MODE_AVAILABLE)
    await PlayerProp.sendNotify(context, PlayerPropEnum.PROP_PLAYER_MP_SETTING_TYPE)
    await PlayerProp.sendNotify(context, PlayerPropEnum.PROP_IS_ONLY_MP_WITH_PS_PLAYER)
    await GachaSimpleInfo.sendNotify(context)
    await PlayerRechargeData.sendNotify(context)
    await AllWidgetData.sendNotify(context)
    await CoopData.sendNotify(context)

    // Set client state
    client.state = ClientState.POST_LOGIN | ClientState.SCENE_WORLD
    client.readyToSave = true

    // Join world
    if (mpWorld != null) await mpWorld.join(context)
    else await player.hostWorld.join(context)

    await PlayerLogin.response(context)

    Logger.measure('Player login', loginPerfMark)
    Logger.clearMarks(loginPerfMark)

    return player
  }

  async playerLogout(client: Client | DummyClient): Promise<void> {
    const { chatManager, playerMap } = this
    const { auid } = client
    const player = this.getPlayer(auid)
    if (!player) return

    // Remove public chat of host world
    chatManager.removePublicChat(player.hostWorld)

    // Destroy player instance
    await player.destroy()

    // Set client state
    client.state = ClientState.NONE

    delete playerMap[auid]
    client.player = null
  }

  async save(client: Client | DummyClient) {
    const { auid, readyToSave } = client
    const player = this.getPlayer(auid)
    if (!player || !readyToSave) return

    await this.saveUserData(auid, player)
  }

  getPlayer(auid: string): Player {
    return this.playerMap[auid]
  }

  getPlayerByUid(uid: number): Player {
    return Object.values(this.playerMap).find(player => player.uid === uid)
  }

  getOnlinePlayerInfo(uid: number): OnlinePlayerInfo {
    const player = this.getPlayerByUid(uid)
    if (!player) return null

    return player.exportOnlinePlayerInfo()
  }

  getOnlinePlayerList(ignorePlayer?: Player): OnlinePlayerInfo[] {
    const playerList = Object.values(this.playerMap)
      .filter(player => player !== ignorePlayer && player.props.get(PlayerPropEnum.PROP_PLAYER_MP_SETTING_TYPE) !== MpSettingTypeEnum.MP_SETTING_NO_ENTER)

    const selectedUid: number[] = []
    const onlinePlayerList: OnlinePlayerInfo[] = []

    while (selectedUid.length < Math.min(playerList.length, 50)) {
      const player = playerList[Math.floor(Math.random() * playerList.length)]
      if (selectedUid.includes(player.uid)) continue

      selectedUid.push(player.uid)
      onlinePlayerList.push(player.exportOnlinePlayerInfo())
    }

    return onlinePlayerList
  }
}