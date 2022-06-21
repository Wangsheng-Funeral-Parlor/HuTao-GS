import util from 'util'
import BaseClass from '#/baseClass'
import CLI from '@/cli'
import { ChatInfo } from '@/types/game/chat'
import ChatChannel from './chatChannel'
import { noColor } from '@/tty'
import { waitMs } from '@/utils/asyncWait'
import { getTimeSeconds } from '@/utils/time'

export default class CommandHandler extends BaseClass {
  channel: ChatChannel
  printBuffer: string[]

  constructor(channel: ChatChannel) {
    super()

    this.channel = channel
    this.printBuffer = []

    super.initHandlers(channel)
  }

  print(...args: any[]) {
    this.printBuffer.push(util.format(...args))
  }

  printError(...args: any[]) {
    args.unshift('Error:')
    this.print(...args)
  }

  async handleMessage(chatInfo: ChatInfo): Promise<void> {
    const { channel, printBuffer } = this
    const { game } = channel.chatManager
    const { uid, sequence, text } = chatInfo
    const player = game.getPlayerByUid(uid)

    if (!player || !text || text.indexOf(CLI.prefix) !== 0) return

    const err = CLI.execCommand(text.slice(1), {
      cli: {
        print: this.print.bind(this),
        printError: this.printError.bind(this)
      },
      kcpServer: game.server,
      sender: player
    })
    if (err) this.printError(...err)

    await waitMs(500)

    this.channel.send(player, {
      time: getTimeSeconds(),
      uid: 1,
      sequence: sequence + 1,
      text: noColor(printBuffer.splice(0).join('\n'))
    })
  }
}