import { getNameByCmdId } from '#/cmdIds'
import config from '@/config'
import Logger from '@/logger'
import { fileExists, readFile, writeFile } from '@/utils/fileSystem'
import { join } from 'path'
import { cwd } from 'process'
import * as protobuf from 'protobufjs'

const logger = new Logger('PROTOU', 0xc2f542)

const protoTypeCache: { [proto: string]: protobuf.Type } = {}
const logBlacklist: (string | number)[] = []

function canLogProto(name: string | number): boolean {
  if ((typeof name === 'string' && name.length <= 0) || logBlacklist.includes(name)) return false
  logBlacklist.push(name)
  return true
}

async function dumpProto(name: string | number, data: Buffer) {
  try {
    const dumpPath = join(cwd(), 'data/log/dump', `proto-${name}.bin`)
    if (data.length <= 0 || (await fileExists(dumpPath) && (await readFile(dumpPath)).length >= data.length)) return
    await writeFile(dumpPath, data)
  } catch (err) { }
}

export const getProtoType = async (proto: string, common: boolean = false): Promise<protobuf.Type> => {
  const cacheId = proto + Number(common)
  const cache = protoTypeCache[cacheId]
  if (cache) return cache

  const protoPath = join(cwd(), `data/proto${common ? '' : ('/' + config.version)}/${proto}.proto`)
  if (!await fileExists(protoPath)) return null

  const root = await protobuf.load(protoPath)
  const type = root.lookup(proto) as protobuf.Type

  protoTypeCache[cacheId] = type

  return type
}

export const objToProtobuffer = async (obj: object, cmdId: number | string, common: boolean = false): Promise<Buffer> => {
  const protoName = getNameByCmdId(cmdId)
  try {
    const type = await getProtoType(protoName.toString(), common)
    if (type == null) {
      if (canLogProto(protoName)) logger.warn('Missing proto:', protoName)
      return Buffer.alloc(0)
    }

    const message = type.create(obj)
    return Buffer.from(type.encode(message).finish())
  } catch (err) {
    if (canLogProto(protoName)) logger.error((<Error>err).message)
    return Buffer.alloc(0)
  }
}

export const dataToProtobuffer = async <T extends object>(data: Buffer, cmdId: number | string, common: boolean = false): Promise<T> => {
  const protoName = getNameByCmdId(cmdId)
  try {
    const type = await getProtoType(protoName.toString(), common)
    if (type == null) {
      if (canLogProto(protoName)) logger.warn('Missing proto:', protoName)
      await dumpProto(protoName, data)
      return <T>{}
    }
    return <T>type.decode(data)
  } catch (err) {
    if (canLogProto(protoName)) logger.error((<Error>err).message)
    await dumpProto(protoName, data)
    return <T>{}
  }
}

export default {
  objToProtobuffer,
  dataToProtobuffer
}