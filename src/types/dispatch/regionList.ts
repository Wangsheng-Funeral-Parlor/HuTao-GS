import { RetcodeEnum } from '../enum/retcode'

export interface QueryRegionListHttpRsp {
  retcode: RetcodeEnum
  regionList: RegionSimpleInfo[]
  clientSecretKey: string
  clientCustomConfigEncrypted: string
  enableLoginPc: boolean
}

export interface RegionSimpleInfo {
  name: string
  title: string
  type: string
  dispatchUrl: string
}