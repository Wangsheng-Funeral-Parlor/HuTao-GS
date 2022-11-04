import Entity from '$/entity'
import Avatar from '$/entity/avatar'
import ClientGadget from '$/entity/gadget/clientGadget'
import AbilityManager from '$/manager/abilityManager'
import Vector from '$/utils/vector'
import { DynamicFloat, DynamicInt } from '$DT/BinOutput/Common/DynamicNumber'
import { HealHP, LoseHP, ReviveAvatar, ReviveDeadAvatar } from '$DT/BinOutput/Config/ConfigAbility/Action/Child'
import ConfigAbilityPredicate from '$DT/BinOutput/Config/ConfigAbility/Predicate'
import SelectTargets from '$DT/BinOutput/Config/SelectTargets'
import SelectTargetsByShape from '$DT/BinOutput/Config/SelectTargets/Child/SelectTargetsByShape'
import { AbilityTargettingEnum, EntityTypeEnum, FightPropEnum, TargetTypeEnum } from '@/types/enum'
import { getStringHash } from '@/utils/hash'
import AppliedAbility from './appliedAbility'

const MathOp = ['MUL', 'ADD']
const creatureTypes = [EntityTypeEnum.Avatar, EntityTypeEnum.Monster]

export default class AbilityUtils {
  manager: AbilityManager

  constructor(manager: AbilityManager) {
    this.manager = manager
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

    const index = op.i - 2
    const args: number[] = input.splice(index, 3).slice(0, -1).map(this.eval.bind(this, state.ability))
    if (args.find(a => typeof a !== 'number')) return

    switch (op.name) {
      case 'MUL':
        state.val = args[0] * args[1]
        break
      case 'ADD':
        state.val = args[0] + args[1]
        break
    }

    input.splice(index, 0, state.val)
  }

  private calc(ability: AppliedAbility, input: (string | number)[]): number {
    const state = { ability, busy: true, val: 0 }
    while (state.busy) this.doMath(state, input)
    return state.val
  }

  eval(ability: AppliedAbility, val: DynamicFloat | DynamicInt, defVal: number = 0): number {
    if (val == null) return defVal
    if (Array.isArray(val)) return this.calc(ability, Array.from(val))

    val = val.toString()
    if (!isNaN(parseFloat(val))) return parseFloat(val)

    // fight prop
    if (val.indexOf('FIGHT_PROP_') === 0) return ability.manager.entity.getProp(FightPropEnum[val])

    // override map
    return Number(ability?.overrideMapContainer?.getValue({ hash: getStringHash(val), str: val })?.val || 0)
  }

  calcAmount(ability: AppliedAbility, caster: Entity, target: Entity, config: HealHP | LoseHP | ReviveAvatar | ReviveDeadAvatar): number {
    const {
      Amount,
      AmountByCasterAttackRatio,
      AmountByCasterMaxHPRatio,
      AmountByTargetCurrentHPRatio,
      AmountByTargetMaxHPRatio
    } = config

    let amount = this.eval(ability, Amount)
    amount += caster.getProp(FightPropEnum.FIGHT_PROP_MAX_HP) * this.eval(ability, AmountByCasterMaxHPRatio)
    amount += caster.getProp(FightPropEnum.FIGHT_PROP_CUR_ATTACK) * this.eval(ability, AmountByCasterAttackRatio)
    amount += target.getProp(FightPropEnum.FIGHT_PROP_MAX_HP) * this.eval(ability, AmountByTargetMaxHPRatio)
    amount += target.getProp(FightPropEnum.FIGHT_PROP_CUR_HP) * this.eval(ability, AmountByTargetCurrentHPRatio)

    return amount
  }

  getCaster(): Entity {
    const { manager } = this
    const { entity } = manager
    const { manager: entityManager } = entity

    if (entityManager == null) return entity

    if ((<ClientGadget>entity).ownerEntityId != null) return entityManager.getEntity((<ClientGadget>entity).ownerEntityId)
    return entity
  }

  getTargetType(target: Entity): TargetTypeEnum {
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

  isTargetType(target: Entity, type: TargetTypeEnum): boolean {
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

  getShapeCenter(_base: string) {
    return this.manager.entity.motion.pos
  }

  isInsideShape(target: Entity, shapeName: string, center: Vector, ratio: number): boolean {
    const { pos } = target.motion

    if (shapeName.indexOf('Circle') === 0) {
      const radius = parseFloat(shapeName.slice(shapeName.indexOf('R') + 1)) * ratio
      return center.distanceTo2D(pos) <= radius
    }

    return true
  }

  selectTargetsByShape(targetList: Entity[], ability: AppliedAbility, config: SelectTargetsByShape) {
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

  getOtherTargets(ability: AppliedAbility, config: SelectTargets) {
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
        this.selectTargetsByShape(targetList, ability, config)
        break
      }
      case 'SelectTargetsByTag': {
        break
      }
    }

    return targetList
  }

  getTargetList(ability: AppliedAbility, config: HealHP | LoseHP | ReviveAvatar | ConfigAbilityPredicate, target: Entity): Entity[] {
    const { manager } = this
    const { entity } = manager
    const { manager: entityManager, player } = <Avatar>entity
    const { scene } = entityManager
    const { playerList } = scene

    const { Target, OtherTargets } = <{ Target: string, OtherTargets?: SelectTargets }>config

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
    return targetList.filter((t, i, arr) => arr.indexOf(t) === i)
  }
}