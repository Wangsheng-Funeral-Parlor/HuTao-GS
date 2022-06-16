import Vector from '../Vector'
import { Born } from '.'
import BornRandomConfig from '../BornRandom'

export default interface ConfigBornBySelf extends Born {
  Offset?: Vector
  BornRandom?: BornRandomConfig
  OnGround?: boolean
}