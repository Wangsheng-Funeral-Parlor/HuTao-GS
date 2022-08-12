import ConfigAvatarStateIDInfo from './ConfigAvatarStateIDInfo'
import ConfigNormalStateIDInfo from './ConfigNormalStateIDInfo'

export interface State {
  $type: string
  AnimatorStates: { [stateName: string]: string[] }
}

type StateConfig = ConfigAvatarStateIDInfo | ConfigNormalStateIDInfo

export default StateConfig