import ConfigBaseConstForceField from "."

export default interface ConfigSpeedupField extends ConfigBaseConstForceField {
  $type: "ConfigSpeedupField"
  Attenuation: number
  SingleDir: boolean
}
