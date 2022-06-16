import DataVector from '@/types/gameData/BinOutput/Common/Vector'
import { VectorInterface } from '@/types/game/motion'

export default class Vector {
  X: number
  Y: number
  Z: number

  constructor(x?: number, y?: number, z?: number) {
    this.set(x, y, z)
  }

  set(x?: number, y?: number, z?: number): Vector {
    this.X = x || 0
    this.Y = y || 0
    this.Z = z || 0
    return this
  }

  setData(vec: DataVector | VectorInterface) {
    const { X, Y, Z } = vec

    this.X = typeof X === 'number' ? X : (X?.[1] || 0)
    this.Y = typeof Y === 'number' ? Y : (Y?.[1] || 0)
    this.Z = typeof Z === 'number' ? Z : (Z?.[1] || 0)
  }

  distanceTo(vec: Vector): number {
    const { X, Y, Z } = this
    return Math.sqrt(((vec.X - X) ** 2) + ((vec.Y - Y) ** 2) + ((vec.Z - Z) ** 2))
  }

  copy(vec: Vector): Vector {
    const { X, Y, Z } = vec
    this.set(X, Y, Z)
    return this
  }

  clone(): Vector {
    return new Vector().copy(this)
  }

  export(): VectorInterface {
    const props = ['X', 'Y', 'Z']
    const ret = {}

    for (let prop of props) {
      if (this[prop] != null) ret[prop] = this[prop]
    }

    return ret
  }
}