import { RetcodeEnum } from "./enum"

import { ForceUpdateInfo, RegionInfo, StopServerInfo } from "."

export interface QueryCurrRegionHttpRsp {
  forceUdpate?: ForceUpdateInfo
  stopServer?: StopServerInfo

  retcode?: RetcodeEnum
  msg?: string
  regionInfo?: RegionInfo
  clientSecretKey?: string
  regionCustomConfigEncrypted?: string
  clientRegionCustomConfigEncrypted?: string
}
