import { CoopPointStateEnum } from './enum'

export interface CoopPoint {
  id?: number
  state?: CoopPointStateEnum
  selfConfidence?: number
}