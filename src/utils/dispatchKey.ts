import config from '@/config'
import { join } from 'path'
import { cwd } from 'process'
import { fileExists, readFile, writeFile } from './fileSystem'
import { genEc2b, getEc2bKey } from './mhyCrypto/ec2b'
import OpenSSL, { RSAKeyPair } from './openssl'

const { version, dispatchKeyId, serverKeySize } = config

export default class DispatchKey {
  static async getClientKeyPair(keyId: number = dispatchKeyId): Promise<RSAKeyPair> {
    return OpenSSL.getKeyPair(join(cwd(), `data/key/${keyId}`), 'client')
  }

  static async getServerKeyPair(keyId: number = dispatchKeyId): Promise<RSAKeyPair> {
    return OpenSSL.getKeyPair(join(cwd(), `data/key/${keyId}`), 'server', Math.min(serverKeySize, 2048)) // 3.0.5+ ua patch limit
  }

  static async getKeyPairs(keyId: number = dispatchKeyId): Promise<{ client: RSAKeyPair, server: RSAKeyPair }> {
    return {
      client: await DispatchKey.getClientKeyPair(keyId),
      server: await DispatchKey.getServerKeyPair(keyId)
    }
  }

  static async getEc2b(): Promise<Buffer> {
    const binPath = join(cwd(), `data/bin/${version}`, 'ec2b.bin')

    // Generate if missing
    if (!await fileExists(binPath)) await writeFile(binPath, genEc2b())

    return readFile(binPath)
  }

  static async getXorKey(): Promise<Buffer> {
    return getEc2bKey(await this.getEc2b())
  }
}