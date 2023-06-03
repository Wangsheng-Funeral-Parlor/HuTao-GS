import FetterConfig from "./Common/FetterConfig"

export interface FetterStoryExcelConfig extends FetterConfig {
  StoryTitleTextMapHash: number
  StoryContextTextMapHash: number
  StoryTitle2TextMapHash: number
  StoryContext2TextMapHash: number
  Tips: number[]
  StoryTitleLockedTextMapHash: number
}

type FetterStoryExcelConfigList = FetterStoryExcelConfig[]

export default FetterStoryExcelConfigList
