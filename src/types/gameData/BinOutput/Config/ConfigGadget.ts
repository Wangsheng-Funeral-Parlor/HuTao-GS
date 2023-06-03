import ConfigAIBeta from "./ConfigAIBeta"
import ConfigBillboard from "./ConfigBillboard"
import ConfigCombat from "./ConfigCombat"
import ConfigEntity from "./ConfigEntity"
import ConfigEntityAbilityEntry from "./ConfigEntityAbilityEntry"
import ConfigEquipment from "./ConfigEquipment"
import ConfigFace from "./ConfigFace"
import ConfigGadgetAction from "./ConfigGadgetAction"
import ConfigGadgetAudio from "./ConfigGadgetAudio"
import ConfigGadgetMisc from "./ConfigGadgetMisc"
import ConfigGadgetPattern from "./ConfigGadgetPattern"
import ConfigGadgetUI from "./ConfigGadgetUI"
import ConfigIntee from "./ConfigIntee"
import ConfigMove from "./ConfigMove"
import ConfigNavigation from "./ConfigNavigation"
import ConfigPaimon from "./ConfigPaimon"
import ConfigPartController from "./ConfigPartController"
import ConfigStateLayer from "./ConfigStateLayer"
import ConfigTimer from "./ConfigTimer"
import ConfigTrigger from "./ConfigTrigger"
import ConfigWall from "./ConfigWall"
import ConfigWeather from "./ConfigWeather"

export default interface ConfigGadget extends ConfigEntity {
  HasEquip: boolean
  HasAudio: boolean
  HasModel: boolean
  HasAbility: boolean
  HasFollowWindZoneRotation: boolean
  ForceDontUseUpdateRigidbody: boolean
  HasConnectTrigger: boolean
  CanBeCreatedOnPlatform: boolean
  ConnectTriggerPriority: number
  IgnoreChildSceneProp: boolean
  MoveRefreshGroundForceUp: boolean
  Combat: ConfigCombat
  Abilities: ConfigEntityAbilityEntry[]
  Field: ConfigTrigger
  Timer: ConfigTimer
  Move: ConfigMove
  Gadget: ConfigGadgetPattern
  Equipment: ConfigEquipment
  Navigation: ConfigNavigation
  UiInteract: ConfigGadgetUI
  Misc: ConfigGadgetMisc
  StateLayers: { [key: string]: ConfigStateLayer }
  Audio: ConfigGadgetAudio
  Aibeta: ConfigAIBeta
  Weather: ConfigWeather
  Wall: ConfigWall
  Face: ConfigFace
  PartControl: ConfigPartController
  Paimon: ConfigPaimon
  RadarHint: boolean
  KeepModifierOutSight: boolean
  GadgetAction: ConfigGadgetAction
  Billboard: ConfigBillboard
  Intee: ConfigIntee
  BindEmotions: string[]
  Projector: boolean
  LowPriorityIntee: boolean
  CanRemoveByClient: boolean
  Tags: string[]
  CanBeTriggeredByAvatarRay: boolean
}
