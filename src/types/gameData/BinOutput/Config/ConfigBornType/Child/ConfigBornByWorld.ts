import { DynamicVector } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseBornType from '.'

export default interface ConfigBornByWorld extends ConfigBaseBornType {
  $type: 'ConfigBornByWorld'
  WorldPos: DynamicVector
  WorldFwd: DynamicVector
}