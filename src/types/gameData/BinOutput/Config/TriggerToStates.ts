import BowDrawTime from './BowDrawTime'

export default interface TriggerToStates {
  Trigger: string
  PlayTime: number
  States: string[]
  BowDrawTimes: BowDrawTime[]
  FloatID: string
  FloatValue: number
}