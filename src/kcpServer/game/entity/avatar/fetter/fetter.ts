import FetterList from "./fetterList"

import { PlayerPropEnum } from "@/types/enum"
import FetterConfig, { FetterCond } from "@/types/gameData/ExcelBinOutput/Common/FetterConfig"
import { FetterInfo } from "@/types/proto"
import { FetterStateEnum } from "@/types/proto/enum"

export default class Fetter {
  fetterList: FetterList
  id: number
  openConds: FetterCond[]
  finishConds: FetterCond[]
  state: FetterStateEnum

  constructor(fetterList: FetterList, data: FetterConfig) {
    this.fetterList = fetterList

    const { FetterId, OpenConds, FinishConds } = data

    this.id = FetterId
    this.openConds = OpenConds
    this.finishConds = FinishConds
  }

  update() {
    const { fetterList: fetterInfo, openConds } = this

    let condMatch = true

    for (const cond of openConds) {
      const { CondType, ParamList } = cond

      if (CondType == null) continue

      switch (CondType) {
        case "FETTER_COND_AVATAR_PROMOTE_LEVEL":
          condMatch = fetterInfo.avatar.props.get(PlayerPropEnum.PROP_BREAK_LEVEL) >= ParamList[0]
          break
        case "FETTER_COND_FETTER_LEVEL":
          condMatch = fetterInfo.expLevel >= ParamList[0]
          break
        case "FETTER_COND_UNLOCK_TRANS_POINT":
        case "FETTER_COND_PLAYER_BIRTHDAY":
          condMatch = true
          break
        default:
          condMatch = false
      }

      if (!condMatch) break
    }

    this.state = condMatch ? FetterStateEnum.OPEN : FetterStateEnum.NOT_OPEN
  }

  export(): FetterInfo {
    const { id, state } = this

    return {
      fetterId: id,
      fetterState: state,
    }
  }
}
