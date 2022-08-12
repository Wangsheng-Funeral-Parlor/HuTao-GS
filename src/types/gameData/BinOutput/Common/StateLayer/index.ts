import ConfigNormalStateLayer from './ConfigNormalStateLayer'

export interface StateLayer {
  $type: string
}

type StateLayerConfig = ConfigNormalStateLayer

export default StateLayerConfig