import ConfigBaseScenePoint from '.'

export default interface SceneBuildingPoint extends ConfigBaseScenePoint {
  $type: 'SceneBuildingPoint'
  BuildingType: string
  FogId: number
}