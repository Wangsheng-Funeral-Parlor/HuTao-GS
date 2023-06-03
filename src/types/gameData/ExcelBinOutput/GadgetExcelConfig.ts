export interface GadgetExcelConfig {
  JsonName: string
  Tags: any[]
  ItemJsonName: string
  InteeIconName: string
  InteractNameTextMapHash: number
  Id: number
  NameTextMapHash: number
  LODPatternName: string
  Type?: string
  PrefabPathHashSuffix?: number
  PrefabPathHashPre?: number
  CampID?: number
  HasMove?: boolean
  HasAudio?: boolean
  IsInteractive?: boolean
  VisionLevel?: string
  MpPropID?: number
  IsEquip?: boolean
  ItemPrefabPathHashSuffix?: number
  ItemPrefabPathHashPre?: number
  LandSoundID?: number
  ClientScriptHashSuffix?: number
  ClientScriptHashPre?: number
  RadarHintID?: number
  HasDynamicBarrier?: boolean
  ChainId?: number
  PrefabPathRemoteHashSuffix?: number
  PrefabPathRemoteHashPre?: number
  ControllerPathHashSuffix?: number
  ControllerPathHashPre?: number
}

type GadgetExcelConfigList = GadgetExcelConfig[]

export default GadgetExcelConfigList
