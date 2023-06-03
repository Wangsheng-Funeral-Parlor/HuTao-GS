import Challenge from ".."
import InTimeTrigger from "../trigger/inTimeTrigger"
import KillMonsterTrigger from "../trigger/killMonsterTrigger"

import ChallengeFactoryHandler from "./handler"

import Scene from "$/scene"
import SceneGroup from "$/scene/sceneGroup"

export default class KillMonsterInTimeChallengeFactoryHandler implements ChallengeFactoryHandler {
  public isThisType(challengeType: string): boolean {
    return challengeType === "CHALLENGE_KILL_MONSTER_IN_TIME"
  }

  public build(
    challengeIndex: number,
    challengeId: number,
    timeLimit: number,
    groupId: number,
    targetCfgId: number,
    param6: number,
    scene: Scene,
    group: SceneGroup
  ): Challenge {
    const realGroup = scene.scriptManager.getGroup(groupId)

    return new Challenge(scene, realGroup, challengeId, challengeIndex, [timeLimit], timeLimit, 0, [
      new KillMonsterTrigger(targetCfgId),
      new InTimeTrigger(),
    ])
  }
}
