import Loader from '$/gameData/loader'
import { EntityFightPropConfig } from '@/types/game'
import AvatarDataGroup, { AvatarData, CostumeData, FlycloakData } from '@/types/gameData/AvatarData'

class AvatarDataLoader extends Loader {
  declare data: AvatarDataGroup

  constructor() {
    super('AvatarData')
  }

  async getData(): Promise<AvatarDataGroup> {
    return super.getData()
  }

  async getAvatar(id: number, silent: boolean = false): Promise<AvatarData> {
    const data = (await this.getAvatarList())?.find(avatar => avatar.Id === id)
    if (!silent) {
      if (data == null) this.warn('message.loader.avatarData.warn.noData', id)
      else if (data.Config == null) this.warn('message.loader.avatarData.warn.noConfig', id)
    }
    return data
  }

  async getAvatarByName(name: string, silent: boolean = false): Promise<AvatarData> {
    const data = (await this.getAvatarList())?.find(avatar => avatar.Name === name)
    if (!silent) {
      if (data == null) this.warn('message.loader.avatarData.warn.noData', name)
      else if (data.Config == null) this.warn('message.loader.avatarData.warn.noConfig', name)
    }
    return data
  }

  async getAvatarList(): Promise<AvatarData[]> {
    return (await this.getData())?.Avatar || []
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
      this.warn('message.loader.avatarData.warn.noFightPropConfig', id)

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