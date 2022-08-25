import config, { DEFAULT_CONFIG } from '@/config'
import { CmdIds } from '@/types/kcp'
import ver1_6_51 from './ver1_6_51'
import ver2_6 from './ver2_6'
import ver2_7 from './ver2_7'
import ver2_8 from './ver2_8'
import ver2_8_50 from './ver2_8_50'

const versionMap: { [version: string]: CmdIds } = {
  '1.6.51': ver1_6_51,
  '2.6.0': ver2_6,
  '2.7.0': ver2_7,
  '2.8.0': ver2_8,
  '2.8.50': ver2_8_50,
  '2.8.51': ver2_8_50,
  '2.8.52': ver2_8_50,
  '2.8.53': ver2_8_50,
  '2.8.54': ver2_8_50,
  '3.0.0': ver2_8,
  '3.0.50': ver2_8
}

export const cmdIds: CmdIds = versionMap[config.version] || versionMap[DEFAULT_CONFIG.version] || {}
export const switchedCmdIds = Object.fromEntries(
  Object.entries(cmdIds)
    .map(e => [e[1], e[0]])
)

export const PACKET_HEAD = 0xFFFF

export const getNameByCmdId = (cmdId: number | string): number | string => {
  if (cmdId === PACKET_HEAD) return 'PacketHead'

  const name = switchedCmdIds[cmdId]
  if (name == null) return cmdId

  return name
}

export const getCmdIdByName = (protoName: string | number): number | string => {
  if (protoName === 'PacketHead') return PACKET_HEAD

  const id = cmdIds[protoName]
  if (id == null) return protoName

  return id
}