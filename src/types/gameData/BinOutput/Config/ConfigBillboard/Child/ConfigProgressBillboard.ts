import ConfigBaseBillboard from '.'

export default interface ConfigProgressBillboard extends ConfigBaseBillboard {
  CustomKey: string
  MaxValueRawNum: number
  PrefabPluginName: string
}