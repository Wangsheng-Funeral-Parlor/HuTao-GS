import ConfigBaseBornType from '.'

export default interface ConfigBornByStormLightning extends ConfigBaseBornType {
  $type: 'ConfigBornByStormLightning'
  HitHeightRatio: number
  SelectRange: number
  MaxOffsetLen: number
  LightningHitOrNotRatio: number
}