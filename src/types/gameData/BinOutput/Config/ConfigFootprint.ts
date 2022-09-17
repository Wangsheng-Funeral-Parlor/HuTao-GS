import ConfigFootprintEffect from './ConfigFootprintEffect'

export default interface ConfigFootprint {
  DefaultEffectPatternName: string
  SpecialSurfaces: { [platform: string]: ConfigFootprintEffect }
}