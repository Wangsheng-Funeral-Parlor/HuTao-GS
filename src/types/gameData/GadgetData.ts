import ConfigGadget from './BinOutput/Config/ConfigGadget'

export interface GadgetData {
  JsonName: string
  Tags: string[]
  Id: number

  HasMove: boolean
  HasAudio: boolean
  IsInteractive: boolean
  IsEquip: boolean
  HasDynamicBarrier: boolean

  Type?: string
  CampID?: number
  VisionLevel?: string
  MpPropID?: number
  LandSoundID?: number
  RadarHintID?: number
  ChainId?: number

  PrefabPathHashSuffix?: number
  PrefabPathHashPre?: number
  ItemPrefabPathHashSuffix?: number
  ItemPrefabPathHashPre?: number
  ClientScriptHashSuffix?: number
  ClientScriptHashPre?: number
  PrefabPathRemoteHashSuffix?: number
  PrefabPathRemoteHashPre?: number
  ControllerPathHashSuffix?: number
  ControllerPathHashPre?: number

  Config: ConfigGadget
}

export interface GadgetPropData {
  Id: number
  Hp: number
  Attack: number
  Defense: number
  HpCurve: string
  AttackCurve: string
  DefenseCurve: string
}

export default interface GadgetDataGroup {
  Gadget: GadgetData[]
  Prop: GadgetPropData[]
}