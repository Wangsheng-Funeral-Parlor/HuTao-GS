import ConfigBaseGadgetPredicate from "."

export default interface ConfigPredicateByInteract extends ConfigBaseGadgetPredicate {
  $type: "ConfigPredicateByInteract"
  IsEnableInteract: boolean
}
