import Challenge from ".."

import ChallengeTrigger from "."

import ChallengeData from "#/packets/ChallengeData"
import Gadget from "$/entity/gadget"

export default class KillGadgetTrigger extends ChallengeTrigger {
  public async onBegin(challenge: Challenge): Promise<void> {
    await ChallengeData.broadcastNotify(challenge.scene.broadcastContextList, {
      paramIndex: 2,
      value: challenge.score,
      challengeIndex: challenge.challengeIndex,
    })
  }

  public async onGadgetDeath(challenge: Challenge, gadget: Gadget): Promise<void> {
    const newScore = challenge.increaseScore

    await ChallengeData.broadcastNotify(challenge.scene.broadcastContextList, {
      paramIndex: 2,
      value: newScore,
      challengeIndex: challenge.challengeIndex,
    })

    if (newScore >= challenge.goal) {
      challenge.done()
    }
  }
}
