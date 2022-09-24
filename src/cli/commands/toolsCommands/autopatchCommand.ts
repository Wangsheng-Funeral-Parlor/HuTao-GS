import { update } from '@/tools/autoPatch'
import { CommandDefinition } from '..'

const autopatchCommand: CommandDefinition = {
  name: 'autopatch',
  desc: 'Fetch autopatch data',
  exec: async () => update()
}

export default autopatchCommand