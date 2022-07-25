import { ForceUpdateInfo, RegionInfo, StopServerInfo } from '.'
import { RetcodeEnum } from './enum'

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