import ProudSkill from "./proudSkill"
import SkillDepot from "./skillDepot"

import { PacketContext } from "#/packet"
import Embryo from "$/ability/embryo"
import SkillData from "$/gameData/data/SkillData"
import { ElemTypeEnum, FightPropEnum } from "@/types/enum"
import { ChangeEnergyReasonEnum } from "@/types/proto/enum"
import SkillUserData from "@/types/user/SkillUserData"
import { getStringHash } from "@/utils/hash"

export default class Skill {
  depot: SkillDepot
  id: number
  level: number
  proudSkill?: ProudSkill

  cdTime: number
  costStamina: number
  costElemType?: ElemTypeEnum
  costElemVal: number

  abilityName: string | null
  abilityEmbryo: Embryo | null

  started: boolean

  cdStartTime: number | null
  cdDuration: number | null

  constructor(depot: SkillDepot, skillId: number) {
    this.depot = depot
    this.id = skillId

    this.cdTime = 0
    this.costStamina = 0
    this.costElemType = 0
    this.costElemVal = 0

    this.abilityName = null
    this.abilityEmbryo = null

    this.started = false

    this.cdStartTime = null
    this.cdDuration = null
  }

  private get sceneTime(): number | null {
    return this.depot.manager.avatar.player.currentScene?.sceneTime || null
  }

  get isEnergySkill(): boolean {
    return this.depot.energySkill === this
  }

  get isReady(): boolean {
    const { sceneTime, started, cdStartTime, cdDuration } = this
    if (started || sceneTime == null) return false

    return cdStartTime == null || cdDuration == null || sceneTime - cdStartTime > cdDuration
  }

  async init(userData: SkillUserData) {
    const { id, level, proudSkillData } = userData
    if (this.id !== id) return this.initNew()

    this.level = level || 1

    const { AbilityName, ProudSkillGroupId, CdTime, CostStamina, CostElemType, CostElemVal } =
      (await SkillData.getSkill(id)) || {}

    this.cdTime = CdTime || 0
    this.costStamina = CostStamina || 0
    this.costElemType = ElemTypeEnum[(CostElemType || "").toUpperCase()] || 0
    this.costElemVal = CostElemVal || 0

    this.abilityName = AbilityName || null

    if (ProudSkillGroupId == null) return

    this.proudSkill = new ProudSkill(this, ProudSkillGroupId)

    if (proudSkillData) await this.proudSkill.init(proudSkillData)
    else await this.proudSkill.initNew()
  }

  async initNew() {
    const { id } = this

    this.level = 1

    const { AbilityName, ProudSkillGroupId, CostStamina, CostElemType, CostElemVal } =
      (await SkillData.getSkill(id)) || {}

    this.costStamina = CostStamina || 0
    this.costElemType = ElemTypeEnum[(CostElemType || "").toUpperCase()] || 0
    this.costElemVal = CostElemVal || 0

    this.abilityName = AbilityName || null

    if (ProudSkillGroupId == null) return

    this.proudSkill = new ProudSkill(this, ProudSkillGroupId)

    await this.proudSkill.initNew()
  }

  async start(context: PacketContext, cdRatio = 1, costStaminaRatio = 1) {
    const { depot, cdTime, costStamina, abilityName, isEnergySkill, isReady } = this
    const { manager } = depot
    const { avatar } = manager
    const { abilityManager, staminaManager } = avatar

    if (!isReady) return

    try {
      this.started = true

      if (isEnergySkill) await avatar.drainEnergy(true, ChangeEnergyReasonEnum.CHANGE_ENERGY_SKILL_START)
      staminaManager.immediate(costStaminaRatio * costStamina * 100)

      let cdDuration = cdTime * cdRatio * 1e3
      cdDuration -= cdDuration * avatar.getProp(FightPropEnum.FIGHT_PROP_SKILL_CD_MINUS_RATIO)

      if (cdDuration > 0) {
        this.cdStartTime = this.sceneTime
        this.cdDuration = cdDuration
      }

      if (abilityName) await abilityManager.triggerAbility(context, { hash: getStringHash(abilityName) })
    } finally {
      this.started = false
    }
  }

  exportUserData(): SkillUserData {
    const { id, level, proudSkill } = this

    return {
      id,
      level,
      proudSkillData: proudSkill?.exportUserData() || false,
    }
  }
}
