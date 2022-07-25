import { FightPropEnum } from '@/types/enum'
import { CommandDefinition } from '.'

const avatarCommands: CommandDefinition[] = [
  {
    name: 'god',
    desc: 'Toggle god mode',
    args: [
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: async (cmdInfo) => {
      const { args, cli, sender, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[0] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }

      player.godMode = !player.godMode

      print(`God mode ${player.godMode ? 'enabled' : 'disabled'}.`)
    }
  },
  {
    name: 'heal',
    desc: 'Heal all avatar in team',
    args: [
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: async (cmdInfo) => {
      const { args, cli, sender, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[0] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }

      print('Healed all avatar.')

      const avatarList = player.teamManager.getTeam()?.avatarList || []
      for (let avatar of avatarList) {
        if (!avatar.isAlive()) await avatar.revive()
        await avatar.fightProps.fullHeal(true)
      }
    }
  },
  {
    name: 'recharge',
    desc: 'Recharge all avatar in team',
    args: [
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: async (cmdInfo) => {
      const { args, cli, sender, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[0] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }

      print('Recharged energy.')

      const avatarList = player.teamManager.getTeam()?.avatarList || []
      for (let avatar of avatarList) avatar.fightProps.rechargeEnergy(true)
    }
  },
  {
    name: 'setfp',
    desc: 'Set fight prop',
    args: [
      { name: 'prop', type: 'str' },
      { name: 'value', type: 'num' },
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: async (cmdInfo) => {
      const { args, cli, sender, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[2] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }

      const prop = isNaN(parseInt(args[0])) ? FightPropEnum[<string>args[0]] : args[0]
      if (FightPropEnum[prop] == null) {
        printError('Invalid fight prop.')
        return
      }

      const { currentAvatar } = player
      if (!currentAvatar) {
        printError('Current avatar is null.')
        return
      }

      currentAvatar.fightProps.set(prop, args[1], true)
      print(`Set ${FightPropEnum[prop]}(${prop}) to ${args[1]}.`)
    }
  }
]

export default avatarCommands