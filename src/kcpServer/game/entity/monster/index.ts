import { ProtEntityTypeEnum } from '@/types/enum/entity'
import Entity from '$/entity'
import { SceneMonsterInfo } from '@/types/game/monster'
import Weapon from '$/equip/weapon'
import { MonsterBornTypeEnum } from '@/types/enum/monster'
import GrowCurveData from '$/gameData/data/GrowCurveData'
import MonsterData from '$/gameData/data/MonsterData'

export default class Monster extends Entity {
  monsterId: number

  affixList: number[]
  weaponList: Weapon[]

  bornType: MonsterBornTypeEnum

  titleId: number
  specialNameId: number

  constructor(monsterId: number) {
    super()

    this.monsterId = monsterId

    this.config = MonsterData.getFightPropConfig(monsterId)
    this.growCurve = GrowCurveData.getGrowCurve('Monster')

    this.entityType = ProtEntityTypeEnum.PROT_ENTITY_MONSTER

    this.affixList = []
    this.weaponList = []
    this.bornType = MonsterBornTypeEnum.MONSTER_BORN_DEFAULT

    super.initHandlers(this)

    const monsterData = MonsterData.getMonster(monsterId)
    if (!monsterData) return

    this.affixList = monsterData.Affix || []
    this.weaponList = monsterData.Equips.map(id => Weapon.createByGadgetId(id))

    const describeData = MonsterData.getDescribe(monsterData.DescribeId)
    if (!describeData) return

    this.titleId = describeData.TitleID || 0
    this.specialNameId = MonsterData.getSpecialName(describeData.SpecialNameLabID)?.Id || 0
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
    for (let weapon of weaponList) await manager?.register(weapon.entity)
  }

  // Unregister
  async handleUnregister() {
    const { manager, weaponList } = this
    for (let weapon of weaponList) await manager?.unregister(weapon.entity)
  }
}