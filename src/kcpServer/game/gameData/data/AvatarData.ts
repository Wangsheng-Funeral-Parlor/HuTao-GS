import Loader from "$/gameData/loader"
import { EntityFightPropConfig } from "@/types/game"
import AvatarDataGroup, { AvatarData, CostumeData, FlycloakData } from "@/types/gameData/AvatarData"

class AvatarDataLoader extends Loader {
  declare data: AvatarDataGroup

  constructor() {
    super("AvatarData", "message.cache.debug.avatar")
  }

  async getData(): Promise<void> {
    await super.getData()
  }

  getAvatar(id: number, silent = false): AvatarData {
    const data = this.getAvatarList().find((avatar) => avatar.Id === id)
    if (!silent) {
      if (data == null) this.warn("message.loader.avatarData.warn.noData", id)
      else if (data.Config == null) this.warn("message.loader.avatarData.warn.noConfig", id)
    }
    return data
  }

  getAvatarByName(name: string, silent = false): AvatarData {
    const data = this.getAvatarList().find((avatar) => avatar.Name === name)
    if (!silent) {
      if (data == null) this.warn("message.loader.avatarData.warn.noData", name)
      else if (data.Config == null) this.warn("message.loader.avatarData.warn.noConfig", name)
    }
    return data
  }

  getAvatarList(): AvatarData[] {
    return this.data?.Avatar || []
  }

  getCostume(avatarId: number, id: number): CostumeData {
    return this.getCostumeList().find((costume) => costume.AvatarId === avatarId && costume.Id === id)
  }

  getCostumeList(): CostumeData[] {
    return this.data?.Costume || []
  }

  getFlycloak(id: number): FlycloakData {
    return this.getFlycloakList().find((flycloak) => flycloak.Id === id)
  }

  getFlycloakList(): FlycloakData[] {
    return this.data?.Flycloak || []
  }

  getFightPropConfig(id: number): EntityFightPropConfig {
    const data = this.getAvatar(id)
    if (!data) {
      this.warn("message.loader.avatarData.warn.noFightPropConfig", id)

      return {
        HpBase: 0,
        AttackBase: 0,
        DefenseBase: 0,
        Critical: 0,
        CriticalHurt: 0,
        PropGrowCurves: [],
      }
    }

    const { HpBase, AttackBase, DefenseBase, Critical, CriticalHurt, PropGrowCurves } = data

    return {
      HpBase,
      AttackBase,
      DefenseBase,
      Critical,
      CriticalHurt,
      PropGrowCurves: PropGrowCurves.map((c) => ({
        PropType: c.Type,
        Type: c.GrowCurve,
      })),
    }
  }
}

let loader: AvatarDataLoader
export default (() => (loader = loader || new AvatarDataLoader()))()
