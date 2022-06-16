import EntityConfig from './Entity'
import ForceConfig from './Force'
import PointConfig from './Point'

export default interface ScenePointConfig {
  Points: {
    [id: string]: PointConfig
  }
  Forces: {
    [id: string]: ForceConfig
  }
  Entities: {
    [id: string]: EntityConfig
  }
}