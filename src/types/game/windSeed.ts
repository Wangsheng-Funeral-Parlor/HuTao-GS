import { VectorInterface } from './motion'

export interface RefreshNotify {
  refreshNum: number
}

export interface AddWindBulletNotify {
  seedEntityId: number
  seedPos: VectorInterface
  catchPlayerUid: number
}

export interface AreaNotify {
  areaId: number
  areaCode: string
  areaType: number
}