import Vector from '../../Common/Vector'
import ConfigAirflowField from './ConfigAirflowField'
import ConfigRiseField from './ConfigRiseField'

export interface Force {
  $type: string
  GadgetId: number
  Pos: Vector
  Rot?: Vector
  Alias: string
}

type ForceConfig =
  ConfigAirflowField |
  ConfigRiseField

export default ForceConfig