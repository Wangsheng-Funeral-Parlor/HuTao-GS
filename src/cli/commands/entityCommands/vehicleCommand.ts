import Vector from '$/utils/vector'
import { CommandDefinition } from '..'

const vehicleCommand: CommandDefinition = {
  name: 'vehicle',
  desc: 'Spawn vehicle',
  usage: [
    'vehicle <uid> - Spawn vehicle at player\'s current avatar position',
    'vehicle       - (In game) Spawn vehicle at current avatar position'
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

    const { currentScene, pos } = player
    if (!currentScene || !pos) return printError('Unable to get player position.')

    print('Spawning vehicle')

    await currentScene.vehicleManager.createVehicle(player, 45001001, 0, pos, new Vector())
  }
}

export default vehicleCommand