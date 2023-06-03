import ConfigGadgetStateAction from "./ConfigGadgetStateAction"

export default interface ConfigGadgetAction {
  TriggerEnterActionList: ConfigGadgetStateAction[]
  GadgetStateActionList: ConfigGadgetStateAction[]
  PlatformActionList: ConfigGadgetStateAction[]
  InteractActionList: ConfigGadgetStateAction[]
}
