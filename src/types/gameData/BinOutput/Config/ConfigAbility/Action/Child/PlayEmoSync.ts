import ConfigBaseAbilityAction from '.'

export default interface PlayEmoSync extends ConfigBaseAbilityAction {
  $type: 'PlayEmoSync'
  DialogID: number
  EmoSyncAssetPath: string
}