import Challenge from ".."

import ChallengeTrigger from "."

export default class ForTimeTrigger extends ChallengeTrigger {
  public async onCheckTimeout(challenge: Challenge): Promise<void> {
    const current = challenge.scene.timestamp

    if (current - challenge.startedAt > challenge.timeLimit) {
      await challenge.done()
    }
  }
}
