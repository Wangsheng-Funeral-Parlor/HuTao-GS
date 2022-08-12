import AnimEventConfig from './AnimEventConfig'

export default interface CombatConfig {
  Property: {
    EndureType: string
    Weight: number
  }
  BeHit: {
    HitBloodEffect: string
  }
  CombatLock: {
    LockShape: string
    LockWeightYaxisParam: number
    LockWeightYaxisThreshold: number
    LockType: string
  }
  Die: {
    HasAnimatorDie: boolean
    DieEndTime: number
    DieForceDisappearTime: number
    DieDisappearEffect: string
    DieShaderData: string
    UseRagDoll: boolean
    RagDollDieEndTimeDelay: number
  }
  AnimEvents: {
    [name: string]: AnimEventConfig
  }
}