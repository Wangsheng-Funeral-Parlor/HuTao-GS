import { AvatarTypeEnum } from '../proto/enum'
import EntityUserData from './EntityUserData'
import FettersUserData from './FettersUserData'
import SkillManagerUserData from './SkillManagerUserData'

export default interface AvatarUserData extends EntityUserData {
  guid: string
  id: number
  type: AvatarTypeEnum
  skillsData: SkillManagerUserData
  fettersData: FettersUserData
  weaponGuid?: string | false // compatibility
  equipGuidList: string[]
  flycloak: number
  costume: number
  bornTime: number
}