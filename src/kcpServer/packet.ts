import Logger from '@/logger'
import { ClientStateEnum } from '@/types/enum'
import { PacketHead } from '@/types/kcp'
import { WaitOnBlock } from '@/utils/asyncWait'
import { xor } from '@/utils/xor'
import Client from './client'
const logger = new Logger('PACKET', 0x8810cd)

const WAIT_TIMEOUT = 1800

export const verbosePackets = [
  'AbilityInvocationsNotify',
  'AvatarFightPropUpdateNotify',
  'ClientAbilityChangeNotify',
  'ClientAbilityInitFinishNotify',
  'ClientReportNotify',
  'CombatInvocationsNotify',
  'EntityAiSyncNotify',
  'EntityConfigHashNotify',
  'EntityFightPropChangeReasonNotify',
  'EntityFightPropUpdateNotify',
  'EvtAiSyncCombatThreatInfoNotify',
  'EvtAiSyncSkillCdNotify',
  'EvtAvatarUpdateFocusNotify',
  'EvtDoSkillSuccNotify',
  'EvtEntityRenderersChangedNotify',
  'MonsterAIConfigHashNotify',
  'PingReq',
  'PingRsp',
  'PlayerPropChangeNotify',
  'PlayerPropNotify',
  'QueryPathReq',
  'QueryPathRsp',
  'SceneAudioNotify',
  'SceneAvatarStaminaStepReq',
  'SceneAvatarStaminaStepRsp',
  'SceneEntityMoveNotify',
  'ScenePlayerLocationNotify',
  'SceneTimeNotify',
  'SetEntityClientDataNotify',
  'UnionCmdNotify',
  'VehicleStaminaNotify',
  'WorldPlayerLocationNotify',
  'WorldPlayerRTTNotify'
]

export interface PacketInterface {
  name: string

  reqState: ClientStateEnum
  notifyState: ClientStateEnum
  reqStatePass: boolean
  notifyStatePass: boolean
  reqStateMask: number
  notifyStateMask: number

  reqWaitState: ClientStateEnum
  notifyWaitState: ClientStateEnum
  reqWaitStatePass: boolean
  notifyWaitStatePass: boolean
  reqWaitStateMask: number
  notifyWaitStateMask: number

  request?(context: PacketContext, data: any, ...any: any[]): Promise<void>
  response?(context: PacketContext, data: any, ...any: any[]): Promise<void>
  recvNotify?(context: PacketContext, data: any, ...any: any[]): Promise<void>
  sendNotify?(context: PacketContext, data: any, ...any: any[]): Promise<void>
  broadcastNotify?(contextList: PacketContext[], ...data: any[]): Promise<void>

  checkState(context: PacketContext, state: ClientStateEnum, pass?: boolean, mask?: number): boolean
  waitState(context: PacketContext, state: ClientStateEnum, pass?: boolean, mask?: number): Promise<void>
}

export interface PacketOption {
  reqState?: ClientStateEnum
  notifyState?: ClientStateEnum
  reqStatePass?: boolean
  notifyStatePass?: boolean
  reqStateMask?: number
  notifyStateMask?: number

  reqWaitState?: ClientStateEnum
  notifyWaitState?: ClientStateEnum
  reqWaitStatePass?: boolean
  notifyWaitStatePass?: boolean
  reqWaitStateMask?: number
  notifyWaitStateMask?: number
}

export class PacketContext {
  client: Client
  seqId: number
  wob: WaitOnBlock

  constructor(client: Client, seqId?: number) {
    this.client = client
    this.seqId = seqId || null
    this.wob = new WaitOnBlock(2)
  }

  get server() {
    return this.client.server
  }

  get game() {
    return this.server.game
  }

  get player() {
    return this.client.player
  }
}

export default class Packet implements PacketInterface {
  name: string

  reqState: ClientStateEnum
  notifyState: ClientStateEnum
  reqStatePass: boolean
  notifyStatePass: boolean
  reqStateMask: number
  notifyStateMask: number

  reqWaitState: ClientStateEnum
  notifyWaitState: ClientStateEnum
  reqWaitStatePass: boolean
  notifyWaitStatePass: boolean
  reqWaitStateMask: number
  notifyWaitStateMask: number

  constructor(name: string, opts: PacketOption = {}) {
    this.name = name

    this.reqState = opts.reqState || ClientStateEnum.NONE
    this.notifyState = opts.notifyState || ClientStateEnum.NONE
    this.reqStatePass = opts.reqStatePass || false
    this.notifyStatePass = opts.notifyStatePass || false
    this.reqStateMask = opts.reqStateMask || 0xFFFF
    this.notifyStateMask = opts.notifyStateMask || 0xFFFF

    this.reqWaitState = opts.reqWaitState || ClientStateEnum.NONE
    this.notifyWaitState = opts.notifyWaitState || ClientStateEnum.NONE
    this.reqWaitStatePass = opts.reqWaitStatePass || false
    this.notifyWaitStatePass = opts.notifyWaitStatePass || false
    this.reqWaitStateMask = opts.reqWaitStateMask || 0xFFFF
    this.notifyWaitStateMask = opts.notifyWaitStateMask || 0xFFFF
  }

  private logState(state: string) {
    const { name } = this
    const verbosePacketNames = verbosePackets.map(packet => packet.replace(/Req|Rsp|Notify/, ''))

    if (verbosePacketNames.includes(name)) logger.verbose(`[${state}]`, name)
    else logger.debug(`[${state}]`, name)
  }

  private getHead(context: PacketContext): PacketHead {
    const { seqId } = context

    const head: PacketHead = { sentMs: Date.now() }
    if (seqId != null) head.clientSequenceId = seqId

    return head
  }

  static isPacket(buf: Buffer): boolean {
    return buf.length > 5 && buf.readInt16BE(0) === 0x4567 && buf.readUInt16BE(buf.byteLength - 2) === 0x89AB
  }

  static decode(buf: Buffer): { head: Buffer, data: Buffer } {
    const headLen = buf.readUInt16BE(4)
    const dataLen = buf.readUInt32BE(6)

    let offset = 10

    const head = buf.subarray(offset, (() => offset += headLen)())
    const data = buf.subarray(offset, (() => offset += dataLen)())

    return { head, data }
  }

  static encode(head: Buffer, data: Buffer, packetID: number, keyBuffer: Buffer): Buffer {
    const magic2 = Buffer.from(0x89AB.toString(16), 'hex')
    const part1 = Buffer.alloc(10)

    part1.writeUInt16BE(0x4567, 0)
    part1.writeUInt16BE(packetID, 2)
    part1.writeUInt16BE(head.length, 4)
    part1.writeUInt32BE(data.length, 6)

    const ret = Buffer.concat([part1, head, data, magic2], part1.length + head.length + data.length + magic2.length)
    xor(ret, keyBuffer)
    return ret
  }

  async response(context: PacketContext, data: any): Promise<void> {
    await context.wob.waitTick()
    await context.client.sendPacket(`${this.name}Rsp`, this.getHead(context), data)
  }

  async sendNotify(context: PacketContext, data: any, ..._any: any[]): Promise<void> {
    await context.wob.waitTick()
    await context.client.sendPacket(`${this.name}Notify`, this.getHead(context), data)
  }

  async broadcastNotify(contextList: PacketContext[], ...data: any[]): Promise<void> {
    for (const context of contextList) await this.sendNotify(context, ...(data as [any, ...any[]]))
  }

  checkState(context: PacketContext, state: ClientStateEnum, pass: boolean = false, mask: number = 0xFFFF, log: boolean = true): boolean {
    if (state === ClientStateEnum.NONE) return true

    const { state: curState } = context.client
    const maskedState = (curState & mask)
    const check = maskedState === state || (pass && maskedState >= state)

    if (!check && log) this.logState('SKIP')

    return check
  }

  async waitState(context: PacketContext, state: ClientStateEnum, pass: boolean = false, mask: number = 0xFFFF): Promise<void> {
    if (this.checkState(context, state, pass, mask, false)) return

    this.logState('WAIT')

    return new Promise<void>((resolve, reject) => {
      const { client } = context
      let i = 0

      const checkCond = async () => {
        try {
          const destroy = client.destroyed || ++i >= WAIT_TIMEOUT

          if (!destroy && !this.checkState(context, state, pass, mask, false)) return

          client.off('update', checkCond)
          client.off('destroy', checkCond)
          client.maxListeners -= 1

          if (destroy) return

          this.logState('CONT')

          resolve()
        } catch (err) {
          reject(err)
        }
      }

      client.maxListeners += 1
      client.on('update', checkCond)
      client.on('destroy', checkCond)
    })
  }
}