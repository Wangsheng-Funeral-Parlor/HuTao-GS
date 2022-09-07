import config from '@/config'
import { waitTick } from '@/utils/asyncWait'
import DispatchKey from '@/utils/dispatchKey'
import { fileExists, readFile, writeFile } from '@/utils/fileSystem'
import { getStringLiteralInfo, replaceStringLiteral } from '@/utils/metadata'
import { decryptGlobalMetadata, encryptGlobalMetadata } from '@/utils/mhyCrypto/metadata'
import OpenSSL from '@/utils/openssl'
import { join, resolve } from 'path'
import { cwd } from 'process'

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

  // Replace password key
  const isCryptoOffset = stringLiterals.indexOf('is_crypto')
  const passwordPublicKey = rsaKeys[
    rsaKeys
      .map((key, i) => [i, Math.abs(isCryptoOffset - stringLiterals.indexOf(key))])
      .sort((a, b) => a[1] - b[1])[0]?.[0]
  ]
  const passwordPublicKeyOffset = passwordPublicKey ? data.indexOf(passwordPublicKey) : null
  const passwordPublicKeyPointer = pointers.find(p => p.offset === passwordPublicKeyOffset)
  if (passwordPublicKeyPointer == null) {
    console.log('Unable to find password public key.')
  } else {
    console.log('Replacing password public key...')
    const passwordKey = await OpenSSL.getKeyPair(join(cwd(), 'data/key'), 'password', config.passwordKeySize)
    buf = replaceStringLiteral(buf, passwordPublicKeyPointer, Buffer.from(passwordKey.public.xml))
  }

  // Replace server key
  const serverPublicKey = rsaKeys[rsaKeys.indexOf(rsaKeys.find(k => k.match(/<P>.+<\/P>/s) != null)) - 1]
  const serverPublicKeyOffset = serverPublicKey ? data.indexOf(serverPublicKey) : null
  const serverPublicKeyPointer = pointers.find(p => p.offset === serverPublicKeyOffset)
  if (serverPublicKeyPointer == null) {
    console.log('Unable to find server public key.')
  } else {
    console.log('Replacing server public key...')
    const serverKey = await DispatchKey.getServerKeyPair(config.dispatchKeyId)
    buf = replaceStringLiteral(buf, serverPublicKeyPointer, Buffer.from(serverKey.public.xml))
  }

  encryptGlobalMetadata(buf)

  await writeFile(dstPath, buf)
}

export const dumpStringLiterals = async (src: string, dst: string) => {
  const srcPath = resolve(src)
  const dstPath = resolve(dst)

  if (!await fileExists(srcPath)) throw new Error('File not found.')

  let buf = await readFile(srcPath)
  decryptGlobalMetadata(buf)

  const { pointers, data } = getStringLiteralInfo(buf)
  const stringLiterals: string[] = []

  let i = 0
  for (const pointer of pointers) {
    const { offset, length } = pointer
    stringLiterals.push(`${offset}:${length};${data.subarray(offset, offset + length).toString()}`)

    if (++i % 1000 === 0) {
      console.log(`Dumping: (${i}/${pointers.length})`)
      await waitTick()
    }
  }

  await writeFile(dstPath, JSON.stringify(stringLiterals, null, 2))
}