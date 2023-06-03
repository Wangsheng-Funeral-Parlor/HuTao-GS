import ConfigBaseScenePoint from "."

import { DynamicVector } from "$DT/BinOutput/Common/DynamicNumber"

export default interface SceneVehicleSummonPoint extends ConfigBaseScenePoint {
  $type: "SceneVehicleSummonPoint"
  GLOFNHHDOME?: boolean
  VehicleType: string
  VehicleGadgetId: number
  BornPointList: DynamicVector[]
  BornRotateList: DynamicVector[]
  VehicleRadius?: number
  TitleTextID: string
  FEKLHAICFKE?: string
}
