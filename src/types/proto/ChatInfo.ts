import { SystemHint } from "."

export interface ChatInfo {
  text?: string
  icon?: number
  systemHint?: SystemHint

  time: number
  uid: number
  sequence?: number
  toUid?: number
  isRead?: boolean
}
