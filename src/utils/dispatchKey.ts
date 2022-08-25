import config from '@/config'
import { join } from 'path'
import { cwd } from 'process'
import { fileExists, readFile, writeFile } from './fileSystem'
import { genEc2b, getEc2bKey } from './mhyCrypto/ec2b'
import OpenSSL, { KeyPair } from './openssl'

const { version, dispatchKeyId, signingKeySize } = config

export default class DispatchKey {
  static async getEncryptKeyPair(keyId: number = dispatchKeyId): Promise<KeyPair> {
    return OpenSSL.getKeyPair(join(cwd(), `data/key/${keyId}`), 'encrypt')
  }

  static async getSigningKeyPair(keyId: number = dispatchKeyId): Promise<KeyPair> {
    return OpenSSL.getKeyPair(join(cwd(), `data/key/${keyId}`), 'signing', Math.min(signingKeySize, 2048)) // 3.0.5+ ua patch limit
  }

  static async getKeyPairs(keyId: number = dispatchKeyId): Promise<{ encrypt: KeyPair, signing: KeyPair }> {
    return {
      encrypt: await DispatchKey.getEncryptKeyPair(keyId),
      signing: await DispatchKey.getSigningKeyPair(keyId)
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