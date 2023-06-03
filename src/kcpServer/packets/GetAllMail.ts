import GetAllMailResult from "./GetAllMailResult"

import Packet, { PacketInterface, PacketContext } from "#/packet"
import { MailData } from "@/types/proto"
import { RetcodeEnum } from "@/types/proto/enum"
import { getTimeSeconds } from "@/utils/time"

export interface GetAllMailReq {
  isCollected: boolean
}

export interface GetAllMailRsp {
  retcode: RetcodeEnum
  isTruncated: boolean
  mailList: MailData[]
  isCollected: boolean
}

export interface GetAllMailNotify {
  isCollected: boolean
}

class GetAllMailPacket extends Packet implements PacketInterface {
  constructor() {
    super("GetAllMail")
  }

  async request(context: PacketContext, data: GetAllMailReq): Promise<void> {
    // <= 3.3
    const now = getTimeSeconds()

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      isTruncated: false,
      mailList: [
        {
          mailId: 1,
          mailTextContent: {
            title: "Welcome To Hutao-GS",
            content: '<type="browser" text="Github" href="https://github.com/kuma-dayo/HuTao-GS"/>',
            sender: "Server",
          },
          sendTime: now,
          expireTime: now * 2,
          importance: now,
          isRead: false,
          isAttachmentGot: false,
          configId: 0,
          collectState: 1,
        },
      ],
      isCollected: data.isCollected,
    })
  }

  async response(context: PacketContext, data: GetAllMailRsp): Promise<void> {
    await super.response(context, data)
  }

  async recvNotify(context: PacketContext, data: GetAllMailNotify): Promise<void> {
    // >= 3.4
    const now = getTimeSeconds()

    await GetAllMailResult.sendNotify(context, {
      retcode: RetcodeEnum.RET_SUCC,
      totalPageCount: 1,
      mailList: [
        {
          mailId: 1,
          mailTextContent: {
            title: "Welcome To Hutao-GS",
            content: '<type="browser" text="Github" href="https://github.com/kuma-dayo/HuTao-GS"/>',
            sender: "Server",
          },
          sendTime: now,
          expireTime: now * 2,
          importance: now,
          isRead: false,
          isAttachmentGot: false,
          configId: 0,
          collectState: 1,
        },
      ],
      isCollected: data.isCollected,
      pageIndex: 1,
    })
    await this.sendNotify(context, { isCollected: data.isCollected })
  }

  async sendNotify(context: PacketContext, notifyData: GetAllMailNotify): Promise<void> {
    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], ...data: any[]): Promise<void> {
    await super.broadcastNotify(contextList, ...data)
  }
}

let packet: GetAllMailPacket
export default (() => (packet = packet || new GetAllMailPacket()))()
