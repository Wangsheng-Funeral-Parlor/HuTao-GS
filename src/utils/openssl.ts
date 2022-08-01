import Logger from '@/logger'
import { exec } from 'child_process'

const logger = new Logger('OPNSSL', 0x730c0a)

function execCommand(cmd: string): Promise<string> {
  return new Promise((res, rej) => {
    const cp = exec(cmd)
    let buffer = ''
    cp.stdout.setEncoding('utf8')
    cp.stdout.on('data', data => buffer += data)
    cp.on('exit', () => res(buffer))
    cp.on('error', (err) => rej(err))
  })
}

function trimBuffer(buf: Buffer): Buffer {
  let i = 0
  while (buf[i] === 0) i++
  return buf.subarray(i)
}

export default class OpenSSL {
  private static parseText(txt: string): { [key: string]: string } {
    const lines = txt.split('\n')
    const output = {}

    let lastKey = null
    for (const line of lines) {
      const keyMatch = line.match(/^[a-zA-Z]([a-zA-Z\d\s])*?:/)

      let key: string = keyMatch?.[0]
      let val = line.trim()
      if (key == null) {
        if (lastKey == null) continue
        key = lastKey
      } else {
        val = line.slice(key.length).trim()

        key = key[0].toUpperCase() + key.slice(1, -1)
        lastKey = key
      }

      if (val.length === 0) continue

      if (output[key] == null) output[key] = val
      else output[key] += val
    }

    return output
  }

  static async isInstalled() {
    logger.debug('Checking OpenSSL installation...')

    try {
      if ((await execCommand('openssl version')).indexOf('OpenSSL') >= 0) return true
    } catch (err) {
      logger.error(err)
    }

    logger.error('OpenSSL not installed.')
    return false
  }

  static async generateRsaPrivateKey(out: string, size: number = 2048) {
    await execCommand(`openssl genrsa -out "${out}" ${size}`)
  }

  static async generateRootCaCert(key: string, cnf: string, out: string) {
    await execCommand(`openssl req -x509 -new -nodes -key "${key}" -sha256 -days 3650 -config "${cnf}" -out "${out}"`)
  }

  static async generateCert(csr: string, ca: string, caKey: string, cnf: string, out: string) {
    await execCommand(`openssl x509 -req -days 825 -in "${csr}" -CA "${ca}" -CAkey "${caKey}" -CAcreateserial -out "${out}" -extensions req_ext -extfile "${cnf}"`)
  }

  static async generateCsr(key: string, cnf: string, out: string) {
    await execCommand(`openssl req -new -utf8 -key "${key}" -config "${cnf}" -out "${out}"`)
  }

  static async extractRsaPublicKey(inp: string, out: string) {
    await execCommand(`openssl rsa -in "${inp}" -pubout -out "${out}"`)
  }

  static async pemToXmlRsaPrivate(inp: string): Promise<string> {
    const {
      Modulus,
      PublicExponent,
      Prime1, Prime2,
      Exponent1, Exponent2,
      Coefficient,
      PrivateExponent
    } = OpenSSL.parseText(await execCommand(`openssl rsa -in "${inp}" -text -noout`))

    if (
      Modulus == null ||
      PublicExponent == null ||
      Prime1 == null || Prime2 == null ||
      Exponent1 == null || Exponent2 == null ||
      Coefficient == null ||
      PrivateExponent == null
    ) throw new Error('Invalid private key.')

    // convert to buffer
    let m = Buffer.from(Modulus.split(':').join(''), 'hex')
    let e = Buffer.from((PublicExponent.match(/0x\d+/)?.[0]?.slice(2) || '').padStart(8, '0'), 'hex')
    let p = Buffer.from(Prime1.split(':').join(''), 'hex')
    let q = Buffer.from(Prime2.split(':').join(''), 'hex')
    let dp = Buffer.from(Exponent1.split(':').join(''), 'hex')
    let dq = Buffer.from(Exponent2.split(':').join(''), 'hex')
    let iq = Buffer.from(Coefficient.split(':').join(''), 'hex')
    let d = Buffer.from(PrivateExponent.split(':').join(''), 'hex')

    // remove high order zeros
    m = trimBuffer(m)
    e = trimBuffer(e)
    p = trimBuffer(p)
    q = trimBuffer(q)
    dp = trimBuffer(dp)
    dq = trimBuffer(dq)
    iq = trimBuffer(iq)
    d = trimBuffer(d)

    // conver to base64
    const M = m.toString('base64')
    const E = e.toString('base64')
    const P = p.toString('base64')
    const Q = q.toString('base64')
    const DP = dp.toString('base64')
    const DQ = dq.toString('base64')
    const IQ = iq.toString('base64')
    const D = d.toString('base64')

    return `<RSAKeyValue><Modulus>${M}</Modulus><Exponent>${E}</Exponent><P>${P}</P><Q>${Q}</Q><DP>${DP}</DP><DQ>${DQ}</DQ><InverseQ>${IQ}</InverseQ><D>${D}</D></RSAKeyValue>`
  }

  static async pemToXmlRsaPublic(inp: string): Promise<string> {
    const {
      Modulus,
      Exponent
    } = OpenSSL.parseText(await execCommand(`openssl rsa -pubin -in "${inp}" -text -noout`))

    if (
      Modulus == null ||
      Exponent == null
    ) throw new Error('Invalid public key.')

    // convert to buffer
    let m = Buffer.from(Modulus.split(':').join(''), 'hex')
    let e = Buffer.from((Exponent.match(/0x\d+/)?.[0]?.slice(2) || '').padStart(8, '0'), 'hex')

    // remove high order zeros
    m = trimBuffer(m)
    e = trimBuffer(e)

    // conver to base64
    const M = m.toString('base64')
    const E = e.toString('base64')

    return `<RSAKeyValue><Modulus>${M}</Modulus><Exponent>${E}</Exponent></RSAKeyValue>`
  }
}