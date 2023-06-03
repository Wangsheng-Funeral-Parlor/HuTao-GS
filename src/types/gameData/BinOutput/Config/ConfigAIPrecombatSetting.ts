export default interface ConfigAIPrecombatSetting {
  BioClockSleepFrom: number
  BioClockSleepTo: number
  SatietyTime: number
  OverrideWeatherNeuronMapping: { [weatherType: string]: string[] }
}
