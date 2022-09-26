import Gadget from '$/entity/gadget'
import translate from '@/translate'
import { CommandDefinition } from '..'

const gadgetCommand: CommandDefinition = {
  name: 'gadget',
  usage: 2,
  args: [
    { name: 'id', type: 'int' },
    { name: 'lv', type: 'int' },
    { name: 'uid', type: 'int', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const player = kcpServer.game.getPlayerByUid(args[2] || sender?.uid)

    if (!player) return printError(translate('generic.playerNotFound'))

    const { currentScene, pos } = player
    if (!currentScene || !pos) return printError(translate('generic.playerNoPos'))

    print(translate('cli.commands.gadget.info.spawn', args[0]))

    const entity = new Gadget(args[0])

    entity.motion.pos.copy(pos)
    entity.bornPos.copy(pos)

    await entity.initNew(args[1])
    await currentScene.entityManager.add(entity)
  }
}

export default gadgetCommand