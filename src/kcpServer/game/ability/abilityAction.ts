import BaseClass from '#/baseClass'
import { PacketContext } from '#/packet'
import Entity from '$/entity'
import Avatar from '$/entity/avatar'
import Gadget from '$/entity/gadget'
import ClientGadget from '$/entity/gadget/clientGadget'
import AbilityManager from '$/manager/abilityManager'
import Vector from '$/utils/vector'
import Logger from '@/logger'
import { AbilityTargettingEnum, EntityTypeEnum, FightPropEnum, GadgetStateEnum, TargetTypeEnum } from '@/types/enum'
import { DynamicNumber } from '@/types/gameData/BinOutput/Common/Dynamic'
import ActionConfig from '@/types/gameData/BinOutput/ConfigAbility/Action'
import AvatarSkillStart from '@/types/gameData/BinOutput/ConfigAbility/Action/AvatarSkillStart'
import ExecuteGadgetLua from '@/types/gameData/BinOutput/ConfigAbility/Action/ExecuteGadgetLua'
import HealHP from '@/types/gameData/BinOutput/ConfigAbility/Action/HealHP'
import LoseHP from '@/types/gameData/BinOutput/ConfigAbility/Action/LoseHP'
import SelectTargetsConfig from '@/types/gameData/BinOutput/ConfigAbility/SelectTarget'
import SelectTargetsByShape from '@/types/gameData/BinOutput/ConfigAbility/SelectTarget/SelectTargetsByShape'
import { ChangeHpReasonEnum, PlayerDieTypeEnum, ProtEntityTypeEnum } from '@/types/proto/enum'
import { getStringHash } from '@/utils/hash'
import { ActionParam } from '../../../types/gameData/BinOutput/Common/ActionParam'
import AppliedAbility from './appliedAbility'

const MathOp = ['MUL', 'ADD']
const creatureTypes = [EntityTypeEnum.Avatar, EntityTypeEnum.Monster]

const logger = new Logger('ABIACT', 0xcbf542)

export default class AbilityAction extends BaseClass {
  manager: AbilityManager

  constructor(manager: AbilityManager) {
    super()

    this.manager = manager

    super.initHandlers(this)
  }

  private getMathOp(input: (string | number)[]): { i: number, name: string } {
    const opList = input
      .map((str, i) => {
        const name = str?.toString()?.toUpperCase()
        return { i, name, isOp: MathOp.includes(name) }
      })
      .filter((e, i, list) => e.isOp && list.slice(i - 2, i).find(a => a.isOp) == null)

    for (const opName of MathOp) {
      const op = opList.find(o => o.name === opName)
      if (op) return op
    }

    return null
  }

  private doMath(state: { ability: AppliedAbility, busy: boolean, val: number }, input: (string | number)[]) {
    const op = this.getMathOp(input)
    if (op == null) {
      state.busy = false
      return
    }

    const args: number[] = input.splice(op.i - 2, 3).slice(0, -1).map(this.eval.bind(this, state.ability))
    if (args.find(a => typeof a !== 'number')) return

    switch (op.name) {
      case 'MUL':
        state.val = args[0] * args[1]
        break
      case 'ADD':
        state.val = args[0] + args[1]
        break
    }
  }

  private calc(ability: AppliedAbility, input: (string | number)[]): number {
    const state = { ability, busy: true, val: 0 }
    while (state.busy) this.doMath(state, input)
    return state.val
  }

  private eval(ability: AppliedAbility, val: ActionParam | DynamicNumber): number {
    if (val == null) return 0
    if (Array.isArray(val)) return this.calc(ability, Array.from(val))

    val = val.toString()
    if (!isNaN(parseFloat(val))) return parseFloat(val)

    return Number(ability?.overrideMapContainer?.getValue({ hash: getStringHash(val), str: val })?.val || 0)
  }

  private getCaster(): Entity {
    const { manager } = this
    const { entity } = manager
    const { manager: entityManager } = entity

    if (entityManager == null) return entity

    if ((<ClientGadget>entity).ownerEntityId != null) return entityManager.getEntity((<ClientGadget>entity).ownerEntityId)
    return entity
  }

  private getTargetType(target: Entity): TargetTypeEnum {
    const { manager } = this
    const { entity } = manager
    const { manager: entityManager } = <Avatar>entity

    const ownerEntityId = (<ClientGadget>entity).ownerEntityId
    const owner = ownerEntityId ? entityManager.getEntity(ownerEntityId) : entity

    const ownerIsCreature = creatureTypes.includes(owner.entityType)
    const targetIsCreature = creatureTypes.includes(target.entityType)
    const bothAreCreatures = ownerIsCreature && targetIsCreature

    switch (true) {
      case (entity === target):
        return TargetTypeEnum.Self
      case ((<ClientGadget>target).ownerEntityId === owner.entityId):
        return TargetTypeEnum.SelfCamp
      case (bothAreCreatures && owner.entityType === target.entityType):
        return TargetTypeEnum.Alliance
      case (bothAreCreatures && owner.entityType !== target.entityType):
        return TargetTypeEnum.Enemy
      default:
        return TargetTypeEnum.None
    }
  }

  private isTargetType(target: Entity, type: TargetTypeEnum): boolean {
    const targetType = this.getTargetType(target)

    switch (type) {
      case TargetTypeEnum.None:
      case TargetTypeEnum.All:
        return true
      case TargetTypeEnum.Alliance:
        return targetType === TargetTypeEnum.Alliance
      case TargetTypeEnum.Enemy:
        return targetType === TargetTypeEnum.Enemy
      case TargetTypeEnum.Self:
        return targetType === TargetTypeEnum.Self
      case TargetTypeEnum.SelfCamp:
        return targetType === TargetTypeEnum.SelfCamp
      case TargetTypeEnum.AllExceptSelf:
        return targetType !== TargetTypeEnum.Self
      default:
        return false
    }
  }

  private getShapeCenter(_base: string) {
    return this.manager.entity.motion.pos
  }

  private isInsideShape(target: Entity, shapeName: string, center: Vector, ratio: number): boolean {
    const { pos } = target.motion

    if (shapeName.indexOf('Circle') === 0) {
      const radius = parseFloat(shapeName.slice(shapeName.indexOf('R') + 1)) * ratio
      return center.distanceTo2D(pos) <= radius
    }

    return true
  }

  private selectTargetsByShape(targetList: Entity[], ability: AppliedAbility, config: SelectTargetsByShape) {
    const { manager } = this
    const { entity } = manager
    const { manager: entityManager } = <Avatar>entity
    const { ShapeName, CenterBasedOn, CampTargetType, SizeRatio } = config

    const nearbyEntities = entityManager.getNearbyEntityList(entity)
    for (const nearbyEntity of nearbyEntities) {
      if (
        !this.isTargetType(nearbyEntity, TargetTypeEnum[CampTargetType] || TargetTypeEnum.None) ||
        !this.isInsideShape(nearbyEntity, ShapeName, this.getShapeCenter(CenterBasedOn), this.eval(ability, SizeRatio) || 1)
      ) continue

      targetList.push(nearbyEntity)
    }
  }

  private getOtherTargets(ability: AppliedAbility, config: SelectTargetsConfig) {
    const { $type } = config

    const targetList: Entity[] = []
    switch ($type) {
      case 'SelectTargetsByChildren':
      case 'SelectTargetsByEquipParts':
      case 'SelectTargetsByLCTrigger':
      case 'SelectTargetsByLCTriggerAll':
      case 'SelectTargetsBySelfGroup': {
        break
      }
      case 'SelectTargetsByShape': {
        this.selectTargetsByShape(targetList, ability, <SelectTargetsByShape>config)
        break
      }
      case 'SelectTargetsByTag': {
        break
      }
    }

    return targetList
  }

  private getTargetList(ability: AppliedAbility, config: HealHP | LoseHP, target?: Entity): Entity[] {
    const { manager } = this
    const { entity } = manager
    const { manager: entityManager, player } = <Avatar>entity
    const { scene } = entityManager
    const { playerList } = scene
    const { Target, OtherTargets } = config

    const targetList: Entity[] = []
    switch (AbilityTargettingEnum[Target] || AbilityTargettingEnum.Self) {
      case AbilityTargettingEnum.Self: {
        targetList.push(entity)
        break
      }
      case AbilityTargettingEnum.Caster: {
        targetList.push(this.getCaster())
        break
      }
      case AbilityTargettingEnum.Target: {
        targetList.push(target)
        break
      }
      case AbilityTargettingEnum.CurTeamAvatars: {
        const team = player?.teamManager?.getTeam()
        if (team == null) break
        targetList.push(...team.getAvatarList())
        break
      }
      case AbilityTargettingEnum.CurLocalAvatar: {
        const currentAvatar = player?.currentAvatar
        if (currentAvatar == null) break
        targetList.push(currentAvatar)
        break
      }
      case AbilityTargettingEnum.AllPlayerAvatars: {
        for (const p of playerList) {
          const team = p?.teamManager?.getTeam()
          if (team == null) continue
          targetList.push(...team.getAliveAvatarList())
        }
        break
      }
    }

    if (OtherTargets) targetList.push(...this.getOtherTargets(ability, OtherTargets))

    logger.debug('GetTargetList:', Target, entity?.entityId, target?.entityId, targetList.map(t => t.entityId))

    return targetList
  }

  private calcAmount(ability: AppliedAbility, caster: Entity, target: Entity, config: HealHP | LoseHP): number {
    const { fightProps: casterFightProps } = caster
    const { fightProps: targetFightProps } = target
    const {
      Amount,
      AmountByCasterAttackRatio,
      AmountByCasterMaxHPRatio,
      AmountByTargetCurrentHPRatio,
      AmountByTargetMaxHPRatio
    } = config

    let amount = this.eval(ability, Amount)
    amount += casterFightProps.get(FightPropEnum.FIGHT_PROP_MAX_HP) * this.eval(ability, AmountByCasterMaxHPRatio)
    amount += casterFightProps.get(FightPropEnum.FIGHT_PROP_CUR_ATTACK) * this.eval(ability, AmountByCasterAttackRatio)
    amount += targetFightProps.get(FightPropEnum.FIGHT_PROP_MAX_HP) * this.eval(ability, AmountByTargetMaxHPRatio)
    amount += targetFightProps.get(FightPropEnum.FIGHT_PROP_CUR_HP) * this.eval(ability, AmountByTargetCurrentHPRatio)

    return amount
  }

  async runActionConfig(context: PacketContext, ability: AppliedAbility, config: ActionConfig, target?: Entity) {
    if (ability == null || config == null) return

    logger.debug('RunAction:', config?.$type, config, target ? target.entityId : 'self')
    await this.emit(config?.$type, context, ability, config, target)
  }

  /**Actions Events**/

  // AvatarSkillStart
  async handleAvatarSkillStart(_context: PacketContext, ability: AppliedAbility, config: AvatarSkillStart) {
    const { manager } = this
    const { entity } = manager
    const { staminaManager, skillManager } = (<Avatar>entity)
    const { currentDepot } = skillManager
    const { SkillID, CostStaminaRatio } = config

    const skill = currentDepot?.getSkill(SkillID)
    if (staminaManager == null || skill == null) return

    await staminaManager.immediate(-(this.eval(ability, CostStaminaRatio || 1) * skill.costStamina * 100))
  }

  // ExecuteGadgetLua
  async handleExecuteGadgetLua(_context: PacketContext, _ability: AppliedAbility, config: ExecuteGadgetLua) {
    const { manager } = this
    const { entity } = manager

    if (entity.protEntityType !== ProtEntityTypeEnum.PROT_ENTITY_GADGET) return

    await (<Gadget>entity).setGadgetState(config.Param1 || GadgetStateEnum.Default)
  }

  // HealHP
  async handleHealHP(context: PacketContext, ability: AppliedAbility, config: HealHP, target?: Entity) {
    const targetList = this.getTargetList(ability, config, target)

    for (const targetEntity of targetList) {
      const { fightProps } = targetEntity
      const amount = this.calcAmount(ability, this.getCaster(), targetEntity, config)

      await fightProps.heal(amount, true, ChangeHpReasonEnum.CHANGE_HP_ADD_ABILITY, context.seqId)
    }
  }

  // KillSelf
  async handleKillSelf() {
    const { manager } = this
    const { entity } = manager

    await entity.kill(0, PlayerDieTypeEnum.PLAYER_DIE_NONE)
  }

  // LoseHP
  async handleLoseHP(context: PacketContext, ability: AppliedAbility, config: LoseHP, target?: Entity) {
    const { Lethal } = config

    const targetList = this.getTargetList(ability, config, target)

    for (const targetEntity of targetList) {
      const { fightProps } = targetEntity
      const amount = this.calcAmount(ability, this.getCaster(), targetEntity, config)

      if (fightProps.get(FightPropEnum.FIGHT_PROP_CUR_HP) - amount <= 0 && !Lethal) continue

      await fightProps.takeDamage(null, amount, true, ChangeHpReasonEnum.CHANGE_HP_SUB_ABILITY, context.seqId)
    }
  }
}