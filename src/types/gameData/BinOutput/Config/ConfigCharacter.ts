import ConfigBillboard from './ConfigBillboard'
import ConfigCombat from './ConfigCombat'
import ConfigEntityAbilityEntry from './ConfigEntityAbilityEntry'
import ConfigFace from './ConfigFace'
import ConfigPartController from './ConfigPartController'
import ConfigStateLayer from './ConfigStateLayer'
import ConfigEquipController from './ConfigEquipController'

export default interface ConfigCharacter {
  Combat: ConfigCombat
  EquipController: ConfigEquipController
  Abilities: ConfigEntityAbilityEntry[]
  StateLayers: { [key: string]: ConfigStateLayer }
  Face: ConfigFace
  PartControl: ConfigPartController
  Billboard: ConfigBillboard
  BindEmotions: string[]
}