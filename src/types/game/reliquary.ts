export interface ReliquaryInterface {
  level: number
  exp: number
  promoteLevel?: number
  mainPropId: number
  appendPropIdList: number[]
}

export interface SceneReliquaryInfo {
  itemId: number
  guid: string
  level: number
  promoteLevel?: number
}