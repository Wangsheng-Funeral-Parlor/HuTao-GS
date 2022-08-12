import { StateLayer } from '.'
import StateConfig from './State'

export default interface ConfigNormalStateLayer extends StateLayer {
  LayerIndexName: string
  StateIDs: {
    [stateID: string]: StateConfig
  }
}