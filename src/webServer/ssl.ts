import config from '@/config'
import TLogger from '@/translate/tlogger'
import { dirExists, fileExists, mkdir, readFile, writeFile } from '@/utils/fileSystem'
import OpenSSL from '@/utils/openssl'
import { join, resolve } from 'path'

const logger = new TLogger('SSLGEN', 0xa0ff00)

const domains = Object.keys(config.domains)

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
  ...domains.map((d, i) => `DNS.${i + 1}=${d}`),
  ...domains.map((d, i) => `DNS.${domains.length + i + 1}=*.${d}`)
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
  caPath: string
  certPath: string
  keyPath: string

  constructor() {
    this.workDir = resolve(config.sslDir)
    this.caPath = join(this.workDir, caFiles.caCrt)
    this.certPath = join(this.workDir, srvFiles.srvCrt)
    this.keyPath = join(this.workDir, srvFiles.srvKey)
  }

  async validateCaFiles() {
    const { workDir } = this

    logger.info('message.ssl.info.checkCA')

    for (const key in caFiles) {
      if (!await fileExists(join(workDir, caFiles[key]))) {
        logger.warn('message.ssl.warn.checkCAFail')
        return false
      }
    }

    logger.info('message.ssl.info.checkSuccess')

    return true
  }

  async validateSrvFiles() {
    const { workDir } = this

    logger.info('message.ssl.info.checkSRV')

    for (const key in srvFiles) {
      if (!await fileExists(join(workDir, srvFiles[key]))) {
        logger.warn('message.ssl.warn.checkSRVFail')
        return false
      }
    }

    logger.info('message.ssl.info.checkSuccess')

    return true
  }

  async mkdir() {
    const { workDir } = this
    if (await dirExists(workDir)) return

    logger.info('message.ssl.info.mkdir')
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

      logger.info('message.ssl.info.generateCA')

      // create config if not exists
      if (!await fileExists(caCnfPath)) {
        logger.info('message.ssl.info.create', caCnf)
        await writeFile(caCnfPath, caCnfData)
      } else {
        logger.info('message.ssl.info.found', caCnf)
      }

      logger.info('message.ssl.info.generate', caKey)
      await OpenSSL.generateRsaPrivateKey(caKeyPath, 4096)

      logger.info('message.ssl.info.generate', caCrt)
      await OpenSSL.generateRootCaCert(caKeyPath, caCnfPath, caCrtPath)

      if (!await this.generateSrvFiles()) return false
    } catch (err) {
      logger.error('generic.param1', err)
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

      logger.info('message.ssl.info.generateSRV')

      // create config if not exists
      if (!await fileExists(srvCnfPath)) {
        logger.info('message.ssl.info.create', srvCnf)
        await writeFile(srvCnfPath, srvCnfData)
      } else {
        logger.info('message.ssl.info.found', srvCnf)
      }

      logger.info('message.ssl.info.generate', srvKey)
      await OpenSSL.generateRsaPrivateKey(srvKeyPath, 4096)

      logger.info('message.ssl.info.generate', srvCsr)
      await OpenSSL.generateCsr(srvKeyPath, srvCnfPath, srvCsrPath)

      logger.info('message.ssl.info.generate', srvCrt)
      await OpenSSL.generateCert(srvCsrPath, caCrtPath, caKeyPath, srvCnfPath, srvCrtPath)
    } catch (err) {
      logger.error('generic.param1', err)
      return false
    }

    return true
  }

  async exportHttpsConfig() {
    const { caPath, certPath, keyPath } = this

    if (!await this.validateCaFiles()) {
      // missing ca files, regenerate ca & server files
      if (!await this.generateCaFiles()) return null
    } else if (!await this.validateSrvFiles()) {
      // missing server files, regenerate server files only
      if (!await this.generateSrvFiles()) return null
    }

    return {
      ca: await readFile(caPath),
      cert: await readFile(certPath),
      key: await readFile(keyPath)
    }
  }
}