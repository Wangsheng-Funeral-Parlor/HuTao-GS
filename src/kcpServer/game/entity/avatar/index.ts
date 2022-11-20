import AvatarChangeCostume from '#/packets/AvatarChangeCostume'
import AvatarEquipChange, { AvatarEquipChangeNotify } from '#/packets/AvatarEquipChange'
import AvatarFlycloakChange from '#/packets/AvatarFlycloakChange'
import AvatarLifeStateChange from '#/packets/AvatarLifeStateChange'
import Entity from '$/entity'
import Equip from '$/equip'
import Reliquary from '$/equip/reliquary'
import Weapon from '$/equip/weapon'
import AvatarData from '$/gameData/data/AvatarData'
import GrowCurveData from '$/gameData/data/GrowCurveData'
import SkillManager from '$/manager/skillManager'
import StaminaManager from '$/manager/staminaManager'
import TalentManager from '$/manager/talentManager'
import Player from '$/player'
import { EntityTypeEnum, EquipTypeEnum, PlayerPropEnum } from '@/types/enum'
import { AvatarEnterSceneInfo, AvatarInfo, AvatarSatiationData, SceneAvatarInfo, SceneTeamAvatar } from '@/types/proto'
import { AvatarTypeEnum, ProtEntityTypeEnum, RetcodeEnum } from '@/types/proto/enum'
import AvatarUserData from '@/types/user/AvatarUserData'
import { getTimeSeconds } from '@/utils/time'
import ExcelInfo from './excelInfo'
import FetterList from './fetter/fetterList'

const AvatarDefaultAbilities = [
  'Avatar_DefaultAbility_VisionReplaceDieInvincible',
  'Avatar_DefaultAbility_AvartarInShaderChange',
  'Avatar_SprintBS_Invincible',
  'Avatar_Freeze_Duration_Reducer',
  'Avatar_Attack_ReviveEnergy',
  'Avatar_Component_Initializer',
  'Avatar_FallAnthem_Achievement_Listener',
  'GrapplingHookSkill_Ability'
]

export default class Avatar extends Entity {
  player: Player

  avatarId: number
  guid: bigint

  equipMap: { [type: number]: Equip }

  staminaManager: StaminaManager
  talentManager: TalentManager
  skillManager: SkillManager
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
    this.guid = player.guidManager.getGuid(guid)

    this.equipMap = {}

    this.staminaManager = new StaminaManager(this)
    this.talentManager = new TalentManager(this)
    this.skillManager = new SkillManager(this)
    this.fetterList = new FetterList(this)
    this.excelInfo = new ExcelInfo(this)

    this.protEntityType = ProtEntityTypeEnum.PROT_ENTITY_AVATAR
    this.entityType = EntityTypeEnum.Avatar

    super.initHandlers(this)
  }

  private async loadAvatarData() {
    const { avatarId, abilityManager } = this

    this.config = await AvatarData.getFightPropConfig(avatarId)
    this.growCurve = await GrowCurveData.getGrowCurve('Avatar')

    const avatarData = await AvatarData.getAvatar(avatarId)
    if (!avatarData) return

    this.name = avatarData.Name || null

    for (const name of AvatarDefaultAbilities) abilityManager.addEmbryo(name)
    this.loadAbilities(avatarData?.Config?.Abilities)
  }

  async init(userData: AvatarUserData) {
    const { player, avatarId, talentManager, skillManager, fetterList, excelInfo, motion } = this
    const { inventory } = player
    const {
      id,
      type,
      talentData,
      skillsData,
      fettersData,
      weaponGuid,
      equipGuidList,
      flycloak,
      costume,
      bornTime
    } = userData
    if (avatarId !== id) return this.initNew(undefined, false)

    await this.loadAvatarData()

    await talentManager.init(talentData)
    await skillManager.init(skillsData)
    await fetterList.init(fettersData)
    await excelInfo.init()

    motion.standby()

    const equipGuids = equipGuidList || []
    if (weaponGuid) equipGuids.push(weaponGuid) // compatibility

    for (const equipGuid of equipGuids) {
      const item = inventory.getItem(BigInt(equipGuid))
      if (!item?.equip) continue

      this.equip(item.equip, false)
    }

    this.wearingFlycloakId = flycloak
    this.costumeId = costume
    this.avatarType = type
    this.bornTime = bornTime

    super.init(userData)
  }

  async initNew(avatarType: AvatarTypeEnum = AvatarTypeEnum.FORMAL, notify: boolean = true): Promise<void> {
    const { player, avatarId, skillManager, fetterList, excelInfo, motion } = this

    await this.loadAvatarData()

    await skillManager.initNew()
    await fetterList.initNew()
    await excelInfo.init()

    motion.standby()

    const weapon = new Weapon((await AvatarData.getAvatar(avatarId))?.InitialWeapon, player)
    await weapon.initNew()

    await player.inventory.add(weapon, notify, true)
    await this.equip(weapon, notify)

    this.wearingFlycloakId = 140001
    this.avatarType = avatarType
    this.bornTime = getTimeSeconds()

    super.initNew()
  }

  get weapon(): Weapon {
    return <Weapon>this.equipMap[EquipTypeEnum.EQUIP_WEAPON] || null
  }

  async equip(equip: Equip, notify: boolean = true): Promise<void> {
    const { manager, player, fightProps, equipMap } = this
    const { currentScene, context } = player
    const { type, equipped: equipOwner } = equip

    const curEquip = equipMap[type]
    if (equip === curEquip) return

    if (equipOwner) await equipOwner.unequip(equip, false)

    if (curEquip) {
      await this.unequip(curEquip, false)
      if (equipOwner) await equipOwner.equip(curEquip, notify)
    }

    equipMap[type] = equip
    if (type === EquipTypeEnum.EQUIP_WEAPON && manager) await manager.register((<Weapon>equip).entity)

    equip.equipped = this

    const broadcastContextList = currentScene?.broadcastContextList || [context]

    if (notify) await AvatarEquipChange.broadcastNotify(broadcastContextList, this, type)
    await fightProps.update(notify)
  }

  async unequip(equip: Equip, notify: boolean = true): Promise<void> {
    if (equip.equipped !== this) return

    const { manager, player, fightProps, equipMap } = this
    const { currentScene, context } = player
    const { type } = equip

    if (equipMap[type] !== equip) return

    delete equipMap[type]
    if (type === EquipTypeEnum.EQUIP_WEAPON && manager) await manager.unregister((<Weapon>equip).entity)

    equip.equipped = null

    const broadcastContextList = currentScene?.broadcastContextList || [context]

    if (notify) await AvatarEquipChange.broadcastNotify(broadcastContextList, this, type)
    await fightProps.update(notify)
  }

  async changeCostume(costumeId: number): Promise<RetcodeEnum> {
    const { player, avatarId } = this

    if (costumeId) {
      const costume = player.getCostume(avatarId, costumeId)
      if (!costume) return RetcodeEnum.RET_NOT_HAS_COSTUME
    }

    // Set costume id
    this.costumeId = costumeId

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

  exportAvatarEquipChange(equipType: EquipTypeEnum = EquipTypeEnum.EQUIP_WEAPON): AvatarEquipChangeNotify {
    const { guid, equipMap } = this
    const equip = equipMap[equipType]

    const equipChange: AvatarEquipChangeNotify = {
      avatarGuid: guid.toString(),
      equipType
    }

    if (equip == null) return equipChange

    equipChange.itemId = equip.itemId
    equipChange.equipGuid = equip.guid.toString()

    if (equipType === EquipTypeEnum.EQUIP_WEAPON) equipChange.weapon = (<Weapon>equip).exportSceneWeaponInfo()
    else equipChange.reliquary = (<Reliquary>equip).exportSceneReliquaryInfo()

    return equipChange
  }

  exportAvatarInfo(): AvatarInfo {
    const { avatarId, guid, props, fightProps, skillManager, talentManager, fetterList, /*excelInfo,*/ avatarType, lifeState, wearingFlycloakId, costumeId, bornTime } = this
    const { skillDepotId, inherentProudSkillList, skillLevelMap, proudSkillExtraLevelMap } = skillManager.export() || {}

    return {
      avatarId,
      guid: guid.toString(),
      propMap: props.exportPropMap(),
      lifeState,
      equipGuidList: this.exportEquipList().map(e => e.guid.toString()),
      talentIdList: talentManager.exportIdList(),
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
      //excelInfo: excelInfo.export()
    }
  }

  exportEquipList(reliquaryOnly: boolean = false): Equip[] {
    const { equipMap } = this
    return Object.values(equipMap).filter(equip =>
      equip != null &&
      (!reliquaryOnly || (equip.type > EquipTypeEnum.EQUIP_NONE && equip.type < EquipTypeEnum.EQUIP_WEAPON))
    )
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
    const { player, avatarId, guid, weapon, skillManager, talentManager, /*excelInfo,*/ wearingFlycloakId, costumeId, bornTime } = this
    const { uid, peerId } = player
    const { skillDepotId, inherentProudSkillList, skillLevelMap } = skillManager.export() || {}

    return {
      uid,
      avatarId,
      guid: guid.toString(),
      peerId,
      equipIdList: this.exportEquipList().map(e => e.itemId),
      skillDepotId,
      weapon: weapon.exportSceneWeaponInfo(),
      reliquaryList: (<Reliquary[]>this.exportEquipList(true)).map(reliquary => reliquary.exportSceneReliquaryInfo()),
      inherentProudSkillList,
      skillLevelMap,
      talentIdList: talentManager.exportIdList(),
      teamResonanceList: [
        10801
      ],
      wearingFlycloakId,
      bornTime,
      costumeId,
      //excelInfo: excelInfo.export()
    }
  }

  exportSceneTeamAvatar(): SceneTeamAvatar {
    const { player, entityId, guid, weapon, abilityManager, isOnScene } = this
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
        abilityEmbryoList: abilityManager.exportEmbryoList()
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
      talentManager,
      skillManager,
      fetterList,
      wearingFlycloakId,
      costumeId,
      bornTime
    } = this

    return Object.assign({
      guid: guid.toString(),
      id: avatarId,
      type: avatarType,
      talentData: talentManager.exportUserData(),
      skillsData: skillManager.exportUserData(),
      fettersData: fetterList.exportUserData(),
      equipGuidList: this.exportEquipList().map(equip => equip.guid.toString()),
      flycloak: wearingFlycloakId,
      costume: costumeId,
      bornTime
    }, super.exportUserData())
  }

  /**Events**/

  // Register
  async handleRegister() {
    const { manager, weapon } = this
    if (weapon) await manager.register(weapon.entity)
  }

  // Unregister
  async handleUnregister() {
    const { manager, weapon } = this
    if (weapon) await manager?.unregister(weapon.entity)
  }

  // Revive
  async handleRevive() {
    const { context } = this.player
    await AvatarLifeStateChange.sendNotify(context, this)
  }
}