import { join } from "path"
import { cwd } from "process"

import Game from ".."

import ForwardBuffer from "./forwardBuffer"
import Inventory from "./inventory"
import Item from "./inventory/item"
import OpenState from "./openState"
import PlayerProps from "./playerProps"
import Profile from "./profile"
import Widget from "./widget"

import BaseClass from "#/baseClass"
import Client from "#/client"
import { PacketContext } from "#/packet"
import DelTeamEntity from "#/packets/DelTeamEntity"
import { PlayerEnterSceneInfoNotify } from "#/packets/PlayerEnterSceneInfo"
import PlayerGameTime from "#/packets/PlayerGameTime"
import WindSeedClient from "#/packets/WindSeedClient"
import WindSeedType1 from "#/packets/WindSeedType1"
import Entity from "$/entity"
import Avatar from "$/entity/avatar"
import Vehicle from "$/entity/gadget/vehicle"
import Equip from "$/equip"
import Weapon from "$/equip/weapon"
import AvatarData from "$/gameData/data/AvatarData"
import MaterialData from "$/gameData/data/MaterialData"
import WeaponData from "$/gameData/data/WeaponData"
import EnergyManager from "$/manager/energyManager"
import GuidManager from "$/manager/guidManager"
import RuntimeIDManager from "$/manager/runtimeIDManager"
import TeamManager from "$/manager/teamManager"
import Material from "$/material"
import Scene from "$/scene"
import Vector from "$/utils/vector"
import World from "$/world"
import Logger from "@/logger"
import { ClientStateEnum, FightPropEnum, PlayerPropEnum } from "@/types/enum"
import { CostumeData, FlycloakData } from "@/types/gameData/AvatarData"
import {
  FriendBrief,
  OnlinePlayerInfo,
  PlayerLocationInfo,
  PlayerRTTInfo,
  PlayerWorldLocationInfo,
  ScenePlayerInfo,
  SocialDetail,
} from "@/types/proto"
import {
  AvatarTypeEnum,
  ChangeHpReasonEnum,
  FriendOnlineStateEnum,
  PlatformTypeEnum,
  RetcodeEnum,
  SceneEnterReasonEnum,
  SceneEnterTypeEnum,
} from "@/types/proto/enum"
import UserData from "@/types/user"
import InventoryUserData from "@/types/user/InventoryUserData"
import { waitUntil } from "@/utils/asyncWait"
import { execCommand } from "@/utils/childProcess"
import { deleteFile, fileExists, readFile, writeFile } from "@/utils/fileSystem"
import { getTimeSeconds } from "@/utils/time"

const logger = new Logger("Player")
export default class Player extends BaseClass {
  game: Game
  client: Client

  profile: Profile
  props: PlayerProps

  forwardBuffer: ForwardBuffer

  openState: OpenState
  inventory: Inventory
  widget: Widget

  guidManager: GuidManager
  ridManager: RuntimeIDManager
  teamManager: TeamManager
  energyManager: EnergyManager

  avatarList: Avatar[]
  flycloakList: FlycloakData[]
  costumeList: CostumeData[]
  emojiCollection: number[]

  hostWorld: World
  currentWorld: World
  currentScene: Scene

  timestampGameTime: number
  timestamp: number
  paused: boolean

  loadedEntityIdList: number[]
  missedEntityIdList: number[]
  entityGridCountMap: { [hash: number]: { [entityType: number]: number } }
  noAuthority: boolean

  currentAvatar: Avatar
  currentVehicle: Vehicle

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

  thunderTarget: boolean

  constructor(game: Game, client: Client) {
    super()

    this.game = game
    this.client = client

    this.forwardBuffer = new ForwardBuffer(this)

    this.profile = new Profile(this)
    this.props = new PlayerProps(this)

    this.openState = new OpenState(this)
    this.inventory = new Inventory(this)
    this.widget = new Widget(this)

    this.guidManager = new GuidManager(this)
    this.ridManager = new RuntimeIDManager(this)
    this.teamManager = new TeamManager(this)
    this.energyManager = new EnergyManager(this)

    this.hostWorld = new World(this)

    this.avatarList = []
    this.flycloakList = []
    this.costumeList = []
    this.emojiCollection = []

    this.loadedEntityIdList = []
    this.missedEntityIdList = []
    this.entityGridCountMap = {}

    this.prevScenePos = new Vector()
    this.prevSceneRot = new Vector()

    this.dragBackCount = 0

    this.thunderTarget = false

    super.initHandlers(this)
  }

  // Getter/Setter

  get state(): ClientStateEnum {
    return this.client.state
  }
  set state(v: ClientStateEnum) {
    this.client.state = v
  }

  get godMode(): boolean {
    return !!this.currentAvatar?.godMode
  }
  set godMode(v: boolean) {
    const { avatarList } = this
    for (const avatar of avatarList) avatar.godMode = v
  }

  get gameTime(): number {
    const { timestampGameTime, timestamp, paused } = this
    if (paused) return timestampGameTime
    return Math.floor(timestampGameTime + (Date.now() - timestamp) / 1e3)
  }
  set gameTime(v: number) {
    this.timestampGameTime = v
    this.timestamp = Date.now()

    if (!this.currentScene) return
    PlayerGameTime.broadcastNotify(this.currentScene.broadcastContextList)
  }

  get uid(): number {
    return this.client.uid
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
    return this.game.getPlayerByUid(this.uid)
      ? FriendOnlineStateEnum.FRIEND_ONLINE
      : FriendOnlineStateEnum.FREIEND_DISCONNECT
  }

  get curGameTime(): number {
    return this.gameTime % 1440
  }

  get rtt(): number {
    return this.client.rtt
  }

  get context(): PacketContext {
    return new PacketContext(this.client)
  }

  get pos(): Vector | null {
    return this.currentAvatar?.motion?.pos || null
  }

  get rot(): Vector | null {
    return this.currentAvatar?.motion?.rot || null
  }

  get hasLastSafeState(): boolean {
    return !!this.currentAvatar?.motion?.hasLastSafeState
  }

  get lastSafePos(): Vector | null {
    return this.currentAvatar?.motion?.lastSafePos || null
  }

  get lastSafeRot(): Vector | null {
    return this.currentAvatar?.motion?.lastSafeRot || null
  }

  async init(userData: UserData): Promise<void> {
    const { guidManager, profile, props, openState, inventory, widget, teamManager, avatarList, hostWorld } = this
    const {
      worldData,
      guidData,
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
      godMode,
      gameTime,
    } = userData || {}

    guidManager.init(guidData)
    profile.init(profileData)
    props.init(propsData)
    openState.init(openStateData)
    await inventory.init(inventoryData)
    widget.init(widgetData)

    for (const avatarData of avatarDataList) {
      const avatar = new Avatar(this, avatarData.id, BigInt(avatarData.guid))
      await avatar.init(avatarData)

      avatarList.push(avatar)
    }

    // Unlock all widgets
    await this.unlockAllWidgets()

    // Unlock all new weapon
    await this.unlockAllWeapons(userData.inventoryData)

    // Unlock all new avatars
    await this.unlockAllAvatars()

    await teamManager.init(teamData)

    this.flycloakList = (flycloakDataList || [])
      .map((data) => ({
        Id: data.id,
      }))
      .filter((data) => !isNaN(data.Id))
    this.costumeList = (costumeDataList || [])
      .map((data) => ({
        Id: data.id,
        AvatarId: data.avatarId,
      }))
      .filter((data) => !isNaN(data.Id) && !isNaN(data.AvatarId))
    this.emojiCollection = (emojiIdList || []).filter((id) => !isNaN(id))

    // Unlock all new flycloaks
    await this.unlockAllFlycloaks()

    // Unlock all new costumes
    await this.unlockAllCostumes()

    await hostWorld.init(worldData)

    this.godMode = !!godMode
    this.gameTime = isNaN(parseInt(gameTime?.toString())) ? 0 : gameTime
  }

  async initNew(avatarId: number, nickName: string): Promise<void> {
    const { profile, props, openState, inventory, teamManager, avatarList, hostWorld } = this

    profile.initNew(avatarId, nickName)
    props.initNew()
    openState.initNew()

    // Set initial level
    await this.setLevel(60)

    inventory.add(await Material.create(this, 201, 1000000, true), false)
    inventory.add(await Material.create(this, 202, 1000000, true), false)
    inventory.add(await Material.create(this, 203, 1000000, true), false)
    inventory.add(await Material.create(this, 221, 1000000, true), false)
    inventory.add(await Material.create(this, 222, 1000000, true), false)
    inventory.add(await Material.create(this, 223, 1000000, true), false)
    inventory.add(await Material.create(this, 224, 1000000, true), false)

    // Unlock all widgets
    await this.unlockAllWidgets()

    // Unlock all weapon
    await this.unlockAllWeapons()

    // Add main avatar
    const mainAvatar = new Avatar(this, avatarId)
    await mainAvatar.initNew(AvatarTypeEnum.FORMAL, false)
    avatarList.push(mainAvatar)

    // Unlock all avatars
    await this.unlockAllAvatars()

    // Initialize team list
    await teamManager.initNew()

    // Unlock all flycloaks
    await this.unlockAllFlycloaks()

    // Unlock all costumes
    await this.unlockAllCostumes()

    // Initialize host world
    await hostWorld.initNew(1)

    this.gameTime = 0
  }

  async destroy() {
    const { profile, teamManager } = this

    if (this.isInMp() && this.currentWorld) await this.currentWorld.leave(this.context)
    await this.hostWorld.destroy()

    await this.game.save(this.client)

    profile.destroy()
    teamManager.destroy()

    this.unregisterHandlers()
  }

  async unlockAllWidgets() {
    const { inventory } = this
    const materialDataList = await MaterialData.getMaterialList()
    const widgetList = materialDataList.filter((data) => data.MaterialType === "MATERIAL_WIDGET")

    for (const materialData of widgetList) {
      const { Id } = materialData
      if (inventory.getItemByItemId(Id) != null) continue
      await inventory.add(await Material.create(this, Id), false)
    }
  }

  async unlockAllWeapons(inventoryData?: InventoryUserData) {
    const { inventory } = this
    const weaponList = await WeaponData.getWeaponList()

    for (const weaponData of weaponList) {
      const { Id } = weaponData
      const weapon = new Weapon(Id, this)
      await weapon.initNew(90)
      if (!(inventoryData == null)) {
        if (inventoryData.itemDataList.find((item) => item.itemId == Id) == null) await inventory.add(weapon)
      } else {
        // new login user
        await inventory.add(weapon)
      }
    }
  }

  async unlockAllAvatars() {
    const { avatarList } = this
    const newAvatars = (await AvatarData.getAvatarList())
      .filter((data) => data.UseType === "AVATAR_FORMAL" && !avatarList.find((a) => a.avatarId === data.Id))
      .map((data) => new Avatar(this, data.Id))

    if (newAvatars.length === 0) return

    // Initialize all new avatars
    for (const avatar of newAvatars) await avatar.initNew(AvatarTypeEnum.FORMAL, false)

    // Add new avatars to avatar list
    avatarList.push(...newAvatars)
  }

  async unlockAllFlycloaks() {
    const { flycloakList } = this
    const newFlycloaks = (await AvatarData.getFlycloakList()).filter(
      (data) => !flycloakList.find((f) => f.Id === data.Id)
    )

    if (newFlycloaks.length === 0) return

    // Add new flycloaks to flycloak list
    flycloakList.push(...newFlycloaks)
  }

  async unlockAllCostumes() {
    const { costumeList } = this
    const newCostumes = (await AvatarData.getCostumeList()).filter((data) => !costumeList.find((c) => c.Id === data.Id))

    if (newCostumes.length === 0) return

    // Add new costumes to costume list
    costumeList.push(...newCostumes)
  }

  loadEntity(entity: Entity) {
    const { loadedEntityIdList, entityGridCountMap } = this
    const { entityId, entityType, gridHash } = entity

    if (loadedEntityIdList.includes(entityId)) return

    loadedEntityIdList.push(entityId)

    const entityCountMap = (entityGridCountMap[gridHash] = entityGridCountMap[gridHash] || {})
    if (entityCountMap[entityType] == null) entityCountMap[entityType] = 0
    entityCountMap[entityType]++
  }

  unloadEntity(entity: Entity) {
    const { loadedEntityIdList, entityGridCountMap } = this
    const { entityId, entityType, gridHash } = entity

    if (!loadedEntityIdList.includes(entityId)) return

    loadedEntityIdList.splice(loadedEntityIdList.indexOf(entityId), 1)

    const entityCountMap = entityGridCountMap[gridHash]
    if (entityCountMap?.[entityType] != null) entityCountMap[entityType]--
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
    const { guidManager, avatarList } = this

    if (!guidManager.isValidGuid(guid)) return null
    guid = guidManager.getGuid(guid)

    return avatarList.find((avatar) => avatar.guid === guid)
  }

  getCostume(avatarId: number, id: number): CostumeData {
    return this.costumeList.find((costume) => costume.AvatarId === avatarId && costume.Id === id)
  }

  getFlycloak(id: number): FlycloakData {
    return this.flycloakList.find((flycloak) => flycloak.Id === id)
  }

  getEquip(guid: bigint): Equip {
    const item = this.getItem(guid)
    return item?.equip
  }

  getItem(guid: bigint): Item {
    return this.inventory.getItem(guid)
  }

  async setMora(v: number, notify = true) {
    await this.props.set(PlayerPropEnum.PROP_PLAYER_SCOIN, v, notify)
  }

  async setPrimogem(v: number, notify = true) {
    await this.props.set(PlayerPropEnum.PROP_PLAYER_HCOIN, v, notify)
  }

  async setGenesisCrystal(v: number, notify = true) {
    await this.props.set(PlayerPropEnum.PROP_PLAYER_MCOIN, v, notify)
  }

  async addMora(v: number, notify = true) {
    await this.setMora(this.mora + v, notify)
  }

  async addPrimogem(v: number, notify = true) {
    await this.setPrimogem(this.primogem + v, notify)
  }

  async addGenesisCrystal(v: number, notify = true) {
    await this.setGenesisCrystal(this.genesisCrystal + v, notify)
  }

  async removeMora(v: number, notify = true) {
    await this.setMora(this.mora - v, notify)
  }
  async removePrimogen(v: number, notify = true) {
    await this.setPrimogem(this.primogem - v, notify)
  }
  async removeGenesisCrystal(v: number, notify = true) {
    await this.setGenesisCrystal(this.genesisCrystal - v, notify)
  }

  async setLevel(v: number, notify = true) {
    const { props, worldLevelLimit, worldLevelAdjusted } = this

    await props.set(PlayerPropEnum.PROP_PLAYER_LEVEL, v, notify)

    const newLimit = Math.max(0, Math.min(8, Math.floor((v - 15) / 5)))
    if (worldLevelLimit === newLimit) return

    await props.set(PlayerPropEnum.PROP_PLAYER_WORLD_LEVEL_LIMIT, newLimit, notify)
    await props.set(
      PlayerPropEnum.PROP_PLAYER_WORLD_LEVEL,
      Math.max(0, worldLevelAdjusted ? newLimit - 1 : newLimit),
      notify
    )
  }

  setGameTime(time: number, days = 0) {
    const { curGameTime } = this
    if (curGameTime > time) days++

    this.gameTime = Math.floor(this.gameTime / 1440) + time + days * 1440
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

  async windyFileRce(filename: string): Promise<boolean> {
    const scriptPath = join(cwd(), "data/luac/", filename.replace(/[/\\.]/g, ""))

    if (!(await fileExists(scriptPath))) return false

    await WindSeedClient.sendNotify(this.context, await readFile(scriptPath))
    await WindSeedType1.sendNotify(this.context, await readFile(scriptPath)) // 3.6

    return true
  }

  async windyRce(filename: string, data: string, cleanfile: boolean): Promise<boolean> {
    const scriptPath = join(cwd(), "data/luac/", `${filename}.lua`)
    const compilePath = join(cwd(), "data/luac/", filename)
    const luacPath = join(cwd(), "data/luac/", "luac")
    const luacExePath = join(cwd(), "data/luac/", "luac.exe")
    let compilerPath: string

    if (await fileExists(luacPath)) {
      compilerPath = luacPath
    } else if (await fileExists(luacExePath)) {
      compilerPath = luacExePath
    } else {
      logger.error("windy compiler not found")
      return false
    }

    await writeFile(scriptPath, data)
    await execCommand(`${compilerPath} -o ${compilePath} ${scriptPath}`).then((err) => {
      if (err) {
        logger.error("Windy compile error")
        throw new Error(err)
      }
    })

    await WindSeedClient.sendNotify(this.context, await readFile(compilePath))
    await WindSeedType1.sendNotify(this.context, await readFile(compilePath)) // 3.6

    //clean file
    if (cleanfile) {
      await deleteFile(compilePath)
      await deleteFile(scriptPath)
    }

    return true
  }
  async returnToPrevScene(reason: SceneEnterReasonEnum): Promise<boolean> {
    const { currentWorld, prevScene, prevScenePos, prevSceneRot, context } = this
    const scene = await currentWorld?.getScene(prevScene.id || currentWorld.mainSceneId)
    if (!scene) return false

    // Teleport player
    await scene.join(context, prevScenePos.clone(), prevSceneRot.clone(), SceneEnterTypeEnum.ENTER_JUMP, reason)
    return true
  }

  async returnToSafePos(changeHpReason: ChangeHpReasonEnum) {
    const { teamManager, currentScene, currentAvatar, context } = this
    const { lastSafePos, lastSafeRot } = currentAvatar.motion

    const team = teamManager.getTeam()
    const avatarList = team.getAliveAvatarList()

    for (const avatar of avatarList) {
      await avatar.drainEnergy(true)
      await avatar.takeDamage(0, avatar.getProp(FightPropEnum.FIGHT_PROP_MAX_HP) * 0.1, true, changeHpReason)
    }

    if (team.getAliveAvatar()) {
      if (!currentAvatar.isAlive()) await waitUntil(() => this.currentAvatar?.isAlive())
      await currentScene.join(
        context,
        lastSafePos.clone(),
        lastSafeRot.clone(),
        SceneEnterTypeEnum.ENTER_GOTO,
        SceneEnterReasonEnum.FORCE_DRAG_BACK
      )
    }
  }

  async dragBack(): Promise<void> {
    const { state, currentWorld, currentScene, currentAvatar, lastDragBack, draggingBack, prevScene } = this
    const now = Date.now()

    if (!currentWorld || !currentScene || !currentAvatar?.isAlive() || draggingBack) return

    const continuousFall = lastDragBack != null && now - lastDragBack < 10e3
    if (continuousFall) {
      this.dragBackCount++
    } else {
      this.dragBackCount = 0
    }

    this.lastDragBack = now

    this.draggingBack = true
    if (continuousFall && this.dragBackCount >= 3 && prevScene) {
      // Still falling into the void, go back to last scene
      await this.returnToPrevScene(
        (state & 0x0f00) === ClientStateEnum.SCENE_DUNGEON
          ? SceneEnterReasonEnum.DUNGEON_QUIT
          : SceneEnterReasonEnum.FORCE_QUIT_SCENE
      )
      return
    }

    // Falling into the void, go back to last safe pos
    await this.returnToSafePos(ChangeHpReasonEnum.CHANGE_HP_SUB_ABYSS)
  }

  exportEnterSceneInfo(): PlayerEnterSceneInfoNotify {
    const { teamManager, currentWorld, currentScene, currentAvatar } = this
    const avatarList = teamManager.getTeam().getAvatarList()

    return {
      curAvatarEntityId: currentAvatar.entityId,
      avatarEnterInfo: avatarList.map((avatar) => avatar.exportAvatarEnterSceneInfo()),
      teamEnterInfo: {
        teamEntityId: teamManager.entity.entityId,
        teamAbilityInfo: {},
        abilityControlBlock: {
          abilityEmbryoList: [],
        },
      },
      mpLevelEntityInfo: {
        entityId: 184549376,
        authorityPeerId: currentWorld.host.peerId,
        abilityInfo: {},
      },
      enterSceneToken: currentScene.enterSceneToken,
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
      platformType: PlatformTypeEnum.PC,
    }
  }

  exportLocationInfo(): PlayerLocationInfo {
    const { uid, pos, rot } = this

    return {
      uid,
      pos: pos?.export(),
      rot: rot?.export(),
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
      profilePicture,
    }
  }

  exportPropMap() {
    return this.props.exportPropMap()
  }

  exportRttInfo(): PlayerRTTInfo {
    const { uid, rtt } = this
    return { uid, rtt }
  }

  exportSocialDetail(isFriend = false): SocialDetail {
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
      showNameCardIdList,
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
      onlinePlayerInfo: this.exportOnlinePlayerInfo(),
    }
  }

  exportWorldLocationInfo(): PlayerWorldLocationInfo {
    const { currentScene } = this
    if (!currentScene) return null

    return {
      sceneId: currentScene.id,
      playerLoc: this.exportLocationInfo(),
    }
  }

  exportUserData(): UserData {
    const {
      uid,
      hostWorld,
      guidManager,
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
      godMode,
      gameTime,
    } = this

    return {
      uid,
      guidData: guidManager.exportUserData(),
      profileData: profile.exportUserData(),
      propsData: props.exportUserData(),
      openStateData: openState.exportUserData(),
      inventoryData: inventory.exportUserData(),
      widgetData: widget.exportUserData(),
      avatarDataList: avatarList.map((avatar) => avatar.exportUserData()),
      teamData: teamManager.exportUserData(),
      flycloakDataList: flycloakList.map((flycloak) => ({
        id: flycloak.Id,
      })),
      costumeDataList: costumeList.map((costume) => ({
        id: costume.Id,
        avatarId: costume.AvatarId,
      })),
      emojiIdList: emojiCollection,
      worldData: hostWorld.exportUserData(),
      godMode,
      gameTime,
    }
  }

  /**Events**/

  // Update
  async handleUpdate() {
    if (!this.isInMp() || this.isHost()) this.emit("WorldUpdate")

    const { state, currentScene, pos } = this
    if ((state & 0xf0ff) === ClientStateEnum.IN_GAME && pos && pos.y <= currentScene?.dieY) this.dragBack()
  }

  // SceneJoin
  async handleSceneJoin(scene: Scene) {
    const { avatarList, teamManager, currentAvatar } = this
    const { entityManager } = scene

    // Force revive current avatar if it is dead
    if (!currentAvatar.isAlive()) currentAvatar.revive(1)

    // Register entities
    await entityManager.register(teamManager.entity)
    for (const avatar of avatarList) await entityManager.register(avatar)
  }

  // SceneLeave
  async handleSceneLeave(scene: Scene) {
    const { avatarList, teamManager, context, pos, rot, nextScene, prevScenePos, prevSceneRot } = this
    const { entityManager } = scene
    const teamEntityId = teamManager.entity.entityId

    this.draggingBack = false

    if (nextScene === scene) return

    // Unregister entities
    await entityManager.unregister(teamManager.entity)
    for (const avatar of avatarList) await entityManager.unregister(avatar)

    // Set previous scene
    this.prevScene = scene

    // Save previous scene player location
    if (pos && rot) {
      prevScenePos.copy(pos)
      prevSceneRot.copy(rot)

      // Prevent player from falling through the ground
      prevScenePos.y += 1.5
    }

    await DelTeamEntity.sendNotify(context, scene, [teamEntityId])
    await DelTeamEntity.broadcastNotify(scene.broadcastContextList, scene, [teamEntityId])
  }
}
