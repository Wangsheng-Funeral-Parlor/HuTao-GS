import ConfigGadgetPredicate from "./ConfigGadgetPredicate"

export default interface ConfigGadgetStateAction {
  GadgetState: string
  Predicate: ConfigGadgetPredicate
}
