import Loader from '$/gameData/loader'
import AvatarDataGroup, { AvatarData, CostumeData, FlycloakData } from '@/types/gameData/AvatarData'
import { EntityFightPropConfig } from '@/types/game/entity'

class AvatarDataLoader extends Loader {
  declare data: AvatarDataGroup

  constructor() {
    super('AvatarData')
  }

  async getData(): Promise<AvatarDataGroup> {
    return super.getData()
  }

  async getAvatarList(): Promise<AvatarData[]> {
    return (await this.getData())?.Avatar || []
  }

  async getAvatar(id: number): Promise<AvatarData> {
    return (await this.getAvatarList())?.find(avatar => avatar.Id === id)
  }

  async getAvatarByName(name: string): Promise<AvatarData> {
    return (await this.getAvatarList())?.find(avatar => avatar.Name === name)
  }

  async getCostume(avatarId: number, id: number): Promise<CostumeData> {
    return (await this.getCostumeList())?.find(costume => costume.AvatarId === avatarId && costume.Id === id)
  }

  async getCostumeList(): Promise<CostumeData[]> {
    return (await this.getData())?.Costume || []
  }

  async getFlycloak(id: number): Promise<FlycloakData> {
    return (await this.getFlycloakList())?.find(flycloak => flycloak.Id === id)
  }

  async getFlycloakList(): Promise<FlycloakData[]> {
    return (await this.getData())?.Flycloak || []
  }

  async getFightPropConfig(id: number): Promise<EntityFightPropConfig> {
    const data = await this.getAvatar(id)
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