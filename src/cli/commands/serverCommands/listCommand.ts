import { CommandDefinition } from '..'

const listCommand: CommandDefinition = {
  name: 'list',
  desc: 'List connected clients',
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { cli, kcpServer } = cmdInfo
    const { print } = cli
    const { clientList } = kcpServer
    const lines = []

    for (const client of clientList) {
      lines.push(`${client.uid?.toString()?.padStart(6, '0') || '------'}|${client.state?.toString(16)?.padStart(4, '0')?.toUpperCase()}|${client.conv?.toString(16)?.padStart(8, '0')?.toUpperCase()}`)
    }

    if (lines.length === 0) lines.push('Empty.')

    const maxLength = Math.max(...lines.map(line => line.length))

    print('='.repeat(maxLength))
    print(' UID  | CS | ID')
    print('='.repeat(maxLength))
    for (const line of lines) print(line)
    print('='.repeat(maxLength))
  }
}

export default listCommand