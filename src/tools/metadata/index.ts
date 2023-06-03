import { join, resolve } from "path"
import { cwd } from "process"

import config from "@/config"
import translate from "@/translate"
import TError from "@/translate/terror"
import { waitTick } from "@/utils/asyncWait"
import DispatchKey from "@/utils/dispatchKey"
import { fileExists, readFile, writeFile } from "@/utils/fileSystem"
import { getStringLiteralInfo, replaceStringLiteral, StringLiteralPointer } from "@/utils/metadata"
import { decryptGlobalMetadata, encryptGlobalMetadata } from "@/utils/mhyCrypto/metadata"
import OpenSSL from "@/utils/openssl"

function getRSAKeyInfo(buf: Buffer): { pointers: StringLiteralPointer[]; data: Buffer; rsaKeys: string[] } {
  const { pointers, data } = getStringLiteralInfo(buf)

  const stringLiterals = data.toString()

  const rsaKeys = stringLiterals.match(/<RSAKeyValue>.*?<\/RSAKeyValue>/gs)

  if (rsaKeys == null) throw new TError("message.tools.meta.error.noRSAKeys")

  return {
    pointers,
    data,
    rsaKeys,
  }
}

async function patchPasswordPublicKey(buf: Buffer): Promise<Buffer> {
  const { pointers, data, rsaKeys } = getRSAKeyInfo(buf)

  const isCryptoOffset = data.indexOf("is_crypto")
  const possiblyPasswordPublicKeyPointer =
    pointers[pointers.indexOf(pointers.find((p) => p.offset === isCryptoOffset)) - 1]
  const possiblyPasswordPublicKey = data
    .subarray(
      possiblyPasswordPublicKeyPointer.offset,
      possiblyPasswordPublicKeyPointer.offset + possiblyPasswordPublicKeyPointer.length
    )
    .toString("utf8")

  const passwordPublicKey = possiblyPasswordPublicKey.includes("<RSAKeyValue>") ? possiblyPasswordPublicKey : rsaKeys[0]
  const passwordPublicKeyOffset = passwordPublicKey ? data.indexOf(passwordPublicKey) : null
  const passwordPublicKeyPointer = pointers.find((p) => p.offset === passwordPublicKeyOffset)

  if (passwordPublicKeyPointer == null) {
    console.log(translate("message.tools.meta.error.noPasswordPublicKey"))
  } else {
    console.log(translate("message.tools.meta.info.replacePasswordPublicKey"))
    const passwordKey = await OpenSSL.getKeyPair(join(cwd(), "data/key"), "password", config.dispatch.passwordKeySize)
    buf = replaceStringLiteral(buf, passwordPublicKeyPointer, Buffer.from(passwordKey.public.xml))
  }

  return buf
}

async function patchServerPublicKey(buf: Buffer): Promise<Buffer> {
  const { pointers, data, rsaKeys } = getRSAKeyInfo(buf)

  const serverPublicKey = rsaKeys[rsaKeys.indexOf(rsaKeys.find((k) => k.match(/<P>.+<\/P>/s) != null)) - 1]
  const serverPublicKeyOffset = serverPublicKey ? data.indexOf(serverPublicKey) : null
  const serverPublicKeyPointer = pointers.find((p) => p.offset === serverPublicKeyOffset)

  if (serverPublicKeyPointer == null) {
    console.log(translate("message.tools.meta.error.noServerPublicKey"))
  } else {
    console.log(translate("message.tools.meta.info.replaceServerPublicKey"))
    const serverKey = await DispatchKey.getServerKeyPair()
    buf = replaceStringLiteral(buf, serverPublicKeyPointer, Buffer.from(serverKey.public.xml))
  }

  return buf
}

export const decryptMetadata = async (src: string, dst: string) => {
  const srcPath = resolve(src)
  const dstPath = resolve(dst)

  if (!(await fileExists(srcPath))) throw new TError("generic.fileNotFound", srcPath)

  const buf = await readFile(srcPath)
  decryptGlobalMetadata(buf)

  await writeFile(dstPath, buf)
}

export const encryptMetadata = async (src: string, dst: string) => {
  const srcPath = resolve(src)
  const dstPath = resolve(dst)

  if (!(await fileExists(srcPath))) throw new TError("generic.fileNotFound", srcPath)

  const buf = await readFile(srcPath)
  encryptGlobalMetadata(buf)

  await writeFile(dstPath, buf)
}

export const patchMetadata = async (src: string, dst: string) => {
  const srcPath = resolve(src)
  const dstPath = resolve(dst)

  if (!(await fileExists(srcPath))) throw new TError("generic.fileNotFound", srcPath)

  let buf = await readFile(srcPath)
  decryptGlobalMetadata(buf)

  buf = await patchPasswordPublicKey(buf)
  buf = await patchServerPublicKey(buf)

  encryptGlobalMetadata(buf)

  await writeFile(dstPath, buf)
}

export const dumpStringLiterals = async (src: string, dst: string) => {
  const srcPath = resolve(src)
  const dstPath = resolve(dst)

  if (!(await fileExists(srcPath))) throw new TError("generic.fileNotFound", srcPath)

  let buf = await readFile(srcPath)
  decryptGlobalMetadata(buf)

  const { pointers, data } = getStringLiteralInfo(buf)
  const stringLiterals: string[] = []

  let i = 0
  for (const pointer of pointers) {
    const { offset, length } = pointer
    stringLiterals.push(`${offset}:${length};${data.subarray(offset, offset + length).toString()}`)

    if (++i % 1000 === 0) {
      console.log(`${i}/${pointers.length}`)
      await waitTick()
    }
  }

  await writeFile(dstPath, JSON.stringify(stringLiterals, null, 2))
}
