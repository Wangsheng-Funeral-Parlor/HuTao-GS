import { LifeStateEnum } from "../proto/enum"

import PropsUserData from "./PropsUserData"

export default interface EntityUserData {
  lifeState: LifeStateEnum
  propsData: PropsUserData
  fightPropsData: PropsUserData
}
