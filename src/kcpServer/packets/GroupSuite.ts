import Packet, { PacketInterface, PacketContext } from '#/packet'
import Npc from '$/entity/npc'

export interface GroupSuiteNotify {
  groupMap: { [groupId: number]: number }
}

class GroupSuitePacket extends Packet implements PacketInterface {
  constructor() {
    super('GroupSuite')
  }

  async sendNotify(context: PacketContext, npcList: Npc[]): Promise<void> {
    const groupSuitIdListMap: { [groupId: number]: number[] } = {}
    for (const npc of npcList) {
      const { groupId, suitIdList } = npc
      const groupSuitIdList = groupSuitIdListMap[groupId]
      if (groupSuitIdList) {
        groupSuitIdListMap[groupId] = groupSuitIdList.filter(id => suitIdList.includes(id))
      } else {
        groupSuitIdListMap[groupId] = [...suitIdList]
      }
    }

    const notifyData: GroupSuiteNotify = {
      groupMap: Object.fromEntries(
        Object.entries(groupSuitIdListMap)
          .map(e => [e[0], e[1][0] || 1])
      )
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: GroupSuitePacket
export default (() => packet = packet || new GroupSuitePacket())()