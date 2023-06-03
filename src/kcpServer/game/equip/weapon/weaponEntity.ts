import Weapon from "."

import Entity from "$/entity"
import GrowCurveData from "$/gameData/data/GrowCurveData"
import WeaponData from "$/gameData/data/WeaponData"
import { EntityTypeEnum } from "@/types/enum"
import { ProtEntityTypeEnum } from "@/types/proto/enum"
import EntityUserData from "@/types/user/EntityUserData"

export default class WeaponEntity extends Entity {
  weapon: Weapon

  constructor(weapon: Weapon) {
    super(true)

    this.weapon = weapon

    this.protEntityType = ProtEntityTypeEnum.PROT_ENTITY_WEAPON
    this.entityType = weapon.monsterEquip ? EntityTypeEnum.MonsterEquip : EntityTypeEnum.Equip
  }

  private async loadWeaponData() {
    this.config = await WeaponData.getFightPropConfig(this.weapon.itemId)
    this.growCurve = await GrowCurveData.getGrowCurve("Weapon")
  }

  async init(userData: EntityUserData): Promise<void> {
    await this.loadWeaponData()
    super.init(userData)
  }

  async initNew(level?: number): Promise<void> {
    await this.loadWeaponData()
    super.initNew(level)
  }
}
