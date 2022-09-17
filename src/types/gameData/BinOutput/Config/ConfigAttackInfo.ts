import ConfigAttackProperty from './ConfigAttackProperty'
import ConfigBulletWane from './ConfigBulletWane'
import ConfigCameraShake from './ConfigCameraShake'
import ConfigHitPattern from './ConfigHitPattern'

export default interface ConfigAttackInfo {
  AttackTag: string
  AttenuationTag: string
  AttenuationGroup: string
  AttackProperty: ConfigAttackProperty
  HitPattern: ConfigHitPattern
  CanHitHead: boolean
  HitHeadPattern: ConfigHitPattern
  ForceCameraShake: boolean
  CameraShake: ConfigCameraShake
  BulletWane: ConfigBulletWane
  CanBeModifiedBy: string
}