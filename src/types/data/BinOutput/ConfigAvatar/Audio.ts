interface AudioStateConfig {
  CurrentStateName: string
  AudioEvent: {
    Text: string
  }
  OtherStateNames?: string[]
  Usage?: string
}

interface RecurrentSpeecheConfig {
  Start: {
    Upper: number
    Lower: number
  }
  Interval: {
    Upper: number
    Lower: number
  }
  EventName: {
    Text: string
  }
}

export default interface AudioConfig {
  AnimAudio: {
    OnTransitionIn: AudioStateConfig[]
    OnTransitionOut: AudioStateConfig[]
    RecurrentSpeeches: {
      [name: string]: RecurrentSpeecheConfig
    }
  }
  MoveStateAudio: {
    OnStateBegin: AudioStateConfig[]
    OnStateEnd: AudioStateConfig[]
  }
  VoiceSwitch: {
    Text: string
  }
  BodyTypeSwitch: {
    Text: string
  }
  ListenerLiftup: number
  SurfaceProberLiftup: number
}