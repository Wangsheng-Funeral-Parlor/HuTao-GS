import ConfigBaseBillboard from '.'

export default interface ConfigCombatBillboard extends ConfigBaseBillboard {
  ShowHPBar: boolean
  ForceShowDistance: number
  Size: string
  ShieldBarOnly: boolean
}