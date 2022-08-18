import { EquipTypeEnum, FightPropEnum } from '@/types/enum'
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
      for (const avatar of avatarList) {
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
      for (const avatar of avatarList) avatar.fightProps.rechargeEnergy(true)
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
  },
  {
    name: 'guid',
    desc: 'Show current avatar guid & equips guid',
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

      const { currentAvatar } = player
      if (!currentAvatar) {
        printError('Current avatar is null.')
        return
      }

      const { guid, equipMap } = currentAvatar
      const equips = Object.entries(equipMap).map(e => `${EquipTypeEnum[parseInt(e[0])]}: ${e[1]?.guid?.toString()}`).join('\n')
      print(`Avatar: ${guid?.toString()}\n${equips}`)
    }
  },
  {
    name: 'equip',
    desc: 'Equip weapon or artifact',
    args: [
      { name: 'guid', type: 'str' },
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: async (cmdInfo) => {
      const { args, cli, sender, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[1] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }

      const { currentAvatar } = player
      if (!currentAvatar) {
        printError('Current avatar is null.')
        return
      }

      const equip = player.getEquip(BigInt(args[0] || 0))
      if (!equip) {
        printError('Equip not found.')
        return
      }

      await currentAvatar.equip(equip)
      print(`Equipped ${args[0]} to current avatar.`)
    }
  }
]

export default avatarCommands