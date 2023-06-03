import AvatarUserData from "./AvatarUserData"
import CostumeUserData from "./CostumeUserData"
import FlycloakUserData from "./FlycloakUserData"
import GuidUserData from "./GuidUserData"
import InventoryUserData from "./InventoryUserData"
import ProfileUserData from "./ProfileUserData"
import PropsUserData from "./PropsUserData"
import TeamManagerUserData from "./TeamManagerUserData"
import WidgetUserData from "./WidgetUserData"
import WorldUserData from "./WorldUserData"

export default interface UserData {
  uid: number
  guidData: GuidUserData
  profileData: ProfileUserData
  propsData: PropsUserData
  openStateData: PropsUserData
  inventoryData: InventoryUserData
  widgetData: WidgetUserData
  avatarDataList: AvatarUserData[]
  teamData: TeamManagerUserData
  flycloakDataList: FlycloakUserData[]
  costumeDataList: CostumeUserData[]
  emojiIdList: number[]
  worldData: WorldUserData
  godMode: boolean
  gameTime: number
}
