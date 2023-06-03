import ConfigNormalStateIDInfo from "../../ConfigStateIDInfo/Child/ConfigNormalStateIDInfo"

import ConfigBaseStateLayer from "."

export default interface ConfigNormalStateLayer extends ConfigBaseStateLayer {
  $type: "ConfigNormalStateLayer"
  StateIDs: { [key: string]: ConfigNormalStateIDInfo }
}
