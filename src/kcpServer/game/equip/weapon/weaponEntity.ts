/* eslint-disable @typescript-eslint/require-await */
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

  private loadWeaponData() {
    this.config = WeaponData.getFightPropConfig(this.weapon.itemId)
    this.growCurve = GrowCurveData.getGrowCurve("Weapon")
  }

  async init(userData: EntityUserData): Promise<void> {
    this.loadWeaponData()
    super.init(userData)
  }

  async initNew(level?: number): Promise<void> {
    this.loadWeaponData()
    super.initNew(level)
  }
}
