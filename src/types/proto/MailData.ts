import { MailCollectState } from "./enum"
import { MailItem, MailTextContent } from "./mailData/index"

export interface MailData {
  mailId: number
  mailTextContent: MailTextContent
  itemList?: MailItem
  sendTime: number
  expireTime: number
  importance?: number
  isRead: boolean
  isAttachmentGot: boolean
  configId: number
  argumentList?: string[]
  collectState: MailCollectState
}
