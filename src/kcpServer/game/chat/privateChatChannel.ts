import PrivateChat, { PrivateChatReq } from '#/packets/PrivateChat'
import { ChatManager } from '$/manager/chatManager'
import Player from '$/player'
import { ChatInfo } from '@/types/proto'
import { getTimeSeconds } from '@/utils/time'
import ChatChannel from './chatChannel'
import CommandHandler from './commandHandler'

export default class PrivateChatChannel extends ChatChannel {
  privateChatId: string
  commandHandler: CommandHandler

  constructor(chatManager: ChatManager, sender: Player, target: Player) {
    super(chatManager)

    this.privateChatId = PrivateChatChannel.getId(sender, target.uid)
    this.uidList = [sender.uid, target.uid]

    if (sender.uid === 1 || target.uid === 1) {
      this.commandHandler = new CommandHandler(this)
    }

    super.initHandlers(this)
  }

  static createChatInfo(sender: Player, req: PrivateChatReq): ChatInfo {
    const chatInfo: ChatInfo = {
      time: getTimeSeconds(),
      uid: sender.uid,
      toUid: req.targetUid
    }

    if (req.text) chatInfo.text = req.text
    else if (req.icon != null) chatInfo.icon = req.icon

    return chatInfo
  }

  static getId(sender: Player, targetUid: number): string {
    return [sender.uid, targetUid].sort((a, b) => Math.sign(a - b)).join('-')
  }

  async handleMessage(chatInfo: ChatInfo, seqId?: number): Promise<void> {
    // set toUid if not set
    if (chatInfo.toUid == null) {
      chatInfo.toUid = this.playerList.find(player => player.uid !== chatInfo.uid).uid
    }

    const contextList = this.playerList.map(player => {
      const ctx = player.context
      ctx.seqId = seqId || null
      return ctx
    })
    await PrivateChat.broadcastNotify(contextList, chatInfo)
  }
}