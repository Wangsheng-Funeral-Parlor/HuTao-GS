import { update } from '@/tools/autoPatch'
import { CommandDefinition } from '..'

const autopatchCommand: CommandDefinition = {
  name: 'autopatch',
  exec: async () => update()
}

export default autopatchCommand