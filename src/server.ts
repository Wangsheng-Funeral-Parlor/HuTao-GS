import GlobalState from '@/globalState'
import KcpServer from '@/kcpServer'
import { waitMs } from '@/utils/asyncWait'
import WebServer from '@/webServer'
import { mkdirSync, statSync } from 'fs'
import * as hostile from 'hostile'
import { join } from 'path'
import { PerformanceObserver } from 'perf_hooks'
import { cwd, execPath, exit } from 'process'
import config, { SUPPORT_REGIONS, SUPPORT_VERSIONS } from './config'
import DnsServer from './dnsServer'
import Logger from './logger'
import { patchGame, unpatchGame } from './tools/patcher'
import TLogger from './translate/tlogger'
import { cRGB } from './tty/utils'
import { Announcement } from './types/announcement'
import Update from './update'
import Authenticator from './utils/authenticator'
import { detachedSpawn, execCommand } from './utils/childProcess'
import { dirExists } from './utils/fileSystem'

const {
  serverName,
  version,
  autoGamePatch,
  gameDir,
  dispatchRegion,
  dispatchSeed,
  dispatchKeyId,
  autoPatch,
  httpPort,
  httpsPort,
  recorderPort,
  hosts
} = config

const requiredDirs = [
  // game resource
  'data/bin/' + version,
  'data/proto/' + version,
  'data/game/' + version,

  // RSA key
  'data/key',

  // log
  'data/log/server',
  'data/log/client',
  'data/log/dump',

  // user data
  'data/user',

  // windy
  'data/luac'
]

// dispatch RSA key
if (dispatchKeyId) requiredDirs.push('data/key/' + dispatchKeyId)

const welcomeAnnouncement: Announcement = {
  type: 2, // Game
  subtitle: 'Welcome',
  title: `Welcome to ${serverName}!`,
  banner: 'https://webstatic-sea.mihoyo.com/hk4e/announcement/img/banner/welcome.png',
  content: '<p style="white-space: pre-wrap;">Hello, have fun~~</p><img src="https://webstatic-sea.mihoyo.com/hk4e/announcement/img/fallen.png"><p style="white-space: pre-wrap;">Powered by: HuTao GS</p>',
  start: Date.now(),
  end: Date.now() + (365 * 24 * 60 * 60e3),
  tag: 3,
  loginAlert: true
}

const logger = new TLogger('SERVER')

export default class Server {
  observer: PerformanceObserver

  update: Update
  auth: Authenticator

  dnsServer: DnsServer
  webServer: WebServer
  kcpServer: KcpServer

  readyToStart: boolean

  constructor() {
    // Window title
    logger.write(`\x1b]0;${serverName}\x07`)

    // Start log capture
    Logger.startCapture()

    // Load global state
    GlobalState.load()

    // Server build info
    logger.info('message.server.info.name', cRGB(0xffffff, serverName))
    logger.info('message.server.info.build', cRGB(0xffffff, process.env.BUILD_INFO || 'development'))
    logger.info('message.server.info.gameVersion', cRGB(0xffffff, version))
    logger.info('message.server.info.dispatchRegion', cRGB(0xffffff, dispatchRegion))
    logger.info('message.server.info.dispatchSeed', cRGB(0xffffff, dispatchSeed))
    logger.info('message.server.info.dispatchKey', cRGB(0xffffff, dispatchKeyId?.toString()))
    logger.info('message.server.info.autoPatch', cRGB(0xffffff, autoPatch.toString()))
    logger.info('message.server.info.logLevel', cRGB(0xffffff, logger.getLogLevel().toString()))

    if (!SUPPORT_REGIONS.includes(dispatchRegion)) {
      logger.error('message.server.error.invalidRegion')
      return
    }

    if (!SUPPORT_VERSIONS.includes(version)) {
      logger.error('message.server.error.invalidVersion')
      return
    }

    this.checkDirs()

    this.observer = new PerformanceObserver(list => logger.performance(list))

    this.update = new Update(this)
    this.auth = new Authenticator('data/auth.json')

    this.dnsServer = new DnsServer(this)
    this.webServer = new WebServer(this)
    this.kcpServer = new KcpServer(this)

    this.webServer.announcements.push(welcomeAnnouncement)

    this.readyToStart = true
  }

  get announcements() {
    return this.webServer.announcements
  }

  async tryPatchGame() {
    if (!autoGamePatch || !await dirExists(gameDir)) return
    try {
      await patchGame(gameDir)
    } catch (err) {
      logger.error('message.server.error.patchGame', err)
    }
  }

  async tryUnpatchGame() {
    if (!autoGamePatch || !await dirExists(gameDir)) return
    try {
      await unpatchGame(gameDir)
    } catch (err) {
      logger.error('message.server.error.unpatchGame', err)
    }
  }

  async flushDNS(): Promise<void> {
    await execCommand('ipconfig /flushdns')
  }

  async setHosts(): Promise<void> {
    if (!hosts) return

    logger.debug('message.server.debug.setHost')

    for (const host of hosts) {
      for (let i = 1; i <= 10; i++) {
        try {
          hostile.set('127.0.0.1', host)
          break
        } catch (err) {
          // only throw error if all attempts failed
          if (i >= 10) {
            logger.error('message.server.error.setHost', err)
            this.restart(15e3)
            return
          }
        }
      }
    }

    logger.debug('message.server.debug.setHostSuccess')

    logger.debug('message.server.debug.flushDns')
    try {
      await this.flushDNS()
      logger.debug('message.server.debug.flushDnsSuccess')
    } catch (err) {
      logger.error('message.server.error.flushDns', err)
      this.restart(15e3)
    }
  }

  async removeHosts(): Promise<void> {
    if (!hosts) return

    logger.debug('message.server.debug.removeHost')

    for (const host of hosts) {
      for (let i = 1; i <= 10; i++) {
        try {
          hostile.remove('127.0.0.1', host)
          break
        } catch (err) {
          // only throw error if all attempts failed
          if (i >= 10) {
            logger.error('message.server.error.removeHost', err)
            this.restart(15e3)
            return
          }
        }
      }
    }

    logger.debug('message.server.debug.removeHostSuccess')

    logger.debug('message.server.debug.flushDns')
    try {
      await this.flushDNS()
      logger.debug('message.server.debug.flushDnsSuccess')
    } catch (err) {
      logger.error('message.server.error.flushDns', err)
      this.restart(15e3)
    }
  }

  async start(): Promise<void> {
    const { observer, dnsServer, webServer, kcpServer, readyToStart } = this
    if (!readyToStart) return

    observer.observe({ entryTypes: ['measure'], buffered: true })

    Logger.mark('Start')
    logger.info('message.server.info.starting')

    await this.setHosts()

    let listening = 0

    async function onListening(): Promise<void> {
      if (++listening < 3) return

      logger.info('message.server.info.started')
      Logger.measure('Server start', 'Start')
    }

    dnsServer.on('listening', onListening)
    webServer.on('listening', onListening)

    try {
      dnsServer.start()
      await webServer.start([
        { port: httpPort },
        { port: httpsPort, useHttps: true },
        { port: recorderPort }
      ])
      await kcpServer.start()
      await onListening()

      await this.tryPatchGame()
    } catch (err) {
      logger.error('message.server.error.start', err)
    }
  }

  async restart(delay: number = 1e3): Promise<void> {
    logger.info('message.server.info.restart', delay)

    await this.runShutdownTasks()
    await waitMs(delay)

    await detachedSpawn(execPath, process.argv.slice(1))
    exit()
  }

  async stop(delay: number = 1e3): Promise<void> {
    logger.info('message.server.info.stop', delay)

    await this.runShutdownTasks(true)
    await waitMs(delay)

    exit()
  }

  async runShutdownTasks(fullShutdown: boolean = false) {
    const { observer, dnsServer, webServer, kcpServer, readyToStart } = this
    if (!readyToStart) return // Can't shutdown if it never started in the first place...

    await kcpServer.stop()

    webServer.stop()
    dnsServer.stop()

    GlobalState.save()

    if (fullShutdown) {
      await this.removeHosts()
      await this.tryUnpatchGame()
    }

    observer.disconnect()

    await Logger.stopCapture(!!GlobalState.get('SaveLog'))
  }

  setLogLevel(level: number) {
    logger.setLogLevel(level)
  }

  checkDirs() {
    for (const path of requiredDirs) {
      try { if (statSync(join(cwd(), path))) continue } catch (err) { }
      try {
        logger.info('message.server.info.mkdir', path)
        mkdirSync(join(cwd(), path), { recursive: true })
      } catch (err) {
        logger.error('message.server.error.mkdir', err)
      }
    }
  }
}