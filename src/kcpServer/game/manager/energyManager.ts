import TrifleItem from "$/entity/gadget/trifleItem"
import Material from "$/material"
import Player from "$/player"
import Item from "$/player/inventory/item"
import Vector from "$/utils/vector"
import { ElemTypeEnum } from "@/types/enum"

interface DropInfo {
  id: number
  count: number
}

export default class EnergyManager {
  player: Player

  constructor(player: Player) {
    this.player = player
  }

  // should i just put it in json?
  private getDropsById(dropId: number): DropInfo[] {
    if (dropId < 22010010 || dropId > 22010050) return []
    dropId -= 22010000

    const infoList: DropInfo[] = []

    if (dropId > 10 && dropId < 40 && dropId % 10 >= 1 && dropId % 10 <= 7) {
      let offset = (dropId - 1) % 10

      if (dropId < 20 || (dropId < 30 && (dropId - 1) % 4 < 2)) offset += 16

      infoList.push({ id: 2001 + offset, count: 1 })
    }

    if (dropId % 10 === 0 && dropId !== 30) infoList.push({ id: 2024, count: 1 })
    if (dropId % 10 === 0 && dropId >= 30) infoList.push({ id: 2008, count: 1 })

    if (infoList.length === 0) return []

    if (dropId % 25 === 0) infoList[0].count += dropId / 25

    return infoList
  }

  async spawnDropsById(pos: Vector, dropId: number, seqId?: number): Promise<void> {
    const infoList = this.getDropsById(dropId)
    for (const info of infoList) await this.spawnDrop(pos, info.id, info.count, seqId)
  }

  async spawnDrop(pos: Vector, id: number, count = 1, seqId?: number): Promise<void> {
    const { player } = this
    const { currentScene } = player
    if (currentScene == null) return

    const { entityManager } = currentScene

    const entity = new TrifleItem(new Item(await Material.create(player, id, count)))
    await entity.initNew()
    entity.motion.pos.copy(pos)

    await entityManager.add(entity, undefined, undefined, seqId)
  }

  async addAllEnergy(energy = 0): Promise<void> {
    const { player } = this
    const { teamManager, currentScene, currentAvatar } = player
    if (currentScene == null) return

    const penaltyMul = Math.max(0.1, 1 - currentScene.exportSceneTeamAvatarList().length * 0.1)
    const { avatarList } = teamManager.getTeam()
    for (const avatar of avatarList) {
      await avatar.gainEnergy(energy * (avatar === currentAvatar ? 1 : penaltyMul), false, true)
    }
  }

  async addElemEnergy(elemType: ElemTypeEnum = 0, sameElemEnergy = 0, diffElemEnergy = 0): Promise<void> {
    const { player } = this
    const { teamManager, currentScene, currentAvatar } = player
    if (currentScene == null) return

    const penaltyMul = Math.max(0.1, 1 - currentScene.exportSceneTeamAvatarList().length * 0.1)
    const { avatarList } = teamManager.getTeam()
    for (const avatar of avatarList) {
      const { skillManager } = avatar
      const energy = skillManager.costElemType === elemType ? sameElemEnergy : diffElemEnergy
      await avatar.gainEnergy(energy * (avatar === currentAvatar ? 1 : penaltyMul), false, true)
    }
  }
}
