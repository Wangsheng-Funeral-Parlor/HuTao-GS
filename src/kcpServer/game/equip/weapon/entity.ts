import Entity from '$/entity'
import GrowCurveData from '$/gameData/data/GrowCurveData'
import WeaponData from '$/gameData/data/WeaponData'
import { ProtEntityTypeEnum } from '@/types/enum/entity'
import Weapon from '.'

export class WeaponEntity extends Entity {
  weapon: Weapon

  constructor(weapon: Weapon) {
    super()

    this.weapon = weapon

    this.config = WeaponData.getFightPropConfig(this.weapon.itemId)
    this.growCurve = GrowCurveData.getGrowCurve('Weapon')

    this.entityType = ProtEntityTypeEnum.PROT_ENTITY_WEAPON
  }
}