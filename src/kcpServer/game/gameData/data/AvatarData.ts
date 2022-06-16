import Loader from '$/gameData/loader'
import AvatarDataGroup, { AvatarData, CostumeData, FlycloakData } from '@/types/data/AvatarData'
import { EntityFightPropConfig } from '@/types/game/entity'

class AvatarDataLoader extends Loader {
  declare data: AvatarDataGroup

  constructor() {
    super('AvatarData')
  }

  getAvatarList(): AvatarData[] {
    return this.data.Avatar || []
  }

  getCostumeList(): CostumeData[] {
    return this.data.Costume || []
  }

  getFlycloakList(): FlycloakData[] {
    return this.data.Flycloak || []
  }

  getAvatar(id: number): AvatarData {
    return this.getAvatarList()?.find(avatar => avatar.Id === id)
  }

  getAvatarByName(name: string): AvatarData {
    return this.getAvatarList()?.find(avatar => avatar.Name === name)
  }

  getCostume(avatarId: number, id: number): CostumeData {
    return this.getCostumeList()?.find(costume => costume.AvatarId === avatarId && costume.Id === id)
  }

  getFlycloak(id: number): FlycloakData {
    return this.getFlycloakList()?.find(flycloak => flycloak.Id === id)
  }

  getFightPropConfig(id: number): EntityFightPropConfig {
    const data = this.getAvatar(id)
    if (!data) {
      return {
        HpBase: 0,
        AttackBase: 0,
        DefenseBase: 0,
        Critical: 0,
        CriticalHurt: 0,
        PropGrowCurves: []
      }
    }

    const { HpBase, AttackBase, DefenseBase, Critical, CriticalHurt, PropGrowCurves } = data

    return {
      HpBase,
      AttackBase,
      DefenseBase,
      Critical,
      CriticalHurt,
      PropGrowCurves: PropGrowCurves.map(c => ({
        PropType: c.Type,
        Type: c.GrowCurve
      }))
    }
  }
}

let loader: AvatarDataLoader
export default (() => loader = loader || new AvatarDataLoader())()