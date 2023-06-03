export interface DungeonChallengeConfig {
  Id: number
  TargetTextTemplateTextMapHash: number
  SubTargetTextTemplateTextMapHash: number
  ProgressTextTemplateTextMapHash: number
  SubProgressTextTemplateTextMapHash: number
  IconPath: string
  ChallengeType: string

  NoSuccessHint?: boolean
  InterruptButtonType?: string
  NoFailHint?: boolean
  IsBlockTopTimer?: boolean
  SubChallengeFadeOutRule?: string
  SubChallengeFadeOutDelayTime?: number
  SubChallengeBannerRule?: string
  RecordType?: string
  ActivitySkillID?: number
  IsSuccessWhenNotSettled?: boolean
}

type DungeonChallengeConfigList = DungeonChallengeConfig[]

export default DungeonChallengeConfigList
