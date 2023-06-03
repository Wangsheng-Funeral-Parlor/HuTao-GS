import Challenge from ".."
import InTimeTrigger from "../trigger/inTimeTrigger"
import TriggerGroupTrigger from "../trigger/triggerGroup"

import ChallengeFactoryHandler from "./handler"

import Scene from "$/scene"
import SceneGroup from "$/scene/sceneGroup"
import { EventTypeEnum } from "@/types/enum"

export default class TriggerInTimeChallengeFactoryHandler implements ChallengeFactoryHandler {
  public isThisType(challengeType: string): boolean {
    return challengeType === "CHALLENGE_TRIGGER_IN_TIME"
  }

  public build(
    challengeIndex: number,
    challengeId: number,
    timeLimit: number,
    param4: number,
    triggerTag: number,
    triggerCount: number,
    scene: Scene,
    group: SceneGroup
  ): Challenge {
    return new Challenge(
      scene,
      group,
      challengeId,
      challengeIndex,
      [timeLimit, triggerCount],
      timeLimit,
      triggerCount,
      [(new InTimeTrigger(), new TriggerGroupTrigger(EventTypeEnum[triggerTag]))]
    )
  }
}
