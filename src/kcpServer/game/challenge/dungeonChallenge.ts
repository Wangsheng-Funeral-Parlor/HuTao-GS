import ChallengeTrigger from "./trigger"

import Challenge from "."

import Scene from "$/scene"
import SceneGroup from "$/scene/sceneGroup"
import { EventTypeEnum } from "@/types/enum"

export default class dungeonChallenge extends Challenge {
  stage: boolean

  constructor(
    scene: Scene,
    sceneGroup: SceneGroup,
    challengeId: number,
    challengeIndex: number,
    paramList: number[],
    timeLimit: number,
    goal: number,
    challengeTrigger: ChallengeTrigger[]
  ) {
    super(scene, sceneGroup, challengeId, challengeIndex, paramList, timeLimit, goal, challengeTrigger)
  }

  public async done() {
    await super.done()

    if (this.success) return
  }

  public async settle() {
    if (!this.stage) {
      //TODO

      this.scene.scriptManager.emit(EventTypeEnum.EVENT_DUNGEON_SETTLE, this.success ? 0 : 1)
    }
  }
}
