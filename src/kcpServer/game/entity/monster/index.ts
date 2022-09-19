import Entity from '$/entity'
import Weapon from '$/equip/weapon'
import GrowCurveData from '$/gameData/data/GrowCurveData'
import MonsterData from '$/gameData/data/MonsterData'
import Player from '$/player'
import { EntityTypeEnum, FightPropEnum } from '@/types/enum'
import { SceneMonsterInfo } from '@/types/proto'
import { ChangeHpReasonEnum, MonsterBornTypeEnum, ProtEntityTypeEnum } from '@/types/proto/enum'
import EntityUserData from '@/types/user/EntityUserData'

export default class Monster extends Entity {
  player: Player

  monsterId: number

  affixList: number[]
  weaponList: Weapon[]

  hpDropList: { id: number, hp: number }[]
  killDropId: number

  poseId: number
  isElite: boolean

  bornType: MonsterBornTypeEnum

  titleId: number
  specialNameId: number

  constructor(monsterId: number, player: Player) {
    super()

    this.player = player

    this.monsterId = monsterId

    this.affixList = []
    this.weaponList = []

    this.hpDropList = []
    this.killDropId = 0

    this.bornType = MonsterBornTypeEnum.MONSTER_BORN_DEFAULT

    this.poseId = 0
    this.isElite = false

    this.protEntityType = ProtEntityTypeEnum.PROT_ENTITY_MONSTER
    this.entityType = EntityTypeEnum.Monster

    super.initHandlers(this)
  }

  private async loadMonsterData() {
    const { player, monsterId } = this

    this.config = await MonsterData.getFightPropConfig(monsterId)
    this.growCurve = await GrowCurveData.getGrowCurve('Monster')

    const monsterData = await MonsterData.getMonster(monsterId)
    if (!monsterData) return

    this.affixList = monsterData.Affix || []
    this.weaponList = monsterData.Equips.map(id => Weapon.createByGadgetId(id, player, true))

    for (const weapon of this.weaponList) await weapon.initNew()

    this.hpDropList = (monsterData.HpDrops || [])
      .filter(d => d.DropId != null && d.HpPercent != null)
      .map(d => ({ id: d.DropId || 0, hp: (d.HpPercent || 0) / 100 }))
    this.killDropId = monsterData.KillDropId || 0

    const describeData = await MonsterData.getDescribe(monsterData.DescribeId)
    if (describeData) {
      this.titleId = describeData.TitleID || 0
      this.specialNameId = (await MonsterData.getSpecialName(describeData.SpecialNameLabID))?.Id || 0
    }

    this.loadAbilities(monsterData?.Config?.Abilities, true)
  }

  async init(userData: EntityUserData): Promise<void> {
    await this.loadMonsterData()
    await super.init(userData)
  }

  async initNew(level?: number): Promise<void> {
    await this.loadMonsterData()
    await super.initNew(level)
  }

  async takeDamage(attackerId: number, val: number, notify?: boolean, changeHpReason?: ChangeHpReasonEnum, seqId?: number): Promise<void> {
    const { manager, motion, hpDropList } = this

    const maxHp = this.getProp(FightPropEnum.FIGHT_PROP_MAX_HP)
    const hpBefore = this.getProp(FightPropEnum.FIGHT_PROP_CUR_HP) / maxHp
    await super.takeDamage(attackerId, val, notify, changeHpReason, seqId)
    const hpAfter = this.getProp(FightPropEnum.FIGHT_PROP_CUR_HP) / maxHp

    for (const hpDrop of hpDropList) {
      const { id, hp } = hpDrop
      if (hpBefore <= hp || hpAfter > hp) continue

      await manager?.scene?.spawnDropsById(motion.pos, id, seqId)
    }
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
    const { player, manager, weaponList } = this
    const { guidManager } = player

    for (const weapon of weaponList) {
      await manager?.unregister(weapon.entity)
      guidManager.freeGuid(weapon.guid)
    }
  }

  // Death
  async handleDeath(seqId?: number, batch: boolean = false) {
    const { manager, motion, killDropId } = this

    await manager?.scene?.spawnDropsById(motion.pos, killDropId, seqId)
    await super.handleDeath(seqId, batch)
  }
}