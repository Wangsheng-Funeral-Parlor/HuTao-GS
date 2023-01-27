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

  // auto patcher
  autoGamePatch: boolean
  gameDir: string | null

  // auto update
  hostUpdate: boolean
  updateURL: string | null

  // dispatch
  dispatchHost: string | null
  dispatchSeed: string
  dispatchRegion: string
  dispatchKeyId: number
  autoPatch: boolean
  usePassword: boolean

  // RSA key
  passwordKeySize: number
  serverKeySize: number

  // port binding
  dnsPort: number
  httpPort: number
  httpsPort: number
  recorderPort: number
  kcpPort: number[] | number

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
  version: '3.4.0',
  packetsToDump: [],

  autoGamePatch: false,
  gameDir: null,

  hostUpdate: false,
  updateURL: null,

  dispatchHost: null,
  dispatchSeed: null,
  dispatchRegion: 'OSREL',
  dispatchKeyId: 3,
  autoPatch: false,

  usePassword: false,
  passwordKeySize: 4096,
  serverKeySize: 2048,

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
  '1.4.50',
  '1.6.51', '2.0.0',
  '2.6.0',
  '2.7.0',
  '2.8.0',
  '2.8.50', '2.8.51', '2.8.52', '2.8.53', '2.8.54', '3.0.0',
  '3.0.50', '3.0.51', '3.0.52', '3.0.53', '3.1.0',
  '3.1.50', '3.1.51', '3.1.52', '3.1.53', '3.2.0',
  '3.3.0',
  '3.4.0'
]

logger.info('Loading config...')

const allConfigs = getJson('config.json', {})
const curConfigName = allConfigs.current || 'default'
const curConfig = allConfigs[curConfigName]

if (curConfig == null) logger.error('Config not found:', curConfigName)
else logger.info('Loaded config:', curConfigName)

const config: Config = Object.assign({}, DEFAULT_CONFIG, curConfig || {})

export const NO_CONFIG = curConfig == null
export const AVAILABLE_CONFIGS = Object.keys(getJson('config.json', {})).filter(k => k !== 'current')
export default config


