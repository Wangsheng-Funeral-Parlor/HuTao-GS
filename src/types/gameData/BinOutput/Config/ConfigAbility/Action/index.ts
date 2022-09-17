import ActCameraShake from './Child/ActCameraShake'
import AddGlobalValue from './Child/AddGlobalValue'
import ApplyModifier from './Child/ApplyModifier'
import AttachEffect from './Child/AttachEffect'
import AttachModifier from './Child/AttachModifier'
import AvatarSkillStart from './Child/AvatarSkillStart'
import CreateGadget from './Child/CreateGadget'
import DamageByAttackValue from './Child/DamageByAttackValue'
import DoWatcherSystemAction from './Child/DoWatcherSystemAction'
import DungeonFogEffects from './Child/DungeonFogEffects'
import EnableBulletCollisionPluginTrigger from './Child/EnableBulletCollisionPluginTrigger'
import EnableHitBoxByName from './Child/EnableHitBoxByName'
import ExecuteGadgetLua from './Child/ExecuteGadgetLua'
import FireEffect from './Child/FireEffect'
import FixedMonsterRushMove from './Child/FixedMonsterRushMove'
import HealHP from './Child/HealHP'
import KillGadget from './Child/KillGadget'
import KillSelf from './Child/KillSelf'
import LoseHP from './Child/LoseHP'
import Predicated from './Child/Predicated'
import RemoveModifier from './Child/RemoveModifier'
import ReTriggerAISkillInitialCD from './Child/ReTriggerAISkillInitialCD'
import SendEffectTrigger from './Child/SendEffectTrigger'
import SetAnimatorBool from './Child/SetAnimatorBool'
import SetAnimatorTrigger from './Child/SetAnimatorTrigger'
import SetGlobalValue from './Child/SetGlobalValue'
import SetGlobalValueByTargetDistance from './Child/SetGlobalValueByTargetDistance'
import SetGlobalValueToOverrideMap from './Child/SetGlobalValueToOverrideMap'
import SetPoseBool from './Child/SetPoseBool'
import SetPoseInt from './Child/SetPoseInt'
import SetRandomOverrideMapValue from './Child/SetRandomOverrideMapValue'
import StartDither from './Child/StartDither'
import TriggerAttackEvent from './Child/TriggerAttackEvent'
import TriggerBullet from './Child/TriggerBullet'
import TurnDirection from './Child/TurnDirection'

type ConfigAbilityAction =
  ActCameraShake |
  AddGlobalValue |
  ApplyModifier |
  AttachEffect |
  AttachModifier |
  AvatarSkillStart |
  CreateGadget |
  DamageByAttackValue |
  DoWatcherSystemAction |
  DungeonFogEffects |
  EnableBulletCollisionPluginTrigger |
  EnableHitBoxByName |
  ExecuteGadgetLua |
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

export default ConfigAbilityAction