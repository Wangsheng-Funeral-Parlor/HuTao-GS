import Entity from '$/entity'
import GrowCurveData from '$/gameData/data/GrowCurveData'
import { ProtEntityTypeEnum } from '@/types/enum/entity'
import Weapon from '.'

export class WeaponEntity extends Entity {
  weapon: Weapon

  constructor(weapon: Weapon) {
    super()

    this.weapon = weapon

    this.growCurve = GrowCurveData.getGrowCurve('Weapon')

    this.entityType = ProtEntityTypeEnum.PROT_ENTITY_WEAPON
  }
}