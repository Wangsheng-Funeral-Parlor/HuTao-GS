export interface WidgetDataUserData { }

export default interface WidgetUserData {
  data: WidgetDataUserData
  slot: { [tag: number]: number | null }
}