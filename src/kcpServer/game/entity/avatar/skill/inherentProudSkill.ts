import SkillDepot from "./skillDepot"

export default class InherentProudSkill {
  depot: SkillDepot
  id: number

  promoteLevel: number | null

  constructor(depot: SkillDepot, proudSkillId: number, promoteLevel: number | null) {
    this.depot = depot
    this.id = proudSkillId

    this.promoteLevel = promoteLevel
  }
}
