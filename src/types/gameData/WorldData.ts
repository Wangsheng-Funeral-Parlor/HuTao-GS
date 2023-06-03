export interface WorldData {
  Id: number
  Type: string
  MainSceneId: number
}

export interface WorldLevelData {
  Level: number
  MonsterLevel: number
}

export default interface WorldDataGroup {
  World: WorldData[]
  Level: WorldLevelData[]
}
