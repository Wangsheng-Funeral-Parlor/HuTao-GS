import ChallengeTrigger from "./trigger"

import DungeonChallengeBegin from "#/packets/DungeonChallengeBegin"
import DungeonChallengeFinish from "#/packets/DungeonChallengeFinish"
import Gadget from "$/entity/gadget"
import Monster from "$/entity/monster"
import Scene from "$/scene"
import SceneGroup from "$/scene/sceneGroup"
import Logger from "@/logger"
import { EventTypeEnum } from "@/types/enum"

export default class Challenge {
  scene: Scene
  sceneGroup: SceneGroup
  challengeId: number
  challengeIndex: number
  paramList: number[]
  timeLimit: number
  goal: number
  score: number
  progress: boolean
  success: boolean
  startedAt: number
  finishedTime: number
  challengeTrigger: ChallengeTrigger[]

  logger: Logger

  constructor(
    scene: Scene,
    sceneGroup: SceneGroup,
    challengeId: number,
    challengeIndex: number,
    paramList: number[],
    timeLimit: number,
    goal: number,
    challengeTrigger: ChallengeTrigger[]
  ) {
    this.scene = scene
    this.sceneGroup = sceneGroup
    this.challengeId = challengeId
    this.challengeIndex = challengeIndex
    this.paramList = paramList
    this.timeLimit = timeLimit
    this.goal = goal
    this.challengeTrigger = challengeTrigger
    this.score = 0

    this.logger = new Logger("Challenge", 0x8696fe)
  }

  get increaseScore() {
    this.score += 1
    return this.score
  }

  public onCheckTimeOut() {
    if (!this.progress || this.timeLimit <= 0) return

    this.challengeTrigger.forEach((t) => t.onCheckTimeout(this))
  }
  public async start() {
    if (this.progress) return this.logger.debug("Challenge already started")
    this.progress = true
    this.startedAt = Date.now()

    await DungeonChallengeBegin.broadcastNotify(this.scene.broadcastContextList, this)

    this.challengeTrigger.forEach((t) => t.onBegin(this))
  }

  public async done() {
    if (!this.progress) return
    await this.finish(true)

    this.scene.scriptManager.emit(EventTypeEnum.EVENT_CHALLENGE_SUCCESS, this.sceneGroup.id)
  }

  public async fail() {
    if (!this.progress) return
    this.progress = false

    await this.finish(false)

    this.scene.scriptManager.emit(EventTypeEnum.EVENT_CHALLENGE_FAIL, this.sceneGroup.id)
  }

  private async finish(success: boolean) {
    this.progress = false
    this.success = success
    this.finishedTime = this.scene.timestamp - this.startedAt

    await DungeonChallengeFinish.broadcastNotify(this.scene.broadcastContextList, this)

    this.challengeTrigger.forEach((t) => t.onFinish(this))

    this.scene.activeChallenge = null
  }

  public onMonsterDeath(monster: Monster) {
    if (!this.progress || monster.groupId != this.sceneGroup.id) return

    this.challengeTrigger.forEach((t) => t.onMonsterDeath(this, monster))
  }

  public onGadgetDeath(gadget: Gadget) {
    if (!this.progress || gadget.groupId != this.sceneGroup.id) return

    this.challengeTrigger.forEach((t) => t.onGadgetDeath(this, gadget))
  }

  public onGroupTriggerDeath(trigger: string, triggerGroup: SceneGroup) {
    if (!this.progress || triggerGroup == null || triggerGroup.id != this.sceneGroup.id) return

    this.challengeTrigger.forEach((t) => t.onGroupTrigger(this, trigger))
  }

  public onGadgetDamage(gadget: Gadget) {
    if (!this.progress || gadget.groupId != this.sceneGroup.id) return

    this.challengeTrigger.forEach((t) => t.onGadgetDamage(this, gadget))
  }
}
