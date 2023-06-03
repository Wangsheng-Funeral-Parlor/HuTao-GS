import { GadgetBornTypeEnum } from "./enum"

import {
  AbilityGadgetInfo,
  BlossomChestInfo,
  BossChestInfo,
  ClientGadgetInfo,
  CustomGadgetTreeInfo,
  EchoShellInfo,
  FishPoolInfo,
  FoundationInfo,
  GadgetGeneralRewardInfo,
  GadgetPlayInfo,
  GatherGadgetInfo,
  ItemInfo,
  MpPlayRewardInfo,
  OfferingInfo,
  PlatformInfo,
  RoguelikeGadgetInfo,
  ScreenInfo,
  StatueGadgetInfo,
  VehicleInfo,
  WeatherInfo,
  WorktopInfo,
} from "."

export interface SceneGadgetInfo {
  trifleItem?: ItemInfo
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
