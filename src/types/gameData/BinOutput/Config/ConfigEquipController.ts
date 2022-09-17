import TriggerToStates from './TriggerToStates'
import WeaponAwayFromHandState from './WeaponAwayFromHandState'

export default interface ConfigEquipController {
  AttachPoints: { [key: string]: string }
  SheathPoint: string
  DissolveSheathFadeDelay: number
  DissolveSheathFadeTime: number
  DissolveTakeFadeTime: number
  TriggerToStates: TriggerToStates[]
  WeaponAwayFromHandStates: WeaponAwayFromHandState[]
}