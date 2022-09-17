import ConfigBaseStateLayer from '.'
import ConfigNormalStateIDInfo from '../../ConfigStateIDInfo/Child/ConfigNormalStateIDInfo'

export default interface ConfigNormalStateLayer extends ConfigBaseStateLayer {
  $type: 'ConfigNormalStateLayer'
  StateIDs: { [key: string]: ConfigNormalStateIDInfo }
}