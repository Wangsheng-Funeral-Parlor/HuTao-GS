import * as fs from 'fs'
const { mkdir, readFile, writeFile } = fs.promises
import { join, resolve } from 'path'
import { exec } from 'child_process'
import { dirExists, fileExists } from '@/utils/fileSystem'
import Logger from '@/logger'
import config from '@/config'

const logger = new Logger('SSLGEN', 0xa0ff00)

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

const caCnfData = [
  '[req]',
  'distinguished_name = req_distinguished_name',
  'prompt = no',
  '[req_distinguished_name]',
  'C  = CN',
  'ST = Liyue',
  'L  = Liyue harbor',
  'O  = Wangsheng Funeral Parlor',
  'CN = HuTao CA'
].join('\n')

const srvCnfData = [
  '[req]',
  'distinguished_name = req_distinguished_name',
  'req_extensions     = req_ext',
  'prompt = no',
  '[req_distinguished_name]',
  'C   = CN',
  'ST  = 上海市',
  'O   = 上海米哈游网络科技股份有限公司',
  'CN  = mihoyo',
  '[req_ext]',
  'subjectAltName = @alt_names',
  'extendedKeyUsage = 1.3.6.1.5.5.7.3.1',
  '[alt_names]',
  'IP.1=' + config.hostIp,
  'DNS.1=mihoyo.com',
  'DNS.2=hoyoverse.com',
  'DNS.3=yuanshen.com',
  'DNS.4=*.mihoyo.com',
  'DNS.5=*.hoyoverse.com',
  'DNS.6=*.yuanshen.com'
].join('\n')

const caFiles = {
  caCnf: 'ca.cnf',
  caCrt: 'ca.crt',
  caKey: 'ca.key'
}

const srvFiles = {
  srvCnf: 'srv.cnf',
  srvCrt: 'srv.crt',
  srvCsr: 'srv.csr',
  srvKey: 'srv.key'
}

export default class SSL {
  workDir: string
  certPath: string
  keyPath: string

  constructor() {
    this.workDir = resolve(config.sslDir)
    this.certPath = join(this.workDir, srvFiles.srvCrt)
    this.keyPath = join(this.workDir, srvFiles.srvKey)
  }

  async checkOpenSSL() {
    logger.info('Checking OpenSSL installation...')

    try {
      if ((await execCommand('openssl version')).indexOf('OpenSSL') >= 0) return true
    } catch (err) {
      logger.error(err)
    }

    logger.error('OpenSSL not installed.')

    return false
  }

  async validateCaFiles() {
    const { workDir } = this

    logger.info('Validating ca files...')

    for (let key in caFiles) {
      if (!await fileExists(join(workDir, caFiles[key]))) {
        logger.warn('Missing ca files.')
        return false
      }
    }

    logger.info('Validation success.')

    return true
  }

  async validateSrvFiles() {
    const { workDir } = this

    logger.info('Validating srv files...')

    for (let key in srvFiles) {
      if (!await fileExists(join(workDir, srvFiles[key]))) {
        logger.warn('Missing srv files.')
        return false
      }
    }

    logger.info('Validation success.')

    return true
  }

  async mkdir() {
    const { workDir } = this
    if (await dirExists(workDir)) return

    logger.info('Creating ssl directory...')
    await mkdir(workDir, { recursive: true })
  }

  async generateCaFiles() {
    if (!await this.checkOpenSSL()) return false

    try {
      const { workDir } = this
      const { caCnf, caCrt, caKey } = caFiles
      const caCnfPath = join(workDir, caCnf)
      const caCrtPath = join(workDir, caCrt)
      const caKeyPath = join(workDir, caKey)

      await this.mkdir()

      logger.info('Generating ca files...')

      // create config if not exists
      if (!await fileExists(caCnfPath)) {
        logger.info(`Creating ${caCnf}...`)
        await writeFile(caCnfPath, caCnfData)
      } else {
        logger.info(`Found ${caCnf}.`)
      }

      logger.info(`Generating ${caKey}...`)
      await execCommand(`openssl genrsa -out "${caKeyPath}" 4096`)

      logger.info(`Generating ${caCrt}...`)
      await execCommand(`openssl req -x509 -new -nodes -key "${caKeyPath}" -sha256 -days 3650 -out "${caCrtPath}" -config "${caCnfPath}"`)

      if (!await this.generateSrvFiles()) return false
    } catch (err) {
      logger.error(err)
      return false
    }

    return true
  }

  async generateSrvFiles() {
    if (!await this.validateCaFiles()) return this.generateCaFiles()
    if (!await this.checkOpenSSL()) return false

    try {
      const { workDir } = this
      const { caCrt, caKey } = caFiles
      const { srvCnf, srvCrt, srvCsr, srvKey } = srvFiles
      const caCrtPath = join(workDir, caCrt)
      const caKeyPath = join(workDir, caKey)
      const srvCnfPath = join(workDir, srvCnf)
      const srvCrtPath = join(workDir, srvCrt)
      const srvCsrPath = join(workDir, srvCsr)
      const srvKeyPath = join(workDir, srvKey)

      logger.info('Generating srv files...')

      // create config if not exists
      if (!await fileExists(srvCnfPath)) {
        logger.info(`Creating ${srvCnf}...`)
        await writeFile(srvCnfPath, srvCnfData)
      } else {
        logger.info(`Found ${srvCnf}.`)
      }

      logger.info(`Generating ${srvKey}...`)
      await execCommand(`openssl genrsa -out "${srvKeyPath}" 4096`)

      logger.info(`Generating ${srvCsr}...`)
      await execCommand(`openssl req -new -utf8 -key "${srvKeyPath}" -out "${srvCsrPath}" -config "${srvCnfPath}"`)

      logger.info(`Generating ${srvCrt}...`)
      await execCommand(`openssl x509 -req -days 825 -in "${srvCsrPath}" -CA "${caCrtPath}" -CAkey "${caKeyPath}" -CAcreateserial -out "${srvCrtPath}" -extensions req_ext -extfile "${srvCnfPath}"`)
    } catch (err) {
      logger.error(err)
      return false
    }

    return true
  }

  async exportHttpsConfig() {
    const { certPath, keyPath } = this

    if (!await this.validateCaFiles()) {
      // missing ca files, regenerate ca & server files
      if (!await this.generateCaFiles()) return null
    } else if (!await this.validateSrvFiles()) {
      // missing server files, regenerate server files only
      if (!await this.generateSrvFiles()) return null
    }

    return {
      cert: await readFile(certPath),
      key: await readFile(keyPath)
    }
  }
}