import config from '@/config'
import DispatchKey from '@/utils/dispatchKey'
import { fileExists, readFile, writeFile } from '@/utils/fileSystem'
import { getStringLiteralInfo, replaceStringLiteral } from '@/utils/metadata'
import { decryptGlobalMetadata, encryptGlobalMetadata } from '@/utils/mhyCrypto/metadata'
import { resolve } from 'path'

export const decryptMetadata = async (src: string, dst: string) => {
  const srcPath = resolve(src)
  const dstPath = resolve(dst)

  if (!await fileExists(srcPath)) throw new Error('File not found.')

  const buf = await readFile(srcPath)
  decryptGlobalMetadata(buf)

  await writeFile(dstPath, buf)
}

export const encryptMetadata = async (src: string, dst: string) => {
  const srcPath = resolve(src)
  const dstPath = resolve(dst)

  if (!await fileExists(srcPath)) throw new Error('File not found.')

  const buf = await readFile(srcPath)
  encryptGlobalMetadata(buf)

  await writeFile(dstPath, buf)
}

export const patchMetadata = async (src: string, dst: string) => {
  const srcPath = resolve(src)
  const dstPath = resolve(dst)

  if (!await fileExists(srcPath)) throw new Error('File not found.')

  let buf = await readFile(srcPath)
  decryptGlobalMetadata(buf)

  const { pointers, data } = getStringLiteralInfo(buf)
  const stringLiterals = data.toString()

  const rsaKeys = stringLiterals.match(/<RSAKeyValue>.*?<\/RSAKeyValue>/gs)
  if (rsaKeys == null) throw new Error('Unable to find rsa keys.')

  const originalKey = rsaKeys[rsaKeys.indexOf(rsaKeys.find(k => k.match(/<P>.+<\/P>/s) != null)) - 1]
  const originalKeyOffset = data.indexOf(originalKey)
  const originalKeyPointer = pointers.find(p => p.offset === originalKeyOffset)
  if (originalKeyPointer == null) throw new Error('Unable to find signature key.')

  const signingKey = await DispatchKey.getSigningKeyPair(config.dispatchKeyId)
  buf = replaceStringLiteral(buf, originalKeyPointer, Buffer.from(signingKey.public.xml))

  encryptGlobalMetadata(buf)

  await writeFile(dstPath, buf)
}