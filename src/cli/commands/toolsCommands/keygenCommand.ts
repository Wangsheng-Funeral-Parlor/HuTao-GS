import keyGen from '@/tools/keyGen'
import { CommandDefinition } from '..'

const keygenCommand: CommandDefinition = {
  name: 'keygen',
  exec: async () => keyGen()
}

export default keygenCommand