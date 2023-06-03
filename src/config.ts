import Logger from "./logger"

import { getJson } from "@/utils/json"

const logger = new Logger("CONFIG", 0xcacaff)

interface Config {
  dispatch: {
    autoPatch: boolean
    dispatchHost: string | null
    dispatchKeyId: number
    dispatchRegion: string
    dispatchSeed: string
    passwordKeySize: number
    serverKeySize: number
    usePassword: boolean
  }

  dns: {
    domains: { [domain: string]: string | null } // domain to ip map
    nameservers: string[] // ip list
  }

  // server
  game: {
    autoGamePatch: boolean
    serverName: string
    version: string
    eventlist: number[]
    gameDir: string | null
    hostIp: string
    packetsToDump: string[]
    sslDir: string
    serverAccount: {
      adventureRank: number
      avatarId: number
      nameCardId: number
      nickName: string
      signature: string
    }
    hosts: string[] | null
  }

  cleanWindyFile: boolean
  // auto update
  updateURL: string | null
  hostUpdate: boolean

  // port binding
  dnsPort: number
  httpPort: number
  httpsPort: number
  kcpPort: number[] | number
  recorderPort: number
  res_developer: { [data: string]: [costElemType: number, maxEnergy?: number, energyPercent?: number] }
}

export const DEFAULT_CONFIG: Config = {
  dispatch: {
    autoPatch: false,
    dispatchHost: null,
    dispatchKeyId: 5,
    dispatchRegion: "OSREL",
    dispatchSeed: null,
    passwordKeySize: 4096,
    serverKeySize: 2048,
    usePassword: false,
  },
  dns: {
    domains: {
      "hoyoverse.com": null,
      "mihoyo.com": null,
      "yuanshen.com": null,
    },
    nameservers: ["1.1.1.1", "1.0.0.1"],
  },
  game: {
    autoGamePatch: false,
    serverName: "HuTao-GS",
    version: "3.3.0",
    eventlist: [],
    gameDir: null,
    hostIp: "127.0.0.1",
    sslDir: "./ssl",
    packetsToDump: [],
    serverAccount: {
      adventureRank: 60,
      avatarId: 10000046,
      nameCardId: 210059,
      nickName: "HuTao-GS",
      signature: "Welcome to HuTao-GS!",
    },
    hosts: null,
  },
  cleanWindyFile: true,
  updateURL: null,
  hostUpdate: false,
  dnsPort: 53,
  httpPort: 80,
  httpsPort: 443,
  kcpPort: 22102,
  recorderPort: 8888,
  res_developer: {},
}

export const SUPPORT_REGIONS = ["OSREL", "OSCB", "CNCB"]

export const SUPPORT_VERSIONS = [
  "0.9.16", //not CBT3
  //cbt3 cannot be supported because it probably uses enet.
  "1.0.0",
  "1.1.0",
  "1.2.0",
  "1.3.0",
  "1.4.0",
  "1.4.50",
  "1.6.51",
  "2.6.0",
  "2.7.0",
  "2.8.0",
  "2.8.50",
  "2.8.51",
  "2.8.52",
  "2.8.53",
  "2.8.54",
  "3.0.0",
  "3.0.50",
  "3.0.51",
  "3.0.52",
  "3.0.53",
  "3.1.0",
  "3.1.50",
  "3.1.51",
  "3.1.52",
  "3.1.53",
  "3.2.0",
  "3.2.50",
  "3.2.51",
  "3.2.52",
  "3.2.53",
  "3.3.0",
  "3.3.50",
  "3.3.51",
  "3.3.52",
  "3.3.53",
  "3.3.54",
  "3.4.0",
  "3.5.0",
  "3.6.0",
  "3.7.0",
]

logger.info("Loading config...")

const allConfigs = getJson("config.json", {})
const curConfigName = allConfigs.current || "default"
const curConfig = allConfigs[curConfigName]

if (curConfig == null) logger.error("Config not found:", curConfigName)
else logger.info("Loaded config:", curConfigName)

const config: Config = Object.assign({}, DEFAULT_CONFIG, curConfig || {})

export const NO_CONFIG = curConfig == null
export const AVAILABLE_CONFIGS = Object.keys(getJson("config.json", {})).filter((k) => k !== "current")
export default config
