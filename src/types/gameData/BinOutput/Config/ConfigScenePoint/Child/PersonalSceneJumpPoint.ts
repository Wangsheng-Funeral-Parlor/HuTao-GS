import { DynamicVector } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseScenePoint from '.'

export default interface PersonalSceneJumpPoint extends ConfigBaseScenePoint {
  $type: 'PersonalSceneJumpPoint'
  TranSceneId: number
  TitleTextID: string
  TriggerSize: DynamicVector
  IsHomeworldDoor: boolean
}