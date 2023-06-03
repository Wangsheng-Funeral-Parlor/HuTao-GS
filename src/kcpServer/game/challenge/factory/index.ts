import ChallengeFactoryHandler from "./handler"
import KillAndGuardChallengeFactoryHandler from "./killAndGuard"
import KillMonsterCountChallengeFactoryHandler from "./killMonsterCount"
import KillMonsterInTimeChallengeFactoryHandler from "./killMonsterInTime"
import KillMonsterTimeChallengeFactoryHandler from "./killMonsterTime"
import SurviveChallengeFactoryHandler from "./survive"
import TriggerInTimeChallengeFactoryHandler from "./triggerInTime"

import DungeonData from "$/gameData/data/DungeonData"
import Scene from "$/scene"
import SceneGroup from "$/scene/sceneGroup"

export default class ChallengeFactory {
  private static challengeFactoryHandlers: Array<ChallengeFactoryHandler> = []

  static {
    this.challengeFactoryHandlers.push(new KillAndGuardChallengeFactoryHandler())
    this.challengeFactoryHandlers.push(new KillMonsterCountChallengeFactoryHandler())
    this.challengeFactoryHandlers.push(new KillMonsterInTimeChallengeFactoryHandler())
    this.challengeFactoryHandlers.push(new KillMonsterTimeChallengeFactoryHandler())
    this.challengeFactoryHandlers.push(new SurviveChallengeFactoryHandler())
    this.challengeFactoryHandlers.push(new TriggerInTimeChallengeFactoryHandler())
  }

  public static getChallenge(
    localChallengeId: number,
    challengeDataId: number,
    param3: number,
    param4: number,
    param5: number,
    param6: number,
    scene: Scene,
    group: SceneGroup
  ) {
    const data = DungeonData.getDungeonChallenge(challengeDataId)

    console.log(data)
    for (const handler of this.challengeFactoryHandlers) {
      if (!handler.isThisType(data.ChallengeType)) continue

      return handler.build(localChallengeId, challengeDataId, param3, param4, param5, param6, scene, group)
    }
  }
}
