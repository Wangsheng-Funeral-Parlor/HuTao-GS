import ProfileUserData from './ProfileUserData'
import PropsUserData from './PropsUserData'
import InventoryUserData from './InventoryUserData'
import AvatarUserData from './AvatarUserData'
import FlycloakUserData from './FlycloakUserData'
import CostumeUserData from './CostumeUserData'
import TeamManagerUserData from './TeamManagerUserData'
import WorldUserData from './WorldUserData'
import WidgetUserData from './WidgetUserData'

export default interface UserData {
  uid: number
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
  gameTime: number
}