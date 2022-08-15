import { PacketContext } from '#/packet'
import VehicleInteract from '#/packets/VehicleInteract'
import VehicleManager from '$/manager/vehicleManager'
import Player from '$/player'
import { FightPropEnum } from '@/types/enum'
import { SceneGadgetInfo, VehicleLocationInfo, VehicleMember } from '@/types/proto'
import { RetcodeEnum, VehicleInteractTypeEnum } from '@/types/proto/enum'
import Gadget from '.'

export default class Vehicle extends Gadget {
  vehicleManager: VehicleManager
  player: Player

  pointId: number
  memberList: { pos: number, player: Player }[]

  constructor(manager: VehicleManager, player: Player, vehicleId: number, pointId: number) {
    super(vehicleId)

    this.vehicleManager = manager
    this.player = player

    this.pointId = pointId
    this.memberList = []
  }

  async destroy() {
    const { vehicleManager, memberList } = this
    while (memberList.length > 0) await this.getOut(memberList[0].player)
    await vehicleManager.destroyVehicle(this)
  }

  async getIn(player: Player, pos: number, context?: PacketContext) {
    const { entityId, memberList } = this
    const member = memberList.find(m => m.pos === pos)

    if (member) {
      if (member.player === player) {
        await VehicleInteract.response(context || player.context, {
          retcode: RetcodeEnum.RET_SUCC,
          entityId,
          interactType: VehicleInteractTypeEnum.VEHICLE_INTERACT_IN,
          member: this.exportVehicleMember(pos)
        })
      } else {
        await VehicleInteract.response(context || player.context, { retcode: RetcodeEnum.RET_VEHICLE_SLOT_OCCUPIED })
      }

      return
    }

    memberList.push({ player, pos })

    await VehicleInteract.response(context || player.context, {
      retcode: RetcodeEnum.RET_SUCC,
      entityId,
      interactType: VehicleInteractTypeEnum.VEHICLE_INTERACT_IN,
      member: this.exportVehicleMember(pos)
    })
  }

  async getOut(player: Player, context?: PacketContext) {
    const { entityId, memberList } = this
    const member = memberList.find(m => m.player === player)

    if (member == null) {
      await VehicleInteract.response(context || player.context, { retcode: RetcodeEnum.RET_NOT_IN_VEHICLE })
      return
    }

    const memberInfo = this.exportVehicleMember(member.pos)
    memberList.splice(memberList.indexOf(member), 1)

    await VehicleInteract.response(context || player.context, {
      retcode: RetcodeEnum.RET_SUCC,
      entityId,
      interactType: VehicleInteractTypeEnum.VEHICLE_INTERACT_OUT,
      member: memberInfo
    })
  }

  syncMemberPos() {
    const { memberList, motion } = this
    const { pos, rot } = motion

    for (const member of memberList) {
      const { pos: playerPos, rot: playerRot } = member.player

      playerPos?.copy(pos)
      playerRot?.copy(rot)
    }
  }

  exportSceneGadgetInfo(): SceneGadgetInfo {
    const { player, memberList } = this
    const info = super.exportSceneGadgetInfo()

    info.vehicleInfo = {
      memberList: memberList.map(m => this.exportVehicleMember(m.pos)),
      ownerUid: player.uid,
      curStamina: 240
    }

    return info
  }

  exportVehicleLocationInfo(): VehicleLocationInfo {
    const { player, gadgetId, entityId, fightProps, motion, memberList } = this
    const { pos, rot } = motion

    return {
      entityId,
      gadgetId,
      ownerUid: player.uid,
      pos: pos.export(),
      rot: rot.export(),
      curHp: fightProps.get(FightPropEnum.FIGHT_PROP_CUR_HP),
      maxHp: fightProps.get(FightPropEnum.FIGHT_PROP_MAX_HP),
      uidList: memberList.map(m => m.player.uid)
    }
  }

  exportVehicleMember(pos: number): VehicleMember {
    const member = this.memberList.find(m => m.pos === pos)
    if (member == null) return null

    return {
      uid: member.player.uid,
      avatarGuid: member.player.currentAvatar?.guid?.toString(),
      pos
    }
  }
}