import ScriptArgs from "./scriptArgs"

import scriptManager from "$/manager/scriptManager"
import SceneGroup from "$/scene/sceneGroup"

export default interface scriptLibContext {
  scriptManager: scriptManager
  currentGroup: SceneGroup
  uid: number
  args?: ScriptArgs
  source_entity_id?: number
  target_entity_id?: number
}
