import AvatarData from '$/gameData/data/AvatarData'
import AbilityManager from '$/manager/abilityManager'
import { ProtEntityTypeEnum } from '@/types/enum/entity'
import { AbilityAppliedAbility, AbilityAppliedModifier, AbilityEmbryo } from '@/types/game/ability'
import Ability from '.'
import Entity from '../entity'
import Avatar from '../entity/avatar'

const AvatarDefaultAbilities = [
  'Avatar_DefaultAbility_VisionReplaceDieInvincible',
  'Avatar_DefaultAbility_AvartarInShaderChange',
  'Avatar_SprintBS_Invincible',
  'Avatar_Freeze_Duration_Reducer',
  'Avatar_Attack_ReviveEnergy',
  'Avatar_Component_Initializer',
  'Avatar_FallAnthem_Achievement_Listener'
]

export default class AbilityList {
  entity: Entity

  abilityList: Ability[]

  constructor(entity: Entity) {
    this.entity = entity

    this.abilityList = []
  }

  update() {
    this.clear()

    switch (this.entity.entityType) {
      case ProtEntityTypeEnum.PROT_ENTITY_AVATAR:
        this.addAvatarAbilities()
        break
      case ProtEntityTypeEnum.PROT_ENTITY_MONSTER:
        break
      case ProtEntityTypeEnum.PROT_ENTITY_TEAM:
        break
    }
  }

  addAvatarAbilities() {
    // Default abilities
    for (let ability of AvatarDefaultAbilities) this.add(ability)

    const { avatarId } = this.entity as Avatar
    const data = AvatarData.getAvatar(avatarId)
    if (!data) return

    for (let ability of data.Config.Abilities) {
      this.add(ability.AbilityName, ability.AbilityOverride || 'Default')
    }
  }

  add(name: string = 'Default', overrideName: string = 'Default') {
    const { abilityList } = this
    if (abilityList.find(a => a.name === name && a.overrideName === overrideName)) return

    abilityList.push(new Ability(this, name, overrideName))
  }

  clear() {
    const { abilityList } = this
    while (abilityList.length > 0) abilityList.shift()
  }

  register(manager: AbilityManager) {
    if (!manager) return
    const { abilityList } = this
    for (let ability of abilityList) manager.register(ability)
  }

  unregister(manager: AbilityManager) {
    if (!manager) return
    const { abilityList } = this
    for (let ability of abilityList) manager.unregister(ability)
  }

  exportAppliedAbilityList(): AbilityAppliedAbility[] {
    return []
  }

  exportappliedModifierList(): AbilityAppliedModifier[] {
    return []
  }

  exportEmbryoList(): AbilityEmbryo[] {
    return this.abilityList.map(ability => ability.exportEmbryo())
  }
}