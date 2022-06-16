import KcpServer from '..'
import Client from '#/client'
import DummyClient from '#/dummyClient'
import PlayerProp from '#/packets/PlayerProp'
import PlayerData from '#/packets/PlayerData'
import StoreWeightLimit from '#/packets/StoreWeightLimit'
import PlayerStore from '#/packets/PlayerStore'
import OpenStateUpdate from '#/packets/OpenStateUpdate'
import AvatarData from '#/packets/AvatarData'
import AvatarSatiationData from '#/packets/AvatarSatiationData'
import Player from '$/player'
import World from '$/world'
import { OnlinePlayerInfo } from '@/types/game/playerInfo'
import { MpSettingTypeEnum } from '@/types/enum/mp'
import PlayerLogin from '#/packets/PlayerLogin'
import { PacketContext } from '#/packet'
import DoSetPlayerBornData from '#/packets/DoSetPlayerBornData'
import { ChatManager } from './manager/chatManager'
import { PlayerPropEnum } from '@/types/enum/player'
import { ClientState } from '@/types/enum/state'
import config from '@/config'
import UserData from '@/types/user'
import hash from '../../utils/hash'
import { getJson, setJson } from '@/utils/json'
import AllWidgetData from '#/packets/AllWidgetData'
import ShopManager from './manager/shopManager'
import GachaSimpleInfo from '#/packets/GachaSimpleInfo'
import PlayerRechargeData from '#/packets/PlayerRechargeData'

export default class Game {
  server: KcpServer

  chatManager: ChatManager
  shopManager: ShopManager

  playerMap: { [auid: string]: Player }

  constructor(server: KcpServer) {
    this.server = server

    this.chatManager = new ChatManager(this)
    this.shopManager = new ShopManager(this)

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

  private loadUserData(auid: string): false | UserData {
    return getJson(`data/user/${hash(auid).slice(5, -5)}.json`, false)
  }

  private saveUserData(auid: string, player: Player): boolean {
    return setJson(`data/user/${hash(auid).slice(5, -5)}.json`, player.exportUserData())
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

  getUid(auid: string) {
    const userData = this.loadUserData(auid)
    if (!userData) return parseInt('1' + hash(auid).slice(0, 5))

    return userData.uid
  }

  async playerLogin(context: PacketContext, mpWorld?: World): Promise<Player> {
    const { server, playerMap } = this
    const { client } = context
    const { auid } = client
    if (auid == null) return null

    // Set client state
    client.state = ClientState.LOGIN

    let player: Player = client.player

    if (!player && !mpWorld && playerMap[auid]) await server.disconnect(playerMap[auid].client.id, 4)

    if (!player) {
      const userData = this.loadUserData(auid)

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

    await PlayerProp.sendNotify(context, PlayerPropEnum.PROP_PLAYER_RESIN)
    await PlayerData.sendNotify(context)
    await OpenStateUpdate.sendNotify(context)
    await StoreWeightLimit.sendNotify(context)
    await PlayerStore.sendNotify(context)
    await AvatarData.sendNotify(context)
    await AvatarSatiationData.sendNotify(context)
    await PlayerProp.sendNotify(context, PlayerPropEnum.PROP_IS_MP_MODE_AVAILABLE)
    await PlayerProp.sendNotify(context, PlayerPropEnum.PROP_PLAYER_MP_SETTING_TYPE)
    await PlayerProp.sendNotify(context, PlayerPropEnum.PROP_IS_ONLY_MP_WITH_PS_PLAYER)
    await GachaSimpleInfo.sendNotify(context)
    await PlayerRechargeData.sendNotify(context)
    await AllWidgetData.sendNotify(context)

    // Set client state
    client.state = ClientState.POST_LOGIN | ClientState.SCENE_WORLD
    client.readyToSave = true

    // Join world
    if (mpWorld != null) await mpWorld.join(context)
    else await player.hostWorld.join(context)

    await PlayerLogin.response(context)

    return player
  }

  async playerLogout(client: Client | DummyClient): Promise<void> {
    const { chatManager, playerMap } = this
    const { auid } = client
    const player = this.getPlayer(auid)
    if (!player) return

    // remove public chat of host world
    chatManager.removePublicChat(player.hostWorld)

    // destroy player instance
    await player.destroy()

    delete playerMap[auid]
    client.player = null
  }

  save(client: Client | DummyClient) {
    const { auid, readyToSave } = client
    const player = this.getPlayer(auid)
    if (!player || !readyToSave) return

    this.saveUserData(auid, player)
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