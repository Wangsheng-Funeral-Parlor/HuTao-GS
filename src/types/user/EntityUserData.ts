import { LifeStateEnum } from '../enum/entity'
import PropsUserData from './PropsUserData'

export default interface EntityUserData {
  lifeState: LifeStateEnum
  propsData: PropsUserData
  fightPropsData: PropsUserData
}