import Packet, { PacketContext, PacketInterface } from '#/packet'
import Vector from '$/utils/vector'
import { ClientStateEnum } from '@/types/enum'
import { MapMarkPoint } from '@/types/proto'
import { MarkMapOperationEnum, RetcodeEnum, SceneEnterReasonEnum, SceneEnterTypeEnum } from '@/types/proto/enum'

export interface MarkMapReq {
  op: MarkMapOperationEnum
  old?: MapMarkPoint
  mark?: MapMarkPoint
}

export interface MarkMapRsp {
  retcode: RetcodeEnum
  markList: MapMarkPoint[]
}

class MarkMapPacket extends Packet implements PacketInterface {
  constructor() {
    super('MarkMap', {
      reqState: ClientStateEnum.IN_GAME,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, data: MarkMapReq): Promise<void> {
    const { player } = context
    const { currentWorld, currentScene, lastTpReq } = player
    const { op, mark } = data

    if (op === MarkMapOperationEnum.GET) {
      await this.response(context, {
        retcode: RetcodeEnum.RET_SUCC,
        markList: []
      })
      return
    }

    const { sceneId, name, pos } = mark

    if (op === MarkMapOperationEnum.ADD && name.indexOf('tp:') === 0) {
      const scene = await currentWorld.getScene(sceneId)
      if (!scene || Date.now() - lastTpReq < 5e3) return

      player.lastTpReq = Date.now()

      let posY = parseInt(name.split(':')[1])
      if (isNaN(posY)) posY = 512

      await scene.join(context, new Vector(pos.x, posY, pos.z), new Vector(), currentScene === scene ? SceneEnterTypeEnum.ENTER_GOTO : SceneEnterTypeEnum.ENTER_JUMP, SceneEnterReasonEnum.TRANS_POINT)
    }

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      markList: []
    })
  }

  async response(context: PacketContext, data: MarkMapRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: MarkMapPacket
export default (() => packet = packet || new MarkMapPacket())()