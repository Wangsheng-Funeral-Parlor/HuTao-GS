import { RetcodeEnum } from "./enum"

import { RegionSimpleInfo } from "."

export interface QueryRegionListHttpRsp {
  retcode?: RetcodeEnum
  regionList?: RegionSimpleInfo[]
  clientSecretKey?: string
  clientCustomConfigEncrypted?: string
  enableLoginPc?: boolean
}
