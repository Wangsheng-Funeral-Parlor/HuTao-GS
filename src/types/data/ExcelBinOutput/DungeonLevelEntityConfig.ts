export interface DungeonLevelEntityConfig {
  ClientId: number
  Id: number
  LevelConfigName: string
  DescTextMapHash: number

  Show?: boolean
}

type DungeonLevelEntityConfigList = DungeonLevelEntityConfig[]

export default DungeonLevelEntityConfigList