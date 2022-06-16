import { HeadControl } from '.'

export default interface ConfigHeadControl extends HeadControl {
  UseHeadControl?: boolean
  AnimStates: string[]
}