import ConfigAISensingSetting from './ConfigAISensingSetting'

export default interface ConfigAISensing {
  Enable: boolean
  Settings: { [key: string]: ConfigAISensingSetting }
  Templates: { [key: string]: string }
}