import { DynamicVector } from '$DT/BinOutput/Common/DynamicNumber'
import { VectorInfo } from '@/types/proto'

export default class Vector {
  x: number
  y: number
  z: number

  lastX: number
  lastY: number
  lastZ: number
  initLast: boolean

  hash: number

  grid: Vector | null
  gridSize: number | null

  constructor(x?: number, y?: number, z?: number, gridSize: number = null) {
    this.grid = gridSize == null ? null : new Vector()
    this.gridSize = gridSize

    this.initLast = true
    this.set(x, y, z)
  }

  private updateHash() {
    const { x, y, z } = this
    this.hash = Math.floor(1 * x + 12 * y + 123 * z)
  }

  private updateGrid() {
    const { x, y, z, grid, gridSize } = this
    if (gridSize == null) return

    grid?.set(Math.floor(x / gridSize), Math.floor(y / gridSize), Math.floor(z / gridSize))
  }

  set(x?: number, y?: number, z?: number): Vector {
    const { x: X, y: Y, z: Z, initLast } = this

    if (initLast) {
      this.lastX = x || 0
      this.lastY = y || 0
      this.lastZ = z || 0
      this.initLast = false
    } else {
      this.lastX = X || 0
      this.lastY = Y || 0
      this.lastZ = Z || 0
    }

    this.x = x || 0
    this.y = y || 0
    this.z = z || 0

    this.updateHash()
    this.updateGrid()

    return this
  }

  setGridSize(gridSize: number = null) {
    this.grid = gridSize == null ? null : new Vector()
    this.gridSize = gridSize

    this.updateGrid()

    return this
  }

  setData(vec: DynamicVector | VectorInfo | Vector) {
    const v = vec || {}
    const x = (<VectorInfo | Vector>v).x || (<DynamicVector>v).X
    const y = (<VectorInfo | Vector>v).y || (<DynamicVector>v).Y
    const z = (<VectorInfo | Vector>v).z || (<DynamicVector>v).Z

    this.set(
      typeof x === 'number' ? x : Number(x?.[1]),
      typeof y === 'number' ? y : Number(y?.[1]),
      typeof z === 'number' ? z : Number(z?.[1])
    )

    return this
  }

  distanceTo(vec: Vector): number {
    const { x, y, z } = this
    return Math.sqrt(((vec.x - x) ** 2) + ((vec.y - y) ** 2) + ((vec.z - z) ** 2))
  }

  distanceTo2D(vec: Vector): number {
    const { x, z } = this
    return Math.sqrt(((vec.x - x) ** 2) + ((vec.z - z) ** 2))
  }

  hasChanged(): boolean {
    const { x, y, z, lastX, lastY, lastZ } = this
    return (
      x !== lastX ||
      y !== lastY ||
      z !== lastZ
    )
  }

  equal(vec: Vector): boolean {
    const { x: X, y: Y, z: Z } = this
    const { x, y, z } = vec
    return X === x && Y === y && Z === z
  }

  copy(vec: Vector): Vector {
    const { x, y, z } = vec
    this.set(x, y, z)
    return this
  }

  clone(): Vector {
    return new Vector().copy(this)
  }

  // vector math
  add(vec: Vector): Vector {
    const { x: X, y: Y, z: Z } = this
    const { x, y, z } = vec
    return this.set(X + x, Y + y, Z + z)
  }

  sub(vec: Vector): Vector {
    const { x: X, y: Y, z: Z } = this
    const { x, y, z } = vec
    return this.set(X - x, Y - y, Z - z)
  }

  mul(vec: Vector): Vector {
    const { x: X, y: Y, z: Z } = this
    const { x, y, z } = vec
    return this.set(X * x, Y * y, Z * z)
  }

  div(vec: Vector): Vector {
    const { x: X, y: Y, z: Z } = this
    const { x, y, z } = vec
    return this.set(X / x, Y / y, Z / z)
  }

  // scalar math
  addScalar(n: number): Vector {
    const { x, y, z } = this
    return this.set(x + n, y + n, z + n)
  }

  subScalar(n: number): Vector {
    const { x, y, z } = this
    return this.set(x - n, y - n, z - n)
  }

  mulScalar(n: number): Vector {
    const { x, y, z } = this
    return this.set(x * n, y * n, z * n)
  }

  divScalar(n: number): Vector {
    const { x, y, z } = this
    return this.set(x / n, y / n, z / n)
  }

  export(): VectorInfo {
    const props = ['x', 'y', 'z']
    const ret = {}

    for (const prop of props) {
      if (this[prop] != null) ret[prop] = this[prop]
    }

    return ret
  }
}