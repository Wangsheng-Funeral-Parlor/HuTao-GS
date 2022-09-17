import ConfigBaseShape from '.'

export default interface ConfigShapeRect extends ConfigBaseShape {
  $type: 'ConfigShapeRect'
  CenterType: string
  Width: number
  Length: number
}