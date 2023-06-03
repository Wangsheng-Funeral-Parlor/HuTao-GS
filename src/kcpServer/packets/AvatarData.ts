import Packet, { PacketContext, PacketInterface } from "#/packet"
import { ClientStateEnum } from "@/types/enum"
import { AvatarInfo, AvatarTeam } from "@/types/proto"

export interface AvatarDataNotify {
  avatarList: AvatarInfo[]
  avatarTeamMap: { [id: number]: AvatarTeam }
  curAvatarTeamId: number
  chooseAvatarGuid: string
  tempAvatarGuidList?: string[]
  ownedFlycloakList: number[]
  ownedCostumeList: number[]
}

class AvatarDataPacket extends Packet implements PacketInterface {
  constructor() {
    super("AvatarData")
  }

  async sendNotify(context: PacketContext): Promise<void> {
    if (!this.checkState(context, ClientStateEnum.LOGIN)) return

    const { teamManager, avatarList, flycloakList, costumeList } = context.player
    const notifyData: AvatarDataNotify = {
      avatarList: avatarList.map((a) => a.exportAvatarInfo()),
      avatarTeamMap: teamManager.exportAvatarTeamMap(),
      curAvatarTeamId: teamManager.currentTeam,
      chooseAvatarGuid: avatarList[0].guid.toString(),
      ownedFlycloakList: flycloakList.map((flycloak) => flycloak.Id),
      ownedCostumeList: costumeList.map((costume) => costume.Id),
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: AvatarDataPacket
export default (() => (packet = packet || new AvatarDataPacket()))()
