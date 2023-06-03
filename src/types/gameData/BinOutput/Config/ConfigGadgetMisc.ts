import ConfigAutoDool from "./ConfigAutoDool"
import ConfigChest from "./ConfigChest"
import ConfigCrystal from "./ConfigCrystal"
import ConfigGear from "./ConfigGear"
import ConfigPickup from "./ConfigPickup"
import ConfigConstForceField from "./ConfigScenePoint/Child/ConfigForceField/Child/ConfigConstForceField"
import ConfigSeal from "./ConfigSeal"
import ConfigWindSeed from "./ConfigWindSeed"

export default interface ConfigGadgetMisc {
  Chest: ConfigChest
  Gear: ConfigGear
  ForceField: ConfigConstForceField
  Crystal: ConfigCrystal
  Seal: ConfigSeal
  Pickup: ConfigPickup
  WindSeed: ConfigWindSeed
  AutoDoor: ConfigAutoDool
  EscapeEffect: string
  GuidePoint: boolean
  IsUIPoint: boolean
  GuidePointType: string
  TargetIndicatorYOffset: number
}
