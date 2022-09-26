import Vector from '$/utils/vector'
import translate from '@/translate'
import { SceneEnterReasonEnum, SceneEnterTypeEnum } from '@/types/proto/enum'
import { CommandDefinition } from '..'

const tpCommand: CommandDefinition = {
  name: 'tp',
  usage: 2,
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

    if (!player) return printError(translate('generic.playerNotFound'))

    const { currentScene, context } = player
    if (!currentScene) return printError(translate('generic.notInScene'))

    const x = args[0]
    const y = args[1]
    const z = args[2]

    print(translate('cli.commands.tp.info.tp', x, y, z))

    currentScene.join(context, new Vector(x, y, z), new Vector(), SceneEnterTypeEnum.ENTER_GOTO, SceneEnterReasonEnum.TRANS_POINT)
  }
}

export default tpCommand