import ConfigBaseBornType from "."

export default interface ConfigBornByGlobalValue extends ConfigBaseBornType {
  $type: "ConfigBornByGlobalValue"
  PositionKey: string
  DirectionKey: string
}
