import EquipUserData from "./EquipUserData"

export default interface ReliquaryUserData extends EquipUserData {
  level: number
  exp: number
  mainProp: number
  appendPropList: number[]
}
