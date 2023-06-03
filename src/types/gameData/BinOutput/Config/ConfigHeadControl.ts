export default interface ConfigHeadControl {
  UseHeadControl: boolean
  MaxYawDegree: number
  MaxPitchDegree: number
  Speed: number
  WeightSpeed: number
  UseWhiteAnimStates: boolean
  AnimStates: string[]
  DontAnimStates: string[]
}
