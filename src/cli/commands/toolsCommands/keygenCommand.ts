import keyGen from '@/tools/keyGen'
import { CommandDefinition } from '..'

const keygenCommand: CommandDefinition = {
  name: 'keygen',
  desc: 'Attempt to generate key from packet dumps',
  exec: async () => keyGen()
}

export default keygenCommand