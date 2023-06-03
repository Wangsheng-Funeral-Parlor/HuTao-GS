import {
  AbilitySyncStateInfo,
  AnimatorParameterValueInfoPair,
  EntityRendererChangedInfo,
  SceneEntityAiInfo,
  VectorInfo,
} from "."

export interface EntityAuthorityInfo {
  abilityInfo: AbilitySyncStateInfo
  rendererChangedInfo: EntityRendererChangedInfo
  aiInfo: SceneEntityAiInfo
  bornPos: VectorInfo
  poseParaList?: AnimatorParameterValueInfoPair[]
  unknown1?: {
    unknown1?: VectorInfo
  }
}
