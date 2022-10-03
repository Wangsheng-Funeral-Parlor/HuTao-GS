import AlwaysPass from './AlwaysPass'
import CheckCurrentEquip from './CheckCurrentEquip'
import CheckEqualDynamicValue from './CheckEqualDynamicValue'
import CollisionDetect from './CollisionDetect'
import HasDynamicValue from './HasDynamicValue'

type ConfigWidgetPredict =
  AlwaysPass |
  CheckCurrentEquip |
  CheckEqualDynamicValue |
  CollisionDetect |
  HasDynamicValue

export default ConfigWidgetPredict