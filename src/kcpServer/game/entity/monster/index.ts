import Entity from "$/entity"
import Weapon from "$/equip/weapon"
import GrowCurveData from "$/gameData/data/GrowCurveData"
import MonsterData from "$/gameData/data/MonsterData"
import Player from "$/player"
import { EntityTypeEnum, EventTypeEnum, FightPropEnum, MonsterTypeEnum } from "@/types/enum"
import { SceneMonsterInfo } from "@/types/proto"
import { AbilityScalarTypeEnum, ChangeHpReasonEnum, MonsterBornTypeEnum, ProtEntityTypeEnum } from "@/types/proto/enum"
import EntityUserData from "@/types/user/EntityUserData"

export default class Monster extends Entity {
  player: Player

  monsterId: number

  affixList: number[]
  weaponList: Weapon[]

  hpDropList: { id: number; hp: number }[]
  killDropId: number

  poseId: number
  isElite: boolean

  monsterType: MonsterTypeEnum
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

    this.monsterType = MonsterTypeEnum.MONSTER_NONE
    this.bornType = MonsterBornTypeEnum.MONSTER_BORN_DEFAULT

    this.poseId = 0
    this.isElite = false

    this.protEntityType = ProtEntityTypeEnum.PROT_ENTITY_MONSTER
    this.entityType = EntityTypeEnum.Monster

    this.monster = this

    super.initHandlers(this)
  }

  private async loadMonsterData() {
    const { player, monsterId } = this

    this.config = await MonsterData.getFightPropConfig(monsterId)
    this.growCurve = await GrowCurveData.getGrowCurve("Monster")

    const monsterData = await MonsterData.getMonster(monsterId)
    if (!monsterData) return

    this.affixList = monsterData.Affix || []
    this.weaponList = monsterData.Equips.map((id) => Weapon.createByGadgetId(id, player, true))

    for (const weapon of this.weaponList) await weapon.initNew()

    this.hpDropList = (monsterData.HpDrops || [])
      .filter((d) => d.DropId != null && d.HpPercent != null)
      .map((d) => ({ id: d.DropId || 0, hp: (d.HpPercent || 0) / 100 }))
    this.killDropId = monsterData.KillDropId || 0

    this.monsterType = MonsterTypeEnum[monsterData.Type] || MonsterTypeEnum.MONSTER_NONE

    const describeData = await MonsterData.getDescribe(monsterData.DescribeId)
    if (describeData) {
      this.titleId = describeData.TitleID || 0
      this.specialNameId = (await MonsterData.getSpecialName(describeData.SpecialNameLabID))?.Id || 0
    }

    this.loadAbilities(monsterData?.Config?.Abilities, true)
    this.loadGlobalValue(monsterData?.Config?.GlobalValue)
  }

  async init(userData: EntityUserData): Promise<void> {
    await this.loadMonsterData()
    await super.init(userData)
  }

  async initNew(level?: number): Promise<void> {
    await this.loadMonsterData()
    await super.initNew(level)
  }

  isBoss(): boolean {
    return this.monsterType === MonsterTypeEnum.MONSTER_BOSS
  }

  async takeDamage(
    attackerId: number,
    val: number,
    notify?: boolean,
    changeHpReason?: ChangeHpReasonEnum,
    seqId?: number
  ): Promise<void> {
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
    const {
      authorityPeerId,
      monsterId,
      groupId,
      configId,
      affixList,
      weaponList,
      bornType,
      blockId,
      poseId,
      isElite,
      titleId,
      specialNameId,
    } = this

    return {
      monsterId,
      groupId,
      configId,
      affixList,
      weaponList: weaponList.map((weapon) => weapon.exportSceneWeaponInfo()),
      authorityPeerId,
      bornType,
      blockId,
      poseId,
      isElite,
      titleId,
      specialNameId,
    }
  }

  /**Events**/

  // Register
  async handleRegister() {
    const { manager, weaponList, abilityManager } = this
    const { sgvDynamicValueMapContainer } = abilityManager

    for (const weapon of weaponList) await manager?.register(weapon.entity)

    if (!this.isBoss()) return

    setTimeout(() => {
      const keys = sgvDynamicValueMapContainer.getKeys()
      for (const key of keys) {
        const { type, val } = sgvDynamicValueMapContainer.getValue(key)

        if (type !== AbilityScalarTypeEnum.FLOAT || val !== 0) continue

        sgvDynamicValueMapContainer.setValue({
          key,
          valueType: type,
          floatValue: 1,
        })
      }
    }, 5e3)
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
  async handleDeath(seqId?: number, batch = false) {
    const { manager, motion, killDropId } = this

    if (manager.scene.activeChallenge != null) manager.scene.activeChallenge.onMonsterDeath(this)
    if (manager.scene.EnableScript)
      await this.sceneGroup?.scene.scriptManager.emit(EventTypeEnum.EVENT_ANY_MONSTER_DIE, this.groupId, this.configId)

    await manager?.scene?.spawnDropsById(motion.pos, killDropId, seqId)
    await super.handleDeath(seqId, batch)
  }
}
