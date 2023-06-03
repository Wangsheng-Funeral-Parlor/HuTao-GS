import Player from "."

import PlayerProp from "#/packets/PlayerProp"
import PlayerPropChange from "#/packets/PlayerPropChange"
import { PlayerPropEnum } from "@/types/enum"
import { PropPair, PropValue } from "@/types/proto"
import { MpSettingTypeEnum } from "@/types/proto/enum"
import PropsUserData from "@/types/user/PropsUserData"

export default class PlayerProps {
  player: Player

  propMap: { [type: number]: number }

  constructor(player: Player) {
    this.player = player

    this.propMap = {}

    this.clear()
  }

  init(userData: PropsUserData) {
    for (const type in userData) {
      if (isNaN(parseInt(type))) continue
      this.set(parseInt(type), userData[type])
    }

    this.set(PlayerPropEnum.PROP_CUR_PERSIST_STAMINA, this.get(PlayerPropEnum.PROP_MAX_STAMINA))
    this.set(PlayerPropEnum.PROP_CUR_TEMPORARY_STAMINA, 0)
  }

  initNew() {
    this.set(PlayerPropEnum.PROP_PLAYER_RESIN, 160)
    this.set(PlayerPropEnum.PROP_IS_SPRING_AUTO_USE, true)
    this.set(PlayerPropEnum.PROP_MAX_SPRING_VOLUME, 8000000)
    this.set(PlayerPropEnum.PROP_CUR_SPRING_VOLUME, 8000000)
    this.set(PlayerPropEnum.PROP_SPRING_AUTO_USE_PERCENT, 0.5)
    this.set(PlayerPropEnum.PROP_MAX_STAMINA, 24000)
    this.set(PlayerPropEnum.PROP_IS_FLYABLE, true)
    this.set(PlayerPropEnum.PROP_IS_TRANSFERABLE, true)
    this.set(PlayerPropEnum.PROP_IS_MP_MODE_AVAILABLE, true)
    this.set(PlayerPropEnum.PROP_PLAYER_MP_SETTING_TYPE, MpSettingTypeEnum.MP_SETTING_ENTER_AFTER_APPLY)

    this.set(PlayerPropEnum.PROP_CUR_PERSIST_STAMINA, this.get(PlayerPropEnum.PROP_MAX_STAMINA))
    this.set(PlayerPropEnum.PROP_CUR_TEMPORARY_STAMINA, 0)
  }

  get(id: number) {
    return this.propMap[id] || 0
  }

  async set(type: number, val: number | boolean, notify = false): Promise<void> {
    const { player, propMap } = this

    val = Number(val) || 0

    const delta = val - this.get(type)
    propMap[type] = val

    if (!notify) return

    const { context } = player
    await PlayerProp.sendNotify(context, type)
    await PlayerPropChange.sendNotify(context, type, delta)
  }

  clear() {
    const { propMap } = this
    for (const type in PlayerPropEnum) {
      if (!isNaN(Number(type))) continue
      propMap[PlayerPropEnum[type]] = 0
    }
  }

  exportPropMap(): { [id: number]: PropValue } {
    const { propMap } = this
    const map: { [type: number]: PropValue } = {}

    for (const type in propMap) {
      map[type] = this.exportPropValue(parseInt(type))
    }

    return map
  }

  exportPropPair(type: number): PropPair {
    const propValue = this.exportPropValue(type)
    return {
      type: propValue.type,
      propValue,
    }
  }

  exportPropValue(type: number): PropValue {
    const value = this.get(type)
    return {
      type,
      ival: value,
      val: value,
    }
  }

  exportUserData(): PropsUserData {
    return Object.assign({}, this.propMap)
  }
}
