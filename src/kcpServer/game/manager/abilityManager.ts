import BaseClass from '#/baseClass'
import { PacketContext } from '#/packet'
import AbilityInvocations from '#/packets/AbilityInvocations'
import ClientAbilityChange from '#/packets/ClientAbilityChange'
import ClientAbilityInitFinish from '#/packets/ClientAbilityInitFinish'
import { dataToProtobuffer } from '#/utils/dataUtils'
import Ability from '$/ability'
import Entity from '$/entity'
import Logger from '@/logger'
import { AbilityAppliedAbility, AbilityAppliedModifier, AbilityEmbryo, AbilityInvokeEntry } from '@/types/proto'
import { AbilityInvokeArgumentEnum } from '@/types/proto/enum'

const protoLookupTable = {
  ABILITY_NONE: null,
  ABILITY_META_MODIFIER_CHANGE: 'AbilityMetaModifierChange',
  ABILITY_META_COMMAND_MODIFIER_CHANGE_REQUEST: null,
  ABILITY_META_SPECIAL_FLOAT_ARGUMENT: 'AbilityMetaSpecialFloatArgument',
  ABILITY_META_OVERRIDE_PARAM: null,
  ABILITY_META_CLEAR_OVERRIDE_PARAM: null,
  ABILITY_META_REINIT_OVERRIDEMAP: 'AbilityMetaReInitOverrideMap',
  ABILITY_META_GLOBAL_FLOAT_VALUE: 'AbilityScalarValueEntry',
  ABILITY_META_CLEAR_GLOBAL_FLOAT_VALUE: null,
  ABILITY_META_ABILITY_ELEMENT_STRENGTH: null,
  ABILITY_META_ADD_OR_GET_ABILITY_AND_TRIGGER: 'AbilityMetaAddOrGetAbilityAndTrigger',
  ABILITY_META_SET_KILLED_SETATE: 'AbilityMetaSetKilledState',
  ABILITY_META_SET_ABILITY_TRIGGER: 'AbilityMetaSetAbilityTrigger',
  ABILITY_META_ADD_NEW_ABILITY: null,
  ABILITY_META_REMOVE_ABILITY: null,
  ABILITY_META_SET_MODIFIER_APPLY_ENTITY: null,
  ABILITY_META_MODIFIER_DURABILITY_CHANGE: 'AbilityMetaModifierDurabilityChange',
  ABILITY_META_ELEMENT_REACTION_VISUAL: 'AbilityMetaElementReactionVisual',
  ABILITY_META_SET_POSE_PARAMETER: 'AbilityMetaSetPoseParameter',
  ABILITY_META_UPDATE_BASE_REACTION_DAMAGE: 'AbilityMetaUpdateBaseReactionDamage',
  ABILITY_META_TRIGGER_ELEMENT_REACTION: 'AbilityMetaTriggerElementReaction',
  ABILITY_META_LOSE_HP: 'AbilityMetaLoseHp',
  ABILITY_ACTION_TRIGGER_ABILITY: 'AbilityActionTriggerAbility',
  ABILITY_ACTION_SET_CRASH_DAMAGE: 'AbilityActionSetCrashDamage',
  ABILITY_ACTION_EFFECT: null,
  ABILITY_ACTION_SUMMON: 'AbilityActionSummon',
  ABILITY_ACTION_BLINK: 'AbilityActionBlink',
  ABILITY_ACTION_CREATE_GADGET: 'AbilityActionCreateGadget',
  ABILITY_ACTION_APPLY_LEVEL_MODIFIER: null,
  ABILITY_ACTION_GENERATE_ELEM_BALL: 'AbilityActionGenerateElemBall',
  ABILITY_ACTION_SET_RANDOM_OVERRIDE_MAP_VALUE: 'AbilityActionSetRandomOverrideMapValue',
  ABILITY_ACTION_SERVER_MONSTER_LOG: 'AbilityActionServerMonsterLog',
  ABILITY_ACTION_CREATE_TILE: 'AbilityActionCreateTile',
  ABILITY_ACTION_DESTROY_TILE: 'AbilityActionDestroyTile',
  ABILITY_ACTION_FIRE_AFTER_IMAGE: 'AbilityActionFireAfterImgae',
  ABILITY_MIXIN_AVATAR_STEER_BY_CAMERA: 'AbilityMixinAvatarSteerByCamera',
  ABILITY_MIXIN_MONSTER_DEFEND: null,
  ABILITY_MIXIN_WIND_ZONE: 'AbilityMixinWindZone',
  ABILITY_MIXIN_COST_STAMINA: 'AbilityMixinCostStamina',
  ABILITY_MIXIN_ELITE_SHIELD: 'AbilityMixinEliteShield',
  ABILITY_MIXIN_ELEMENT_SHIELD: 'AbilityMixinElementShield',
  ABILITY_MIXIN_GLOBAL_SHIELD: 'AbilityMixinGlobalShield',
  ABILITY_MIXIN_SHIELD_BAR: 'AbilityMixinShieldBar',
  ABILITY_MIXIN_WIND_SEED_SPAWNER: 'AbilityMixinWindSeedSpawner',
  ABILITY_MIXIN_DO_ACTION_BY_ELEMENT_REACTION: 'AbilityMixinDoActionByElementReaction',
  ABILITY_MIXIN_FIELD_ENTITY_COUNT_CHANGE: 'AbilityMixinFieldEntityCountChange',
  ABILITY_MIXIN_SCENE_PROP_SYNC: 'AbilityMixinScenePropSync',
  ABILITY_MIXIN_WIDGET_MP_SUPPORT: 'AbilityMixinWidgetMpSupport'
}

const logger = new Logger('ABILIT', 0xa0a0ff)

export default class AbilityManager extends BaseClass {
  entity: Entity

  usedId: number[]
  abilityList: Ability[]

  constructor(entity: Entity) {
    super()

    this.entity = entity

    this.usedId = []
    this.abilityList = []

    super.initHandlers(this)
  }

  private getNewId(): number {
    const { usedId } = this

    let id = 0
    while (usedId.includes(++id));

    usedId.push(id)
    return id
  }

  private freeId(id: number) {
    const { usedId } = this
    if (usedId.includes(id)) usedId.splice(usedId.indexOf(id), 1)
  }

  register(ability: Ability) {
    const { abilityList } = this
    const { manager, name, overrideName } = ability

    if (manager) manager.unregister(ability)

    const id = this.getNewId()

    ability.manager = this
    ability.id = id

    abilityList.push(ability)

    logger.verbose('Register:', id, '->', `${name}[${overrideName}]`)
  }

  unregister(ability: Ability) {
    const { abilityList } = this
    const { manager, id, name, overrideName } = ability

    if (manager !== this) return

    ability.manager = null
    ability.id = null
    ability.instancedId = null

    abilityList.splice(abilityList.indexOf(ability), 1)

    this.freeId(id)

    logger.verbose('Unregister:', id, '->', `${name}[${overrideName}]`)
  }

  registerList(abilityList: Ability[]) {
    for (const ability of abilityList) this.register(ability)
  }

  unregisterAll() {
    const { abilityList } = this
    for (const ability of abilityList) this.unregister(ability)
  }

  exportAppliedAbilityList(): AbilityAppliedAbility[] {
    return []
  }

  exportAppliedModifierList(): AbilityAppliedModifier[] {
    return []
  }

  exportEmbryoList(): AbilityEmbryo[] {
    return this.abilityList.map(ability => ability.exportEmbryo())
  }

  /**Events**/

  // AbilityInvoke
  async handleAbilityInvoke(context: PacketContext, entry: AbilityInvokeEntry) {
    const { player, seqId } = context
    const { argumentType, abilityData } = entry
    const proto = protoLookupTable[AbilityInvokeArgumentEnum[argumentType]]

    player?.forwardBuffer?.addEntry(AbilityInvocations, entry, seqId)

    if (proto == null) {
      logger.warn('No proto for argument type:', argumentType, AbilityInvokeArgumentEnum[argumentType], abilityData)
      return
    }

    logger.verbose(proto)

    await this.emit(proto, await dataToProtobuffer(Buffer.from(abilityData, 'base64'), proto), seqId)
  }

  // ClientAbilityChange
  async handleClientAbilityChange(context: PacketContext, entry: AbilityInvokeEntry) {
    const { player, seqId } = context
    player?.forwardBuffer?.addEntry(ClientAbilityChange, entry, seqId)
  }

  // ClientAbilityInitFinish
  async handleClientAbilityInitFinish(context: PacketContext, entry: AbilityInvokeEntry) {
    const { player, seqId } = context
    player?.forwardBuffer?.addEntry(ClientAbilityInitFinish, entry, seqId)
  }
}