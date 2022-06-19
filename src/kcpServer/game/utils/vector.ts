import DataVector from '@/types/gameData/BinOutput/Common/Vector'
import { VectorInterface } from '@/types/game/motion'

export default class Vector {
  X: number
  Y: number
  Z: number

  hash: number

  grid: Vector | null
  gridSize: number | null

  constructor(x?: number, y?: number, z?: number, gridSize: number = null) {
    this.grid = gridSize == null ? null : new Vector()
    this.gridSize = gridSize

    this.set(x, y, z)
  }

  private updateHash() {
    const { X, Y, Z } = this
    this.hash = 1 * X + 12 * Y + 123 * Z
  }

  private updateGrid() {
    const { X, Y, Z, grid, gridSize } = this
    if (gridSize == null) return

    grid?.set(Math.floor(X / gridSize), Math.floor(Y / gridSize), Math.floor(Z / gridSize))
  }

  set(x?: number, y?: number, z?: number): Vector {
    this.X = x || 0
    this.Y = y || 0
    this.Z = z || 0

    this.updateHash()
    this.updateGrid()

    return this
  }

  setGridSize(gridSize: number = null) {
    this.grid = gridSize == null ? null : new Vector()
    this.gridSize = gridSize

    this.updateGrid()
  }

  setData(vec: DataVector | VectorInterface | Vector) {
    const { X, Y, Z } = vec

    this.set(
      typeof X === 'number' ? X : X?.[1],
      typeof Y === 'number' ? Y : Y?.[1],
      typeof Z === 'number' ? Z : Z?.[1]
    )

    return this
  }

  distanceTo(vec: Vector): number {
    const { X, Y, Z } = this
    return Math.sqrt(((vec.X - X) ** 2) + ((vec.Y - Y) ** 2) + ((vec.Z - Z) ** 2))
  }

  distanceTo2D(vec: Vector): number {
    const { X, Z } = this
    return Math.sqrt(((vec.X - X) ** 2) + ((vec.Z - Z) ** 2))
  }

  equal(vec: Vector): boolean {
    const { X, Y, Z } = this
    const { X: x, Y: y, Z: z } = vec
    return X === x && Y === y && Z === z
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