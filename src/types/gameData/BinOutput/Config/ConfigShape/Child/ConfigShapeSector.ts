import ConfigBaseShape from "."

export default interface ConfigShapeSector extends ConfigBaseShape {
  $type: "ConfigShapeSector"
  Radius: number
  FullDegree: number
}
