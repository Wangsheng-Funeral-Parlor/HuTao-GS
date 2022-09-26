import { getCmdIdByName } from '#/cmdIds'
import TLogger from '@/translate/tlogger'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { cwd } from 'process'

const logger = new TLogger('KEYGEN', 0xfcba03)

const KNOWN_VALUES = [0x45, 0x67, 0, 0, 0, 0x89, 0xAB]

function parseDump(keyGenBuf: Buffer, progressBuf: Buffer, dumpBuf: Buffer, packet?: string): boolean {
  const len = dumpBuf.length
  const offsets = [0, 1, 4, 6, 7, len - 2, len - 1]
  const knownValues = Array.from(KNOWN_VALUES) // clone array

  const cmdId = getCmdIdByName(packet)
  if (typeof cmdId === 'number') {
    offsets.push(2, 3)
    knownValues.push(cmdId >> 8, cmdId & 0xFF)
  }

  let modified: boolean = false

  for (let i = 0; i < offsets.length; i++) {
    const offset = offsets[i] % 4096
    const knownValue = knownValues[i]
    const dumpValue = dumpBuf.readUInt8(offset)

    const pByteOffset = Math.floor(offset / 8)
    const pBitOffset = offset % 8
    const progressByte = progressBuf.readUInt8(pByteOffset)
    const progress = (progressByte >> pBitOffset) & 1

    if (progress === 1) continue

    const key = dumpValue ^ knownValue

    logger.debug(
      'message.tools.keyGen.debug.dump',
      offset,
      key.toString(16).toUpperCase().padStart(2, '0'),
      dumpValue.toString(16).toUpperCase().padStart(2, '0'),
      knownValue.toString(16).toUpperCase().padStart(2, '0')
    )

    keyGenBuf.writeUInt8(key, offset)
    progressBuf.writeUInt8(progressByte | (1 << pBitOffset), pByteOffset)

    modified = true
  }

  return modified
}

export default function keyGen() {
  try {
    logger.info('message.tools.keyGen.info.generate')

    const dumpDirPath = join(cwd(), 'data/log/dump')
    const keyGenPath = join(cwd(), 'data/bin/keyGen.bin')
    const progressPath = join(cwd(), 'data/bin/keyGenP.bin')

    let keyGenBuf: Buffer
    let progressBuf: Buffer
    let modified: boolean = false

    if (existsSync(keyGenPath)) keyGenBuf = readFileSync(keyGenPath)
    else keyGenBuf = Buffer.alloc(4096)

    if (existsSync(progressPath)) progressBuf = readFileSync(progressPath)
    else progressBuf = Buffer.alloc(512)

    for (const dumpFile of readdirSync(dumpDirPath)) {
      if (dumpFile.indexOf('raw-') !== 0) continue

      try {
        const dumpFilePath = join(dumpDirPath, dumpFile)
        const dumpBuf = readFileSync(dumpFilePath)

        modified = parseDump(keyGenBuf, progressBuf, dumpBuf, dumpFile.slice(0, -4).split('-')[2]) || modified
      } catch (err) {
        logger.error('message.tools.keyGen.error.dump', dumpFile, err)
      }
    }

    if (!modified) {
      logger.info('message.tools.keyGen.info.notModified')
      return
    }

    logger.info('message.tools.keyGen.info.save')

    writeFileSync(keyGenPath, keyGenBuf)
    writeFileSync(progressPath, progressBuf)

    logger.info('message.tools.keyGen.info.success')
  } catch (err) {
    logger.error('message.tools.keyGen.error.unknown', err)
  }
}