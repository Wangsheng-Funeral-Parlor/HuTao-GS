import ConfigBaseWidgetToy from '.'

export default interface ConfigWidgetToyTakePhoto extends ConfigBaseWidgetToy {
  $type: 'ConfigWidgetToyTakePhoto'
  HasCameraEffect: boolean
  CameraUIEffect: string
  CameraScreenEffect: string
  MainCameraEffect: string
}