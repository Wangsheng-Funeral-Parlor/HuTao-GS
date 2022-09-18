import BaseCreateEntity from '.'

export default interface CreateGadget extends BaseCreateEntity {
  $type: 'CreateGadget'
  GadgetID: number
  CampID: number
  CampTargetType: string
  ByServer: boolean
}