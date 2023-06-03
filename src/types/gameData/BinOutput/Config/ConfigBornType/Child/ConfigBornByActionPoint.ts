import ConfigBaseBornType from "."

export default interface ConfigBornByActionPoint extends ConfigBaseBornType {
  $type: "ConfigBornByActionPoint"
  ActionPointType: string
  SelectType: string
}
