import { RegionSimpleInfo } from '.'
import { RetcodeEnum } from './enum'

export interface QueryRegionListHttpRsp {
  retcode?: RetcodeEnum
  regionList?: RegionSimpleInfo[]
  clientSecretKey?: string
  clientCustomConfigEncrypted?: string
  enableLoginPc?: boolean
}