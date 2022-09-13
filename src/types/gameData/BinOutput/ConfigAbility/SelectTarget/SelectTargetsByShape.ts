import { SelectTarget } from '.'
import { DynamicNumber } from '../../Common/Dynamic'

export default interface SelectTargetByShape extends SelectTarget {
  ShapeName: string
  CenterBasedOn: string
  CampTargetType: string
  CampBasedOn: string
  SizeRatio: DynamicNumber | number
}