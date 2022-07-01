import KcpServer from '#/.'
import Monster from '$/entity/monster'
import Weapon from '$/equip/weapon'
import SceneData from '$/gameData/data/SceneData'
import Material from '$/material'
import Player from '$/player'
import Vector from '$/utils/vector'
import keyGen from '@/keyGen'
import Server from '@/server'
import { cRGB, noColor } from '@/tty'
import { FightPropEnum } from '@/types/enum/fightProp'
import { SceneEnterReasonEnum, SceneEnterTypeEnum } from '@/types/enum/scene'
import { update } from '@/update'
import CLI from '.'

export interface ArgumentDefinition {
  name: string
  type?: string
  optional?: boolean
  dynamic?: boolean
}

export interface CommandDefinition {
  name: string
  desc: string
  args?: ArgumentDefinition[]
  allowPlayer?: boolean
  onlyAllowPlayer?: boolean
  exec: (cmdInfo: CmdInfo) => void
}

export interface CLILike {
  print: (...args: any[]) => void
  printError: (...args: any[]) => void
}

export interface CmdInfo {
  args?: any[]
  sender?: Player
  cli: CLILike
  server?: Server
  kcpServer?: KcpServer
}

const helpMaxCmdPerPage = 10

export function helpFormatArgument(argument: ArgumentDefinition) {
  const { name, optional, dynamic, type } = argument

  const bracket = optional ? '[]' : '<>'
  const spread = dynamic ? '...' : ''
  const argType = type == null ? '' : `:${type}`

  return `${bracket[0]}${spread}${name}${argType}${bracket[1]}`
}

export function helpFormatCommand(command: CommandDefinition, prefix: string = '') {
  const { name, args, desc } = command
  return `${cRGB(0xffffff, prefix + name)}${cRGB(0xffb71c, (args != null && args.length > 0) ? (' ' + args.map(helpFormatArgument).join(' ')) : '')} - ${desc}`
}

const commands: CommandDefinition[] = [
  {
    name: 'help',
    desc: 'List commands info',
    args: [
      { name: 'page', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: (cmdInfo) => {
      const { args, cli, sender } = cmdInfo
      const { print, printError } = cli

      if (sender) {
        print('Please visit announcement for list of commands.')
        return
      }

      const allowedCommands = commands
        .filter(cmd => !cmd.onlyAllowPlayer)

      const page = args[0] || 1
      const pageCount = Math.floor((allowedCommands.length - 1) / helpMaxCmdPerPage) + 1

      if (pageCount <= 0) return
      if (page < 1 || page > pageCount) return printError(`Page out of range (1-${pageCount}): ${page}`)

      const lines = allowedCommands
        .filter((_cmd, i) => Math.floor(i / helpMaxCmdPerPage) + 1 === page)
        .map(cmd => helpFormatCommand(cmd))
      const maxLength = Math.max(...lines.map(l => noColor(l).length))
      const head = `[HELP][${page}/${pageCount}]`

      print(`${head}${'='.repeat(maxLength - head.length)}`)
      for (let line of lines) print(line)
      print('='.repeat(maxLength))
    }
  },
  {
    name: 'stop',
    desc: 'Stop server',
    exec: (cmdInfo) => {
      (cmdInfo.cli as CLI).stop()
      cmdInfo.server.stop()
    }
  },
  {
    name: 'restart',
    desc: 'Restart server',
    exec: (cmdInfo) => {
      (cmdInfo.cli as CLI).stop()
      cmdInfo.server.restart()
    }
  },
  {
    name: 'logLevel',
    desc: 'Set log level [0]N-F-E-W-I-D-P-V-V[8]',
    args: [
      { name: 'level', type: 'int' }
    ],
    exec: (cmdInfo) => {
      const { args, cli, server } = cmdInfo
      const { print } = cli
      const level: number = args[0]

      if (level < 0 || level > 7) {
        print('Invalid log level:', level)
        return
      }

      server.setLogLevel(level)
    }
  },
  {
    name: 'log',
    desc: 'Enable/Disable save server log',
    exec: (cmdInfo) => cmdInfo.server.globalState.toggle('SaveLog')
  },
  {
    name: 'saveRecorder',
    desc: 'Enable/Disable save log recorder (overseauspider)',
    exec: (cmdInfo) => cmdInfo.server.globalState.toggle('SaveRecorder')
  },
  {
    name: 'saveReport',
    desc: 'Enable/Disable save report (log-upload-os)',
    exec: (cmdInfo) => cmdInfo.server.globalState.toggle('SaveReport')
  },
  {
    name: 'packetId',
    desc: 'Show/Hide packetId',
    exec: (cmdInfo) => cmdInfo.server.globalState.toggle('ShowPacketId')
  },
  {
    name: 'protoMatch',
    desc: 'Enable/Disable protoMatch',
    exec: (cmdInfo) => cmdInfo.server.globalState.toggle('UseProtoMatch')
  },
  {
    name: 'update',
    desc: 'Fetch new dispatch data',
    exec: () => update()
  },
  {
    name: 'keygen',
    desc: 'Attempt to generate key from packet dumps',
    exec: () => keyGen()
  },
  {
    name: 'list',
    desc: 'List connected clients',
    allowPlayer: true,
    exec: (cmdInfo) => {
      const { cli, kcpServer } = cmdInfo
      const { print } = cli
      const { clients } = kcpServer
      const lines = []

      for (let clientID in clients) {
        const client = clients[clientID]
        lines.push(`${client.uid.toString().padStart(6, '0') || '------'}|${client.state.toString(16).padStart(4, '0').toUpperCase()}|${clientID}`)
      }

      if (lines.length === 0) {
        print('Empty.')
        return
      }

      const maxLength = Math.max(...lines.map(line => line.length))

      print('='.repeat(maxLength))
      print(' UID  | CS | clientID')
      print('='.repeat(maxLength))
      for (let line of lines) print(line)
      print('='.repeat(maxLength))
    }
  },
  {
    name: 'disconnect',
    desc: 'Disconnect client',
    args: [
      { name: 'clientID|uid' },
      { name: 'reason', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: (cmdInfo) => {
      const { args, cli, kcpServer } = cmdInfo
      cli.print('Attempt to disconnect:', args[0])
      if (args[0].indexOf('_') === -1) kcpServer.disconnectUid(parseInt(args[0]), args[1])
      else kcpServer.disconnect(args[0], args[1])
    }
  },
  {
    name: 'ar',
    desc: 'Set adventure rank',
    args: [
      { name: 'level', type: 'int' },
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: (cmdInfo) => {
      const { args, cli, sender, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[1] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }

      player.setLevel(args[0])
      print(`Adventure rank set to: ${player.level}`)
    }
  },
  {
    name: 'pos',
    desc: 'Print current position',
    args: [
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: (cmdInfo) => {
      const { args, cli, sender, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[0] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }

      const pos = player.pos
      if (!pos) {
        printError('Unable to get player position.')
        return
      }

      print('Scene:', player.currentScene?.id || '?', 'X:', pos.X, 'Y:', pos.Y, 'Z:', pos.Z)
    }
  },
  {
    name: 'scene',
    desc: 'Change scene',
    args: [
      { name: 'id', type: 'int' },
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: (cmdInfo) => {
      const { args, cli, sender, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[1] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }

      const { currentWorld, currentScene, context } = player
      if (!currentWorld) {
        printError('Not in world.')
        return
      }

      const scene = currentWorld.getScene(args[0])
      const sceneData = SceneData.getScene(args[0])
      if (!scene || !sceneData) {
        printError('Scene not found.')
        return
      }
      if (currentScene === scene) {
        printError('Same scene.')
        return
      }

      print('Change scene to:', scene.id)

      const { BornPos, BornRot } = sceneData

      const pos = new Vector()
      const rot = new Vector()

      pos.setData(BornPos)
      rot.setData(BornRot)

      scene.join(context, pos, rot, SceneEnterTypeEnum.ENTER_JUMP, SceneEnterReasonEnum.TRANS_POINT)
    }
  },
  {
    name: 'tp',
    desc: 'Teleport to location',
    args: [
      { name: 'x', type: 'int' },
      { name: 'y', type: 'int' },
      { name: 'z', type: 'int' },
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: (cmdInfo) => {
      const { args, cli, sender, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[3] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }

      const { currentScene, context } = player
      if (!currentScene) {
        printError('Not in scene.')
        return
      }

      const x = args[0]
      const y = args[1]
      const z = args[2]

      print('Teleport to:', x, y, z)

      currentScene.join(context, new Vector(x, y, z), new Vector(), SceneEnterTypeEnum.ENTER_GOTO, SceneEnterReasonEnum.TRANS_POINT)
    }
  },
  {
    name: 'god',
    desc: 'Toggle god mode',
    args: [
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: (cmdInfo) => {
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
    name: 'setfp',
    desc: 'Set fight prop',
    args: [
      { name: 'prop', type: 'str' },
      { name: 'value', type: 'num' },
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: (cmdInfo) => {
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
    name: 'weapon',
    desc: 'Give weapon',
    args: [
      { name: 'id', type: 'int' },
      { name: 'count', type: 'int', optional: true },
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: (cmdInfo) => {
      const { args, cli, sender, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[2] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }

      const id = args[0]
      const count = args[1] || 1

      print('Give weapon:', `(${id})x${count}`)

      for (let i = 0; i < count; i++) {
        const weapon = new Weapon(id)
        weapon.initNew()
        player.inventory.add(weapon)
      }
    }
  },
  {
    name: 'material',
    desc: 'Give material',
    args: [
      { name: 'id', type: 'int' },
      { name: 'count', type: 'int', optional: true },
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: (cmdInfo) => {
      const { args, cli, sender, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[2] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }

      const id = args[0]
      const count = args[1] || 1

      const material = new Material(id, null, count)
      player.inventory.add(material)

      print('Give material:', `(${id})x${material.count}`)
    }
  },
  {
    name: 'monster',
    desc: 'Spawn monster at player location',
    args: [
      { name: 'id', type: 'int' },
      { name: 'lv', type: 'int' },
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: (cmdInfo) => {
      const { args, cli, sender, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[2] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }

      const { currentScene, pos } = player
      if (!currentScene || !pos) {
        printError('Unable to get player position.')
        return
      }

      print('Attempt to spawn monster:', args[0])

      const entity = new Monster(args[0])

      entity.motionInfo.pos.copy(pos)
      entity.bornPos.copy(pos)

      entity.initNew(args[1])

      currentScene.entityManager.add(entity)
    }
  },
  {
    name: 'scoin',
    desc: 'Give mora',
    args: [
      { name: 'amount', type: 'int' },
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: (cmdInfo) => {
      const { args, cli, sender, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[1] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }

      const amount = args[0]

      print('Give mora:', amount)

      player.addMora(amount)
    }
  },
  {
    name: 'hcoin',
    desc: 'Give primogem',
    args: [
      { name: 'amount', type: 'int' },
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: (cmdInfo) => {
      const { args, cli, sender, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[1] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }

      const amount = args[0]

      print('Give primogem:', amount)

      player.addPrimogem(amount)
    }
  },
  {
    name: 'mcoin',
    desc: 'Give genesis crystal',
    args: [
      { name: 'amount', type: 'int' },
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: (cmdInfo) => {
      const { args, cli, sender, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[1] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }

      const amount = args[0]

      print('Give genesis crystal:', amount)

      player.addGenesisCrystal(amount)
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
    exec: (cmdInfo) => {
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
    name: 'coop',
    desc: 'Change to coop world',
    args: [
      { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: (cmdInfo) => {
      const { args, cli, sender, kcpServer } = cmdInfo
      const { print, printError } = cli
      const player = kcpServer.game.getPlayerByUid(args[0] || sender?.uid)

      if (!player) {
        printError('Player not found.')
        return
      }
      if (player.isInMp()) {
        printError('Player already in a coop world.')
        return
      }

      print('Changing to coop world.')

      player.hostWorld.changeToMp()
    }
  }
]

export default commands