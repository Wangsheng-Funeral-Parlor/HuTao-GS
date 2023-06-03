import Challenge from ".."
import ForTimeTrigger from "../trigger/forTimeTrigger"

import ChallengeFactoryHandler from "./handler"

import Scene from "$/scene"
import SceneGroup from "$/scene/sceneGroup"

export default class SurviveChallengeFactoryHandler implements ChallengeFactoryHandler {
  public isThisType(challengeType: string): boolean {
    return challengeType === "CHALLENGE_SURVIVE"
  }

  public build(
    challengeIndex: number,
    challengeId: number,
    timeToSurvive: number,
    unused4: number,
    unused5: number,
    unused6: number,
    scene: Scene,
    group: SceneGroup
  ): Challenge {
    return new Challenge(scene, group, challengeId, challengeIndex, [timeToSurvive], timeToSurvive, 0, [
      new ForTimeTrigger(),
    ])
  }
}
