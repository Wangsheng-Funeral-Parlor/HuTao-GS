import ActivityManager from "$/manager/activityManager"
import Player from "$/player"
import { ActivityInfo, ActivityScheduleInfo } from "@/types/proto"
import { getTimeSeconds } from "@/utils/time"

export default class Activity {
  manager: ActivityManager

  id: number
  type: number
  schedule: number

  beginDate: Date
  endDate: Date

  constructor(
    manager: ActivityManager,
    id: number,
    type: number,
    schedule: number,
    beginTime: number,
    endTime: number
  ) {
    this.manager = manager

    this.id = id
    this.type = type
    this.schedule = schedule

    this.beginDate = new Date(beginTime)
    this.endDate = new Date(endTime)
  }

  get scheduleId(): number {
    const { id, schedule } = this
    return id * 1e3 + schedule
  }

  get beginTime(): number {
    return getTimeSeconds(this.beginDate)
  }

  get endTime(): number {
    return getTimeSeconds(this.endDate)
  }

  exportActivityScheduleInfo(): ActivityScheduleInfo {
    const { id, scheduleId, beginTime, endTime } = this
    const now = getTimeSeconds()

    return {
      activityId: id,
      isOpen: now >= beginTime && now < endTime,
      scheduleId,
      beginTime,
      endTime,
    }
  }

  exportActivityInfo(_player: Player): ActivityInfo {
    const { manager, id, type, scheduleId, beginTime, endTime } = this

    return {
      activityId: id,
      scheduleId,
      activityType: type,
      beginTime,
      endTime,
      watcherInfoList: [],
      meetCondList: [],
      expireCondList: [],
      firstDayStartTime: manager.startTime,
      takenRewardList: [],
    }
  }
}
