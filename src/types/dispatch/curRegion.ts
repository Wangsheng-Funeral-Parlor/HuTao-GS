import { RetcodeEnum } from '../enum/Retcode'

export interface ForceUpdateInfo {
  forceUpdateUrl: string
}

export interface QueryCurrRegionHttpRsp {
  forceUdpate?: ForceUpdateInfo
  stopServer?: StopServerInfo

  retcode: RetcodeEnum
  msg?: string
  regionInfo?: RegionInfo
  clientSecretKey?: string
  regionCustomConfigEncrypted?: string
  clientRegionCustomConfigEncrypted?: string
}

export interface RegionInfo {
  gateserverIp?: string
  gateserverPort?: number
  payCallbackUrl?: string
  areaType?: string
  resourceUrl?: string
  dataUrl?: string
  feedbackUrl?: string
  bulletinUrl?: string
  resourceUrlBak?: string
  dataUrlBak?: string
  clientDataVersion?: number
  handbookUrl?: string
  clientSilenceDataVersion?: number
  clientDataMd5?: string
  clientSilenceDataMd5?: string
  resVersionConfig?: ResVersionConfig
  secretKey?: string
  officialCommunityUrl?: string
  clientVersionSuffix?: string
  clientSilenceVersionSuffix?: string
  useGateserverDomainName?: boolean
  gateserverDomainName?: string
  userCenterUrl?: string
  accountBindUrl?: string
  cdkeyUrl?: string
  privacyPolicyUrl?: string
  nextResourceUrl?: string
  nextResVersionConfig?: ResVersionConfig
}

export interface ResVersionConfig {
  version: number
  relogin?: boolean
  md5: string
  releaseTotalSize: string
  versionSuffix: string
  branch: string
  nextScriptVersion?: string
}

export interface StopServerInfo {
  stopBeginTime: number
  stopEndTime: number
  url: string
  contentMsg: string
}