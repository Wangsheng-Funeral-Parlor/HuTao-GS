import { randomBytes } from "crypto"
import { join } from "path"
import { cwd } from "process"

import { compare, hash } from "bcryptjs"

import { getJsonAsync, setJsonAsync } from "./json"
import OpenSSL from "./openssl"
import { rsaDecrypt } from "./rsa"

import config from "@/config"
import translate from "@/translate"
import TError from "@/translate/terror"

const TOKEN_TTL = 1209600e3

const { usePassword, passwordKeySize } = config.dispatch

export interface AccountData {
  uid: number
  name: string
  passwordHash: string
  tokens: { [token: string]: number }
}

export interface AuthResponse {
  success: boolean
  message: string
  uid?: number
  name?: string
  token?: string
}

/** Super insecure authentication system™ */
export default class Authenticator {
  dataPath: string

  constructor(dataPath: string) {
    this.dataPath = dataPath
  }

  private async randBytes(size: number): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      randomBytes(size, (err, buf) => {
        if (err) return reject(err)
        resolve(buf)
      })
    })
  }

  private async randNumber(): Promise<number> {
    return (await this.randBytes(4))?.readUInt32LE()
  }

  async register(name: string, pass: string): Promise<AuthResponse> {
    const { dataPath } = this
    const accounts: AccountData[] = await getJsonAsync(dataPath, [])

    if (accounts.find((acc) => acc?.name === name)) {
      return {
        success: false,
        message: translate("message.authenticator.api.accountExists"),
      }
    }

    let uid: number
    let attempt = 0
    while (true) {
      uid = await this.randNumber()
      if (uid == null || attempt >= 50) throw new TError("message.authenticator.error.generateUidFail")
      if (accounts.find((acc) => acc?.uid === uid) == null) break
      attempt++
    }

    accounts.push({
      uid,
      name,
      passwordHash: await hash(pass, 10),
      tokens: {},
    })

    await setJsonAsync(dataPath, accounts)

    return {
      success: true,
      message: "OK",
      uid,
      name,
    }
  }

  async login(name: string, pass: string, isCrypto = false): Promise<AuthResponse> {
    if (isCrypto && usePassword) {
      try {
        const passwordKeyPair = await OpenSSL.getKeyPair(join(cwd(), "data/key"), "password", passwordKeySize)
        pass = rsaDecrypt(passwordKeyPair.private, Buffer.from(pass, "base64")).toString("utf8")
      } catch (err) {
        return {
          success: false,
          message: err?.message || translate("message.authenticator.api.decryptFail"),
        }
      }
    }

    const { dataPath } = this
    const accounts: AccountData[] = await getJsonAsync(dataPath, [])
    const account = accounts.find((acc) => acc?.name === name)
    const { uid, passwordHash, tokens } = account || {}

    if (
      uid == null ||
      passwordHash == null ||
      tokens == null ||
      (usePassword && !(await compare(pass, passwordHash)))
    ) {
      return {
        success: false,
        message: translate("message.authenticator.api.invalidCredentials"),
      }
    }

    const token = (await this.randBytes(24)).toString("base64").replace(/=/g, "")
    tokens[token] = Date.now()

    await setJsonAsync(dataPath, accounts)

    return {
      success: true,
      message: "OK",
      uid,
      name,
      token,
    }
  }

  async verify(uid: number, token: string): Promise<AuthResponse> {
    token = token?.replace(/=/g, "")

    const { dataPath } = this
    const accounts: AccountData[] = await getJsonAsync(dataPath, [])
    const account = accounts.find((acc) => acc?.uid === uid)
    const { name, tokens } = account || {}

    if (tokens != null) {
      let modified = false
      for (const t in tokens) {
        if (Date.now() - tokens[t] <= TOKEN_TTL) continue
        delete tokens[t]
        modified = true
      }

      if (modified) await setJsonAsync(dataPath, accounts)
    }

    if (name == null || tokens?.[token] == null) {
      return {
        success: false,
        message: translate("message.authenticator.api.invalidToken"),
      }
    }

    if (tokens[token] < 0) delete tokens[token]
    else tokens[token] = Date.now()

    await setJsonAsync(dataPath, accounts)

    return {
      success: true,
      message: "OK",
      uid,
      name,
      token,
    }
  }
}
