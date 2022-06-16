export interface AvatarTalentExcelConfig {
  TalentId: number
  NameTextMapHash: number
  DescTextMapHash: number
  Icon: string
  MainCostItemId: number
  MainCostItemCount: number
  OpenConfig: string
  AddProps: {
    PropType?: string
    Value?: number
  }[]
  ParamList: number[]

  PrevTalent?: number
}

type AvatarTalentExcelConfigList = AvatarTalentExcelConfig[]

export default AvatarTalentExcelConfigList