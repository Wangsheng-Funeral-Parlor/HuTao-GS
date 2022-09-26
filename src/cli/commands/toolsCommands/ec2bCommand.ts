import { dumpEc2bKey } from '@/tools/ec2b'
import { CommandDefinition } from '..'

const ec2bCommand: CommandDefinition = {
  name: 'ec2b',
  args: [
    { name: 'ver', type: 'str' },
    { name: 'name', type: 'str' }
  ],
  exec: async (cmdInfo) => {
    const { args, cli } = cmdInfo
    const { print } = cli

    const [ver, name] = args
    const key = await dumpEc2bKey(ver, name)
    print(key.toString('hex'))
  }
}

export default ec2bCommand