import { Force } from '.'

export default interface ConfigAirflowField extends Force {
  AreaId?: number
  Velocity: number
  Scale?: number
  StayEffect: string
  EnterEffect: string
}