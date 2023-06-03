import { join } from "path"
import { cwd } from "process"

import Packet, { PacketContext, PacketInterface } from "#/packet"
import config from "@/config"
import {
  AdjustTrackingInfo,
  BlockInfo,
  FeatureBlockInfo,
  QueryCurrRegionHttpRsp,
  ResVersionConfig,
  ShortAbilityHashPair,
  TrackingIOInfo,
} from "@/types/proto"
import { ENetReasonEnum, RetcodeEnum } from "@/types/proto/enum"
import { fileExists, readFile } from "@/utils/fileSystem"
import { dataToProtobuffer } from "@/utils/proto"

export interface PlayerLoginReq {
  token: string
  clientVersion: string
  systemVersion: string
  deviceName: string
  deviceUuid: string
  targetUid?: number
  loginRand?: number
  isEditor?: boolean
  languageType: number
  accountType: number
  accountUid?: string
  platform?: string
  deviceInfo: string
  platformType: number
  isGuest?: boolean
  cloudClientIp?: number
  gmUid?: number
  checksum: string
  onlineId?: string
  clientToken?: number
  securityCmdReply: string
  extraBinData?: string
  cps: string
  channelId?: number
  subChannelId?: number
  checksumClientVersion: string
  tag?: number
  trackingIoInfo?: TrackingIOInfo
  countryCode?: string
  clientDataVersion: number
  environmentErrorCode?: string
  targetHomeOwnerUid?: number
  psnId?: string
  clientVerisonHash: string
  isTransfer?: boolean
  regPlatform?: number
  targetHomeParam?: number
  adjustTrackingInfo?: AdjustTrackingInfo
  birthday?: string
}

export interface PlayerLoginRsp {
  retcode: RetcodeEnum
  playerData?: string
  isNewPlayer?: boolean
  targetUid?: number
  loginRand?: number
  isUseAbilityHash: boolean
  abilityHashCode: number
  abilityHashMap?: { string: number }
  clientDataVersion: number
  isRelogin?: boolean
  clientSilenceDataVersion: number
  gameBiz: string
  playerDataVersion?: number
  clientMd5: string
  clientSilenceMd5: string
  resVersionConfig: ResVersionConfig
  blockInfoMap?: { number: BlockInfo }
  clientVersionSuffix: string
  clientSilenceVersionSuffix: string
  shortAbilityHashMap?: ShortAbilityHashPair[]
  scInfo?: string
  isAudit?: boolean
  isScOpen: boolean
  registerCps?: string
  featureBlockInfoList?: FeatureBlockInfo[]
  isDataNeedRelogin?: boolean
  countryCode: string
  nextResVersionConfig?: ResVersionConfig
  nextResourceUrl?: string
  targetHomeOwnerUid?: number
  isEnableClientHashDebug?: boolean
  isTransfer?: boolean
  totalTickTime?: number
  birthday?: string
}

class PlayerLoginPacket extends Packet implements PacketInterface {
  constructor() {
    super("PlayerLogin")
  }

  async request(context: PacketContext, _data: PlayerLoginReq): Promise<void> {
    const { server, game, client } = context

    if (!(await game.playerLogin(context))) server.disconnect(client.conv, ENetReasonEnum.ENET_LOGIN_UNFINISHED)
  }

  async response(context: PacketContext): Promise<void> {
    let curRegionData: QueryCurrRegionHttpRsp = { retcode: 0, regionInfo: {} }

    if (config.dispatch.autoPatch) {
      const binPath = join(cwd(), `data/bin/${config.game.version}/QueryCurrRegionHttpRsp.bin`)
      if (!(await fileExists(binPath))) return

      curRegionData = await dataToProtobuffer(await readFile(binPath), "QueryCurrRegionHttpRsp", true)
    }

    const {
      clientDataVersion,
      clientSilenceDataVersion,
      clientDataMd5,
      clientSilenceDataMd5,
      resVersionConfig,
      clientVersionSuffix,
      clientSilenceVersionSuffix,
    } = curRegionData.regionInfo

    const data: PlayerLoginRsp = {
      retcode: RetcodeEnum.RET_SUCC,
      isUseAbilityHash: true,
      abilityHashCode: 557879627,
      clientDataVersion,
      clientSilenceDataVersion,
      gameBiz: "hk4e_global",
      clientMd5: clientDataMd5,
      clientSilenceMd5: clientSilenceDataMd5,
      resVersionConfig,
      clientVersionSuffix,
      clientSilenceVersionSuffix,
      isScOpen: false,
      registerCps: "mihoyo",
      countryCode: "HK",
    }

    await super.response(context, data)
  }
}

let packet: PlayerLoginPacket
export default (() => (packet = packet || new PlayerLoginPacket()))()
