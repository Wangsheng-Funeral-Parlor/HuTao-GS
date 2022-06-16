import { Shape } from '.'

export default interface ConfigShapeRect extends Shape {
  UseHeight?: boolean
  Height?: number
  CenterType: string
  Width: number
  Length: number
}