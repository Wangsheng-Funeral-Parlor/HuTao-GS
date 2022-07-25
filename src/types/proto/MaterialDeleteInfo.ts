import { CountDownDelete, DateTimeDelete, DelayWeekCountDownDelete } from '.'

export interface MaterialDeleteInfo {
  countDownDelete?: CountDownDelete
  dateDelete?: DateTimeDelete
  delayWeekCountDownDelete?: DelayWeekCountDownDelete
  hasDeleteConfig: boolean
}