import ConfigCameraShakeExt from "./ConfigCameraShakeExt"

import { DynamicVector } from "$DT/BinOutput/Common/DynamicNumber"

export default interface ConfigCameraShake {
  ShakeType: string
  ShakeRange: number
  ShakeTime: number
  ShakeDistance: number
  ShakeDir: DynamicVector
  Extension: ConfigCameraShakeExt
}
