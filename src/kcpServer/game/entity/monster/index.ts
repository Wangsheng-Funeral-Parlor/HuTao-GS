import Entity from '$/entity'
import Weapon from '$/equip/weapon'
import GrowCurveData from '$/gameData/data/GrowCurveData'
import MonsterData from '$/gameData/data/MonsterData'
import { EntityTypeEnum } from '@/types/enum'
import { SceneMonsterInfo } from '@/types/proto'
import { MonsterBornTypeEnum, ProtEntityTypeEnum } from '@/types/proto/enum'
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

    this.affixList = []
    this.weaponList = []
    this.bornType = MonsterBornTypeEnum.MONSTER_BORN_DEFAULT

    this.poseId = 0
    this.isElite = false

    this.protEntityType = ProtEntityTypeEnum.PROT_ENTITY_MONSTER
    this.entityType = EntityTypeEnum.Monster

    super.initHandlers(this)
  }

  private async loadMonsterData() {
    const { monsterId } = this

    this.config = await MonsterData.getFightPropConfig(monsterId)
    this.growCurve = await GrowCurveData.getGrowCurve('Monster')

    const monsterData = await MonsterData.getMonster(monsterId)
    if (!monsterData) return

    this.affixList = monsterData.Affix || []
    this.weaponList = monsterData.Equips.map(id => Weapon.createByGadgetId(id, true))

    for (const weapon of this.weaponList) await weapon.initNew()

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

  /**Events**/

  // Register
  async handleRegister() {
    const { manager, weaponList } = this
    for (const weapon of weaponList) await manager?.register(weapon.entity)
  }

  // Unregister
  async handleUnregister() {
    const { manager, weaponList } = this
    for (const weapon of weaponList) await manager?.unregister(weapon.entity)
  }
}