import ConfigBaseScenePoint from '.'

export default interface SceneTransPoint extends ConfigBaseScenePoint {
  $type: 'SceneTransPoint'
  MaxSpringVolume: number
  CutsceneList: number[]
  NpcId: number
}