import { FoundationStatusEnum, GadgetBornTypeEnum, MovingPlatformTypeEnum } from '../enum/gadget'
import { ItemParam, ItemInterface } from './item'
import { MathQuaternionInterface, VectorInterface } from './motion'
import { Route } from './route'
import { VehicleInfo } from './vehicle'

export interface AbilityGadgetInfo {
  campId: number
  campTargetType: number
  targetEntityId: number
}

export interface BossChestInfo {
  monsterConfigId: number
  resin: number
  remainUidList: number[]
  qualifyUidList: number[]
  uidDiscountMap: { [id: number]: WeeklyBossResinDiscountInfo }
}

export interface BlossomChestInfo {
  resin: number
  qualifyUidList: number[]
  remainUidList: number[]
  deadTime: number
  blossomRefreshType: number
  refreshId: number
}

export interface ClientGadgetInfo {
  campId: number
  campType: number
  guid: string
  ownerEntityId: number
  targetEntityId: number
  asyncLoad: boolean
}

export interface CustomGadgetTreeInfo {
  nodeList: CustomCommonNodeInfo[]
}

export interface EchoShellInfo {
  shellId: number
}

export interface FishPoolInfo {
  poolId: number
  fishAreaList: number[]
  todayFishNum: number
}

export interface FoundationInfo {
  status: FoundationStatusEnum
  uidList: number[]
  currentBuildingId: number
  beginBuildTimeMs: number
  demolitionRefund: number
  buildingList: BuildingInfo[]
  currentNum: number
  maxNum: number
  lockedByUid: number
}

export interface GadgetCrucibleInfo {
  mpPlayId: number
  prepareEndTime: number
}

export interface GadgetGeneralRewardInfo {
  resin: number
  deadTime: number
  remainUidList: number[]
  qualifyUidList: number[]
  itemParam: ItemParam
}

export interface GadgetPlayInfo {
  crucibleInfo: GadgetCrucibleInfo

  playType: number
  duration: number
  progressStageList: number[]
  startCd: number
  startTime: number
  progress: number
}

export interface GatherGadgetInfo {
  itemId: number
  isForbidGuest: boolean
}

export interface MpPlayRewardInfo {
  resin: number
  remainUidList: number[]
  qualifyUidList: number[]
}

export interface OfferingInfo {
  offeringId: number
}

export interface PlatformInfo {
  routeId: number
  startIndex: number
  startRouteTime: number
  startSceneTime: number
  startPos: VectorInterface
  isStarted: boolean
  startRot: MathQuaternionInterface
  stopSceneTime: number
  posOffset: VectorInterface
  rotOffset: MathQuaternionInterface
  movingPlatformType: MovingPlatformTypeEnum
  isActive: boolean
  route: Route
  pointId: number
}

export interface RoguelikeGadgetInfo {
  cellConfigId: number
  cellType: number
  cellState: number
  cellId: number
}

export interface ScreenInfo {
  liveId: number
  projectorEntityId: number
}

export interface StatueGadgetInfo {
  openedStatueUidList: number[]
}

export interface WeatherInfo {
  weatherAreaId: number
}

export interface WorktopInfo {
  optionList: number[]
  isGuestCanOperate: boolean
}

export interface CustomCommonNodeInfo {
  parentIndex: number
  configId: number
  slotIdentifier: string
}

export interface BuildingInfo {
  buildingId: number
  pointConfigId: number
  cost: number
  level: number
  refund: number
  ownerUid: number
}

export interface WeeklyBossResinDiscountInfo {
  discountNum: number
  discountNumLimit: number
  resinCost: number
  originalResinCost: number
}

export interface SceneGadgetInfo {
  trifleItem?: ItemInterface
  gatherGadget?: GatherGadgetInfo
  worktop?: WorktopInfo
  clientGadget?: ClientGadgetInfo
  weather?: WeatherInfo
  abilityGadget?: AbilityGadgetInfo
  statueGadget?: StatueGadgetInfo
  bossChest?: BossChestInfo
  blossomChest?: BlossomChestInfo
  mpPlayReward?: MpPlayRewardInfo
  generalReward?: GadgetGeneralRewardInfo
  offeringInfo?: OfferingInfo
  foundationInfo?: FoundationInfo
  vehicleInfo?: VehicleInfo
  shellInfo?: EchoShellInfo
  screenInfo?: ScreenInfo
  fishPoolInfo?: FishPoolInfo
  customGadgetTreeInfo?: CustomGadgetTreeInfo
  roguelikeGadgetInfo?: RoguelikeGadgetInfo

  gadgetId: number
  groupId?: number
  configId?: number
  ownerEntityId?: number
  bornType?: GadgetBornTypeEnum
  gadgetState?: number
  gadgetType?: number
  isShowCutscene?: boolean
  authorityPeerId?: number
  isEnableInteract?: boolean
  interactId?: number
  markFlag?: number
  propOwnerEntityId?: number
  platform?: PlatformInfo
  interactUidList?: number[]
  draftId?: number
  gadgetTalkState?: number
  playInfo?: GadgetPlayInfo
}