import ConfigBeHitBlendShake from "./ConfigBeHitBlendShake"

export default interface ConfigCombatBeHit {
  HitBloodEffect: string
  HitAutoRedirect: boolean
  MuteAllHit: boolean
  MuteAllHitEffect: boolean
  MuteAllHitText: boolean
  IgnoreMinHitVY: boolean
  BlendShake: ConfigBeHitBlendShake
}
