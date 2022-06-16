import { Point } from '.'

export default interface DungeonExit extends Point {
  EntryPointId: number
}