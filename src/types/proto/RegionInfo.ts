import { ResVersionConfig } from "."

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
