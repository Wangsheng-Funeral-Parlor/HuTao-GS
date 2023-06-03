import { MusicBriefInfo, MusicGameRecord } from "."

export interface MusicGameActivityDetailInfo {
  musicGameRecordMap?: { [id: number]: MusicGameRecord }
  musicOwnBeatmapBriefList?: MusicBriefInfo[]
  musicBeatmapBriefList?: MusicBriefInfo[]
}
