import ConfigAvatarHitBucketSetting from '$DT/BinOutput/Config/ConfigAvatarHitBucketSetting'
import ConfigBaseAbilityAction from '.'

export default interface SetAvatarHitBuckets extends ConfigBaseAbilityAction {
  $type: 'SetAvatarHitBuckets'
  OverrideAvatarHitBucketSetting: ConfigAvatarHitBucketSetting
}