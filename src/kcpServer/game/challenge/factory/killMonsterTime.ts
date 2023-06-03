import Challenge from ".."
import InTimeTrigger from "../trigger/inTimeTrigger"
import KillMonsterCountTrigger from "../trigger/killMonsterCountTrigger"

import ChallengeFactoryHandler from "./handler"

import Scene from "$/scene"
import SceneGroup from "$/scene/sceneGroup"

export default class KillMonsterTimeChallengeFactoryHandler implements ChallengeFactoryHandler {
  public isThisType(challengeType: string): boolean {
    return challengeType === "CHALLENGE_KILL_COUNT_IN_TIME" || challengeType === "CHALLENGE_KILL_COUNT_FAST"
  }

  public build(
    challengeIndex: number,
    challengeId: number,
    timeLimit: number,
    groupId: number,
    targetCount: number,
    param6: number,
    scene: Scene,
    group: SceneGroup
  ): Challenge {
    const realGroup = scene.scriptManager.getGroup(groupId)

    return new Challenge(
      scene,
      realGroup,
      challengeId,
      challengeIndex,
      [targetCount, timeLimit],
      timeLimit,
      targetCount,
      [new KillMonsterCountTrigger(), new InTimeTrigger()]
    )
  }
}
