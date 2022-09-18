import ConfigBaseAbilityAction from '.'

export default interface IssueCommand extends ConfigBaseAbilityAction {
  $type: 'IssueCommand'
  CommandID: number
  Duration: number
}