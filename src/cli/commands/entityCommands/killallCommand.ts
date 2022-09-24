import { PlayerDieTypeEnum, ProtEntityTypeEnum } from '@/types/proto/enum'
import { CommandDefinition } from '..'

const killallCommand: CommandDefinition = {
  name: 'killall',
  desc: 'Kill all nearby monsters (32 Max)',
  usage: [
    'killall <uid> - Kill all nearby monsters for player',
    'killall       - (In game) Kill all nearby monsters'
  ],
  args: [
    { name: 'uid', type: 'int', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const player = kcpServer.game.getPlayerByUid(args[0] || sender?.uid)

    if (!player) return printError('Player not found.')

    const { currentScene, currentAvatar, loadedEntityIdList } = player
    if (!currentAvatar) return printError('Current avatar is null.')
    if (!currentScene) return printError('Not in scene.')

    print('Killing monsters')

    const { entityManager } = currentScene
    const entityList = loadedEntityIdList
      .map(id => entityManager.getEntity(id, true))
      .filter(e => e != null && e.protEntityType === ProtEntityTypeEnum.PROT_ENTITY_MONSTER && e.isAlive())
      .sort((a, b) => Math.sign(a.distanceTo2D(currentAvatar) - b.distanceTo2D(currentAvatar)))

    let i = 0
    for (const entity of entityList) {
      if (i++ > 32) break
      await entity.kill(0, PlayerDieTypeEnum.PLAYER_DIE_NONE, undefined, true)
    }

    await entityManager.flushAll()
  }
}

export default killallCommand