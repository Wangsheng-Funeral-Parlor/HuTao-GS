export interface RecorderLog {
  [name: string]: RecorderLogUser
}

export interface RecorderLogData {
  userName: string
  time: string
  frame: string
  stackTrace: string
  logStr: string
  logType: string
  deviceName: string
  deviceModel: string
  operatingSystem: string
  version: string
  exceptionSerialNum: string
  pos: string
  guid: string
  errorCode: string
  errorCodeToPlatform: number
  serverName: string
  subErrorCode: number
  uid: number
  cpuInfo: string
  gpuInfo: string
  memoryInfo: string
  clientIp: string
  errorLevel: string
  errorCategory: string
  notifyUserName: string
  auid: string
  buildUrl: string
}

export interface RecorderLogEntry {
  time: string
  frame: string
  stackTrace: string
  logStr: string
  logType: string
  deviceName: string
  deviceModel: string
  operatingSystem: string
  version: string
  exceptionSerialNum: string
  pos: string
  guid: string
  errorCode: string
  errorCodeToPlatform: number
  subErrorCode: number
  cpuInfo: string
  gpuInfo: string
  memoryInfo: string
  clientIp: string
  errorLevel: string
  errorCategory: string
}

export interface RecorderLogPlayer {
  auid: string
  uid: number
  entryList: RecorderLogEntry[]
}

export interface RecorderLogUser {
  name: string
  playerMap: { [auid: string]: RecorderLogPlayer }
}