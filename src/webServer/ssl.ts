import config from '@/config'
import Logger from '@/logger'
import { dirExists, fileExists, mkdir, readFile, writeFile } from '@/utils/fileSystem'
import OpenSSL from '@/utils/openssl'
import { join, resolve } from 'path'

const logger = new Logger('SSLGEN', 0xa0ff00)

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
    if (!await OpenSSL.isInstalled()) return false

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
      await OpenSSL.generateRsaPrivateKey(caKeyPath, 4096)

      logger.info(`Generating ${caCrt}...`)
      await OpenSSL.generateRootCaCert(caKeyPath, caCnfPath, caCrtPath)

      if (!await this.generateSrvFiles()) return false
    } catch (err) {
      logger.error(err)
      return false
    }

    return true
  }

  async generateSrvFiles() {
    if (!await this.validateCaFiles()) return this.generateCaFiles()
    if (!await OpenSSL.isInstalled()) return false

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
      await OpenSSL.generateRsaPrivateKey(srvKeyPath, 4096)

      logger.info(`Generating ${srvCsr}...`)
      await OpenSSL.generateCsr(srvKeyPath, srvCnfPath, srvCsrPath)

      logger.info(`Generating ${srvCrt}...`)
      await OpenSSL.generateCert(srvCsrPath, caCrtPath, caKeyPath, srvCnfPath, srvCrtPath)
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