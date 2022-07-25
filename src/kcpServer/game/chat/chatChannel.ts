import BaseClass from '#/baseClass'
import { ChatManager } from '$/manager/chatManager'
import Player from '$/player'
import { SystemHintTypeEnum } from '@/types/enum'
import { ChatInfo } from '@/types/proto'
import { getTimeSeconds } from '@/utils/time'

export default class ChatChannel extends BaseClass {
  chatManager: ChatManager

  uidList: number[]
  _playerList: Player[] | null

  chatHistory: ChatInfo[]

  constructor(chatManager: ChatManager) {
    super()

    this.chatManager = chatManager

    this.uidList = []
    this._playerList = null

    this.chatHistory = []
  }

  get playerList() {
    const { chatManager, uidList, _playerList } = this
    const { game } = chatManager
    return _playerList || uidList.map(uid => game.getPlayerByUid(uid)).filter(player => player != null)
  }

  // Override player list
  set playerList(v: Player[] | null) {
    this._playerList = v
  }

  static createSystemHint(player: Player, type: SystemHintTypeEnum): ChatInfo {
    return {
      time: getTimeSeconds(),
      uid: player.uid,
      systemHint: {
        type
      }
    }
  }

  getPlayer(uid: number) {
    return this.playerList.find(player => player.uid === uid)
  }

  async send(sender: Player, chatInfo: ChatInfo, seqId?: number): Promise<boolean> {
    const { playerList, chatHistory } = this
    if (!playerList.includes(sender)) return false

    // Update sequence
    let seq = chatInfo.sequence || 0
    while (chatHistory.find(ci => ci.sequence === seq)) seq++
    chatInfo.sequence = seq

    // Push message to chat history and sort by sequence
    chatHistory.push(chatInfo)
    chatHistory.sort((a, b) => a.sequence - b.sequence)

    // Emit message event
    await this.emit('Message', chatInfo, seqId)

    return true
  }

  pull(seq: number = 0, num: number = 0) {
    return this.chatHistory.slice(seq).slice(-num)
  }
}