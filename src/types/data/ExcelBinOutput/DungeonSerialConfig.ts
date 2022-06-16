export interface DungeonSerialConfig {
  Id: number
  MaxTakeNum: number

  TakeCost?: number
}

type DungeonSerialConfigList = DungeonSerialConfig[]

export default DungeonSerialConfigList