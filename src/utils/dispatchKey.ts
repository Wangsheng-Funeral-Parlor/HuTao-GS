import config from '@/config'
import { join } from 'path'
import { cwd } from 'process'
import { fileExists, readFile } from './fileSystem'
import OpenSSL from './openssl'

const { dispatchKeyId } = config

interface Key {
  pem: string
  xml: string
}

interface KeyPair {
  private: Key
  public: Key
}

export default class DispatchKey {
  private static async getKeyPair(privatePath: string, publicPath: string): Promise<KeyPair> {
    const priPem = (await readFile(privatePath)).toString()
    const pubPem = (await readFile(publicPath)).toString()

    const priXml = await OpenSSL.pemToXmlRsaPrivate(privatePath)
    const pubXml = await OpenSSL.pemToXmlRsaPublic(publicPath)

    return {
      private: {
        pem: priPem,
        xml: priXml
      },
      public: {
        pem: pubPem,
        xml: pubXml
      }
    }
  }

  static async getEncryptKeyPair(keyId: number = dispatchKeyId): Promise<KeyPair> {
    const privatePath = join(cwd(), `data/key/${keyId}`, 'encryptPrivate.pem')
    const publicPath = join(cwd(), `data/key/${keyId}`, 'encryptPublic.pem')

    // from global-metadata.dat
    if (!await fileExists(privatePath)) throw new Error('Encrypt private key missing.')
    if (!await fileExists(publicPath)) await OpenSSL.extractRsaPublicKey(privatePath, publicPath)

    return DispatchKey.getKeyPair(privatePath, publicPath)
  }

  static async getSigningKeyPair(keyId: number = dispatchKeyId): Promise<KeyPair> {
    const privatePath = join(cwd(), `data/key/${keyId}`, 'signingPrivate.pem')
    const publicPath = join(cwd(), `data/key/${keyId}`, 'signingPublic.pem')

    if (!await fileExists(privatePath)) await OpenSSL.generateRsaPrivateKey(privatePath, 2048)
    if (!await fileExists(publicPath)) await OpenSSL.extractRsaPublicKey(privatePath, publicPath)

    return DispatchKey.getKeyPair(privatePath, publicPath)
  }

  static async getKeyPairs(keyId: number = dispatchKeyId): Promise<{ encrypt: KeyPair, signing: KeyPair }> {
    return {
      encrypt: await DispatchKey.getEncryptKeyPair(keyId),
      signing: await DispatchKey.getSigningKeyPair(keyId)
    }
  }
}