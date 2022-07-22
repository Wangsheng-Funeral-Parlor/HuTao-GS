import { AvatarTypeEnum } from '../enum/avatar'
import EntityUserData from './EntityUserData'
import FettersUserData from './FettersUserData'
import SkillDepotUserData from './SkillDepotUserData'

export default interface AvatarUserData extends EntityUserData {
  guid: string
  id: number
  type: AvatarTypeEnum
  skillDepotData: SkillDepotUserData
  fettersData: FettersUserData
  weaponGuid?: string | false // compatibility
  equipGuidList: string[]
  flycloak: number
  costume: number
  bornTime: number
}