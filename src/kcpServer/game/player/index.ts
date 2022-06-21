import { waitUntil } from '@/utils/asyncWait'
import BaseClass from '#/baseClass'
import Client from '#/client'
import Game from '..'
import Vector from '$/utils/vector'
import World from '$/world'
import Scene from '$/scene'
import Avatar from '$/entity/avatar'
import Material from '$/material'
import Equip from '$/equip'
import OpenState from './openState'
import PlayerProps from './playerProps'
import Profile from './profile'
import Inventory from './inventory'
import Item from './inventory/item'
import CombatManager from '$/manager/combatManager'
import TeamManager from '$/manager/teamManager'
import ForwardBuffer from './forwardBuffer'
import { FriendBrief, SocialDetail } from '@/types/game/social'
import { OnlinePlayerInfo, ScenePlayerInfo } from '@/types/game/playerInfo'
import { PlayerLocationInfo, PlayerRTTInfo, PlayerWorldLocationInfo } from '@/types/game/world'
import { AvatarTypeEnum } from '@/types/enum/avatar'
import { ChangeHpReasonEnum, FightPropEnum } from '@/types/enum/fightProp'
import { PlatformTypeEnum, PlayerPropEnum } from '@/types/enum/player'
import { RetcodeEnum } from '@/types/enum/retcode'
import { SceneEnterReasonEnum, SceneEnterTypeEnum } from '@/types/enum/scene'
import { FriendOnlineStateEnum } from '@/types/enum/social'
import { PacketContext } from '#/packet'
import { PlayerEnterSceneInfoNotify } from '#/packets/PlayerEnterSceneInfo'
import DelTeamEntity from '#/packets/DelTeamEntity'
import PlayerGameTime from '#/packets/PlayerGameTime'
import AvatarData from '$/gameData/data/AvatarData'
import { CostumeData, FlycloakData } from '@/types/gameData/AvatarData'
import { ClientState } from '@/types/enum/state'
import Widget from './widget'
import UserData from '@/types/user'
import SceneBlock from '$/scene/sceneBlock'
import { getTimeSeconds } from '@/utils/time'

export default class Player extends BaseClass {
  game: Game
  client: Client

  profile: Profile
  props: PlayerProps

  combatManager: CombatManager
  forwardBuffer: ForwardBuffer

  openState: OpenState
  inventory: Inventory
  widget: Widget
  teamManager: TeamManager

  avatarList: Avatar[]
  flycloakList: FlycloakData[]
  costumeList: CostumeData[]
  emojiCollection: number[]

  hostWorld: World
  currentWorld: World
  currentScene: Scene

  sceneBlockList: SceneBlock[]

  timestampGameTime: number
  timestamp: number
  paused: boolean

  loadedEntityIdList: number[]

  currentAvatar: Avatar

  changingTeam: boolean
  peerId: number
  lastTpReq: number

  dragBackCount: number
  lastDragBack: number
  draggingBack: boolean

  sceneEnterType: SceneEnterTypeEnum

  nextScene: Scene
  prevScene: Scene
  prevScenePos: Vector
  prevSceneRot: Vector

  constructor(game: Game, client: Client) {
    super()

    this.game = game
    this.client = client

    this.combatManager = new CombatManager(this)
    this.forwardBuffer = new ForwardBuffer(this)

    this.profile = new Profile(this)
    this.props = new PlayerProps(this)

    this.openState = new OpenState(this)
    this.inventory = new Inventory(this)
    this.widget = new Widget(this)
    this.teamManager = new TeamManager(this)

    this.hostWorld = new World(this)

    this.avatarList = []
    this.flycloakList = []
    this.costumeList = []
    this.emojiCollection = []

    this.sceneBlockList = []
    this.loadedEntityIdList = []

    this.prevScenePos = new Vector()
    this.prevSceneRot = new Vector()

    this.dragBackCount = 0

    super.initHandlers(this)
  }

  // Getter

  get uid(): number {
    return this.client.uid
  }

  get state(): ClientState {
    return this.client.state
  }

  get mora(): number {
    return this.props.get(PlayerPropEnum.PROP_PLAYER_SCOIN)
  }

  get primogem(): number {
    return this.props.get(PlayerPropEnum.PROP_PLAYER_HCOIN)
  }

  get genesisCrystal(): number {
    return this.props.get(PlayerPropEnum.PROP_PLAYER_MCOIN)
  }

  get level(): number {
    return this.props.get(PlayerPropEnum.PROP_PLAYER_LEVEL)
  }

  get worldLevel(): number {
    return this.props.get(PlayerPropEnum.PROP_PLAYER_WORLD_LEVEL)
  }

  get worldLevelLimit(): number {
    return this.props.get(PlayerPropEnum.PROP_PLAYER_WORLD_LEVEL_LIMIT)
  }

  get worldLevelAdjusted(): boolean {
    const { worldLevel, worldLevelLimit } = this
    return worldLevel !== worldLevelLimit
  }

  get worldLevelAdjustCD(): number {
    return this.props.get(PlayerPropEnum.PROP_PLAYER_WORLD_LEVEL_ADJUST_CD)
  }

  get onlineState(): FriendOnlineStateEnum {
    return this.game.getPlayerByUid(this.uid) ? FriendOnlineStateEnum.FRIEND_ONLINE : FriendOnlineStateEnum.FREIEND_DISCONNECT
  }

  get curGameTime(): number {
    return this.gameTime % 1440
  }

  get gameTime(): number {
    const { timestampGameTime, timestamp, paused } = this
    if (paused) return timestampGameTime
    return Math.floor(timestampGameTime + ((Date.now() - timestamp) / 1e3))
  }

  get rtt(): number {
    return this.client.rtt
  }

  get context(): PacketContext {
    return new PacketContext(this.client)
  }

  get pos(): Vector | null {
    return this.currentAvatar?.motionInfo?.pos || null
  }

  get rot(): Vector | null {
    return this.currentAvatar?.motionInfo?.rot || null
  }

  get hasLastSafeState(): boolean {
    return !!this.currentAvatar?.motionInfo?.hasLastSafeState
  }

  get lastSafePos(): Vector | null {
    return this.currentAvatar?.motionInfo?.lastSafePos || null
  }

  get lastSafeRot(): Vector | null {
    return this.currentAvatar?.motionInfo?.lastSafeRot || null
  }

  // Setter

  set state(v) {
    this.client.state = v
  }

  set gameTime(v) {
    this.timestampGameTime = v
    this.timestamp = Date.now()

    if (!this.currentScene) return
    PlayerGameTime.broadcastNotify(this.currentScene.broadcastContextList)
  }

  async init(userData: UserData): Promise<void> {
    const { profile, props, openState, inventory, widget, teamManager, avatarList, hostWorld } = this
    const {
      worldData,
      profileData,
      propsData,
      openStateData,
      inventoryData,
      widgetData,
      avatarDataList,
      teamData,
      flycloakDataList,
      costumeDataList,
      emojiIdList,
      gameTime
    } = userData || {}

    profile.init(profileData)
    props.init(propsData)
    openState.init(openStateData)
    inventory.init(inventoryData)
    widget.init(widgetData)

    for (let avatarData of avatarDataList) {
      const avatar = new Avatar(this, avatarData.id, BigInt(avatarData.guid))
      avatar.init(avatarData)

      avatarList.push(avatar)
    }

    teamManager.init(teamData)

    this.flycloakList = (flycloakDataList || []).map(data => ({
      Id: data.id
    }))
    this.costumeList = (costumeDataList || []).map(data => ({
      Id: data.id,
      AvatarId: data.avatarId
    }))
    this.emojiCollection = (emojiIdList || []).filter(id => !isNaN(id))

    hostWorld.init(worldData)

    this.gameTime = gameTime
  }

  async initNew(avatarId: number, nickName: string): Promise<void> {
    const { profile, props, openState, inventory, teamManager, avatarList, flycloakList, costumeList, hostWorld } = this

    profile.initNew(avatarId, nickName)
    props.initNew()
    openState.initNew()

    inventory.add(new Material(221, null, 1000000), false)
    inventory.add(new Material(222, null, 1000000), false)

    // Give all music instrument
    inventory.add(new Material(220025), false) // lyre
    inventory.add(new Material(220044), false) // zither
    inventory.add(new Material(220051), false) // drum

    avatarList.push(new Avatar(this, avatarId))

    // Unlock all avatars
    avatarList.push(...AvatarData.getAvatarList()
      .filter(data => (
        !avatarList.find(a => a.avatarId === data.Id) &&
        data.UseType === 'AVATAR_FORMAL'
      ))
      .map(data => new Avatar(this, data.Id))
    )

    // Initialize all avatars
    for (let avatar of avatarList) await avatar.initNew(AvatarTypeEnum.FORMAL, false)

    // Initialize team list
    teamManager.initNew()

    // Unlock all flycloaks
    flycloakList.push(...AvatarData.getFlycloakList())

    // Unlock all costumes
    costumeList.push(...AvatarData.getCostumeList())

    // Initialize host world
    hostWorld.initNew(1)

    this.gameTime = 0
  }

  async destroy() {
    if (this.isInMp() && this.currentWorld) await this.currentWorld.leave(this.context)
    await this.hostWorld.destroy()

    this.game.save(this.client)

    this.unregisterHandlers()
  }

  async changeAvatar(avatar: Avatar, pos?: Vector, seqId?: number): Promise<RetcodeEnum> {
    return this.teamManager.changeAvatar(avatar, pos, seqId)
  }

  async changeCostume(avatarGuid: bigint, costumeId: number): Promise<RetcodeEnum> {
    const avatar = this.getAvatar(avatarGuid)
    if (!avatar) return RetcodeEnum.RET_CAN_NOT_FIND_AVATAR

    return avatar.changeCostume(costumeId)
  }

  async wearFlycloak(avatarGuid: bigint, flycloakId: number): Promise<RetcodeEnum> {
    const avatar = this.getAvatar(avatarGuid)
    if (!avatar) return RetcodeEnum.RET_CAN_NOT_FIND_AVATAR

    return avatar.wearFlycloak(flycloakId)
  }

  getAvatar(guid: bigint): Avatar {
    return this.avatarList.find(avatar => avatar.guid === guid)
  }

  getCostume(avatarId: number, id: number): CostumeData {
    return this.costumeList.find(costume => costume.AvatarId === avatarId && costume.Id === id)
  }

  getFlycloak(id: number): FlycloakData {
    return this.flycloakList.find(flycloak => flycloak.Id === id)
  }

  getEquip(guid: bigint): Equip {
    const item = this.getItem(guid)
    return item?.equip
  }

  getItem(guid: bigint): Item {
    return this.inventory.getItem(guid)
  }

  setMora(v: number, notify: boolean = true) {
    this.props.set(PlayerPropEnum.PROP_PLAYER_SCOIN, v, notify)
  }

  setPrimogem(v: number, notify: boolean = true) {
    this.props.set(PlayerPropEnum.PROP_PLAYER_HCOIN, v, notify)
  }

  setGenesisCrystal(v: number, notify: boolean = true) {
    this.props.set(PlayerPropEnum.PROP_PLAYER_MCOIN, v, notify)
  }

  addMora(v: number, notify: boolean = true) {
    this.setMora(this.mora + v, notify)
  }

  addPrimogem(v: number, notify: boolean = true) {
    this.setPrimogem(this.primogem + v, notify)
  }

  addGenesisCrystal(v: number, notify: boolean = true) {
    this.setGenesisCrystal(this.genesisCrystal + v, notify)
  }

  setLevel(v: number, notify: boolean = true) {
    const { props, worldLevelLimit, worldLevelAdjusted } = this

    props.set(PlayerPropEnum.PROP_PLAYER_LEVEL, v, notify)

    const newLimit = Math.max(0, Math.min(8, Math.floor((v - 15) / 5)))
    if (worldLevelLimit === newLimit) return

    props.set(PlayerPropEnum.PROP_PLAYER_WORLD_LEVEL_LIMIT, newLimit, notify)
    props.set(PlayerPropEnum.PROP_PLAYER_WORLD_LEVEL, Math.max(0, worldLevelAdjusted ? newLimit - 1 : newLimit), notify)
  }

  setGameTime(time: number, days: number = 0) {
    const { curGameTime } = this
    if (curGameTime > time) days++

    this.gameTime = Math.floor(this.gameTime / 1440) + time + (days * 1440)
  }

  isInMp() {
    const { hostWorld, currentWorld } = this
    return (currentWorld != null && currentWorld !== hostWorld) || hostWorld.mpMode
  }

  isHost() {
    return this.currentWorld?.isHost(this)
  }

  pause() {
    const { paused, gameTime, currentScene } = this
    if (paused || this.isInMp()) return

    this.paused = true
    this.gameTime = gameTime

    if (this.isHost()) currentScene.pause()
  }

  unpause() {
    const { timestampGameTime, paused, currentScene } = this
    if (!paused) return

    this.paused = false
    this.gameTime = timestampGameTime

    if (this.isHost()) currentScene.unpause()
  }

  async returnToPrevScene(reason: SceneEnterReasonEnum): Promise<boolean> {
    const { currentWorld, prevScene, prevScenePos, prevSceneRot, context } = this
    const scene = currentWorld?.getScene(prevScene.id || currentWorld.mainSceneId)
    if (!scene) return false

    // Teleport player
    await scene.join(context, prevScenePos.clone(), prevSceneRot.clone(), SceneEnterTypeEnum.ENTER_JUMP, reason)
    return true
  }

  async dragBack(): Promise<void> {
    const { state, teamManager, currentWorld, currentScene, currentAvatar, lastDragBack, draggingBack, prevScene, context } = this
    const now = Date.now()

    if (!currentWorld || !currentScene || !currentAvatar || !currentAvatar.isAlive() || draggingBack) return
    const { lastSafePos, lastSafeRot } = currentAvatar.motionInfo

    const continuousFall = lastDragBack != null && now - lastDragBack < 10e3
    if (continuousFall) {
      this.dragBackCount++
    } else {
      this.dragBackCount = 0
    }

    this.lastDragBack = now

    this.draggingBack = true
    if (continuousFall && this.dragBackCount >= 5 && prevScene) {
      // Still falling into the void, go back to last scene
      await this.returnToPrevScene((state & 0x0F00) === ClientState.SCENE_DUNGEON ? SceneEnterReasonEnum.DUNGEON_QUIT : SceneEnterReasonEnum.FORCE_QUIT_SCENE)
      return
    }

    // Falling into the void, go back to last safe pos
    const team = teamManager.getTeam()
    const avatarList = team.getAliveAvatarList()
    for (let avatar of avatarList) {
      const { fightProps } = avatar
      await fightProps.drainEnergy(true)
      await fightProps.takeDamage(0, fightProps.get(FightPropEnum.FIGHT_PROP_MAX_HP) * 0.1, true, ChangeHpReasonEnum.CHANGE_HP_SUB_ABYSS)
    }

    if (team.getAliveAvatar()) {
      if (!currentAvatar.isAlive()) await waitUntil(() => this.currentAvatar?.isAlive())
      await currentScene.join(context, lastSafePos.clone(), lastSafeRot.clone(), SceneEnterTypeEnum.ENTER_GOTO, SceneEnterReasonEnum.FORCE_DRAG_BACK)
    }
  }

  exportEnterSceneInfo(): PlayerEnterSceneInfoNotify {
    const { teamManager, currentWorld, currentScene, currentAvatar } = this
    const avatarList = teamManager.getTeam().getAvatarList()

    return {
      curAvatarEntityId: currentAvatar.entityId,
      avatarEnterInfo: avatarList.map(avatar => avatar.exportAvatarEnterSceneInfo()),
      teamEnterInfo: {
        teamEntityId: teamManager.entity.entityId,
        teamAbilityInfo: {},
        abilityControlBlock: {
          abilityEmbryoList: []
        }
      },
      mpLevelEntityInfo: {
        entityId: 184549376,
        authorityPeerId: currentWorld.host.peerId,
        abilityInfo: {}
      },
      enterSceneToken: currentScene.enterSceneToken
    }
  }

  exportFriendBrief(): FriendBrief {
    const { uid, props, profile, level, worldLevel, onlineState } = this
    const { nickname, signature, nameCardId, profilePicture } = profile

    return {
      uid,
      nickname,
      level,
      worldLevel,
      signature,
      onlineState,
      isMpModeAvailable: !!props.get(PlayerPropEnum.PROP_IS_MP_MODE_AVAILABLE),
      lastActiveTime: getTimeSeconds(),
      nameCardId,
      showAvatarInfoList: profile.exportShowAvatarInfoList(),
      profilePicture,
      isGameSource: true,
      platformType: PlatformTypeEnum.PC
    }
  }

  exportLocationInfo(): PlayerLocationInfo {
    const { uid, pos, rot } = this

    return {
      uid,
      pos: pos?.export(),
      rot: rot?.export()
    }
  }

  exportOnlinePlayerInfo(): OnlinePlayerInfo {
    const { uid, props, profile, level, currentWorld, worldLevel } = this
    const { nickname, signature, nameCardId, profilePicture } = profile

    return {
      uid,
      nickname,
      playerLevel: level,
      mpSettingType: props.get(PlayerPropEnum.PROP_PLAYER_MP_SETTING_TYPE),
      curPlayerNumInWorld: currentWorld?.playerList.length || 1,
      worldLevel,
      nameCardId,
      signature,
      profilePicture
    }
  }

  exportPropMap() {
    return this.props.exportPropMap()
  }

  exportRttInfo(): PlayerRTTInfo {
    const { uid, rtt } = this
    return { uid, rtt }
  }

  exportSocialDetail(isFriend: boolean = false): SocialDetail {
    const { uid, profile, level, worldLevel } = this
    const { nickname, signature, birthday, nameCardId, profilePicture, showNameCardIdList } = profile

    return {
      uid,
      nickname,
      level,
      signature,
      birthday,
      worldLevel,
      onlineState: FriendOnlineStateEnum.FRIEND_ONLINE,
      isFriend,
      nameCardId,
      finishAchievementNum: 1,
      towerFloorIndex: 1,
      towerLevelIndex: 1,
      profilePicture,
      showAvatarInfoList: profile.exportShowAvatarInfoList(),
      showNameCardIdList
    }
  }

  exportScenePlayerInfo(): ScenePlayerInfo {
    const { uid, profile, currentScene, peerId } = this
    const { nickname } = profile

    return {
      uid,
      peerId,
      name: nickname,
      sceneId: currentScene.id,
      onlinePlayerInfo: this.exportOnlinePlayerInfo()
    }
  }

  exportWorldLocationInfo(): PlayerWorldLocationInfo {
    const { currentScene } = this
    if (!currentScene) return null

    return {
      sceneId: currentScene.id,
      playerLoc: this.exportLocationInfo()
    }
  }

  exportUserData(): UserData {
    const {
      uid,
      hostWorld,
      profile,
      props,
      openState,
      inventory,
      widget,
      teamManager,
      avatarList,
      flycloakList,
      costumeList,
      emojiCollection,
      gameTime
    } = this

    return {
      uid,
      profileData: profile.exportUserData(),
      propsData: props.exportUserData(),
      openStateData: openState.exportUserData(),
      inventoryData: inventory.exportUserData(),
      widgetData: widget.exportUserData(),
      avatarDataList: avatarList.map(avatar => avatar.exportUserData()),
      teamData: teamManager.exportUserData(),
      flycloakDataList: flycloakList.map(flycloak => ({
        id: flycloak.Id
      })),
      costumeDataList: costumeList.map(costume => ({
        id: costume.Id,
        avatarId: costume.AvatarId
      })),
      emojiIdList: emojiCollection,
      worldData: hostWorld.exportUserData(),
      gameTime
    }
  }

  /**Internal Events**/

  // Update
  async handleUpdate() {
    if (!this.isInMp() || this.isHost()) this.emit('WorldUpdate')

    const { state, currentScene, pos } = this
    if ((state & 0xF0FF) === ClientState.IN_GAME && pos && pos.Y <= currentScene?.dieY) this.dragBack()
  }

  // SceneJoin
  async handleSceneJoin(scene: Scene) {
    const { avatarList, teamManager, currentAvatar } = this
    const { entityManager } = scene

    // Force revive current avatar if it is dead
    if (!currentAvatar.isAlive()) currentAvatar.revive(1)

    // Register entities
    await entityManager.register(teamManager.entity)
    for (let avatar of avatarList) await entityManager.register(avatar)
  }

  // SceneLeave
  async handleSceneLeave(scene: Scene) {
    const { avatarList, teamManager, sceneBlockList, context, pos, rot, nextScene, prevScenePos, prevSceneRot } = this
    const { entityManager } = scene
    const teamEntityId = teamManager.entity.entityId

    this.draggingBack = false

    // Unregister entities
    await entityManager.unregister(teamManager.entity)
    for (let avatar of avatarList) await entityManager.unregister(avatar)

    if (nextScene === scene) return

    // Set previous scene
    this.prevScene = scene

    // Save previous scene player location
    if (pos && rot) {
      prevScenePos.copy(pos)
      prevSceneRot.copy(rot)

      // Prevent player from falling through the ground
      prevScenePos.Y += 1.5
    }

    for (let sceneBlock of sceneBlockList) sceneBlock.tryRemovePlayer(this)

    await DelTeamEntity.sendNotify(context, scene, [teamEntityId])
    await DelTeamEntity.broadcastNotify(scene.broadcastContextList, scene, [teamEntityId])
  }
}