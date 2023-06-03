import Challenge from ".."

import ChallengeTrigger from "."

import ChallengeData from "#/packets/ChallengeData"

export default class TriggerGroupTrigger extends ChallengeTrigger {
  triggerTag: string

  constructor(triggerTag: string) {
    super()
    this.triggerTag = triggerTag
  }
  public async onBegin(challenge: Challenge): Promise<void> {
    await ChallengeData.broadcastNotify(challenge.scene.broadcastContextList, {
      paramIndex: 2,
      value: challenge.score,
      challengeIndex: challenge.challengeIndex,
    })
  }

  public async onGroupTrigger(challenge: Challenge, trigger: string): Promise<void> {
    if (!this.triggerTag.includes(trigger)) return

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
