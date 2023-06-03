export interface SocketContext {
  address: string
  port: number
  clientID: string
}

export interface CmdIds {
  version: string
  proto: {
    [packet: string]: number
  }
}

export interface PacketHead {
  packetId?: number
  rpcId?: number
  clientSequenceId?: number
  enetChannelId?: number
  enetIsReliable?: number
  sentMs?: number
  userId?: number
  userIp?: number
  userSessionId?: number
  recvTimeMs?: number
  rpcBeginTimeMs?: number
  extMap?: { [k: number]: number }
  senderAppId?: number
  sourceService?: number
  targetService?: number
  serviceAppIdMap?: { [k: number]: number }
  isSetGameThread?: boolean
  gameThreadIndex?: number
}
