import { FetterStateEnum } from './enum'

export interface FetterInfo {
  fetterId?: number
  fetterState?: FetterStateEnum
  condIndexList?: number[]
}