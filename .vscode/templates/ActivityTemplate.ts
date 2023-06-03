import ActivityManager from "$/manager/activityManager"
import Player from "$/player"
import { ActivityIdEnum } from "@/types/enum"
import { ActivityInfo } from "@/types/proto"
import Activity from "."

export default class TemplateGameActivity extends Activity {
  constructor(manager: ActivityManager, schedule: number, beginTime: number, endTime: number) {
    super(manager, ActivityIdEnum.TESTGAME, 2202, schedule, beginTime, endTime)
  }

  exportActivityInfo(player: Player): ActivityInfo {
    const info: ActivityInfo = super.exportActivityInfo(player)

    return info
  }
}
