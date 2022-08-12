import ActCameraShake from './ActCameraShake'
import AddGlobalValue from './AddGlobalValue'
import ApplyModifier from './ApplyModifier'
import AttachEffect from './AttachEffect'
import AttachModifier from './AttachModifier'
import CreateGadget from './CreateGadget'
import DamageByAttackValue from './DamageByAttackValue'
import DoWatcherSystemAction from './DoWatcherSystemAction'
import DungeonFogEffects from './DungeonFogEffects'
import EnableBulletCollisionPluginTrigger from './EnableBulletCollisionPluginTrigger'
import EnableHitBoxByName from './EnableHitBoxByName'
import FireEffect from './FireEffect'
import FixedMonsterRushMove from './FixedMonsterRushMove'
import HealHP from './HealHP'
import KillGadget from './KillGadget'
import KillSelf from './KillSelf'
import LoseHP from './LoseHP'
import Predicated from './Predicated'
import RemoveModifier from './RemoveModifier'
import ReTriggerAISkillInitialCD from './ReTriggerAISkillInitialCD'
import SendEffectTrigger from './SendEffectTrigger'
import SetAnimatorBool from './SetAnimatorBool'
import SetAnimatorTrigger from './SetAnimatorTrigger'
import SetGlobalValue from './SetGlobalValue'
import SetGlobalValueByTargetDistance from './SetGlobalValueByTargetDistance'
import SetGlobalValueToOverrideMap from './SetGlobalValueToOverrideMap'
import SetPoseBool from './SetPoseBool'
import SetPoseInt from './SetPoseInt'
import SetRandomOverrideMapValue from './SetRandomOverrideMapValue'
import StartDither from './StartDither'
import TriggerAttackEvent from './TriggerAttackEvent'
import TriggerBullet from './TriggerBullet'
import TurnDirection from './TurnDirection'

export interface Action {
  $type: string
}

type ActionConfig =
  ActCameraShake |
  AddGlobalValue |
  ApplyModifier |
  AttachEffect |
  AttachModifier |
  CreateGadget |
  DamageByAttackValue |
  DoWatcherSystemAction |
  DungeonFogEffects |
  EnableBulletCollisionPluginTrigger |
  EnableHitBoxByName |
  FireEffect |
  FixedMonsterRushMove |
  HealHP |
  KillGadget |
  KillSelf |
  LoseHP |
  Predicated |
  RemoveModifier |
  ReTriggerAISkillInitialCD |
  SendEffectTrigger |
  SetAnimatorBool |
  SetAnimatorTrigger |
  SetGlobalValue |
  SetGlobalValueByTargetDistance |
  SetGlobalValueToOverrideMap |
  SetPoseBool |
  SetPoseInt |
  SetRandomOverrideMapValue |
  StartDither |
  TriggerAttackEvent |
  TriggerBullet |
  TurnDirection

export default ActionConfig