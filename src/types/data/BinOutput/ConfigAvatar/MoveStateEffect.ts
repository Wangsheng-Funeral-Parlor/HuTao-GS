export default interface MoveStateEffectConfig {
  Footprint: {
    DefaultEffectPatternName: string
    SpecialSurfaces: {
      [name: string]: {
        [platform: string]: {
          Effect: string
          Deformation: string
        }
      }
    }
  }
}