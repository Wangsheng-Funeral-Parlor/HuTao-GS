import Scene from "."

import { SceneTagData } from "@/types/gameData/SceneData"

export default class SceneTag {
  scene: Scene

  id: number
  name: string
  conds: {
    type: string
    params: number[]
  }[]
  isDefault: boolean

  constructor(scene: Scene, data: SceneTagData) {
    this.scene = scene

    this.id = data.Id
    this.name = data.Name
    this.conds = data.Cond.map((cond) => ({
      type: cond.CondType,
      params: [cond.Param1, cond.Param2].filter((param) => param != null),
    }))
    this.isDefault = !!data.IsDefaultValid
  }

  get activityManager() {
    return this.scene.world.game.activityManager
  }

  isActive(): boolean {
    if (this.conds.length === 0) return this.isDefault

    const bools: boolean[] = []

    for (const cond of this.conds) {
      switch (cond.type) {
        case "SCENE_TAG_COND_TYPE_SPECIFIC_ACTIVITY_OPEN":
        case "SCENE_TAG_COND_TYPE_ACTIVITY_CONTENT_OPEN": {
          const isOpen =
            this.activityManager.exportActivityScheduleInfoList().find((a) => a.activityId === cond.params[0])
              ?.isOpen || false

          bools.push(isOpen)
          break
        }
        case "SCENE_TAG_COND_TYPE_NONE": {
          bools.push(true)
        }
        case "SCENE_TAG_COND_TYPE_QUEST_FINISH": {
          bools.push(true)
        }
        default: {
          bools.push(false)
          break
        }
      }
    }

    return bools.every((v) => v) ? !this.isDefault : this.isDefault
  }
}
