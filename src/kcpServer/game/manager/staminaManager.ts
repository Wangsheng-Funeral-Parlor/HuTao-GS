import BaseClass from '#/baseClass'
import VehicleStamina from '#/packets/VehicleStamina'
import Avatar from '$/entity/avatar'
import Vehicle from '$/entity/gadget/vehicle'
import Logger from '@/logger'
import { PlayerPropEnum } from '@/types/enum'
import { ChangeHpReasonEnum, MotionStateEnum } from '@/types/proto/enum'

const logger = new Logger('STAMIN', 0xa0a0ff)

const UPDATE_INTERVAL = 200
const RECOVER_AMOUNT = 500

export default class StaminaManager extends BaseClass {
  private entity: Avatar | Vehicle

  private startConsumeTime: number | null
  private startConsumeAquaticTime: number | null
  private startRecoverTime: number | null
  private startRecoverAquaticTime: number | null
  private immediateQueue: number[]

  private consumeAmount: number
  private consumeAquaticAmount: number
  private curVehicleStamina: number

  private timer: NodeJS.Timer

  public constructor(entity: Avatar | Vehicle) {
    super()

    this.entity = entity

    this.startConsumeTime = null
    this.startConsumeAquaticTime = null
    this.startRecoverTime = null
    this.startRecoverAquaticTime = null
    this.immediateQueue = []

    this.consumeAmount = 0
    this.consumeAquaticAmount = 0
    this.curVehicleStamina = null

    this.timer = null

    super.initHandlers(entity)
  }

  public get maxStamina() {
    const { entity } = this
    return entity.player.props.get(PlayerPropEnum.PROP_MAX_STAMINA)
  }

  public get maxAquaticStamina() {
    const { entity } = this
    return entity.player.props.get(PlayerPropEnum.PROP_MAX_AQUATIC_STAMINA)
  }

  public get curStamina() {
    const { curVehicleStamina, entity, maxStamina } = this
    if (entity instanceof Vehicle) return curVehicleStamina ?? maxStamina
    return entity.player.props.get(PlayerPropEnum.PROP_CUR_PERSIST_STAMINA)
  }

  public get curAquaticStamina(): number {
    const { entity } = this
    return entity.player.props.get(PlayerPropEnum.PROP_CUR_AQUATIC_STAMINA)
  }

  public start(): void {
    if (this.timer) this.stop()
    this.timer = setInterval(this.tick.bind(this), UPDATE_INTERVAL)
  }

  public immediate(value: number): void {
    const { immediateQueue } = this
    if (value <= 0) return

    immediateQueue.push(-value)
  }

  public async stop(): Promise<void> {
    await this.stopConsume()
    await this.stopRecover()

    const { timer } = this
    if (timer == null) return

    clearInterval(timer)
    this.timer = null
  }

  public async step(): Promise<void> {
    const { entity } = this
    const { motion } = entity
    const { state } = motion

    switch (state) { // NOSONAR
      case MotionStateEnum.MOTION_CLIMB:
        await this.setRelativeStamina(-150)
        break
    }
  }

  private get sceneTime() {
    return this.entity?.manager?.scene?.sceneTime || null
  }

  private async tick(): Promise<void> {
    const { startRecoverTime, immediateQueue, sceneTime } = this

    // Reset recover timer
    if (immediateQueue.length > 0 && startRecoverTime != null) this.startRecoverTime = sceneTime + 1e3

    // Update aquatic stamina
    const aquaticAmount = this.calcRecoverAquaticAmount() - this.calcConsumeAquaticAmount()
    if (aquaticAmount !== 0) await this.setRelativeAquaticStamina(aquaticAmount)

    // Update stamina
    const amount = (this.calcRecoverAmount() - this.calcConsumeAmount()) +
      immediateQueue.splice(0).reduce((p, v) => p + v, 0)
    if (amount === 0) return

    await this.setRelativeStamina(amount)

    // Check for drowning
    const { entity, maxStamina, curStamina } = this
    if (!entity.isAlive() || curStamina > 0) return

    if (entity instanceof Avatar && MotionStateEnum[entity.motion.state].includes('SWIM')) {
      this.startConsumeTime = null
      await this.setStamina(maxStamina)
      await entity.player.returnToSafePos(ChangeHpReasonEnum.CHANGE_HP_SUB_DRAWN)
    }
  }

  private async startConsume(value: number) {
    await this.stopConsume()
    await this.stopRecover()

    const { startConsumeTime, sceneTime } = this
    if (startConsumeTime != null || sceneTime == null) return

    this.startConsumeTime = sceneTime
    this.consumeAmount = value
  }

  private async startConsumeAquatic(value: number) {
    await this.stopConsumeAquatic()
    await this.stopRecoverAquatic()

    const { startConsumeAquaticTime, sceneTime } = this
    if (startConsumeAquaticTime != null || sceneTime == null) return

    this.startConsumeAquaticTime = sceneTime
    this.consumeAquaticAmount = value
  }

  private async stopConsume() {
    const { startConsumeTime } = this
    if (startConsumeTime == null) return

    await this.tick()
    this.startConsumeTime = null
  }

  private async stopConsumeAquatic() {
    const { startConsumeAquaticTime } = this
    if (startConsumeAquaticTime == null) return

    await this.tick()
    this.startConsumeAquaticTime = null
  }

  private async startRecover(delayed: boolean = false) {
    await this.stopConsume()

    const { startRecoverTime, sceneTime } = this
    if (startRecoverTime != null || sceneTime == null) return

    this.startRecoverTime = delayed ? sceneTime + 1e3 : sceneTime
  }

  private async startRecoverAquatic(delayed: boolean = false) {
    await this.stopConsumeAquatic()

    const { startRecoverAquaticTime, sceneTime } = this
    if (startRecoverAquaticTime != null || sceneTime == null) return

    this.startRecoverAquaticTime = delayed ? sceneTime + 1e3 : sceneTime
  }

  private async stopRecover() {
    const { startRecoverTime } = this
    if (startRecoverTime == null) return

    await this.tick()
    this.startRecoverTime = null
  }

  private async stopRecoverAquatic() {
    const { startRecoverAquaticTime } = this
    if (startRecoverAquaticTime == null) return

    await this.tick()
    this.startRecoverAquaticTime = null
  }

  private calcConsumeAmount(): number {
    const { startConsumeTime, consumeAmount, sceneTime } = this

    if (startConsumeTime == null) return 0
    const duration = Math.max(0, sceneTime - startConsumeTime)
    if (duration <= 0) return 0

    this.startConsumeTime = sceneTime
    return (duration / UPDATE_INTERVAL) * consumeAmount
  }

  private calcConsumeAquaticAmount(): number {
    const { startConsumeAquaticTime, consumeAquaticAmount, sceneTime } = this

    if (startConsumeAquaticTime == null) return 0
    const duration = Math.max(0, sceneTime - startConsumeAquaticTime)
    if (duration <= 0) return 0

    this.startConsumeAquaticTime = sceneTime
    return (duration / UPDATE_INTERVAL) * consumeAquaticAmount
  }

  private calcRecoverAmount(): number {
    const { startRecoverTime, sceneTime } = this

    if (startRecoverTime == null) return 0
    const duration = Math.max(0, sceneTime - startRecoverTime)
    if (duration <= 0) return 0

    this.startRecoverTime = sceneTime
    return (duration / UPDATE_INTERVAL) * RECOVER_AMOUNT
  }

  private calcRecoverAquaticAmount(): number {
    const { startRecoverAquaticTime, sceneTime } = this

    if (startRecoverAquaticTime == null) return 0
    const duration = Math.max(0, sceneTime - startRecoverAquaticTime)
    if (duration <= 0) return 0

    this.startRecoverAquaticTime = sceneTime
    return (duration / UPDATE_INTERVAL) * RECOVER_AMOUNT
  }

  private async setRelativeStamina(value: number) {
    const { maxStamina, curStamina } = this

    if (
      value === 0 ||
      (curStamina <= 0 && value < 0) ||
      (curStamina >= maxStamina && value > 0)
    ) return

    await this.setStamina(curStamina + value)
  }

  private async setRelativeAquaticStamina(value: number) {
    const { maxAquaticStamina, curAquaticStamina } = this

    if (
      value === 0 ||
      (curAquaticStamina <= 0 && value < 0) ||
      (curAquaticStamina >= maxAquaticStamina && value > 0)
    ) return

    await this.setAquaticStamina(curAquaticStamina + value)
  }

  private async setStamina(value: number) {
    const { entity, maxStamina, curStamina } = this
    const { manager, player, godMode } = entity

    if (godMode && value < curStamina) return

    value = Math.max(0, Math.min(maxStamina, value))

    if (entity instanceof Avatar) {
      await player.props.set(PlayerPropEnum.PROP_CUR_PERSIST_STAMINA, value, true)
    } else if (entity instanceof Vehicle) {
      this.curVehicleStamina = value
      if (manager) await VehicleStamina.broadcastNotify(manager.scene.broadcastContextList, entity)
    }
  }

  private async setAquaticStamina(value: number) {
    const { entity, maxAquaticStamina, curAquaticStamina } = this
    const { player, godMode } = entity

    if (godMode && value < curAquaticStamina) return

    value = Math.max(0, Math.min(maxAquaticStamina, value))

    if (entity instanceof Avatar) await player.props.set(PlayerPropEnum.PROP_CUR_AQUATIC_STAMINA, value, true)
  }

  /**Events**/

  // MotionStateChanged
  public async handleMotionStateChanged(state: MotionStateEnum, oldState: MotionStateEnum): Promise<void> {
    // Log unknown motion state change
    if (MotionStateEnum[state] == null || MotionStateEnum[oldState] == null) {
      logger.debug(`Motion state change: ${MotionStateEnum[oldState] ?? oldState}->${MotionStateEnum[state] ?? state}`)
    }

    switch (state) {
      case MotionStateEnum.MOTION_DASH:
      case MotionStateEnum.MOTION_DANGER_DASH:
        await this.startConsume(360)
        break
      case MotionStateEnum.MOTION_DASH_BEFORE_SHAKE:
        this.immediate(1800)
        break
      case MotionStateEnum.MOTION_CLIMB_JUMP:
        this.immediate(2500)
        break
      case MotionStateEnum.MOTION_FLY:
      case MotionStateEnum.MOTION_FLY_FAST:
      case MotionStateEnum.MOTION_FLY_SLOW:
        await this.startConsume(60)
        break
      case MotionStateEnum.MOTION_SWIM_DASH:
        await this.startConsume(204)
        break
      case MotionStateEnum.MOTION_SWIM_MOVE:
        await this.startConsume(80)
        break
      case MotionStateEnum.MOTION_NOTIFY:
      case MotionStateEnum.MOTION_SLIP:
      case MotionStateEnum.MOTION_LADDER_SLIP:
      case MotionStateEnum.MOTION_FLY_IDLE:
      case MotionStateEnum.MOTION_SWIM_IDLE:
      // stamina step
      case MotionStateEnum.MOTION_CLIMB:
        await this.stopConsume()
        await this.stopRecover()
        break
      case MotionStateEnum.MOTION_SKIFF_DASH:
        await this.startConsume(204)
        break
      case MotionStateEnum.MOTION_POWERED_FLY:
      case MotionStateEnum.MOTION_SKIFF_POWERED_DASH:
        this.startRecover()
        break
      default:
        this.startRecover(oldState !== MotionStateEnum.MOTION_NOTIFY)
        break
    }

    switch (state) {
      case MotionStateEnum.MOTION_AQUATIC_DIVE_DASH:
      case MotionStateEnum.MOTION_AQUATIC_SWIM_DASH:
        await this.startConsumeAquatic(204)
        break
      default:
        this.startRecoverAquatic()
        break
    }
  }

  // OnScene
  public async handleOnScene(): Promise<void> {
    this.start()
  }

  // OffScene
  public async handleOffScene(): Promise<void> {
    await this.stop()
  }
}