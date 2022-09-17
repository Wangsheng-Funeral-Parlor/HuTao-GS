import ConfigAIMixinActions from './ConfigAIMixinActions'

export default interface ConfigAIMixinSetControllerParameter {
  EntityTypes: string[]
  OnSuccess: ConfigAIMixinActions
  OnFail: ConfigAIMixinActions
}