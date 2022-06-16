import Vector from '../Vector'
import { Born } from '.'

export default interface ConfigBornByTarget extends Born {
  Offset?: Vector
  OnGround?: boolean
}