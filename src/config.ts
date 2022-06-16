import { getJson } from '@/utils/json'

interface Config {
  // server
  serverName: string
  hostIp: string
  sslDir: string
  version: string

  // dispatch
  dispatchHost: string | null
  dispatchSeed: string

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

  dispatchHost: null,
  dispatchSeed: null,

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

export const SUPPORT_VERSIONS = [
  '1.5.0',
  '2.6.0',
  '2.7.0'
]

const config: Config = getJson('config.json', DEFAULT_CONFIG)

export default config