import { EquipInterface } from '@/types/game/item'
import { SceneWeaponInfo } from '@/types/game/weapon'
import Equip from '..'
import Affix from './affix'
import { WeaponEntity } from './entity'
import WeaponData from '$/gameData/data/WeaponData'
import { EquipTypeEnum } from '@/types/user/EquipUserData'
import WeaponUserData from '@/types/user/WeaponUserData'

export default class Weapon extends Equip {
  entity: WeaponEntity

  gadgetId: number

  affixList: Affix[]

  constructor(itemId: number, guid?: bigint) {
    super(itemId, guid, EquipTypeEnum.WEAPON)

    this.entity = new WeaponEntity(this)

    this.affixList = []

    const weaponData = WeaponData.get(itemId)
    if (!weaponData) return

    this.gadgetId = weaponData.GadgetId

    for (let affix of weaponData.SkillAffix) {
      if (affix === 0) continue
      this.affixList.push(new Affix(this, affix))
    }
  }

  static createByGadgetId(gadgetId: number): Weapon {
    const weapon = new Weapon(0)
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

  init(userData: WeaponUserData) {
    const { entity, affixList } = this
    const { gadgetId, affixDataList, entityData } = userData

    super.init(userData)

    this.gadgetId = gadgetId || 0

    for (let affix of affixList) {
      const affixData = affixDataList.find(data => data.id === affix.id)
      if (affixData == null) continue

      affix.init(affixData)
    }

    entity.init(entityData)
  }

  initNew() {
    const { entity, affixList } = this

    super.initNew()

    for (let affix of affixList) affix.initNew()
    entity.initNew()
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

  export(): EquipInterface {
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