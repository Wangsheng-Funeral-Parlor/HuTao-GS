import Vector from './Vector'

export default interface CameraShakeConfig {
  ShakeType?: string
  ShakeRange: number
  ShakeTime: number
  ShakeDistance: number
  ShakeDir?: Vector
  Extension?: {}
}