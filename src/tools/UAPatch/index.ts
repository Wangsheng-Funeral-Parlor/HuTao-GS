import TError from "@/translate/terror"
import DispatchKey from "@/utils/dispatchKey"
import { fileExists, readFile, writeFile } from "@/utils/fileSystem"

const KEY_START = Buffer.from([0x3c, 0x52, 0x53, 0x41, 0x4b, 0x65, 0x79, 0x56]) // "<RSAKeyV"
const KEY_END = Buffer.from([0x79, 0x56, 0x61, 0x6c, 0x75, 0x65, 0x3e, 0x00]) // "yValue> "
const RET_INS = Buffer.from([0x48, 0x8b, 0xc1, 0x48, 0x83, 0xc4])

function addrToBuffer(addr: number): Buffer {
  if (addr <= 0) return Buffer.from([0x10])
  if (addr < 0x80) return Buffer.from([0x50, addr])

  const buf = Buffer.alloc(5)
  buf.writeUInt8(0x90)
  buf.writeUint32LE(addr, 1)

  return buf
}

export const readKey = (buf: Buffer, offset: number): Buffer => {
  if (Buffer.compare(buf.subarray(offset, offset + KEY_START.length), KEY_START) != 0) return null

  // roll back 2 bytes
  offset -= 2

  const buffers: Buffer[] = []

  while (offset < buf.length) {
    const inst = buf.readUInt16BE(offset)
    offset += 2

    switch (inst) {
      case 0x48ba:
        buffers.push(buf.subarray(offset, offset + 8))
        offset += 8
        break
      case 0x4889:
        const operand = buf.readUint8(offset++)
        switch (operand) {
          case 0x10:
            break
          case 0x50:
            offset++
            break
          case 0x90:
            offset += 4
            break
          default:
            throw new TError("message.tools.ua.error.unknownOperand", operand?.toString(16)?.toUpperCase())
        }
        break
      default:
        throw new TError("message.tools.ua.error.unknownInstruction", inst?.toString(16)?.toUpperCase())
    }

    if (Buffer.compare(buffers[buffers.length - 1], KEY_END) === 0) break
  }

  return Buffer.concat(buffers)
}

export const writeKey = (buf: Buffer, offset: number, key: Buffer) => {
  const buffers: Buffer[] = []

  // roll back 2 bytes
  offset -= 2

  const retInsOffset = buf.subarray(offset).indexOf(RET_INS)
  if (retInsOffset < 0) throw new TError("message.tools.ua.error.noReturn")

  const maxSize = buf.readUInt32LE(offset + retInsOffset - 4) + 8
  let addr = 0

  key = Buffer.concat([key, Buffer.alloc(maxSize - key.length)])

  while (key.length > 0) {
    let chunk = key.subarray(0, 8)
    key = key.length >= 8 ? key.subarray(8) : Buffer.alloc(0)

    if (chunk.length < 8) chunk = Buffer.concat([chunk, Buffer.alloc(8 - chunk.length)])
    buffers.push(Buffer.from([0x48, 0xba]), chunk, Buffer.from([0x48, 0x89]), addrToBuffer(addr))

    addr += 8
  }

  Buffer.concat(buffers).copy(buf, offset)
}

export const findKeys = (buf: Buffer) => {
  const keyOffsets: number[] = []

  let offset = 0
  while (buf.subarray(offset).includes(KEY_START)) {
    const index = buf.subarray(offset).indexOf(KEY_START)
    offset += index
    keyOffsets.push(offset)
    offset += KEY_START.length
  }

  return keyOffsets
}

export const listKeys = async (buf: Buffer): Promise<{ offset: number; data: string }[]> => {
  return findKeys(buf)
    .map((offset) => ({ offset, data: readKey(buf, offset)?.toString() }))
    .filter((k) => k.data != null)
}

export const UAList = async (path: string): Promise<string[]> => {
  if (!(await fileExists(path))) throw new TError("generic.fileNotFound", path)
  return (await listKeys(await readFile(path))).map((k) => k.data)
}

export const UAPatch = async (src: string, dst: string): Promise<void> => {
  if (!(await fileExists(src))) throw new TError("generic.fileNotFound", src)

  const buf = await readFile(src)
  const key = (await listKeys(buf)).find((k) => !k.data.includes("<P>"))
  if (key == null) throw new TError("message.tools.ua.error.noServerPublicKey")

  const serverKey = await DispatchKey.getServerKeyPair()
  writeKey(buf, key.offset, Buffer.from(serverKey.public.xml))

  await writeFile(dst, buf)
}
