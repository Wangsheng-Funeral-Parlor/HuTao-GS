import Player from "$/player"
import { RuntimeIDCategoryEnum } from "@/types/enum"

export default class RuntimeIDManager {
  player: Player

  public static readonly PEER_BITS = 3
  public static readonly CATEGORY_BITS = 5
  public static readonly IS_SYNCED_BITS = 1
  public static readonly SEQUENCE_BITS = 23
  public static readonly PEER_SHIFT = 29
  public static readonly CATEGORY_SHIFT = 24
  public static readonly IS_SYNCED_SHIFT = 23
  public static readonly SEQUENCE_SHIFT = 0
  private static readonly PEER_MASK = 0xe0000000
  private static readonly CATEGORY_MASK = 0x1f000000
  private static readonly IS_SYNCED_MASK = 0x800000
  private static readonly SEQUENCE_MASK = 0x7fffff
  public static readonly INVALID_RUNTIMEID = 0
  public static readonly LEVEL_RUNTIMEID = 0x13800001
  private _networkedNextSeqID: number
  public static readonly MAX_NETWORKED_SEQ_ID = 0x7fffff
  private _localNextSeqID: number
  public static readonly MAX_LOCAL_SEQ_ID = 0x7fffff

  constructor(player: Player) {
    this.player = player

    this._networkedNextSeqID = 1
    this._localNextSeqID = 1
  }

  public GetNextRuntimeID(category: RuntimeIDCategoryEnum): number {
    const { PEER_SHIFT, CATEGORY_SHIFT, IS_SYNCED_MASK, MAX_NETWORKED_SEQ_ID } = RuntimeIDManager
    const { player, _networkedNextSeqID } = this
    const { peerId } = player

    let nextSeqId = _networkedNextSeqID + 1
    if (nextSeqId > MAX_NETWORKED_SEQ_ID) nextSeqId = 1
    this._networkedNextSeqID = nextSeqId

    return ((peerId || 0) << PEER_SHIFT) | (category << CATEGORY_SHIFT) | IS_SYNCED_MASK | nextSeqId
  }
  public GetNextNonSyncedRuntimeID(category: RuntimeIDCategoryEnum): number {
    const { PEER_SHIFT, CATEGORY_SHIFT, IS_SYNCED_MASK, MAX_NETWORKED_SEQ_ID } = RuntimeIDManager
    const { player, _localNextSeqID } = this
    const { peerId } = player

    let nextSeqId = _localNextSeqID + 1
    if (nextSeqId > MAX_NETWORKED_SEQ_ID) nextSeqId = 1
    this._localNextSeqID = nextSeqId

    return ((peerId || 0) << PEER_SHIFT) | (category << CATEGORY_SHIFT) | IS_SYNCED_MASK | nextSeqId
  }
  public IsLocalEntity(Id: number): boolean {
    return this.ParseCategoryName(Id).indexOf("Local") === 0
  }
  public ParseCategory(runtimeID: number): RuntimeIDCategoryEnum {
    return RuntimeIDManager.ParseCategoryStatic(runtimeID)
  }
  public static ParseCategoryStatic(runtimeID: number): RuntimeIDCategoryEnum {
    const { CATEGORY_SHIFT, CATEGORY_MASK } = RuntimeIDManager
    return (runtimeID & CATEGORY_MASK) >> CATEGORY_SHIFT
  }
  public ParseCategoryName(runtimeID: number): string {
    return RuntimeIDCategoryEnum[this.ParseCategory(runtimeID)]
  }
  public ParseSequenceID(runtimeID: number): number {
    const { SEQUENCE_SHIFT, SEQUENCE_MASK } = RuntimeIDManager
    return (runtimeID & SEQUENCE_MASK) >> SEQUENCE_SHIFT
  }
  public ParsePeerID(runtimeID: number): number {
    const { PEER_SHIFT, PEER_MASK } = RuntimeIDManager
    return (runtimeID & PEER_MASK) >> PEER_SHIFT
  }
  public IsSyncedRuntimeID(runtimeID: number): boolean {
    const { IS_SYNCED_SHIFT, IS_SYNCED_MASK } = RuntimeIDManager
    return (runtimeID & IS_SYNCED_MASK) >> IS_SYNCED_SHIFT !== 0
  }
  public IsServerEntity(runtimeID: number): boolean {
    return RuntimeIDManager.IsServerEntityStatic(runtimeID)
  }
  public static IsServerEntityStatic(runtimeID: number): boolean {
    const category = RuntimeIDManager.ParseCategoryStatic(runtimeID)
    return category != 0 && category < 0x10
  }
  public IsClientEntity(runtimeID: number): boolean {
    return !this.IsServerEntity(runtimeID)
  }
}
