import ConfigBulletPattern from "./Child/ConfigBulletPattern"
import ConfigGadgetCollidedPattern from "./Child/ConfigGadgetCollidedPattern"

type ConfigGadgetPattern = ConfigBulletPattern | ConfigGadgetCollidedPattern

export default ConfigGadgetPattern
