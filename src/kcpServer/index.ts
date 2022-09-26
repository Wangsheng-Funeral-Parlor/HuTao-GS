import Client from '#/client'
import PacketHandler from '#/packetHandler'
import GlobalState from '@/globalState'
import Logger from '@/logger'
import Server from '@/server'
import TLogger from '@/translate/tlogger'
import { ClientStateEnum } from '@/types/enum'
import { ENetReasonEnum } from '@/types/proto/enum'
import { waitTick } from '@/utils/asyncWait'
import { fileExists, readFile, writeFile } from '@/utils/fileSystem'
import { join } from 'path'
import { cwd } from 'process'
import EventEmitter from 'promise-events'
import Game from './game'
import Socket from './socket'

const logger = new TLogger('KCPSRV', 0xc824ff)

export default class KcpServer extends EventEmitter {
  private loop: NodeJS.Timer
  private frame: number

  server: Server

  socket: Socket
  game: Game
  packetHandler: PacketHandler
  clientList: Client[]
  tokens: number[]

  constructor(server: Server) {
    super()

    this.server = server

    this.socket = new Socket(this)
    this.game = new Game(this)
    this.packetHandler = new PacketHandler()

    this.clientList = []
    this.tokens = []

    this.frame = 0
  }

  async start(): Promise<void> {
    await this.socket.start()
    this.loop = setInterval(this.update.bind(this), 1e3 / 60)
  }

  async stop(): Promise<void> {
    const { clientList: clients, loop } = this

    for (const clientID in clients) {
      await this.disconnect(parseInt(clientID), ENetReasonEnum.ENET_SERVER_SHUTDOWN)
    }

    clearInterval(loop)

    await waitTick()
    await this.socket.stop()
  }

  createClient(conv: number, workerId: number): Client {
    const client = new Client(this, conv, workerId)

    // Set client state
    client.state = ClientStateEnum.CONNECTION

    logger.info('message.kcpServer.info.connect', conv?.toString(16)?.padStart(8, '0')?.toUpperCase())
    this.clientList.push(client)

    return client
  }

  getClient(conv: number): Client {
    return this.clientList.find(client => client.conv === conv)
  }

  async disconnect(conv: number, enetReason: ENetReasonEnum = ENetReasonEnum.ENET_SERVER_KICK) {
    const { socket, clientList } = this
    const client = this.getClient(conv)
    if (!client || client.destroyed) return false

    await client.destroy(enetReason)
    await socket.disconnect(conv, enetReason)

    logger.info('message.kcpServer.info.disconnect', conv?.toString(16)?.padStart(8, '0')?.toUpperCase(), ENetReasonEnum[enetReason] || enetReason)
    clientList.splice(clientList.indexOf(client), 1)

    return true
  }

  async disconnectUid(uid: number, enetReason: ENetReasonEnum = ENetReasonEnum.ENET_SERVER_KICK) {
    const client = this.game.getPlayerByUid(uid)?.client
    if (!client) return false

    return this.disconnect(client.conv, enetReason)
  }

  update() {
    Logger.mark('Tick')

    const { frame, clientList: clients } = this
    const clientList = Object.values(clients)

    for (let i = frame; i < clientList.length; i += 2) {
      const client = clientList[i]
      if (!client.destroyed) client.update()
    }

    this.frame ^= 1

    Logger.measure('Game tick', 'Tick')
  }

  async dump(name: string, data: Buffer) {
    if (!GlobalState.get('PacketDump')) return

    try {
      const dumpPath = join(cwd(), 'data/log/dump', `${name}.bin`)
      if (data.length <= 0 || (await fileExists(dumpPath) && (await readFile(dumpPath)).length >= data.length)) return
      await writeFile(dumpPath, data)
    } catch (err) { }
  }
}