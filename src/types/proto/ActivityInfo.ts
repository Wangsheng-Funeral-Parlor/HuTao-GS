import { ActivityWatcherInfo, MusicGameActivityDetailInfo } from '.'

export interface ActivityInfo {
  activityId: number
  scheduleId: number
  beginTime: number
  endTime: number
  activityType: number
  isPlayOpenAnim?: boolean
  isFinished?: boolean
  isStarting?: boolean
  watcherInfoList: ActivityWatcherInfo[]
  meetCondList: number[]
  expireCondList: number[]
  selectedAvatarRewardId?: number
  activityCoinMap?: { [id: number]: number }
  scoreLimit?: number
  curScore?: number
  takenRewardList: number[]
  isHidden?: boolean
  firstDayStartTime: number
  MIFCLBCMKJI?: boolean
  BPGCBIEDEDM?: boolean
  AGKPABKOHDA?: { [k: number]: number }

  /* NOSONAR
  samLampInfo?: SeaLampActivityDetailInfo
  crucibleInfo?: CrucibleActivityDetailInfo
  salesmanInfo?: SalesmanActivityDetailInfo
  trialAvatarInfo?: TrialAvatarActivityDetailInfo
  deliveryInfo?: DeliveryActivityDetailInfo
  asterInfo?: AsterActivityDetailInfo
  flightInfo?: FlightActivityDetailInfo
  dragonSpineInfo?: DragonSpineActivityDetailInfo
  effigyInfo?: EffigyActivityDetailInfo
  treasureMapInfo?: TreasureMapActivityDetailInfo
  blessingInfo?: BlessingActivityDetailInfo
  seaLampInfo?: SeaLampActivityInfo
  expeditionInfo?: ExpeditionActivityDetailInfo
  arenaChallengeInfo?: ArenaChallengeActivityDetailInfo
  fleurFairInfo?: FleurFairActivityDetailInfo
  waterSpiritInfo?: WaterSpiritActivityDetailInfo
  challnelerSlabInfo?: ChannelerSlabActivityDetailInfo
  mistTrialActivityInfo?: MistTrialActivityDetailInfo
  hideAndSeekInfo?: HideAndSeekActivityDetailInfo
  findHilichurlInfo?: FindHilichurlDetailInfo
  summerTimeInfo?: SummerTimeDetailInfo
  buoyantCombatInfo?: BuoyantCombatDetailInfo
  echoShellInfo?: EchoShellDetailInfo
  bounceConjuringInfo?: BounceConjuringActivityDetailInfo
  blitzRushInfo?: BlitzRushActivityDetailInfo
  chessInfo?: ChessActivityDetailInfo
  sumoInfo?: SumoActivityDetailInfo
  moonfinTrialInfo?: MoonfinTrialActivityDetailInfo
  lunaRiteInfo?: LunaRiteDetailInfo
  plantFlowerInfo?: PlantFlowerActivityDetailInfo
  */
  musicGameInfo?: MusicGameActivityDetailInfo
  /* NOSONAR
  roguelikeDungoenInfo?: RoguelikeDungeonActivityDetailInfo
  digInfo?: DigActivityDetailInfo
  hachiInfo?: DOCNGBMKEID
  winterCampInfo?: DLHPBNNDGFI
  potionInfo?: IFACCKLEJCC
  tanukiTravelActivityInfo?: PFMCPMIMGLM
  lanternRiteActivityInfo?: JEIAODKGIBD
  michiaeMatsuriInfo?: EPDOGGKOCAP
  bartenderInfo?: NHMFHLIGAKL
  ugcInfo?: EAGKNMCLJDI
  crystalLinkInfo?: ADPBMLFDHJD
  irodoriInfo?: JACDNLEIDOO
  photoInfo?: EHDKFDJEEGP
  spiceInfo?: BEPFLAKHNHL
  gachaInfo?: MMNEJBFMAEA
  luminanceStoneChallengeInfo?: JLMHDDHOGGD
  rogueDiaryInfo?: RogueDiaryDetailInfo
  */
}