import Avatar from "./avatar"
import Monster from "./monster"

import Entity from "."

import AvatarFightPropUpdate from "#/packets/AvatarFightPropUpdate"
import EntityFightPropChangeReason, { EntityFightPropChangeReasonNotify } from "#/packets/EntityFightPropChangeReason"
import EntityFightPropUpdate from "#/packets/EntityFightPropUpdate"
import Reliquary from "$/equip/reliquary"
import Weapon from "$/equip/weapon"
import Config from "@/config"
import Logger from "@/logger"
import { CurveArithEnum, ElemTypeEnum, FightPropEnum } from "@/types/enum"
import { EntityFightPropConfig } from "@/types/game"
import { CurveExcelConfig } from "@/types/gameData/ExcelBinOutput/Common/CurveExcelConfig"
import { FightPropPair } from "@/types/proto"
import { ChangeEnergyReasonEnum, ChangeHpReasonEnum, ProtEntityTypeEnum } from "@/types/proto/enum"
import PropsUserData from "@/types/user/PropsUserData"

const logger = new Logger("fightProp", 0xf5c242)

const ElemTypeFightPropMaxEnergyMap = {
  [ElemTypeEnum.FIRE]: FightPropEnum.FIGHT_PROP_MAX_FIRE_ENERGY,
  [ElemTypeEnum.ELECTRIC]: FightPropEnum.FIGHT_PROP_MAX_ELEC_ENERGY,
  [ElemTypeEnum.WATER]: FightPropEnum.FIGHT_PROP_MAX_WATER_ENERGY,
  [ElemTypeEnum.GRASS]: FightPropEnum.FIGHT_PROP_MAX_GRASS_ENERGY,
  [ElemTypeEnum.WIND]: FightPropEnum.FIGHT_PROP_MAX_WIND_ENERGY,
  [ElemTypeEnum.ICE]: FightPropEnum.FIGHT_PROP_MAX_ICE_ENERGY,
  [ElemTypeEnum.ROCK]: FightPropEnum.FIGHT_PROP_MAX_ROCK_ENERGY,
}

const ElemTypeFightPropCurEnergyMap = {
  [ElemTypeEnum.FIRE]: FightPropEnum.FIGHT_PROP_CUR_FIRE_ENERGY,
  [ElemTypeEnum.ELECTRIC]: FightPropEnum.FIGHT_PROP_CUR_ELEC_ENERGY,
  [ElemTypeEnum.WATER]: FightPropEnum.FIGHT_PROP_CUR_WATER_ENERGY,
  [ElemTypeEnum.GRASS]: FightPropEnum.FIGHT_PROP_CUR_GRASS_ENERGY,
  [ElemTypeEnum.WIND]: FightPropEnum.FIGHT_PROP_CUR_WIND_ENERGY,
  [ElemTypeEnum.ICE]: FightPropEnum.FIGHT_PROP_CUR_ICE_ENERGY,
  [ElemTypeEnum.ROCK]: FightPropEnum.FIGHT_PROP_CUR_ROCK_ENERGY,
}

const DYNAMIC_PROPS = [
  FightPropEnum.FIGHT_PROP_HP,
  FightPropEnum.FIGHT_PROP_HP_PERCENT,
  FightPropEnum.FIGHT_PROP_ATTACK,
  FightPropEnum.FIGHT_PROP_ATTACK_PERCENT,
  FightPropEnum.FIGHT_PROP_DEFENSE,
  FightPropEnum.FIGHT_PROP_DEFENSE_PERCENT,
  FightPropEnum.FIGHT_PROP_CHARGE_EFFICIENCY,
  FightPropEnum.FIGHT_PROP_ELEMENT_MASTERY,
  FightPropEnum.FIGHT_PROP_FIRE_SUB_HURT,
  FightPropEnum.FIGHT_PROP_ELEC_SUB_HURT,
  FightPropEnum.FIGHT_PROP_ICE_SUB_HURT,
  FightPropEnum.FIGHT_PROP_WATER_SUB_HURT,
  FightPropEnum.FIGHT_PROP_WIND_SUB_HURT,
  FightPropEnum.FIGHT_PROP_ROCK_SUB_HURT,
  FightPropEnum.FIGHT_PROP_GRASS_SUB_HURT,
  FightPropEnum.FIGHT_PROP_CRITICAL,
  FightPropEnum.FIGHT_PROP_CRITICAL_HURT,
  FightPropEnum.FIGHT_PROP_HEAL_ADD,
  FightPropEnum.FIGHT_PROP_FIRE_ADD_HURT,
  FightPropEnum.FIGHT_PROP_ELEC_ADD_HURT,
  FightPropEnum.FIGHT_PROP_ICE_ADD_HURT,
  FightPropEnum.FIGHT_PROP_WATER_ADD_HURT,
  FightPropEnum.FIGHT_PROP_WIND_ADD_HURT,
  FightPropEnum.FIGHT_PROP_ROCK_ADD_HURT,
  FightPropEnum.FIGHT_PROP_GRASS_ADD_HURT,
  FightPropEnum.FIGHT_PROP_PHYSICAL_ADD_HURT,
  FightPropEnum.FIGHT_PROP_SHIELD_COST_MINUS_RATIO,
  FightPropEnum.FIGHT_PROP_HEALED_ADD,
  FightPropEnum.FIGHT_PROP_SKILL_CD_MINUS_RATIO,
  FightPropEnum.FIGHT_PROP_SPEED_PERCENT,
  FightPropEnum.FIGHT_PROP_PHYSICAL_SUB_HURT,
  FightPropEnum.FIGHT_PROP_ADD_HURT,
  FightPropEnum.FIGHT_PROP_SUB_HURT,
]

export interface FightPropChangeReason {
  changeHpReason?: ChangeHpReasonEnum
  changeEnergyReason?: ChangeEnergyReasonEnum
}

export default class FightProp {
  entity: Entity

  propMap: { [id: number]: number }

  constructor(entity: Entity) {
    this.entity = entity

    this.propMap = {}
  }

  init(userData: PropsUserData) {
    for (const type in userData) {
      if (isNaN(parseInt(type))) continue
      this.set(parseInt(type), userData[type])
    }
  }

  async update(notify = false): Promise<void> {
    const curve = this.getCurve()
    if (!curve) return

    this.clear(true)

    if (this.entity.protEntityType === ProtEntityTypeEnum.PROT_ENTITY_WEAPON) {
      this.updateWeaponStats(curve)
      return
    }

    const hpPercent =
      this.get(FightPropEnum.FIGHT_PROP_MAX_HP) > 0
        ? this.get(FightPropEnum.FIGHT_PROP_CUR_HP) / this.get(FightPropEnum.FIGHT_PROP_MAX_HP)
        : 1

    this.updateBaseStats(curve)

    const weaponList = this.getWeaponList()
    for (const weapon of weaponList) this.applyWeaponStats(weapon)

    const relicList = this.getRelicList()
    for (const relic of relicList) this.applyRelicStats(relic)

    this.updateHpStats()
    this.updateAtkStats()
    this.updateDefStats()

    this.set(FightPropEnum.FIGHT_PROP_CUR_HP, this.get(FightPropEnum.FIGHT_PROP_MAX_HP) * hpPercent)

    if (!notify) return
    await this.sendUpdateNotify(this.propMap)
  }

  private updateBaseStats(curve: CurveExcelConfig) {
    this.set(FightPropEnum.FIGHT_PROP_BASE_HP, this.calcBaseHp(curve))
    this.set(FightPropEnum.FIGHT_PROP_BASE_ATTACK, this.calcBaseAttack(curve))
    this.set(FightPropEnum.FIGHT_PROP_BASE_DEFENSE, this.calcBaseDefense(curve))

    if (this.entity.protEntityType !== ProtEntityTypeEnum.PROT_ENTITY_AVATAR) return

    const { Critical, CriticalHurt } = this.entity.config

    this.set(FightPropEnum.FIGHT_PROP_CRITICAL, Critical)
    this.set(FightPropEnum.FIGHT_PROP_CRITICAL_HURT, CriticalHurt)

    this.set(FightPropEnum.FIGHT_PROP_CHARGE_EFFICIENCY, 1)
    this.set(FightPropEnum.FIGHT_PROP_ELEMENT_MASTERY, 0)

    this.updateEnergyStats()
  }

  private updateHpStats() {
    const base = this.get(FightPropEnum.FIGHT_PROP_BASE_HP)
    const val = this.get(FightPropEnum.FIGHT_PROP_HP)
    const per = this.get(FightPropEnum.FIGHT_PROP_HP_PERCENT)

    this.set(FightPropEnum.FIGHT_PROP_MAX_HP, base * (1 + per) + val)
  }

  private updateAtkStats() {
    const base = this.get(FightPropEnum.FIGHT_PROP_BASE_ATTACK)
    const val = this.get(FightPropEnum.FIGHT_PROP_ATTACK)
    const per = this.get(FightPropEnum.FIGHT_PROP_ATTACK_PERCENT)

    this.set(FightPropEnum.FIGHT_PROP_CUR_ATTACK, base * (1 + per) + val)
  }

  private updateDefStats() {
    const base = this.get(FightPropEnum.FIGHT_PROP_BASE_DEFENSE)
    const val = this.get(FightPropEnum.FIGHT_PROP_DEFENSE)
    const per = this.get(FightPropEnum.FIGHT_PROP_DEFENSE_PERCENT)

    this.set(FightPropEnum.FIGHT_PROP_CUR_DEFENSE, base * (1 + per) + val)
  }

  private updateEnergyStats() {
    let costElemType = this.getCostElemType()
    let maxEnergy = this.getCostElemVal()
    let energyPercent = this.getMaxEnergy() > 0 ? this.getCurEnergy() / this.getMaxEnergy() : 1
    const { res_developer } = Config

    logger.debug("updateEnergyStats:", costElemType, maxEnergy, energyPercent, this.entity.name)

    if (costElemType == 0 && maxEnergy == 0) {
      for (const data in res_developer) {
        if (this.entity.name.toUpperCase() == data.toUpperCase()) {
          logger.debug(data, res_developer, res_developer[data])
          costElemType = res_developer[data][0]
          maxEnergy = res_developer[data][1] || 1
          energyPercent = res_developer[data][2] || 1
        }
      }
    }
    if (costElemType == 0 && maxEnergy == 0) logger.warn("updateEnergyStats: Skill Data not enough:", this.entity.name)
    // Max energy
    this.set(ElemTypeFightPropMaxEnergyMap[costElemType], maxEnergy)

    // Current energy
    this.set(ElemTypeFightPropCurEnergyMap[costElemType], maxEnergy * energyPercent)
  }

  private applyWeaponStats(weapon: Weapon) {
    const propList = weapon.entity.fightProps.exportPropList()
    for (const prop of propList) {
      const { propType, propValue } = prop
      this.add(propType, propValue)
    }
  }

  private applyRelicStats(reliquary: Reliquary) {
    this.applyRelicMainStats(reliquary)
    this.applyRelicSubStats(reliquary)
  }

  private applyRelicMainStats(reliquary: Reliquary) {
    const { mainPropType, mainPropValue } = reliquary
    if (mainPropType === FightPropEnum.FIGHT_PROP_NONE) return

    this.add(mainPropType, mainPropValue)
  }

  private applyRelicSubStats(reliquary: Reliquary) {
    const { subStatMap } = reliquary

    for (const key in subStatMap) {
      const type = parseInt(key)
      if (isNaN(type) || type === FightPropEnum.FIGHT_PROP_NONE) continue

      this.add(type, subStatMap[key])
    }
  }

  private applyCurve(base: number, curveArith: CurveArithEnum, value = 0) {
    switch (curveArith) {
      case CurveArithEnum.ARITH_ADD:
        return base + value
      case CurveArithEnum.ARITH_MULTI:
        return base * value
      default:
        return base
    }
  }

  private calcBaseAttack(curve: CurveExcelConfig) {
    const { AttackBase } = this.entity.config
    const curveType = this.getPropCurve(FightPropEnum.FIGHT_PROP_BASE_ATTACK)?.Type
    const curveInfo = curve.CurveInfos.find((i) => i.Type === curveType)
    if (!curveInfo) return AttackBase
    return this.applyCurve(AttackBase, CurveArithEnum[curveInfo.Arith], curveInfo.Value)
  }

  private calcBaseDefense(curve: CurveExcelConfig) {
    const { DefenseBase } = this.entity.config
    const curveType = this.getPropCurve(FightPropEnum.FIGHT_PROP_BASE_DEFENSE)?.Type
    const curveInfo = curve.CurveInfos.find((i) => i.Type === curveType)
    if (!curveInfo) return DefenseBase
    return this.applyCurve(DefenseBase, CurveArithEnum[curveInfo.Arith], curveInfo.Value)
  }

  private calcBaseHp(curve: CurveExcelConfig) {
    const { HpBase } = this.entity.config
    const curveType = this.getPropCurve(FightPropEnum.FIGHT_PROP_BASE_HP)?.Type
    const curveInfo = curve.CurveInfos.find((i) => i.Type === curveType)
    if (!curveInfo) return HpBase
    return this.applyCurve(HpBase, CurveArithEnum[curveInfo.Arith], curveInfo.Value)
  }

  private updateWeaponStats(curve: CurveExcelConfig) {
    for (const id in FightPropEnum) {
      const prop = parseInt(id)
      if (isNaN(prop)) continue

      const propCurve = this.getPropCurve(prop)
      const curveType = propCurve?.Type
      const curveInfo = curve.CurveInfos.find((i) => i.Type === curveType)
      if (!curveInfo) continue

      this.set(prop, this.applyCurve(propCurve.Value, CurveArithEnum[curveInfo.Arith], curveInfo.Value))
    }
  }

  private getCurve() {
    const { entity } = this
    const { level, growCurve } = entity
    return growCurve.find((c) => c.Level === level)
  }

  private getPropCurve(prop: FightPropEnum): { Type: string; Value?: number } {
    const { PropGrowCurves } = <EntityFightPropConfig>(this.entity.config || {})
    if (PropGrowCurves == null) return null

    const propCurve = PropGrowCurves.find((c) => FightPropEnum[c.PropType] === prop)
    if (!propCurve) return null

    if (propCurve.Value == null) return { Type: propCurve.Type }
    else return { Type: propCurve.Type, Value: propCurve.Value }
  }

  private getWeaponList(): Weapon[] {
    const { entity } = this
    const { protEntityType: entityType } = entity

    switch (entityType) {
      case ProtEntityTypeEnum.PROT_ENTITY_AVATAR:
        return [(<Avatar>entity).weapon].filter((weapon) => weapon != null)
      case ProtEntityTypeEnum.PROT_ENTITY_MONSTER:
        return (<Monster>entity).weaponList
      default:
        return []
    }
  }

  private getRelicList(): Reliquary[] {
    const { entity } = this
    const { protEntityType: entityType } = entity

    if (entityType !== ProtEntityTypeEnum.PROT_ENTITY_AVATAR) return []

    return <Reliquary[]>(<Avatar>entity).exportEquipList(true)
  }

  private getCostElemVal(): number {
    return (<Avatar>this.entity).skillManager.costElemVal
  }

  private getCostElemType(): ElemTypeEnum {
    return (<Avatar>this.entity).skillManager.costElemType
  }

  private getMaxEnergy(): number {
    return this.get(ElemTypeFightPropMaxEnergyMap[this.getCostElemType()])
  }

  private getCurEnergy(): number {
    return this.get(ElemTypeFightPropCurEnergyMap[this.getCostElemType()])
  }

  async drainEnergy(notify = false, changeEnergyReason?: ChangeEnergyReasonEnum, seqId?: number): Promise<void> {
    const type = ElemTypeFightPropCurEnergyMap[this.getCostElemType()]
    await this.set(type, 0, notify, { changeEnergyReason }, seqId)
  }

  async gainEnergy(
    val: number,
    flat = false,
    notify = false,
    changeEnergyReason?: ChangeEnergyReasonEnum,
    seqId?: number
  ): Promise<void> {
    const type = ElemTypeFightPropCurEnergyMap[this.getCostElemType()]
    const gainAmount = Math.min(
      this.getCostElemVal() - this.get(type),
      Math.max(0, val * (flat ? 1 : this.get(FightPropEnum.FIGHT_PROP_CHARGE_EFFICIENCY)))
    )
    await this.add(type, gainAmount, notify, { changeEnergyReason }, seqId)
  }

  async rechargeEnergy(notify = false, changeEnergyReason?: ChangeEnergyReasonEnum, seqId?: number): Promise<void> {
    const type = ElemTypeFightPropCurEnergyMap[this.getCostElemType()]
    await this.set(type, this.getCostElemVal(), notify, { changeEnergyReason }, seqId)
  }

  async takeDamage(val: number, notify = false, changeHpReason?: ChangeHpReasonEnum, seqId?: number): Promise<boolean> {
    const damage = Math.min(this.get(FightPropEnum.FIGHT_PROP_CUR_HP), Math.max(0, val))
    if (isFinite(damage) && damage > 0)
      this.add(FightPropEnum.FIGHT_PROP_CUR_HP, -damage, notify, { changeHpReason }, seqId)

    return this.get(FightPropEnum.FIGHT_PROP_CUR_HP) <= 0
  }

  async heal(val: number, notify = false, changeHpReason?: ChangeHpReasonEnum, seqId?: number): Promise<void> {
    const healAmount = Math.min(
      this.get(FightPropEnum.FIGHT_PROP_MAX_HP) - this.get(FightPropEnum.FIGHT_PROP_CUR_HP),
      Math.max(0, val)
    )
    if (isFinite(healAmount) && healAmount > 0)
      this.add(FightPropEnum.FIGHT_PROP_CUR_HP, healAmount, notify, { changeHpReason }, seqId)
  }

  async fullHeal(notify = false, changeHpReason?: ChangeHpReasonEnum, seqId?: number): Promise<void> {
    this.set(
      FightPropEnum.FIGHT_PROP_CUR_HP,
      this.get(FightPropEnum.FIGHT_PROP_MAX_HP),
      notify,
      { changeHpReason },
      seqId
    )
  }

  get(type: number) {
    return this.propMap[type] || 0
  }

  async set(
    type: number,
    val: number,
    notify = false,
    changeReason?: FightPropChangeReason,
    seqId?: number
  ): Promise<void> {
    const oldVal = this.get(type)
    this.propMap[type] = val

    if (!notify) return
    await this.sendUpdateNotify({ [type]: val }, seqId)

    const { manager, entityId } = this.entity
    if (!manager || !changeReason) return

    const notifyData: EntityFightPropChangeReasonNotify = {
      entityId,
      propType: type,
      propDelta: val - oldVal,
      paramList: [],
    }

    const { changeHpReason, changeEnergyReason } = changeReason
    if (changeHpReason != null) notifyData.changeHpReason = changeHpReason
    else if (changeEnergyReason != null) notifyData.changeEnergyReason = changeEnergyReason
    else return

    const broadcastContextList = manager.scene.broadcastContextList
    for (const ctx of broadcastContextList) ctx.seqId = seqId
    await EntityFightPropChangeReason.broadcastNotify(broadcastContextList, notifyData)
  }

  async add(
    type: number,
    val: number,
    notify = false,
    changeReason?: FightPropChangeReason,
    seqId?: number
  ): Promise<void> {
    await this.set(type, this.get(type) + val, notify, changeReason, seqId)
  }

  clear(dynamic = false) {
    const { propMap } = this
    for (const type in propMap) {
      if (!dynamic || DYNAMIC_PROPS.includes(parseInt(type))) delete propMap[type]
    }
  }

  async sendUpdateNotify(fightPropMap: { [id: number]: number }, seqId?: number): Promise<void> {
    const { entity } = this
    const { manager, entityId, isOnScene } = entity

    if (manager && isOnScene) {
      const broadcastContextList = manager.scene.broadcastContextList
      for (const ctx of broadcastContextList) ctx.seqId = seqId
      await EntityFightPropUpdate.broadcastNotify(broadcastContextList, {
        entityId,
        fightPropMap,
      })
    } else if (entity.protEntityType === ProtEntityTypeEnum.PROT_ENTITY_AVATAR) {
      await AvatarFightPropUpdate.sendNotify((<Avatar>entity).player.context, {
        avatarGuid: (<Avatar>entity).guid.toString(),
        fightPropMap,
      })
    }
  }

  exportPropList(): FightPropPair[] {
    const { propMap } = this
    const list = []

    for (const type in propMap) {
      list.push({
        propType: type,
        propValue: propMap[type],
      })
    }

    return list
  }

  exportUserData(): PropsUserData {
    return Object.assign({}, this.propMap)
  }
}
