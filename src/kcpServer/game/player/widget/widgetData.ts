import { WidgetDataUserData } from '@/types/user/WidgetUserData'
import Widget from '.'

export default class WidgetData {
  widget: Widget

  anchorPointList: []
  lunchBox: { [slot: number]: number }

  coolDown: any[]

  constructor(widget: Widget) {
    this.widget = widget

    this.anchorPointList = []
    this.lunchBox = {}

    this.coolDown = []
  }

  init(_userData: WidgetDataUserData) { return }

  exportUserData(): WidgetDataUserData {
    return {}
  }
}