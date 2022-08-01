import OpenStateChange from '#/packets/OpenStateChange'
import { OpenStateEnum } from '@/types/proto/enum'
import PropsUserData from '@/types/user/PropsUserData'
import Player from '.'

export default class OpenState {
  player: Player

  openStateMap: { [key: number]: boolean }

  constructor(player: Player) {
    this.player = player

    this.openStateMap = {}
  }

  init(userData: PropsUserData) {
    if (userData == null) return this.initNew()

    for (const key in userData) {
      if (isNaN(Number(key))) continue

      this.openStateMap[Number(key)] = !!userData[key]
    }
  }

  initNew() {
    for (const key in OpenStateEnum) {
      if (!isNaN(Number(key)) || key.indexOf('_GUIDE') >= 0) continue

      this.openStateMap[OpenStateEnum[key]] = true
    }

    this.set(OpenStateEnum.OPEN_STATE_GACHA, false)
  }

  async set(key: number, val: number | boolean, notify: boolean = false): Promise<void> {
    const { player, openStateMap } = this
    openStateMap[key] = !!val

    if (notify) await OpenStateChange.sendNotify(player.context, { [key]: Number(val) })
  }

  exportOpenStateMap() {
    return Object.fromEntries(Object.entries(this.openStateMap).map(e => [e[0], Number(e[1])]))
  }

  exportUserData(): PropsUserData {
    return Object.assign({}, this.exportOpenStateMap())
  }
}