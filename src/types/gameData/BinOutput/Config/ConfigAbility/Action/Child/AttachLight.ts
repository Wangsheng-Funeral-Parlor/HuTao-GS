import ConfigLightAttach from '$DT/BinOutput/Config/ConfigLightAttach'
import ConfigLightComponent from '$DT/BinOutput/Config/ConfigLightComponent'
import ConfigBaseAbilityAction from '.'

export default interface AttachLight extends ConfigBaseAbilityAction {
  $type: 'AttachLight'
  Attach: ConfigLightAttach
  Light: ConfigLightComponent
}