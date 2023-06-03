import Challenge from ".."
import KillMonsterCountTrigger from "../trigger/killMonsterCountTrigger"

import ChallengeFactoryHandler from "./handler"

import Scene from "$/scene"
import SceneGroup from "$/scene/sceneGroup"

export default class KillMonsterCountChallengeFactoryHandler implements ChallengeFactoryHandler {
  public isThisType(challengeType: string): boolean {
    return challengeType === "CHALLENGE_KILL_COUNT"
  }

  public build(
    challengeIndex: number,
    challengeId: number,
    groupId: number,
    goal: number,
    param5: number,
    param6: number,
    scene: Scene,
    group: SceneGroup
  ): Challenge {
    const realGroup = scene.scriptManager.getGroup(groupId)
    return new Challenge(scene, realGroup, challengeId, challengeIndex, [goal, groupId], 0, goal, [
      new KillMonsterCountTrigger(),
    ])
  }
}
