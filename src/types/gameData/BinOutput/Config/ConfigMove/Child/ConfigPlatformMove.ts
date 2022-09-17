import ConfigBaseMove from '.'
import ConfigRoute from '../../ConfigRoute'

export default interface ConfigPlatformMove extends ConfigBaseMove {
  $type: 'ConfigPlatformMove'
  AvatarTriggerEventDistance: number
  IsMovingWater: boolean
  Route: ConfigRoute
  DelayType: string
}