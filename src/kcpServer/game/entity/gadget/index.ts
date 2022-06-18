import { ProtEntityTypeEnum } from '@/types/enum/entity'
import Entity from '$/entity'

export default class Gadget extends Entity {
  gadgetId: number
  ownerEntityId: number
  gadgetState: number
  gadgetType: number
  authorityPeerId: number
  isEnableInteract: boolean
  interactId: number
  markFlag: number
  propOwnerEntityId: number
  interactUidList: number[]
  draftId: number
  gadgetTalkState: number

  constructor() {
    super()

    this.entityType = ProtEntityTypeEnum.PROT_ENTITY_GADGET
  }
}