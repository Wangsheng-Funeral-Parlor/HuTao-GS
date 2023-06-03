import Entity from "$/entity"
import TeamManager from "$/manager/teamManager"
import { EntityTypeEnum } from "@/types/enum"
import { ProtEntityTypeEnum } from "@/types/proto/enum"
import EntityUserData from "@/types/user/EntityUserData"

export default class TeamEntity extends Entity {
  teamManager: TeamManager

  constructor(manager: TeamManager) {
    super(true)

    this.teamManager = manager

    this.config = { PropGrowCurves: null }
    this.growCurve = []

    this.protEntityType = ProtEntityTypeEnum.PROT_ENTITY_TEAM
    this.entityType = EntityTypeEnum.Team
  }

  async init(userData: EntityUserData): Promise<void> {
    super.init(userData)
  }

  async initNew(level?: number): Promise<void> {
    super.initNew(level)
  }
}
