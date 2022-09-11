import BaseClass from '#/baseClass'
import { PacketContext } from '#/packet'
import Entity from '$/entity'
import Avatar from '$/entity/avatar'
import AbilityManager from '$/manager/abilityManager'
import { FightPropEnum } from '@/types/enum'
import ActionConfig from '@/types/gameData/BinOutput/ConfigAbility/Action'
import HealHP from '@/types/gameData/BinOutput/ConfigAbility/Action/HealHP'
import LoseHP from '@/types/gameData/BinOutput/ConfigAbility/Action/LoseHP'
import { ChangeHpReasonEnum } from '@/types/proto/enum'
import { getStringHash } from '@/utils/hash'
import AppliedAbility from './appliedAbility'

const MathOp = ['MUL', 'ADD']

export default class AbilityAction extends BaseClass {
  manager: AbilityManager

  constructor(manager: AbilityManager) {
    super()

    this.manager = manager

    super.initHandlers(this)
  }

  private getMathOp(input: string[]): { i: number, name: string } {
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

  private doMath(state: { ability: AppliedAbility, busy: boolean, val: number }, input: string[]) {
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

  private calc(ability: AppliedAbility, input: string[]): number {
    const state = { ability, busy: true, val: 0 }
    while (state.busy) this.doMath(state, input)
    return state.val
  }

  private eval(ability: AppliedAbility, val: number | string | string[]): number {
    if (val == null) return 0
    if (Array.isArray(val)) return this.calc(ability, Array.from(val))

    val = val.toString()
    if (!isNaN(parseFloat(val))) return parseFloat(val)

    return Number(ability?.overrideMapContainer?.getValue({ hash: getStringHash(val), str: val })?.val || 0)
  }

  private getTargetList(config: HealHP | LoseHP, target?: Entity): Entity[] {
    const { manager } = this
    const { entity } = manager
    const { manager: entityManager, player } = <Avatar>entity
    const { scene } = entityManager
    const { playerList } = scene
    const { Target } = config

    const targetList: Entity[] = []
    switch (Target) {
      case 'CurLocalAvatar': {
        const currentAvatar = player?.currentAvatar
        if (currentAvatar == null) break
        targetList.push(currentAvatar)
        break
      }
      case 'CurTeamAvatars': {
        const team = player?.teamManager?.getTeam()
        if (team == null) break
        targetList.push(...team.getAliveAvatarList())
        break
      }
      case 'AllPlayerAvatars': {
        for (const p of playerList) {
          const team = p?.teamManager?.getTeam()
          if (team == null) continue
          targetList.push(...team.getAliveAvatarList())
        }
        break
      }
      case 'Applier': {
        break
      }
      case 'Caster': {
        targetList.push(entity)
        break
      }
      default:
        targetList.push(target || entity)
    }

    console.log('GetTargetList', Target, entity?.entityId, target?.entityId, targetList.map(t => t.entityId))

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
    amount += casterFightProps.get(FightPropEnum.FIGHT_PROP_ATTACK) * this.eval(ability, AmountByCasterAttackRatio)
    amount += casterFightProps.get(FightPropEnum.FIGHT_PROP_MAX_HP) * this.eval(ability, AmountByCasterMaxHPRatio)
    amount += targetFightProps.get(FightPropEnum.FIGHT_PROP_CUR_HP) * this.eval(ability, AmountByTargetCurrentHPRatio)
    amount += targetFightProps.get(FightPropEnum.FIGHT_PROP_MAX_HP) * this.eval(ability, AmountByTargetMaxHPRatio)

    return amount
  }

  async runActionConfig(context: PacketContext, ability: AppliedAbility, config: ActionConfig, target?: Entity) {
    if (ability == null || config == null) return
    await this.emit(config?.$type, context, ability, config, target)
  }

  /**Actions Event**/

  // HealHP
  async handleHealHP(context: PacketContext, ability: AppliedAbility, config: HealHP, target?: Entity) {
    const { manager } = this
    const { entity } = manager

    const targetList = this.getTargetList(config, target)

    for (const targetEntity of targetList) {
      const { fightProps } = targetEntity
      const amount = this.calcAmount(ability, entity, targetEntity, config)

      await fightProps.heal(amount, true, ChangeHpReasonEnum.CHANGE_HP_ADD_ABILITY, context.seqId)
    }
  }

  // LoseHP
  async handleLoseHP(context: PacketContext, ability: AppliedAbility, config: LoseHP, target?: Entity) {
    const { manager } = this
    const { entity } = manager
    const { Lethal } = config

    const targetList = this.getTargetList(config, target)

    for (const targetEntity of targetList) {
      const { fightProps } = targetEntity
      const amount = this.calcAmount(ability, entity, targetEntity, config)

      if (fightProps.get(FightPropEnum.FIGHT_PROP_CUR_HP) - amount <= 0 && !Lethal) continue

      await fightProps.takeDamage(null, amount, true, ChangeHpReasonEnum.CHANGE_HP_SUB_ABILITY, context.seqId)
    }
  }
}