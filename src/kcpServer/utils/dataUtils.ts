import { join } from 'path'
import { cwd } from 'process'
import * as protobuf from 'protobufjs'
import { getNameByCmdId } from '#/cmdIds'
import config from '@/config'

const protoTypeCache: { [proto: string]: protobuf.Type } = {}

export const xorData = (data: Buffer, key: Buffer): void => {
  for (let i = 0; i < data.length; i++) {
    data.writeUInt8(data.readUInt8(i) ^ key.readUInt8(i % key.length), i)
  }
}

export const parsePacket = (buf: Buffer): {
  head: Buffer,
  data: Buffer
} => {
  const headLen = buf.readUInt16BE(4)
  const dataLen = buf.readUInt32BE(6)

  let offset = 10

  const head = buf.slice(offset, (() => offset += headLen)())
  const data = buf.slice(offset, (() => offset += dataLen)())

  return { head, data }
}

export const getProtoType = async (proto: string, common: boolean = false): Promise<protobuf.Type> => {
  const cacheId = proto + Number(common)
  const cache = protoTypeCache[cacheId]
  if (cache) return cache

  const root = await protobuf.load(join(cwd(), `data/proto${common ? '' : ('/' + config.version)}/${proto}.proto`))
  const type = root.lookup(proto) as protobuf.Type

  protoTypeCache[cacheId] = type

  return type
}

export const objToProtobuffer = async (obj: object, cmdId: number | string, common: boolean = false): Promise<Buffer | string> => {
  try {
    const protoName = getNameByCmdId(cmdId)
    const type = await getProtoType(protoName.toString(), common)
    const message = type.create(obj)

    return Buffer.from(type.encode(message).finish())
  } catch (err) {
    return Buffer.alloc(0)
  }
}

export const dataToProtobuffer = async (data: Buffer, cmdId: number | string, common: boolean = false): Promise<any> => {
  try {
    const protoName = getNameByCmdId(cmdId)
    const type = await getProtoType(protoName.toString(), common)

    return type.decode(data)
  } catch (err) {
    return {}
  }
}

export const dataToPacket = async (head: Buffer, data: Buffer, packetID: number, keyBuffer: Buffer): Promise<Buffer> => {
  const magic2 = Buffer.from(0x89AB.toString(16), 'hex')
  const part1 = Buffer.alloc(10)

  part1.writeUInt16BE(0x4567, 0)
  part1.writeUInt16BE(packetID, 2)
  part1.writeUInt16BE(head.length, 4)
  part1.writeUInt32BE(data.length, 6)

  const ret = Buffer.concat([part1, head, data, magic2], part1.length + head.length + data.length + magic2.length)
  xorData(ret, keyBuffer)
  return ret
}

export const formatSentPacket = (data: Buffer, token: number): Buffer => {
  data = Buffer.from(data)

  let i = 0
  const msgs = []
  while (i < data.length) {
    const _Conv = data.readUInt32BE(i)
    const contentLen = data.readUInt32LE(i + 20)
    const newStart = Buffer.alloc(8)
    newStart.writeUInt32BE(_Conv, 0)
    newStart.writeUInt32BE(token, 4)

    const slice = data.subarray(i + 4, i + 24 + contentLen)

    msgs.push(Buffer.concat([newStart, slice]))
    i += contentLen + 24
  }

  data = Buffer.concat(msgs)
  return data
}

export const getPackets = (data: Buffer, len: number = 28): Buffer[] => {
  let i = 0
  const buffers = []
  while (i < data.length) {
    const contentLen = data.readUInt32BE(i + len - 4)
    const sliced = data.slice(i, i + len + contentLen)
    buffers.push(sliced)
    i += len + contentLen
  }
  return buffers
}

export default {
  xorData,
  parsePacket,
  objToProtobuffer,
  dataToProtobuffer,
  dataToPacket,
  formatSentPacket,
  getPackets
}