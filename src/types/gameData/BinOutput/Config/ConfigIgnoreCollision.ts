import ConfigEntityCollider from "./ConfigEntityCollider"

export default interface ConfigIgnoreCollision {
  SelfColliders: ConfigEntityCollider[]
  TargetColliders: ConfigEntityCollider[]
}
