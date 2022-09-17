import { DynamicVector } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityMixin from '.'

export default interface EnviroFollowRotateMixin extends ConfigBaseAbilityMixin {
  $type: 'EnviroFollowRotateMixin'
  SelfRotateOffSet: DynamicVector
  DeactiveOnCutsecneName: string
}