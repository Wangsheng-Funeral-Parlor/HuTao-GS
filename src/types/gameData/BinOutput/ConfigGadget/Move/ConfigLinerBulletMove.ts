import { Move } from '.'

export default interface ConfigLinerBulletMove extends Move {
  VelocityForce: {
    MuteAll: boolean
  }
  Speed: number
  Acceleration: number
  Delay: number
}