import Entity from '$/entity'
import GrowCurveData from '$/gameData/data/GrowCurveData'
import WeaponData from '$/gameData/data/WeaponData'
import { ProtEntityTypeEnum } from '@/types/proto/enum'
import EntityUserData from '@/types/user/EntityUserData'
import Weapon from '.'

export class WeaponEntity extends Entity {
  weapon: Weapon

  constructor(weapon: Weapon) {
    super()

    this.weapon = weapon

    this.entityType = ProtEntityTypeEnum.PROT_ENTITY_WEAPON
  }

  private async loadWeaponData() {
    this.config = await WeaponData.getFightPropConfig(this.weapon.itemId)
    this.growCurve = await GrowCurveData.getGrowCurve('Weapon')
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