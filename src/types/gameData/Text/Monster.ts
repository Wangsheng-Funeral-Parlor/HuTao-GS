export interface Monster {
  Id: string
  CampID: string
  HPBase: string
  AttackBase: string
  DefenseBase: string
  Critical: string
  CriticalSubHurt: string
  CriticalHurt: string
  FireSubHurt: string
  GrassSubHurt: string
  WaterSubHurt: string
  ElecSubHurt: string
  WindSubHurt: string
  IceSubHurt: string
  RockSubHurt: string
  FireAddHurt: string
  GrassAddHurt: string
  WaterAddHurt: string
  ElecAddHurt: string
  WindAddHurt: string
  IceAddHurt: string
  RockAddHurt: string
  PropGrow1Type: string
  PropGrow1Curve: string
  PropGrow2Type: string
  PropGrow2Curve: string
  PropGrow3Type: string
  PropGrow3Curve: string
  ElementMastery: string
  PhysicalSubHurt: string
  PhysicalAddHurt: string
  Type: string
  ServerScript: string
  CombatConfig: string
  Affix: string
  AI: string
  Equip1: string
  Equip2: string
  IsCanSwim: string
  KillExp: string
  KillExpGrowCurve: string
  Drop1ID: string
  Drop1HpPercent: string
  Drop2ID: string
  Drop2HpPercent: string
  Drop3ID: string
  Drop3HpPercent: string
  KillDropId: string
  IsSceneReward: string
  VisionLevel: string
  ExcludeWeathers: string
  FeatureTagGroupID: string
}

type MonsterList = Monster[]

export default MonsterList
