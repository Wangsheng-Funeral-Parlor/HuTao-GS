import { ProtEntityTypeEnum } from '@/types/enum/entity'
import Entity from '$/entity'
import { SceneMonsterInfo } from '@/types/game/monster'
import Weapon from '$/equip/weapon'
import { MonsterBornTypeEnum } from '@/types/enum/monster'
import GrowCurveData from '$/gameData/data/GrowCurveData'

export default class Monster extends Entity {
  monsterId: number
  groupId: number
  configId: number

  weaponList: Weapon[]

  bornType: MonsterBornTypeEnum
  blockId: number
  titleId: number
  specialNameId: number

  constructor(monsterId: number, groupId: number) {
    super()

    this.monsterId = monsterId
    this.groupId = groupId

    this.growCurve = GrowCurveData.getGrowCurve('Monster')

    this.entityType = ProtEntityTypeEnum.PROT_ENTITY_MONSTER

    super.initHandlers(this)
  }

  exportSceneMonsterInfo(): SceneMonsterInfo {
    const { manager, monsterId, groupId, configId, weaponList, bornType, blockId, titleId, specialNameId } = this

    return {
      monsterId,
      groupId,
      configId,
      weaponList: weaponList.map(weapon => weapon.exportSceneWeaponInfo()),
      authorityPeerId: manager?.scene?.host?.peerId || 1,
      bornType,
      blockId,
      titleId,
      specialNameId
    }
  }

  /**Internal Events**/

  // Register
  async handleRegister() {
    const { manager, weaponList } = this
    for (let weapon of weaponList) await manager.register(weapon.entity)
  }

  // Unregister
  async handleUnregister() {
    const { manager, weaponList } = this
    for (let weapon of weaponList) await manager.unregister(weapon.entity)
  }
}