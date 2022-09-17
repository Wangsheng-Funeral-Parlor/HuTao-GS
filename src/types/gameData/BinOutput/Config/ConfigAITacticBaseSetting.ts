import ConfigAITacticCondition from './ConfigAITacticCondition'

export default interface ConfigAITacticBaseSetting {
  Enable: boolean
  Condition: ConfigAITacticCondition
  NerveTrigger: string[]
}