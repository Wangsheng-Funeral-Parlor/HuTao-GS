import Packet, { PacketContext } from '#/packet'
import Player from '$/player'
import { ClientStateEnum } from '@/types/enum'
import { ForwardTypeEnum } from '@/types/proto/enum'

export interface ForwardEntry {
  forwardType: ForwardTypeEnum
  [key: string]: any
}

export default class ForwardBuffer {
  player: Player

  packetList: Packet[]
  bufferMap: { [type: number]: [number, ForwardEntry, number][] }
  additionalDataMap: { [seqId: number]: any[] }

  constructor(player: Player) {
    this.player = player

    this.packetList = []
    this.bufferMap = {}
    this.additionalDataMap = {}
  }

  private getEntryList(type: ForwardTypeEnum): [Packet, ForwardEntry[], number][] {
    const { packetList, bufferMap } = this
    const entryList = bufferMap[type]
    const ret: [Packet, ForwardEntry[], number][] = []

    if (!entryList) return ret

    for (let i = 0; i < packetList.length; i++) {
      if (!entryList.find(e => e[0] === i)) continue

      const seqIds = entryList
        .filter(e => e[0] === i)
        .map(e => e[2])
        .filter((seqId, j, self) => self.indexOf(seqId) === j)

      for (const seqId of seqIds) {
        ret.push([
          packetList[i],
          entryList.filter(e => e[0] === i && e[2] === seqId).map(e => e[1]),
          seqId
        ])
      }
    }

    entryList.splice(0)
    return ret
  }

  getContextList(type: ForwardTypeEnum): PacketContext[] {
    const { player } = this
    const { currentScene } = player
    if (!currentScene) return []

    const { world, broadcastContextList } = currentScene
    const { host } = world

    const contextList = broadcastContextList.filter(ctx => (ctx.client.state & 0xF0FF) >= (ClientStateEnum.ENTER_SCENE | ClientStateEnum.ENTER_SCENE_DONE))

    switch (type) {
      case ForwardTypeEnum.FORWARD_TO_ALL:
        return contextList
      case ForwardTypeEnum.FORWARD_TO_ALL_EXCEPT_CUR:
      case ForwardTypeEnum.FORWARD_TO_ALL_EXIST_EXCEPT_CUR:
        return contextList.filter(ctx => ctx.player !== player)
      case ForwardTypeEnum.FORWARD_TO_ALL_GUEST:
        return contextList.filter(ctx => ctx.player !== host)
      case ForwardTypeEnum.FORWARD_TO_HOST:
        return [host.context]
      default:
        return []
    }
  }

  private async send(type: ForwardTypeEnum) {
    const { additionalDataMap } = this
    const entryList = this.getEntryList(type)

    for (const entry of entryList) {
      const [packet, entries, seqId] = entry
      const contextList = this.getContextList(type)

      for (const ctx of contextList) ctx.seqId = seqId

      await packet.broadcastNotify(
        contextList,
        entries,
        ...(additionalDataMap[seqId] || [])
      )
    }
  }

  addEntry(packet: Packet, entry: ForwardEntry, seqId: number) {
    const { packetList, bufferMap } = this
    const { forwardType } = entry

    let index = packetList.indexOf(packet)
    if (index === -1) {
      index = packetList.length
      packetList.push(packet)
    }

    bufferMap[forwardType] = bufferMap[forwardType] || []
    bufferMap[forwardType].push([index, entry, seqId])
  }

  setAdditionalData(seqId: number, ...data: any[]) {
    this.additionalDataMap[seqId] = data
  }

  async sendAll(): Promise<void> {
    const { additionalDataMap } = this

    for (const type in ForwardTypeEnum) {
      if (isNaN(parseInt(type))) continue
      await this.send(parseInt(type))
    }

    // clear additional data
    for (const seqId in additionalDataMap) delete additionalDataMap[seqId]
  }
}