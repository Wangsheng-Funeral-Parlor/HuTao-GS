import Entity from '$/entity'
import Equip from '$/equip'
import Player from '$/player'
import FetterList from './fetter/fetterList'
import SkillDepot from './skill/skillDepot'
import ExcelInfo from './excelInfo'
import newGuid from '$/utils/newGuid'
import Weapon from '$/equip/weapon'
import Reliquary from '$/equip/reliquary'
import { AvatarTypeEnum } from '@/types/enum/avatar'
import { ProtEntityTypeEnum } from '@/types/enum/entity'
import { AvatarEnterSceneInfo, AvatarInfo, AvatarSatiationData, SceneAvatarInfo } from '@/types/game/avatar'
import { SceneTeamAvatar } from '@/types/game/team'
import AvatarFlycloakChange from '#/packets/AvatarFlycloakChange'
import { PlayerPropEnum } from '@/types/enum/player'
import AvatarLifeStateChange from '#/packets/AvatarLifeStateChange'
import AvatarEquipChange, { AvatarEquipChangeNotify } from '#/packets/AvatarEquipChange'
import AvatarChangeCostume from '#/packets/AvatarChangeCostume'
import AvatarData from '$/gameData/data/AvatarData'
import GrowCurveData from '$/gameData/data/GrowCurveData'
import { RetcodeEnum } from '@/types/enum/retcode'
import AvatarUserData from '@/types/user/AvatarUserData'
import { EquipTypeEnum } from '@/types/user/EquipUserData'
import { getTimeSeconds } from '@/utils/time'

export default class Avatar extends Entity {
  player: Player

  avatarId: number
  guid: bigint

  weapon: Weapon
  reliquaryMap: { [slot: number]: Reliquary }

  skillDepot: SkillDepot
  fetterList: FetterList
  excelInfo: ExcelInfo

  wearingFlycloakId: number
  avatarType: AvatarTypeEnum
  bornTime: number
  costumeId: number

  constructor(player: Player, avatarId: number, guid?: bigint) {
    super()

    this.player = player
    this.avatarId = avatarId
    this.guid = guid || newGuid()

    this.config = AvatarData.getFightPropConfig(avatarId)
    this.growCurve = GrowCurveData.getGrowCurve('Avatar')

    this.reliquaryMap = {}

    this.skillDepot = new SkillDepot(this)
    this.fetterList = new FetterList(this)
    this.excelInfo = new ExcelInfo(this)

    this.entityType = ProtEntityTypeEnum.PROT_ENTITY_AVATAR

    super.initHandlers(this)
  }

  init(userData: AvatarUserData) {
    const { player, avatarId, skillDepot, fetterList, motionInfo } = this
    const {
      id,
      type,
      skillDepotData,
      fettersData,
      weaponGuid,
      flycloak,
      bornTime
    } = userData
    if (avatarId !== id) return this.initNew(undefined, false)

    skillDepot.init(skillDepotData)
    fetterList.init(fettersData)

    motionInfo.standby()

    const weaponItem = player.inventory.getItem(BigInt(weaponGuid))

    let weapon: Weapon
    if (weaponItem?.equip?.type === EquipTypeEnum.WEAPON) {
      weapon = <Weapon>weaponItem.equip
    } else {
      weapon = new Weapon(AvatarData.getAvatar(avatarId)?.InitialWeapon)
      weapon.initNew()

      player.inventory.add(weapon, false)
    }

    this.equip(weapon, false)

    this.wearingFlycloakId = flycloak
    this.avatarType = type
    this.bornTime = bornTime

    super.init(userData)
  }

  async initNew(avatarType: AvatarTypeEnum = AvatarTypeEnum.FORMAL, notify: boolean = true): Promise<void> {
    const { player, avatarId, skillDepot, fetterList, motionInfo } = this

    skillDepot.initNew()
    fetterList.initNew()

    motionInfo.standby()

    const weapon = new Weapon(AvatarData.getAvatar(avatarId)?.InitialWeapon)
    weapon.initNew()

    await player.inventory.add(weapon, notify)
    await this.equip(weapon, notify)

    this.wearingFlycloakId = 140001
    this.avatarType = avatarType
    this.bornTime = getTimeSeconds()

    super.initNew()
  }

  async equip(equip: Equip, notify: boolean = true): Promise<void> {
    let equipOwner = equip.equipped
    if (equipOwner) await equipOwner.unequip(equip, false)

    const { manager, player, fightProps, weapon, reliquaryMap } = this
    const { currentScene, context } = player

    const isWeapon = equip instanceof Weapon
    const isReliquary = equip instanceof Reliquary

    let curEquip: Equip
    if (isWeapon) curEquip = weapon
    if (isReliquary) curEquip = reliquaryMap[equip.equipType]

    if (equip === curEquip) return
    if (curEquip) {
      await this.unequip(curEquip, false)
      if (equipOwner) await equipOwner.equip(curEquip, notify)
    }

    if (isWeapon) {
      this.weapon = equip
      if (manager) await manager.register(equip.entity)
    } else if (isReliquary) {
      reliquaryMap[equip.equipType] = equip
    }

    equip.equipped = this

    const broadcastContextList = currentScene?.broadcastContextList || [context]

    if (notify) await AvatarEquipChange.broadcastNotify(broadcastContextList, this)
    await fightProps.update(notify)
  }

  async unequip(equip: Equip, notify: boolean = true): Promise<void> {
    if (equip.equipped !== this) return

    const { manager, player, fightProps, weapon, reliquaryMap } = this
    const { currentScene, context } = player

    if (equip instanceof Weapon) {
      if (equip !== weapon) return
      this.weapon = null

      if (manager) await manager.unregister(equip.entity)
    } else if (equip instanceof Reliquary) {
      if (equip !== reliquaryMap[equip.equipType]) return

      delete reliquaryMap[equip.equipType]
    }

    equip.equipped = null

    const broadcastContextList = currentScene?.broadcastContextList || [context]

    if (notify) await AvatarEquipChange.broadcastNotify(broadcastContextList, this)
    await fightProps.update(notify)
  }

  async changeCostume(costumeId: number): Promise<RetcodeEnum> {
    const { player, avatarId } = this

    const costume = player.getCostume(avatarId, costumeId)
    if (!costume) return RetcodeEnum.RET_NOT_HAS_COSTUME

    // Set costume id
    this.costumeId = costume.Id

    const { context, currentScene } = player

    // Notify players to update this avatar costume
    if (currentScene) await AvatarChangeCostume.broadcastNotify(currentScene.broadcastContextList, this)
    else await AvatarChangeCostume.sendNotify(context, this)

    return RetcodeEnum.RET_SUCC
  }

  async wearFlycloak(flycloakId: number): Promise<RetcodeEnum> {
    const { player } = this
    const { currentWorld } = player

    const flycloak = player.getFlycloak(flycloakId)
    if (!flycloak) return RetcodeEnum.RET_NOT_HAS_FLYCLOAK

    // Set flycloak id
    this.wearingFlycloakId = flycloakId

    // Notify player(s) to update this avatar flycloak
    if (player.isInMp() && currentWorld != null) {
      await AvatarFlycloakChange.broadcastNotify(currentWorld.broadcastContextList, this)
    } else {
      await AvatarFlycloakChange.sendNotify(player.context, this)
    }

    return RetcodeEnum.RET_SUCC
  }

  exportAvatarEnterSceneInfo(): AvatarEnterSceneInfo {
    const { entityId, guid, weapon } = this

    return {
      avatarGuid: guid.toString(),
      avatarEntityId: entityId,
      avatarAbilityInfo: {},
      weaponGuid: weapon.guid.toString(),
      weaponEntityId: weapon.entity.entityId,
      weaponAbilityInfo: {}
    }
  }

  exportAvatarEquipChange(equipType: ProtEntityTypeEnum = ProtEntityTypeEnum.PROT_ENTITY_WEAPON): AvatarEquipChangeNotify {
    const { guid, weapon } = this

    switch (equipType) {
      case ProtEntityTypeEnum.PROT_ENTITY_WEAPON:
        return {
          avatarGuid: guid.toString(),
          equipType,
          itemId: weapon?.itemId,
          equipGuid: weapon?.guid?.toString(),
          weapon: weapon?.exportSceneWeaponInfo()
        }
      case ProtEntityTypeEnum.PROT_ENTITY_GADGET:
      default:
        return null
    }
  }

  exportAvatarInfo(): AvatarInfo {
    const { avatarId, guid, props, fightProps, skillDepot, fetterList, excelInfo, avatarType, lifeState, wearingFlycloakId, costumeId, bornTime } = this
    const { skillDepotId, inherentProudSkillList, skillLevelMap, proudSkillExtraLevelMap, talentIdList } = skillDepot.export()

    return {
      avatarId,
      guid: guid.toString(),
      propMap: props.exportPropMap(),
      lifeState,
      equipGuidList: this.exportEquips().map(e => e.guid.toString()),
      talentIdList,
      fightPropMap: fightProps.propMap,
      skillDepotId,
      fetterInfo: fetterList.export(),
      inherentProudSkillList,
      skillLevelMap,
      proudSkillExtraLevelMap,
      avatarType,
      wearingFlycloakId,
      bornTime,
      costumeId,
      excelInfo: excelInfo.export()
    }
  }

  exportEquips() {
    const { weapon, reliquaryMap } = this
    const equips = []

    equips.push(...Object.values(reliquaryMap))
    if (weapon) equips.push(weapon)

    return equips
  }

  exportSatiationData(): AvatarSatiationData {
    const { guid, props } = this

    return {
      avatarGuid: guid.toString(),
      finishTime: 0,
      penaltyFinishTime: props.get(PlayerPropEnum.PROP_SATIATION_PENALTY_TIME)
    }
  }

  exportSceneAvatarInfo(): SceneAvatarInfo {
    const { player, avatarId, guid, weapon, reliquaryMap, skillDepot, excelInfo, wearingFlycloakId, costumeId, bornTime } = this
    const { uid, peerId } = player
    const { skillDepotId, inherentProudSkillList, skillLevelMap, talentIdList } = skillDepot.export()

    return {
      uid,
      avatarId,
      guid: guid.toString(),
      peerId,
      equipIdList: this.exportEquips().map(e => e.itemId),
      skillDepotId,
      weapon: weapon.exportSceneWeaponInfo(),
      reliquaryList: Object.values(reliquaryMap).map(reliquary => reliquary.exportSceneReliquaryInfo()),
      inherentProudSkillList,
      skillLevelMap,
      talentIdList,
      teamResonanceList: [
        10801
      ],
      wearingFlycloakId,
      bornTime,
      costumeId,
      excelInfo: excelInfo.export()
    }
  }

  exportSceneTeamAvatar(): SceneTeamAvatar {
    const { player, entityId, guid, weapon, abilityList, isOnScene } = this
    const { uid, currentScene, currentAvatar } = player

    const data: SceneTeamAvatar = {
      playerUid: uid,
      avatarGuid: guid.toString(),
      sceneId: currentScene.id,
      entityId,
      avatarInfo: this.exportAvatarInfo(),
      avatarAbilityInfo: {},
      sceneAvatarInfo: this.exportSceneAvatarInfo(),
      sceneEntityInfo: this.exportSceneEntityInfo(),
      weaponGuid: weapon.guid.toString(),
      weaponEntityId: weapon.entity.entityId,
      weaponAbilityInfo: {},
      abilityControlBlock: {
        abilityEmbryoList: abilityList.exportEmbryoList()
      },
      isPlayerCurAvatar: (currentAvatar === this),
      isOnScene
    }

    if (player.isInMp()) data.avatarInfo = this.exportAvatarInfo()

    return data
  }

  exportUserData(): AvatarUserData {
    const {
      guid,
      avatarId,
      avatarType,
      skillDepot,
      fetterList,
      weapon,
      wearingFlycloakId,
      bornTime
    } = this

    return Object.assign({
      guid: guid.toString(),
      id: avatarId,
      type: avatarType,
      skillDepotData: skillDepot.exportUserData(),
      fettersData: fetterList.exportUserData(),
      weaponGuid: weapon?.guid?.toString() || <false>false, // stupid typescript >:(
      flycloak: wearingFlycloakId,
      bornTime
    }, super.exportUserData())
  }

  /**Internal Events**/

  // Register
  async handleRegister() {
    await super.handleRegister()

    const { manager, weapon } = this
    if (weapon) await manager.register(weapon.entity)
  }

  // Unregister
  async handleUnregister() {
    await super.handleUnregister()

    const { manager, weapon } = this
    if (weapon) await manager.unregister(weapon.entity)
  }

  // Revive
  async handleRevive() {
    const { context } = this.player
    await AvatarLifeStateChange.sendNotify(context, this)
  }
}