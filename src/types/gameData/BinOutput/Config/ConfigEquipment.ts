import ConfigBladeElementFx from './ConfigBladeElementFx'
import ConfigBowData from './ConfigBowData'

export default interface ConfigEquipment {
  AttachTo: string
  SubGadgetId: number
  SubAttachTo: string
  AuxToTrans: string
  EquipEntityType: string
  BladeFx: ConfigBladeElementFx
  BowData: ConfigBowData
}