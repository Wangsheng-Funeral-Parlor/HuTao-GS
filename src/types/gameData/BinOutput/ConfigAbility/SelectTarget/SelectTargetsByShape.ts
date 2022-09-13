import { SelectTargets } from '.'
import { DynamicNumber } from '../../Common/Dynamic'

export default interface SelectTargetsByShape extends SelectTargets {
  ShapeName: string
  CenterBasedOn: string
  CampTargetType: string
  CampBasedOn: string
  SizeRatio: DynamicNumber | number
}