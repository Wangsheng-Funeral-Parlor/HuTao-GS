import Challenge from ".."
import GuardTrigger from "../trigger/guardTrigger"
import KillMonsterCountTrigger from "../trigger/killMonsterCountTrigger"

import ChallengeFactoryHandler from "./handler"

import Scene from "$/scene"
import SceneGroup from "$/scene/sceneGroup"

export default class KillAndGuardChallengeFactoryHandler implements ChallengeFactoryHandler {
  public isThisType(challengeType: string): boolean {
    return challengeType === "CHALLENGE_KILL_COUNT_GUARD_HP"
  }

  public build(
    challengeIndex: number,
    challengeId: number,
    groupId: number,
    monstersToKill: number,
    gadgetCFGId: number,
    unused: number,
    scene: Scene,
    group: SceneGroup
  ): Challenge {
    const realGroup = scene.scriptManager.getGroup(groupId)
    return new Challenge(scene, realGroup, challengeId, challengeIndex, [monstersToKill, 0], 0, monstersToKill, [
      new KillMonsterCountTrigger(),
      new GuardTrigger(gadgetCFGId),
    ])
  }
}
