import Gadget from "."

import { EvtCreateGadgetNotify } from "#/packets/EvtCreateGadget"
import Player from "$/player"
import { SceneGadgetInfo } from "@/types/proto"

export default class ClientGadget extends Gadget {
  player: Player

  campId: number
  campType: number
  guid: bigint
  ownerEntityId: number
  targetEntityId: number
  asyncLoad: boolean

  constructor(player: Player, notify: EvtCreateGadgetNotify) {
    super(notify?.configId)

    this.player = player

    this.entityId = notify?.entityId

    if (notify?.initPos) this.motion.pos.setData(notify.initPos)
    if (notify?.initEulerAngles) this.motion.rot.setData(notify.initEulerAngles)

    this.campId = notify?.campId
    this.campType = notify?.campType
    this.guid = BigInt(notify?.guid || 0)
    this.ownerEntityId = notify?.ownerEntityId
    this.targetEntityId = notify?.targetEntityId
    this.asyncLoad = notify?.isAsyncLoad
  }

  exportSceneGadgetInfo(): SceneGadgetInfo {
    const { campId, campType, guid, ownerEntityId, targetEntityId, asyncLoad } = this
    const info = super.exportSceneGadgetInfo()

    info.clientGadget = {
      campId,
      campType,
      guid: guid.toString(),
      ownerEntityId,
      targetEntityId,
      asyncLoad,
    }

    return info
  }
}
