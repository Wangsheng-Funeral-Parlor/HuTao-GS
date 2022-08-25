import { getJson } from '@/utils/json'
import Logger from './logger'

const logger = new Logger('CONFIG', 0xcacaff)

interface Config {
  // server
  serverName: string
  hostIp: string
  sslDir: string
  version: string
  packetsToDump: string[]

  // auto update
  hostUpdate: boolean
  updateURL: string | null

  // dispatch
  dispatchHost: string | null
  dispatchSeed: string
  dispatchRegion: string
  dispatchKeyId: number
  signingKeySize: number
  autoPatch: boolean

  // port binding
  dnsPort: number
  httpPort: number
  httpsPort: number
  recorderPort: number
  kcpPort: number

  // dns server
  domains: { [domain: string]: string | null } // domain to ip map
  nameservers: string[] // ip list

  // host file
  hosts: string[] | null // host list
}

export const DEFAULT_CONFIG: Config = {
  serverName: 'HuTao GS',
  hostIp: '127.0.0.1',
  sslDir: './ssl',
  version: '2.7.0',
  packetsToDump: [],

  hostUpdate: false,
  updateURL: null,

  dispatchHost: null,
  dispatchSeed: null,
  dispatchRegion: 'OSREL',
  dispatchKeyId: 3,
  signingKeySize: 2048,
  autoPatch: false,

  dnsPort: 53,
  httpPort: 80,
  httpsPort: 443,
  recorderPort: 8888,
  kcpPort: 22102,

  domains: {
    'yuanshen.com': null,
    'mihoyo.com': null,
    'hoyoverse.com': null
  },
  nameservers: ['1.1.1.1', '1.0.0.1'],

  hosts: null
}

export const SUPPORT_REGIONS = [
  'OSREL',
  'OSCB',
  'CNCB'
]

export const SUPPORT_VERSIONS = [
  '1.6.51', '2.6.0', '2.7.0',
  '2.8.0', '2.8.50', '2.8.51',
  '2.8.52', '2.8.53', '2.8.54',
  '3.0.0', '3.0.50'
]

logger.info('Loading config...')

const allConfigs = getJson('config.json', {})
const curConfigName = allConfigs.current || 'default'
const curConfig = allConfigs[curConfigName]

if (curConfig == null) logger.error('Config not found:', curConfigName)
else logger.info('Loaded config:', curConfigName)

const config: Config = Object.assign({}, DEFAULT_CONFIG, curConfig || {})

export default config