import Challenge from ".."

import Scene from "$/scene"
import SceneGroup from "$/scene/sceneGroup"

export default interface ChallengeFactoryHandler {
  isThisType(challengeType: string): boolean

  build(
    challengeIndex: number,
    challengeId: number,
    param3: number,
    param4: number,
    param5: number,
    param6: number,
    scene: Scene,
    group: SceneGroup
  ): Challenge
}
