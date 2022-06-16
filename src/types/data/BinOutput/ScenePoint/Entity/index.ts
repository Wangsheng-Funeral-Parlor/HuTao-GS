import Vector from '../../Common/Vector'
import ConfigLocalTrigger from './ConfigLocalTrigger'

export interface Entity {
  $type: string
  GadgetId: number
  Pos: Vector
  Rot?: Vector
  Alias: string
}

type EntityConfig = ConfigLocalTrigger

export default EntityConfig