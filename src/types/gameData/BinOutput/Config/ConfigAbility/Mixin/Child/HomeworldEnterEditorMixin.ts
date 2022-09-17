import ConfigBaseAbilityMixin from '.'

export default interface HomeworldEnterEditorMixin extends ConfigBaseAbilityMixin {
  $type: 'HomeworldEnterEditorMixin'
  EditorModifierNames: string[]
  WorldModifierNames: string[]
}