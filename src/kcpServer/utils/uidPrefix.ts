import Client from '#/client'
import Player from '$/player'
import { cRGB } from '@/tty/utils'

export default function uidPrefix(prefix: string, target: Client | Player, color: number = 0xffffff) {
  return `[${cRGB(color, prefix)}|${cRGB(0xa0a0a0, target.uid?.toString()?.padStart(6, '0') || '------')}]`
}