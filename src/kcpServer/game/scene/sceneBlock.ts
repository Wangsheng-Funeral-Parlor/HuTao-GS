import BaseClass from '#/baseClass'
import SceneData from '$/gameData/data/SceneData'
import Player from '$/player'
import Vector from '$/utils/vector'
import TLogger from '@/translate/tlogger'
import { WaitOnBlock } from '@/utils/asyncWait'
import Scene from '.'
import SceneGroup from './sceneGroup'

const logger = new TLogger('GSCENE', 0xefa8ec)

const MAX_BLOCK_MS = 10
const NON_DYNAMIC_LOAD_DISTANCE = 512

export default class SceneBlock extends BaseClass {
  scene: Scene

  id: number

  rect: {
    min: Vector
    max: Vector
  } | false

  groupList: SceneGroup[]
  wob: WaitOnBlock

  loaded: boolean

  constructor(scene: Scene, blockId: number) {
    super()

    this.scene = scene

    this.id = blockId

    this.groupList = []
    this.wob = new WaitOnBlock(MAX_BLOCK_MS)

    super.initHandlers(this)
  }

  private async loadSceneBlockData() {
    const { scene, id } = this
    const blockData = await SceneData.getBlock(scene.id, id)
    if (blockData == null) return

    this.rect = blockData?.Rect != null ? {
      min: new Vector().setData(blockData.Rect.Min),
      max: new Vector().setData(blockData.Rect.Max)
    } : false

    this.groupList = blockData?.Groups
      ?.map(group => new SceneGroup(
        this,
        group.Id,
        new Vector().setData(group.Pos),
        group.DynamicLoad
      )) || []
  }

  private inBoundingRect(player: Player): boolean {
    const { rect } = this
    const { pos } = player

    if (rect === false) return true
    if (rect == null || !pos) return false

    const { min, max } = rect
    const { x: X, z: Z } = pos

    const minX = Math.min(min.x, max.x)
    const maxX = Math.max(min.x, max.x)
    const minZ = Math.min(min.z, max.z)
    const maxZ = Math.max(min.z, max.z)

    return (X >= minX && X <= maxX && Z >= minZ && Z <= maxZ)
  }

  private canLoad() {
    const { scene } = this
    const { playerList } = scene

    for (const player of playerList) {
      if (this.inBoundingRect(player)) return true
    }

    return false
  }

  // TODO: implement it :p
  async init(_userData: any) {
    await this.initNew()
  }

  async initNew() {
    await this.loadSceneBlockData()
  }

  async updateNonDynamic() {
    const { scene, groupList, wob } = this
    const { playerList, entityManager } = scene

    for (const group of groupList) {
      const { pos, dynamicLoad, loaded } = group
      if (dynamicLoad) continue

      const canLoad = playerList.find(player => player.pos != null && pos.distanceTo2D(player.pos) <= NON_DYNAMIC_LOAD_DISTANCE) != null

      if (!loaded && canLoad) await group.load(wob)
      if (loaded && !canLoad) await group.unload()
    }

    await entityManager.flushAll()
  }

  async load() {
    const { scene, id, groupList, wob, loaded } = this
    const { entityManager } = scene

    if (loaded) return
    this.loaded = true

    logger.debug('message.scene.debug.loadBlock', id)

    for (const group of groupList) {
      if (!group.dynamicLoad) continue
      await group.load(wob)
    }

    await entityManager.flushAll()
  }

  async unload() {
    const { scene, id, groupList, wob, loaded } = this
    const { entityManager } = scene

    if (!loaded) return
    this.loaded = false

    logger.debug('message.scene.debug.unloadBlock', id)

    for (const group of groupList) {
      if (!group.dynamicLoad) continue
      await group.unload()
      await wob.waitTick()
    }

    await entityManager.flushAll()
  }

  /**Events**/

  async handleUpdate() {
    const { loaded } = this
    const canLoad = this.canLoad()

    if (!loaded && canLoad) await this.load()
    if (loaded && !canLoad) await this.unload()
  }
}