import SkillData from '$/gameData/data/SkillData'
import SkillDepot from './skillDepot'

export default class Talent {
  depot: SkillDepot

  id: number
  prevTalent: Talent

  constructor(depot: SkillDepot, talentId: number) {
    this.depot = depot
    this.id = talentId
  }

  async init() {
    const { depot, id } = this
    const talentData = await SkillData.getTalent(id)
    if (!talentData) return

    if (talentData.PrevTalent != null) this.prevTalent = new Talent(depot, talentData.PrevTalent)
  }
}