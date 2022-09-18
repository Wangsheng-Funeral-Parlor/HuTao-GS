import ConfigHitScene from '$DT/BinOutput/Config/ConfigHitScene'
import ConfigBaseAbilityAction from '.'

export default interface FireHitEffect extends ConfigBaseAbilityAction {
  $type: 'FireHitEffect'
  HitEntity: string
  HitScene: ConfigHitScene
}