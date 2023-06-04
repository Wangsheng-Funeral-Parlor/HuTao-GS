import UserData from "../user"

export interface PlayerInfo {
  uid: number
  userData: UserData | false
}
