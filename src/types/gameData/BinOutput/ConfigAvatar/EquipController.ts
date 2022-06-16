export default interface EquipControllerConfig {
  SheathPoint: string
  DissolveSheathFadeDelay: number
  DissolveSheathFadeTime: number
  AttachPoints: {
    [attachPoint: string]: string
  }
}