export interface EntityRendererChangedInfo {
  changedRenderers?: { [id: number]: number }
  visibilityCount?: number
  isCached?: boolean
}
