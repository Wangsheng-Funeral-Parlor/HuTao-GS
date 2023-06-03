import ConfigBaseConstForceField from "."

export default interface ConfigAirflowField extends ConfigBaseConstForceField {
  $type: "ConfigAirflowField"
  Scale: number
  StayEffect: string
  EnterEffect: string
  AutoFly: boolean
}
