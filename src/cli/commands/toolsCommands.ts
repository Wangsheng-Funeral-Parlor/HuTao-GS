import keyGen from '@/keyGen'
import { update } from '@/update'
import { CommandDefinition } from '.'

const toolsCommands: CommandDefinition[] = [
  {
    name: 'update',
    desc: 'Fetch new dispatch data',
    exec: () => update()
  },
  {
    name: 'keygen',
    desc: 'Attempt to generate key from packet dumps',
    exec: () => keyGen()
  }
]

export default toolsCommands