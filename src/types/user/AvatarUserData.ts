import { AvatarTypeEnum } from "../proto/enum"

import EntityUserData from "./EntityUserData"
import FettersUserData from "./FettersUserData"
import SkillManagerUserData from "./SkillManagerUserData"
import TalentUserData from "./TalentUserData"

export default interface AvatarUserData extends EntityUserData {
  guid: string
  id: number
  type: AvatarTypeEnum
  talentData: TalentUserData
  skillsData: SkillManagerUserData
  fettersData: FettersUserData
  weaponGuid?: string | false // compatibility
  equipGuidList: string[]
  flycloak: number
  costume: number
  bornTime: number
}
