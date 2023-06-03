import { join } from "path"
import { cwd } from "process"

import * as protobuf from "protobufjs"

import { getNameByCmdId, cmdIds } from "#/cmdIds"
import GlobalState from "@/globalState"
import TLogger from "@/translate/tlogger"
import { fileExists, readFile, writeFile } from "@/utils/fileSystem"

const logger = new TLogger("PROTOU", 0xc2f542)

const protoTypeCache: { [proto: string]: protobuf.Type } = {}
const logBlacklist: (string | number)[] = []

function canLogProto(name: string | number): boolean {
  if ((typeof name === "string" && name.length <= 0) || logBlacklist.includes(name)) return false
  logBlacklist.push(name)
  return true
}

async function dumpProto(name: string | number, data: Buffer) {
  if (!GlobalState.get("PacketDump")) return

  try {
    const dumpPath = join(cwd(), "data/log/dump", `proto-${name}.bin`)
    if (data.length <= 0 || ((await fileExists(dumpPath)) && (await readFile(dumpPath)).length >= data.length)) return
    await writeFile(dumpPath, data)
  } catch (err) {}
}

export const getProtoType = async (proto: string, common = false): Promise<protobuf.Type> => {
  const cacheId = proto + Number(common)
  const cache = protoTypeCache[cacheId]
  if (cache) return cache
  const protoPath = join(cwd(), `data/proto${common ? "" : "/" + cmdIds.version}/${proto}.proto`)
  if (!(await fileExists(protoPath))) return null

  const root = await protobuf.load(protoPath)
  const type = <protobuf.Type>root.lookup(proto)

  protoTypeCache[cacheId] = type

  return type
}

export const objToProtobuffer = async (obj: object, cmdId: number | string, common = false): Promise<Buffer> => {
  const protoName = getNameByCmdId(cmdId)
  try {
    const type = await getProtoType(protoName.toString(), common)
    if (type == null) {
      if (canLogProto(protoName)) logger.warn("message.protoUtils.warn.noProto", protoName)
      return Buffer.alloc(0)
    }

    const message = type.create(obj)
    return Buffer.from(type.encode(message).finish())
  } catch (err) {
    if (canLogProto(protoName)) logger.error("generic.param1", <Error>err)
    return Buffer.alloc(0)
  }
}

export const dataToProtobuffer = async <T extends object>(
  data: Buffer,
  cmdId: number | string,
  common = false
): Promise<T> => {
  const protoName = getNameByCmdId(cmdId)
  try {
    const type = await getProtoType(protoName.toString(), common)
    if (type == null) {
      if (canLogProto(protoName)) logger.warn("message.protoUtils.warn.noProto", protoName)
      await dumpProto(protoName, data)
      return <T>{}
    }
    return <T>type.decode(data)
  } catch (err) {
    if (canLogProto(protoName)) logger.error("generic.param1", <Error>err)
    await dumpProto(protoName, data)
    return <T>{}
  }
}

export default {
  objToProtobuffer,
  dataToProtobuffer,
}
