import ConfigWidgetAction from "./ConfigWidgetAction"
import ConfigWidgetPredict from "./ConfigWidgetPredict"

export default interface ConfigWidgetBehaviour {
  Predicts: ConfigWidgetPredict[]
  SuccessActionPass: ConfigWidgetAction[]
  FailedActionPass: ConfigWidgetAction[]
}
