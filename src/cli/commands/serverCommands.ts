import Server from '@/server'
import { noColor } from '@/tty'
import commands, { CommandDefinition, helpFormatCommand } from '.'
import CLI from '..'

const helpMaxCmdPerPage = 10

const serverCommands: CommandDefinition[] = [
  {
    name: 'help',
    desc: 'List commands info',
    args: [
      { name: 'page', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: async (cmdInfo) => {
      const { args, cli, sender } = cmdInfo
      const { print, printError } = cli

      if (sender) {
        print('Please visit announcement for list of commands.')
        return
      }

      const allowedCommands = commands
        .filter(cmd => !cmd.onlyAllowPlayer)

      const page = args[0] || 1
      const pageCount = Math.floor((allowedCommands.length - 1) / helpMaxCmdPerPage) + 1

      if (pageCount <= 0) return
      if (page < 1 || page > pageCount) return printError(`Page out of range (1-${pageCount}): ${page}`)

      const lines = allowedCommands
        .filter((_cmd, i) => Math.floor(i / helpMaxCmdPerPage) + 1 === page)
        .map(cmd => helpFormatCommand(cmd))
      const maxLength = Math.max(...lines.map(l => noColor(l).length))
      const head = `[HELP][${page}/${pageCount}]`

      print(`${head}${'='.repeat(maxLength - head.length)}`)
      for (const line of lines) print(line)
      print('='.repeat(maxLength))
    }
  },
  {
    name: 'stop',
    desc: 'Stop server',
    exec: async (cmdInfo) => {
      const { cli, server } = cmdInfo as { cli: CLI, server: Server }
      cli.stop()
      await server.stop()
    }
  },
  {
    name: 'restart',
    desc: 'Restart server',
    exec: async (cmdInfo) => {
      const { cli, server } = cmdInfo as { cli: CLI, server: Server }
      cli.stop()
      await server.restart()
    }
  },
  {
    name: 'update',
    desc: 'Update server',
    exec: async (cmdInfo) => {
      await cmdInfo.server.update.start()
    }
  },
  {
    name: 'list',
    desc: 'List connected clients',
    allowPlayer: true,
    exec: async (cmdInfo) => {
      const { cli, kcpServer } = cmdInfo
      const { print } = cli
      const { clients } = kcpServer
      const lines = []

      for (const clientID in clients) {
        const client = clients[clientID]
        lines.push(`${client.uid?.toString()?.padStart(6, '0') || '------'}|${client.state.toString(16).padStart(4, '0').toUpperCase()}|${clientID}`)
      }

      if (lines.length === 0) {
        print('Empty.')
        return
      }

      const maxLength = Math.max(...lines.map(line => line.length))

      print('='.repeat(maxLength))
      print(' UID  | CS | clientID')
      print('='.repeat(maxLength))
      for (const line of lines) print(line)
      print('='.repeat(maxLength))
    }
  },
  {
    name: 'disconnect',
    desc: 'Disconnect client',
    args: [
      { name: 'clientID|uid' },
      { name: 'reason', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: async (cmdInfo) => {
      const { args, cli, kcpServer } = cmdInfo
      cli.print('Attempt to disconnect:', args[0])
      if (args[0].indexOf('_') === -1) kcpServer.disconnectUid(parseInt(args[0]), args[1])
      else kcpServer.disconnect(args[0], args[1])
    }
  },
  {
    name: 'run',
    desc: 'Windy',
    args: [
      { name: 'script', type: 'str' },
      { name: 'uid', type: 'int' }
    ],
    exec: async (cmdInfo) => {
      const { args, cli, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[1])

      if (!player) {
        printError('Player not found.')
        return
      }

      if (await player.windyRce(args[0])) print('Sending script to client.')
      else printError('Script not found.')
    }
  }
]

export default serverCommands