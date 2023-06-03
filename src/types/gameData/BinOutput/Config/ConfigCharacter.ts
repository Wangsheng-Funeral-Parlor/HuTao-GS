import ConfigBillboard from "./ConfigBillboard"
import ConfigCombat from "./ConfigCombat"
import ConfigEntity from "./ConfigEntity"
import ConfigEntityAbilityEntry from "./ConfigEntityAbilityEntry"
import ConfigEquipController from "./ConfigEquipController"
import ConfigFace from "./ConfigFace"
import ConfigPartController from "./ConfigPartController"
import ConfigStateLayer from "./ConfigStateLayer"

export default interface ConfigCharacter extends ConfigEntity {
  Combat: ConfigCombat
  EquipController: ConfigEquipController
  Abilities: ConfigEntityAbilityEntry[]
  StateLayers: { [key: string]: ConfigStateLayer }
  Face: ConfigFace
  PartControl: ConfigPartController
  Billboard: ConfigBillboard
  BindEmotions: string[]
}
