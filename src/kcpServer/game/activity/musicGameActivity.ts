import ActivityManager from '$/manager/activityManager'
import Player from '$/player'
import { ActivityIdEnum } from '@/types/enum'
import { ActivityInfo, MusicGameRecord } from '@/types/proto'
import Activity from '.'

const watcherIdList = [
  15072021, 15072020, 15072019, 15072018, 15072017,
  15072016, 15072015, 15072014, 15072013, 15072012,
  15072005, 15072004, 15072003, 15072001, 15072002,
  15072006, 15072007, 15072008, 15072009, 15072010,
  15072011
]

const meetCondList = [
  5072001, 5072002, 5072003, 5072004, 5072005,
  5072006, 5072007, 5072008, 5072009, 5072011,
  5072013
]

export default class MusicGameActivity extends Activity {
  constructor(manager: ActivityManager, schedule: number, beginTime: number, endTime: number) {
    super(manager, ActivityIdEnum.MUSIC_GAME, 2202, schedule, beginTime, endTime)
  }

  exportActivityInfo(player: Player): ActivityInfo {
    const info: ActivityInfo = super.exportActivityInfo(player)

    info.watcherInfoList = watcherIdList.map(id => ({
      watcherId: id,
      curProgress: 1,
      totalProgress: 1,
      isTakenReward: true
    }))
    info.meetCondList = meetCondList

    const musicGameRecordMap: { [id: number]: MusicGameRecord } = {}
    for (let i = 1; i <= (7 * 3); i++) musicGameRecordMap[i] = { isUnlock: true }

    info.musicGameInfo = {
      musicGameRecordMap
    }

    return info
  }
}