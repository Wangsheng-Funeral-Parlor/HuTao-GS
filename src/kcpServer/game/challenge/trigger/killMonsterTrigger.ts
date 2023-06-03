import Challenge from ".."

import ChallengeTrigger from "."

import ChallengeData from "#/packets/ChallengeData"
import Monster from "$/entity/monster"

export default class KillMonsterTrigger extends ChallengeTrigger {
  monsterCfgId: number

  constructor(monsterCfgId: number) {
    super()

    this.monsterCfgId = monsterCfgId
  }

  public async onBegin(challenge: Challenge): Promise<void> {
    await ChallengeData.broadcastNotify(challenge.scene.broadcastContextList, {
      paramIndex: 1,
      value: challenge.score,
      challengeIndex: challenge.challengeIndex,
    })
  }

  public async onMonsterDeath(challenge: Challenge, monster: Monster): Promise<void> {
    if (monster.configId == this.monsterCfgId) {
      challenge.done()
    }
  }
}
