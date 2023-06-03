import ConfigAIBirdCirclingSetting from "./ConfigAIBirdCirclingSetting"
import ConfigAIBrownianMotionSetting from "./ConfigAIBrownianMotionSetting"
import ConfigAIBuddySetting from "./ConfigAIBuddySetting"
import ConfigAICombatFixedMoveSetting from "./ConfigAICombatFixedMoveSetting"
import ConfigAICombatFollowMoveSetting from "./ConfigAICombatFollowMoveSetting"
import ConfigAICombatSetting from "./ConfigAICombatSetting"
import ConfigAICrabMoveSetting from "./ConfigAICrabMoveSetting"
import ConfigAIDefendArea from "./ConfigAIDefendArea"
import ConfigAIExtractionSetting from "./ConfigAIExtractionSetting"
import ConfigAIFacingMoveSetting from "./ConfigAIFacingMoveSetting"
import ConfigAIFindBackSetting from "./ConfigAIFindBackSetting"
import ConfigAIFleeSetting from "./ConfigAIFleeSetting"
import ConfigAIFlySetting from "./ConfigAIFlySetting"
import ConfigAIFollowScriptedPathSetting from "./ConfigAIFollowScriptedPathSetting"
import ConfigAIFollowServerRouteSetting from "./ConfigAIFollowServerRouteSetting"
import ConfigAIInvestigateSetting from "./ConfigAIInvestigateSetting"
import ConfigAILandingSetting from "./ConfigAILandingSetting"
import ConfigAIMeleeChargeSetting from "./ConfigAIMeleeChargeSetting"
import ConfigAIMixinSetting from "./ConfigAIMixinSetting"
import ConfigAIMove from "./ConfigAIMove"
import ConfigAINetworkSetting from "./ConfigAINetworkSetting"
import ConfigAIOrderSetting from "./ConfigAIOrderSetting"
import ConfigAIPatrolFollowSetting from "./ConfigAIPatrolFollowSetting"
import ConfigAIPoseControl from "./ConfigAIPoseControl"
import ConfigAIPrecombatSetting from "./ConfigAIPrecombatSetting"
import ConfigAIProfilingSetting from "./ConfigAIProfilingSetting"
import ConfigAIReactActionPointSetting from "./ConfigAIReactActionPointSetting"
import ConfigAIReturnToBornPosSetting from "./ConfigAIReturnToBornPosSetting"
import ConfigAIScriptedMoveToSetting from "./ConfigAIScriptedMoveToSetting"
import ConfigAISensing from "./ConfigAISensing"
import ConfigAISkill from "./ConfigAISkill"
import ConfigAISkillGroupCD from "./ConfigAISkillGroupCD"
import ConfigAISkillSetting from "./ConfigAISkillSetting"
import ConfigAISpacialAdjustSetting from "./ConfigAISpacialAdjustSetting"
import ConfigAISpacialChaseSetting from "./ConfigAISpacialChaseSetting"
import ConfigAISpacialProbeSetting from "./ConfigAISpacialProbeSetting"
import ConfigAISurroundSetting from "./ConfigAISurroundSetting"
import ConfigAIThreatSetting from "./ConfigAIThreatSetting"
import ConfigAIUISetting from "./ConfigAIUISetting"
import ConfigAIWanderSetting from "./ConfigAIWanderSetting"

export default interface ConfigAIBeta {
  Enable: boolean
  Friendliness: number
  DecisionArchetype: string
  MoveSetting: ConfigAIMove
  Precombat: ConfigAIPrecombatSetting
  AiCombat: ConfigAICombatSetting
  BuddySetting: ConfigAIBuddySetting
  Sensing: ConfigAISensing
  Neurons: { [key: string]: string[] }
  Threat: ConfigAIThreatSetting
  Order: ConfigAIOrderSetting
  DefendArea: ConfigAIDefendArea
  Fly: ConfigAIFlySetting
  PoseControl: ConfigAIPoseControl
  Ui: ConfigAIUISetting
  Profiling: ConfigAIProfilingSetting
  Network: ConfigAINetworkSetting
  SkillGroupCDConfigs: ConfigAISkillGroupCD[]
  SkillSetting: ConfigAISkillSetting
  Skills: { [key: string]: ConfigAISkill }
  SkillGCD: number
  ReturnToBornTactic: ConfigAIReturnToBornPosSetting
  WanderTactic: ConfigAIWanderSetting
  FollowScriptedPathTactic: ConfigAIFollowScriptedPathSetting
  FollowServerRouteTactic: ConfigAIFollowServerRouteSetting
  InvestigateTactic: ConfigAIInvestigateSetting
  ReactActionPointTactic: ConfigAIReactActionPointSetting
  PatrolFollowTactic: ConfigAIPatrolFollowSetting
  CombatFollowMoveTactic: ConfigAICombatFollowMoveSetting
  MeleeChargeTactic: ConfigAIMeleeChargeSetting
  FacingMoveTactic: ConfigAIFacingMoveSetting
  SurroundTactic: ConfigAISurroundSetting
  FindBackTactic: ConfigAIFindBackSetting
  CombatFixedMoveTactic: ConfigAICombatFixedMoveSetting
  CrabMoveTactic: ConfigAICrabMoveSetting
  FleeTactic: ConfigAIFleeSetting
  SpacialChaseTactic: ConfigAISpacialChaseSetting
  SpacialProbeTactic: ConfigAISpacialProbeSetting
  SpacialAdjustTactic: ConfigAISpacialAdjustSetting
  BirdCirclingTactic: ConfigAIBirdCirclingSetting
  ScriptedMoveToTactic: ConfigAIScriptedMoveToSetting
  LandingTactic: ConfigAILandingSetting
  ExtractionTactic: ConfigAIExtractionSetting
  BrownianMotionTactic: ConfigAIBrownianMotionSetting
  Mixin: ConfigAIMixinSetting
}
