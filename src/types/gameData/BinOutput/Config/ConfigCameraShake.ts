import { DynamicVector } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigCameraShakeExt from './ConfigCameraShakeExt'

export default interface ConfigCameraShake {
  ShakeType: string
  ShakeRange: number
  ShakeTime: number
  ShakeDistance: number
  ShakeDir: DynamicVector
  Extension: ConfigCameraShakeExt
}