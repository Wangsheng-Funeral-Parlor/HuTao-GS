import Equip from ".."

import Affix from "./affix"
import WeaponEntity from "./weaponEntity"

import WeaponData from "$/gameData/data/WeaponData"
import Player from "$/player"
import { EquipTypeEnum, ItemTypeEnum } from "@/types/enum"
import { EquipInfo, SceneWeaponInfo } from "@/types/proto"
import WeaponUserData from "@/types/user/WeaponUserData"

export default class Weapon extends Equip {
  entity: WeaponEntity

  monsterEquip: boolean
  affixList: Affix[]

  constructor(itemId: number, player: Player, monsterEquip = false) {
    super(itemId, player, ItemTypeEnum.ITEM_WEAPON, EquipTypeEnum.EQUIP_WEAPON)

    this.monsterEquip = monsterEquip
    this.entity = new WeaponEntity(this)

    this.affixList = []
  }

  static createByGadgetId(gadgetId: number, player: Player, monsterEquip = false): Weapon {
    const weapon = new Weapon(0, player, monsterEquip)
    weapon.gadgetId = gadgetId
    return weapon
  }

  private async loadWeaponData() {
    const { itemId, gadgetId, affixList } = this
    const weaponData =
      itemId === 0 ? await WeaponData.getWeaponByGadgetId(gadgetId) : await WeaponData.getWeapon(itemId)

    this.itemId = weaponData?.Id || itemId
    this.gadgetId = weaponData?.GadgetId || gadgetId

    if (Array.isArray(weaponData?.SkillAffix)) {
      affixList.splice(0)

      for (const affixId of weaponData.SkillAffix) {
        if (affixId === 0) continue
        affixList.push(new Affix(this, affixId))
      }
    }
  }

  get level() {
    return this.entity.level
  }
  set level(v: number) {
    this.entity.level = v
  }

  get exp() {
    return this.entity.exp
  }
  set exp(v: number) {
    this.entity.exp = v
  }

  get promoteLevel() {
    return this.entity.promoteLevel
  }
  set promoteLevel(v: number) {
    this.entity.promoteLevel = v
  }

  async init(userData: WeaponUserData) {
    const { entity, affixList } = this
    const { affixDataList, entityData } = userData

    await super.init(userData)

    await this.loadWeaponData()
    for (const affixData of affixDataList) {
      const affix = affixList.find((a) => a.id === affixData.id)
      affix?.init(affixData)
    }

    await entity.init(entityData)
  }

  async initNew(level?: number) {
    const { entity, affixList } = this

    await super.initNew()

    await this.loadWeaponData()
    for (const affix of affixList) affix.initNew()

    await entity.initNew(level)
  }

  exportAffixMap() {
    return Object.fromEntries(this.affixList.map((a) => [a.id, a.level]))
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
      affixMap: this.exportAffixMap(),
    }
  }

  export(): EquipInfo {
    const { level, exp, promoteLevel, isLocked } = this
    return {
      weapon: {
        level,
        exp,
        promoteLevel,
        affixMap: this.exportAffixMap(),
      },
      isLocked,
    }
  }

  exportUserData(): WeaponUserData {
    const { entity, affixList } = this

    return Object.assign(
      {
        affixDataList: affixList.map((affix) => affix.exportUserData()),
        entityData: entity.exportUserData(),
      },
      super.exportUserData()
    )
  }
}
