import SkillDepot from './skillDepot'

export default class InherentProudSkill {
  depot: SkillDepot
  id: number

  constructor(depot: SkillDepot, proudSkillId: number) {
    this.depot = depot
    this.id = proudSkillId
  }
}