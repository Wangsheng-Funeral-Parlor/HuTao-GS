import KcpServer from './'
import EnterSceneReady from './packets/EnterSceneReady'
import SceneInitFinish from './packets/SceneInitFinish'
import EnterSceneDone from './packets/EnterSceneDone'
import { PlayerEnterSceneNotify } from './packets/PlayerEnterScene'
import SetUpAvatarTeam from './packets/SetUpAvatarTeam'
import PostEnterScene from './packets/PostEnterScene'
import { ClientStateEnum } from '@/types/enum'
import Client from './client'
import { PacketHead } from '@/types/kcp'

export default class DummyClient extends Client {
  private loop: NodeJS.Timer

  constructor(server: KcpServer) {
    super(server, 0xFFFFFFFF, null)

    this.loop = setInterval(this.update.bind(this), 1e3 / 30)
  }

  // Destroy client
  async destroy(_reason: number = 5) {
    const { server, player, loop } = this

    if (player) await server.game.playerLogout(this)
    this.uid = null

    clearInterval(loop)
    this.update()
  }

  // Update function
  update() {
    const { player } = this

    this.emit('update')
    if (player) player.emit('Update')
  }

  // Send packet
  async sendPacket(packetName: string, _head: PacketHead, data: object) {
    const { player } = this
    if (!player) return

    const { teamManager, avatarList, context } = player

    if (packetName === 'PlayerEnterSceneNotify') {
      // Response to enter scene request
      const { enterSceneToken } = data as PlayerEnterSceneNotify

      // Wait until state change
      await EnterSceneReady.waitState(context, ClientStateEnum.ENTER_SCENE, false, 0xF0FF)

      await EnterSceneReady.request(context, { enterSceneToken })
      await SceneInitFinish.request(context, { enterSceneToken })
      await EnterSceneDone.request(context, { enterSceneToken })
      await PostEnterScene.request(context, { enterSceneToken })

      if (!player.isInMp()) {
        // setup team
        const huTao = avatarList.find(avatar => avatar.avatarId === 10000046)
        await SetUpAvatarTeam.request(context, {
          teamId: teamManager.getTeam().id,
          avatarTeamGuidList: [huTao.guid.toString()],
          curAvatarGuid: huTao.guid.toString()
        })
      }
    }
  }
}