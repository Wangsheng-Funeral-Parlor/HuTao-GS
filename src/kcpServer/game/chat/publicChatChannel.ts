import PlayerChat from '#/packets/PlayerChat'
import { ChatManager } from '$/manager/chatManager'
import World from '$/world'
import { ChatInfo } from '@/types/proto'
import ChatChannel from './chatChannel'

export default class PublicChatChannel extends ChatChannel {
  world: World
  channelId: number

  constructor(chatManager: ChatManager, world: World, channelId: number) {
    super(chatManager)

    this.world = world
    this.channelId = channelId
    this.playerList = world.playerList

    super.initHandlers(this)
  }

  async handleMessage(chatInfo: ChatInfo, seqId?: number): Promise<void> {
    const contextList = this.playerList.map(player => {
      const ctx = player.context
      ctx.seqId = seqId || null
      return ctx
    })
    await PlayerChat.broadcastNotify(contextList, this.channelId, chatInfo)
  }
}