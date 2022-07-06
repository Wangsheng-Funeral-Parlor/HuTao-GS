import { ProtEntityTypeEnum } from '@/types/enum/entity'
import Entity from '$/entity'
import { SceneMonsterInfo } from '@/types/game/monster'
import Weapon from '$/equip/weapon'
import { MonsterBornTypeEnum } from '@/types/enum/monster'
import GrowCurveData from '$/gameData/data/GrowCurveData'
import MonsterData from '$/gameData/data/MonsterData'
import EntityUserData from '@/types/user/EntityUserData'

export default class Monster extends Entity {
  monsterId: number

  affixList: number[]
  weaponList: Weapon[]

  poseId: number
  isElite: boolean

  bornType: MonsterBornTypeEnum

  titleId: number
  specialNameId: number

  constructor(monsterId: number) {
    super()

    this.monsterId = monsterId

    this.entityType = ProtEntityTypeEnum.PROT_ENTITY_MONSTER

    this.affixList = []
    this.weaponList = []
    this.bornType = MonsterBornTypeEnum.MONSTER_BORN_DEFAULT

    this.poseId = 0
    this.isElite = false

    super.initHandlers(this)
  }

  private async loadMonsterData() {
    const { monsterId } = this

    this.config = await MonsterData.getFightPropConfig(monsterId)
    this.growCurve = await GrowCurveData.getGrowCurve('Monster')

    const monsterData = await MonsterData.getMonster(monsterId)
    if (!monsterData) return

    this.affixList = monsterData.Affix || []
    this.weaponList = monsterData.Equips.map(id => Weapon.createByGadgetId(id))

    const describeData = await MonsterData.getDescribe(monsterData.DescribeId)
    if (!describeData) return

    this.titleId = describeData.TitleID || 0
    this.specialNameId = (await MonsterData.getSpecialName(describeData.SpecialNameLabID))?.Id || 0
  }

  async init(userData: EntityUserData): Promise<void> {
    await this.loadMonsterData()
    super.init(userData)
  }

  async initNew(level?: number): Promise<void> {
    await this.loadMonsterData()
    super.initNew(level)
  }

  exportSceneMonsterInfo(): SceneMonsterInfo {
    const { authorityPeerId, monsterId, groupId, configId, weaponList, bornType, blockId, poseId, isElite, titleId, specialNameId } = this

    return {
      monsterId,
      groupId,
      configId,
      weaponList: weaponList.map(weapon => weapon.exportSceneWeaponInfo()),
      authorityPeerId,
      bornType,
      blockId,
      poseId,
      isElite,
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