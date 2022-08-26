import AbilityEmbryoConfig from '../Common/AbilityEmbryo'

export default interface AbilityGroupConfig {
  AbilityGroupSourceType: string
  AbilityGroupTargetType: string
  TargetAbilities: AbilityEmbryoConfig[]
}