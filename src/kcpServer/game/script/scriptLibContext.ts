import ScriptArgs from "./scriptArgs"
import scriptManager from "./scriptManager"

import SceneGroup from "$/scene/sceneGroup"

export default interface scriptLibContext {
  scriptManager: scriptManager
  currentGroup: SceneGroup
  uid: number
  args?: ScriptArgs
  target_entity_id?: number
}
