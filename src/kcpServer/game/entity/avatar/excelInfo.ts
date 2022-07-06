import AvatarData from '$/gameData/data/AvatarData'
import Avatar from '.'

class Hash {
  pre: bigint
  suffix: bigint

  constructor(pre: bigint | number = 0n, suffix: bigint | number = 0n) {
    this.pre = BigInt(pre)
    this.suffix = BigInt(suffix)
  }

  export() {
    return ((this.pre << 32n) | (this.suffix)).toString()
  }
}

export default class ExcelInfo {
  avatar: Avatar

  prefabPathHash: Hash
  prefabPathRemoteHash: Hash
  controllerPathHash: Hash
  controllerPathRemoteHash: Hash
  combatConfigHash: Hash

  constructor(avatar: Avatar) {
    this.avatar = avatar

    this.prefabPathHash = new Hash(0, 0)
    this.prefabPathRemoteHash = new Hash(0, 0)
    this.controllerPathHash = new Hash(0, 0)
    this.controllerPathRemoteHash = new Hash(0, 0)
    this.combatConfigHash = new Hash(0, 0)
  }

  private async loadExcelData() {
    const avatarData = await AvatarData.getAvatar(this.avatar.avatarId)
    if (!avatarData) return

    const {
      PrefabPathHashPre,
      PrefabPathHashSuffix,
      PrefabPathRemoteHashPre,
      PrefabPathRemoteHashSuffix,
      ControllerPathHashPre,
      ControllerPathHashSuffix,
      ControllerPathRemoteHashPre,
      ControllerPathRemoteHashSuffix,
      CombatConfigHashPre,
      CombatConfigHashSuffix
    } = avatarData

    this.prefabPathHash = new Hash(PrefabPathHashPre, PrefabPathHashSuffix)
    this.prefabPathRemoteHash = new Hash(PrefabPathRemoteHashPre, PrefabPathRemoteHashSuffix)
    this.controllerPathHash = new Hash(ControllerPathHashPre, ControllerPathHashSuffix)
    this.controllerPathRemoteHash = new Hash(ControllerPathRemoteHashPre, ControllerPathRemoteHashSuffix)
    this.combatConfigHash = new Hash(CombatConfigHashPre, CombatConfigHashSuffix)
  }

  async init() {
    await this.loadExcelData()
  }

  export() {
    const {
      prefabPathHash,
      prefabPathRemoteHash,
      controllerPathHash,
      controllerPathRemoteHash,
      combatConfigHash
    } = this

    return {
      prefabPathHash: prefabPathHash.export(),
      prefabPathRemoteHash: prefabPathRemoteHash.export(),
      controllerPathHash: controllerPathHash.export(),
      controllerPathRemoteHash: controllerPathRemoteHash.export(),
      combatConfigHash: combatConfigHash.export()
    }
  }
}