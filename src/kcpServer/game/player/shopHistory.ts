import Player from "."

export default class ShopHistory {
  player: Player

  shopMap: {
    [type: number]: {
      id: number
      count: number
      time: number
    }[]
  }

  constructor(player: Player) {
    this.player = player
  }
}
