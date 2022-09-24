import Gadget from '$/entity/gadget'
import { CommandDefinition } from '..'

const gadgetCommand: CommandDefinition = {
  name: 'gadget',
  desc: 'Spawn gadget',
  usage: [
    'gadget <id> <lv> <uid> - Spawn gadget at player\'s current avatar position',
    'gadget <id> <lv>       - (In game) Spawn gadget at current avatar position'
  ],
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

    if (!player) return printError('Player not found.')

    const { currentScene, pos } = player
    if (!currentScene || !pos) return printError('Unable to get player position.')

    print('Spawning gadget:', args[0])

    const entity = new Gadget(args[0])

    entity.motion.pos.copy(pos)
    entity.bornPos.copy(pos)

    await entity.initNew(args[1])
    await currentScene.entityManager.add(entity)
  }
}

export default gadgetCommand