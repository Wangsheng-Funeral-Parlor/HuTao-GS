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

export interface ActivityScheduleInfo {
  activityId: number
  isOpen?: boolean
  scheduleId: number
  beginTime: number
  endTime: number
}

export interface ActivityWatcherInfo {
  watcherId: number
  curProgress?: number
  totalProgress: number
  isTakenReward?: boolean
}

export interface H5ActivityInfo {
  h5ScheduleId: number
  h5ActivityId: number
  beginTime: number
  endTime: number
  contentCloseTime: number
  prefabPath: string
  url: string
  isEntranceOpen?: boolean
}

// Music game
export interface MusicGameActivityDetailInfo {
  musicGameRecordMap?: { [id: number]: MusicGameRecord }
  musicGameMyCustomMapRecordList?: MusicGameCustomMapRecord[]
  musicGameCustomMapRecordList?: MusicGameCustomMapRecord[]
}

export interface MusicGameCustomMapRecord {
  guid: string
  DGHHDJNCEHJ?: number
  author: string
  noteCount?: number
  maxScore?: number
  score?: number
  NNCNPCGGOHI?: number
  updatedAt: number
  DOANBAODBMA?: number
  published?: boolean
  version?: number
  FMIDOHCJJBN?: boolean
  OAPKHNELBPH?: boolean
  NJHAMJMHPAA?: boolean
  ADIBIKKNPKK?: number
  MIGHLPINMFE?: number
  GIDFMAJFIFE?: number[]
  OKBJPAKOLIH?: number[]
  FAOPBAMDFJB?: number
  FELMANEFAOE?: number
}

export interface MusicGameRecord {
  maxScore?: number
  maxCombo?: number
  isUnlock?: boolean
}