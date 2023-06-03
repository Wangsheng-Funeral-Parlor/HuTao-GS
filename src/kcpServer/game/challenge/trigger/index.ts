/* eslint-disable @typescript-eslint/no-empty-function */
import Challenge from ".."

import Gadget from "$/entity/gadget"
import Monster from "$/entity/monster"

export default abstract class ChallengeTrigger {
  public async onBegin(challenge: Challenge): Promise<void> {}

  public async onFinish(challenge: Challenge): Promise<void> {}

  public async onMonsterDeath(challenge: Challenge, monster: Monster): Promise<void> {}

  public async onGadgetDeath(challenge: Challenge, gadget: Gadget): Promise<void> {}

  public async onCheckTimeout(challenge: Challenge): Promise<void> {}

  public async onGadgetDamage(challenge: Challenge, gadget: Gadget): Promise<void> {}

  public async onGroupTrigger(challenge: Challenge, trigger: string) {}
}
