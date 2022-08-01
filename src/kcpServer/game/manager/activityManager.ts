import { PacketContext } from '#/packet'
import ActivityInfoPacket from '#/packets/ActivityInfo'
import Activity from '$/activity'
import MusicGameActivity from '$/activity/musicGameActivity'
import Player from '$/player'
import { ActivityInfo, ActivityScheduleInfo } from '@/types/proto'
import { getTimeSeconds } from '@/utils/time'
import Game from '..'

export default class ActivityManager {
  game: Game

  activityList: Activity[]

  startDate: Date

  constructor(game: Game) {
    this.game = game

    this.activityList = [
      new MusicGameActivity(this, 1, 1655085600e3, 2444004000e3)
    ]

    this.startDate = new Date(1655064000e3)
  }

  get startTime() {
    return getTimeSeconds(this.startDate)
  }

  async sendAllActivityInfo(context: PacketContext): Promise<void> {
    const { activityList } = this
    for (const activity of activityList) await ActivityInfoPacket.sendNotify(context, activity.id)
  }

  exportActivityInfo(player: Player, id: number): ActivityInfo {
    return this.activityList.find(activity => activity.id === id)?.exportActivityInfo(player) || null
  }

  exportActivityInfoList(player: Player, idList: number[]): ActivityInfo[] {
    return idList.map(id => this.exportActivityInfo(player, id)).filter(info => info != null)
  }

  exportActivityScheduleInfoList(): ActivityScheduleInfo[] {
    return this.activityList.map(activity => activity.exportActivityScheduleInfo())
  }
}