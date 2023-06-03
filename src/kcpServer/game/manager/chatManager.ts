import Game from ".."

import BaseClass from "#/baseClass"
import PrivateChatChannel from "$/chat/privateChatChannel"
import PublicChatChannel from "$/chat/publicChatChannel"
import Player from "$/player"
import World from "$/world"
import { ChatInfo } from "@/types/proto"

export class ChatManager extends BaseClass {
  game: Game

  publicChatList: PublicChatChannel[]
  privateChatList: PrivateChatChannel[]

  constructor(game: Game) {
    super()

    this.game = game

    this.publicChatList = []
    this.privateChatList = []

    super.initHandlers()
  }

  private getSender(chatInfo: ChatInfo) {
    return this.game.getPlayerByUid(chatInfo.uid)
  }

  getPublicChat(world: World, channelId: number): PublicChatChannel {
    const { publicChatList } = this

    let publicChatChannel = publicChatList.find((channel) => channel.world === world && channel.channelId === channelId)
    if (!publicChatChannel) {
      publicChatChannel = new PublicChatChannel(this, world, channelId)
      publicChatList.push(publicChatChannel)
    }

    return publicChatChannel
  }

  getPrivateChat(sender: Player, targetUid: number): PrivateChatChannel {
    const { game, privateChatList } = this
    const id = PrivateChatChannel.getId(sender, targetUid)

    let privateChatChannel = privateChatList.find((channel) => channel.privateChatId === id)
    if (!privateChatChannel) {
      const target = game.getPlayerByUid(targetUid)
      if (!target) return null

      privateChatChannel = new PrivateChatChannel(this, sender, target)
      privateChatList.push(privateChatChannel)
    }

    return privateChatChannel
  }

  removePublicChat(world: World) {
    this.publicChatList = this.publicChatList.filter((channel) => channel.world !== world)
  }

  async sendPublic(world: World, channelId: number, chatInfo: ChatInfo, seqId?: number): Promise<boolean> {
    const sender = this.getSender(chatInfo)

    // Get chat channel
    const channel = this.getPublicChat(world, channelId)
    if (!channel) return false

    // Send chat info to channel
    return channel.send(sender, chatInfo, seqId)
  }

  async sendPrivate(chatInfo: ChatInfo, seqId?: number): Promise<boolean> {
    const sender = this.getSender(chatInfo)

    // Get chat channel
    const channel = this.getPrivateChat(sender, chatInfo.toUid)
    if (!channel) return false

    // Send chat info to channel
    return channel.send(sender, chatInfo, seqId)
  }

  pullRecent(player: Player, seq = 0, num = 0): ChatInfo[] {
    const { privateChatList } = this
    const chatHistory: ChatInfo[] = []

    // Pull all private chat history
    for (const channel of privateChatList) {
      if (!channel.playerList.includes(player)) continue
      chatHistory.push(...channel.pull())
    }

    // Sort chat history by time
    chatHistory.sort((a, b) => a.time - b.time)

    // Slice chat history
    return chatHistory.slice(seq).slice(-num)
  }

  pullPrivate(player: Player, targetUid: number, seq = 0, num = 0): ChatInfo[] {
    const channel = this.getPrivateChat(player, targetUid)
    if (!channel) return []

    return channel.pull(seq, num)
  }
}
