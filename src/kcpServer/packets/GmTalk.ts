import Packet, { PacketContext, PacketInterface } from '#/packet'
import Monster from '$/entity/monster'
import Vector from '$/utils/vector'
import { ClientStateEnum } from '@/types/enum'
import { ChangeHpReasonEnum, PlayerDieTypeEnum, ProtEntityTypeEnum, RetcodeEnum } from '@/types/proto/enum'

export interface GmTalkReq {
  msg: string
}

export interface GmTalkRsp {
  retcode: RetcodeEnum
  msg?: string
  retmsg?: string
}

class GmTalkPacket extends Packet implements PacketInterface {
  constructor() {
    super('GmTalk', {
      reqState: ClientStateEnum.IN_GAME,
      reqStatePass: true
    })
  }

  private async gmtHp(context: PacketContext, amount: number) {
    const { player, seqId } = context
    const { currentAvatar } = player
    if (amount > 0) await currentAvatar.heal(amount, true, ChangeHpReasonEnum.CHANGE_HP_ADD_GM, seqId)
    else await currentAvatar.takeDamage(0, -amount, true, ChangeHpReasonEnum.CHANGE_HP_SUB_GM, seqId)
  }

  private async gmtMonster(context: PacketContext, id: number, count: number, lvl: number, x?: number, y?: number, z?: number) {
    const { player } = context
    const { currentScene, pos: playerPos } = player
    const { entityManager } = currentScene

    const pos = (x == null || y == null || z == null) ? playerPos.clone() : new Vector(x, y, z)

    for (let i = 0; i < count; i++) {
      const entity = new Monster(id, player)

      entity.motion.pos.copy(pos)
      entity.bornPos.copy(pos)

      await entity.initNew(lvl)
      await entityManager.add(entity)
    }
  }

  private async gmtKill(context: PacketContext, type: string, all: boolean) {
    const { player } = context
    const { currentScene, currentAvatar, loadedEntityIdList } = player
    const { entityManager } = currentScene

    let entityType: ProtEntityTypeEnum
    switch (type) { // NOSONAR
      case 'MONSTER':
        entityType = ProtEntityTypeEnum.PROT_ENTITY_MONSTER
        break
      default:
        return
    }

    if (!all) return

    const entityList = loadedEntityIdList
      .map(id => entityManager.getEntity(id, true))
      .filter(e => e != null && e.protEntityType === entityType && e.isAlive())
      .sort((a, b) => Math.sign(a.distanceTo2D(currentAvatar) - b.distanceTo2D(currentAvatar)))

    let i = 0
    for (const entity of entityList) {
      if (i++ > 32) break
      await entity.kill(0, PlayerDieTypeEnum.PLAYER_DIE_NONE, undefined, true)
    }

    await entityManager.flushAll()
  }

  private async gmtGod(context: PacketContext, enable: boolean, type?: string) {
    const { player } = context
    if (type == null) player.godMode = enable
  }

  async request(context: PacketContext, data: GmTalkReq): Promise<void> {
    const { msg } = data
    const cmd = msg?.split(' ')?.[0]?.toLowerCase()
    const args = msg?.split(' ')?.slice(1) || []

    switch (cmd) {
      case 'hp':
        await this.gmtHp(context, Number(args[0]))
        break
      case 'monster':
        await this.gmtMonster.call(this, context, ...args.map(arg => Number(arg)))
        break
      case 'kill':
        await this.gmtKill(context, args[0], args[1] === 'ALL')
        break
      case 'wudi':
        await this.gmtGod(context, args.slice(-1)[0] === 'ON', args.length > 1 ? args[0] : undefined)
        break
      default:
        console.log('GmTalk:', msg)
        await this.response(context, { retcode: RetcodeEnum.RET_UNKNOWN_ERROR })
        return
    }

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      msg
    })
  }

  async response(context: PacketContext, data: GmTalkRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: GmTalkPacket
export default (() => packet = packet || new GmTalkPacket())()