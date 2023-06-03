import Challenge from ".."

import ChallengeTrigger from "."

import ChallengeData from "#/packets/ChallengeData"
import Gadget from "$/entity/gadget"
import { FightPropEnum } from "@/types/enum"

export default class GuardTrigger extends ChallengeTrigger {
  entityToProtectCFGId: number
  lastSendPercent = 100

  constructor(entityToProtectCFGId: number) {
    super()

    this.entityToProtectCFGId = entityToProtectCFGId
  }

  public async onBegin(challenge: Challenge): Promise<void> {
    await ChallengeData.broadcastNotify(challenge.scene.broadcastContextList, {
      paramIndex: 2,
      value: 100,
      challengeIndex: challenge.challengeIndex,
    })
  }

  public async onGadgetDamage(challenge: Challenge, gadget: Gadget): Promise<void> {
    if (gadget.configId != this.entityToProtectCFGId) return

    const curHP = gadget.fightProps.get(FightPropEnum.FIGHT_PROP_CUR_HP)
    const maxHP = gadget.fightProps.get(FightPropEnum.FIGHT_PROP_MAX_HP)
    const percent = curHP / maxHP

    if (percent != this.lastSendPercent) {
      this.lastSendPercent = percent
      await ChallengeData.broadcastNotify(challenge.scene.broadcastContextList, {
        paramIndex: 3,
        value: percent,
        challengeIndex: challenge.challengeIndex,
      })
    }

    if (percent <= 0) {
      await challenge.fail()
    }
  }
}
