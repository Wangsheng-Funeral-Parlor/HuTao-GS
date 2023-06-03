import Challenge from ".."

import ChallengeTrigger from "."

import ChallengeData from "#/packets/ChallengeData"
import Monster from "$/entity/monster"

export default class KillMonsterCountTrigger extends ChallengeTrigger {
  public async onBegin(challenge: Challenge): Promise<void> {
    await ChallengeData.broadcastNotify(challenge.scene.broadcastContextList, {
      paramIndex: 1,
      value: challenge.score,
      challengeIndex: challenge.challengeIndex,
    })
  }
  public async onMonsterDeath(challenge: Challenge, monster: Monster): Promise<void> {
    const newScore = challenge.increaseScore

    await ChallengeData.broadcastNotify(challenge.scene.broadcastContextList, {
      paramIndex: 1,
      value: newScore,
      challengeIndex: challenge.challengeIndex,
    })
    if (newScore >= challenge.goal) {
      challenge.done()
    }
  }
}
