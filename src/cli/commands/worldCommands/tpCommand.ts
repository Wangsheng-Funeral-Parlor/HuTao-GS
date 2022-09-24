import Vector from '$/utils/vector'
import { SceneEnterReasonEnum, SceneEnterTypeEnum } from '@/types/proto/enum'
import { CommandDefinition } from '..'

const tpCommand: CommandDefinition = {
  name: 'tp',
  desc: 'Teleport to location',
  usage: [
    'tp <x> <y> <z> <uid> - Teleport player to location',
    'tp <x> <y> <z>       - (In game) Teleport yourself to location'
  ],
  args: [
    { name: 'x', type: 'int' },
    { name: 'y', type: 'int' },
    { name: 'z', type: 'int' },
    { name: 'uid', type: 'int', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const player = kcpServer.game.getPlayerByUid(args[3] || sender?.uid)

    if (!player) return printError('Player not found.')

    const { currentScene, context } = player
    if (!currentScene) return printError('Not in scene.')

    const x = args[0]
    const y = args[1]
    const z = args[2]

    print('Teleport to:', x, y, z)

    currentScene.join(context, new Vector(x, y, z), new Vector(), SceneEnterTypeEnum.ENTER_GOTO, SceneEnterReasonEnum.TRANS_POINT)
  }
}

export default tpCommand