import { SceneTagData } from '@/types/gameData/SceneData'
import Scene from '.'

export default class SceneTag {
  scene: Scene

  id: number
  name: string
  conds: {
    type: string,
    params: number[]
  }[]
  isDefault: boolean

  constructor(scene: Scene, data: SceneTagData) {
    this.scene = scene

    this.id = data.Id
    this.name = data.Name
    this.conds = data.Cond.map(cond => ({
      type: cond.CondType,
      params: [cond.Param1, cond.Param2].filter(param => param != null)
    }))
    this.isDefault = !!data.IsDefaultValid
  }

  // Not yet implemented
  isActive(): boolean {
    return true
  }
}