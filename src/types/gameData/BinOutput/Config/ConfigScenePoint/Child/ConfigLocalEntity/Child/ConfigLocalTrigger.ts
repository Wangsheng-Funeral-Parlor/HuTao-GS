import { DynamicVector } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigShape from '$DT/BinOutput/Config/ConfigShape'
import ConfigBaseLocalEntity from '.'

export default interface ConfigLocalTrigger extends ConfigBaseLocalEntity {
  $type: 'ConfigLocalTrigger'
  TriggerFlag: string
  Shape: ConfigShape
  CheckCount: number
  TriggerInterval: number
  VectorParam: DynamicVector
  FloatParam: number
  StringParam: string
}