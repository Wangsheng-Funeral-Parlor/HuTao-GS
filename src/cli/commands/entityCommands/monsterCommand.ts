import Monster from '$/entity/monster'
import { CommandDefinition } from '..'

const monsterCommand: CommandDefinition = {
  name: 'monster',
  desc: 'Spawn monster',
  usage: [
    'monster <id> <lv> <uid> - Spawn monster at player\'s current avatar position',
    'monster <id> <lv>       - (In game) Spawn monster at current avatar position'
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

    print('Spawning monster:', args[0])

    const entity = new Monster(args[0], player)

    entity.motion.pos.copy(pos)
    entity.bornPos.copy(pos)

    await entity.initNew(args[1])
    await currentScene.entityManager.add(entity)
  }
}

export default monsterCommand