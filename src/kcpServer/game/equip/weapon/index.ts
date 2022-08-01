import WeaponData from '$/gameData/data/WeaponData'
import { EquipTypeEnum } from '@/types/enum'
import { EquipInfo, SceneWeaponInfo } from '@/types/proto'
import WeaponUserData from '@/types/user/WeaponUserData'
import Equip from '..'
import Affix from './affix'
import WeaponEntity from './weaponEntity'

export default class Weapon extends Equip {
  entity: WeaponEntity

  gadgetId: number
  affixList: Affix[]

  constructor(itemId: number, guid?: bigint, monsterEquip: boolean = false) {
    super(itemId, guid, EquipTypeEnum.EQUIP_WEAPON)

    this.entity = new WeaponEntity(this, monsterEquip)

    this.gadgetId = 0
    this.affixList = []
  }

  static createByGadgetId(gadgetId: number, monsterEquip: boolean = false): Weapon {
    const weapon = new Weapon(0, undefined, monsterEquip)
    weapon.gadgetId = gadgetId
    return weapon
  }

  get level() {
    return this.entity.level
  }

  get exp() {
    return this.entity.exp
  }

  get promoteLevel() {
    return this.entity.promoteLevel
  }

  set level(v: number) {
    this.entity.level = v
  }

  set exp(v: number) {
    this.entity.exp = v
  }

  set promoteLevel(v: number) {
    this.entity.promoteLevel = v
  }

  async init(userData: WeaponUserData) {
    const { entity, affixList } = this
    const { gadgetId, affixDataList, entityData } = userData

    super.init(userData)

    this.gadgetId = gadgetId || 0

    for (const affixData of affixDataList) {
      const affix = new Affix(this, affixData.id)

      affix.init(affixData)
      affixList.push(affix)
    }

    await entity.init(entityData)
  }

  async initNew() {
    const { itemId, entity, affixList } = this

    super.initNew()

    const weaponData = await WeaponData.getWeapon(itemId)
    if (weaponData != null) {
      this.gadgetId = weaponData.GadgetId

      for (const affixId of weaponData.SkillAffix) {
        if (affixId === 0) continue

        const affix = new Affix(this, affixId)

        affix.initNew()
        affixList.push(affix)
      }
    }

    await entity.initNew()
  }

  exportAffixMap() {
    return Object.fromEntries(this.affixList.map(a => [a.id, a.level]))
  }

  exportSceneWeaponInfo(): SceneWeaponInfo {
    const { entity, gadgetId, itemId, guid, level, promoteLevel } = this
    return {
      entityId: entity.entityId,
      gadgetId,
      itemId,
      guid: guid.toString(),
      level,
      promoteLevel,
      abilityInfo: {},
      affixMap: this.exportAffixMap()
    }
  }

  export(): EquipInfo {
    const { level, exp, promoteLevel, isLocked } = this
    return {
      weapon: {
        level,
        exp,
        promoteLevel,
        affixMap: this.exportAffixMap()
      },
      isLocked
    }
  }

  exportUserData(): WeaponUserData {
    const { gadgetId, entity, affixList } = this

    return Object.assign({
      gadgetId,
      affixDataList: affixList.map(affix => affix.exportUserData()),
      entityData: entity.exportUserData()
    }, super.exportUserData())
  }
}