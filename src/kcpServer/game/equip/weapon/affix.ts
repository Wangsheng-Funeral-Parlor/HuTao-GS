import Weapon from "."

import { WeaponAffixUserData } from "@/types/user/WeaponUserData"

export default class Affix {
  weapon: Weapon

  id: number
  level: number

  constructor(weapon: Weapon, id: number) {
    this.weapon = weapon
    this.id = id
  }

  init(userData: WeaponAffixUserData) {
    const { id, level } = userData
    if (id !== this.id) return this.initNew()

    this.level = level
  }

  initNew() {
    this.level = 0
  }

  exportUserData(): WeaponAffixUserData {
    const { id, level } = this

    return {
      id,
      level,
    }
  }
}
