import config from '@/config'
import { patchGame, unpatchGame } from '@/tools/patcher'
import { CommandDefinition } from '..'

const gpatchCommand: CommandDefinition = {
  name: 'gpatch',
  desc: 'Game patching tools',
  usage: [
    'gpatch patch <gameDir>   - Patch metadata & ua with backup in game directory',
    'gpatch patch             - Same but gameDir is set to config.gameDir',
    'gpatch unpatch <gameDir> - Unpatch metadata & ua from backup in game directory',
    'gpatch unpatch           - Same but gameDir is set to config.gameDir'
  ],
  args: [
    { name: 'mode', type: 'str', values: ['patch', 'unpatch'] },
    { name: 'gameDir', type: 'str', optional: true }
  ],
  exec: async (cmdInfo) => {
    const { args, cli } = cmdInfo
    const { print, printError } = cli

    const [mode, gameDir] = args
    try {
      switch (mode) {
        case 'patch':
          await patchGame(gameDir || config.gameDir)
          break
        case 'unpatch':
          await unpatchGame(gameDir || config.gameDir)
          break
        default:
          throw new Error(`Unknown mode: ${mode}`)
      }
      print('Success')
    } catch (err) {
      printError((<Error>err).message || 'Unknown error')
    }
  }
}

export default gpatchCommand