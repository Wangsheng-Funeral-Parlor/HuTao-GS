import BaseClass from '#/baseClass'
import SceneData from '$/gameData/data/SceneData'
import Player from '$/player'
import Vector from '$/utils/vector'
import Logger from '@/logger'
import { WaitOnBlock } from '@/utils/asyncWait'
import Scene from '.'
import SceneGroup from './sceneGroup'

const logger = new Logger('GSCENE', 0xefa8ec)

const MAX_BLOCK_MS = 10

export default class SceneBlock extends BaseClass {
  scene: Scene

  id: number

  rect: {
    min: Vector
    max: Vector
  }

  groupList: SceneGroup[]

  private loaded: boolean

  constructor(scene: Scene, blockId: number) {
    super()

    this.scene = scene

    this.id = blockId

    this.groupList = []

    super.initHandlers(this)
  }

  private async loadSceneBlockData() {
    const { scene, id } = this
    const blockData = await SceneData.getBlock(scene.id, id)
    if (blockData == null) return

    this.rect = blockData?.Rect != null ? {
      min: new Vector().setData(blockData.Rect.Min),
      max: new Vector().setData(blockData.Rect.Max)
    } : null

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

    if (!rect) return true
    if (!pos) return false

    const { min, max } = rect
    const { X, Z } = pos

    const minX = Math.min(min.X, max.X)
    const maxX = Math.max(min.X, max.X)
    const minZ = Math.min(min.Z, max.Z)
    const maxZ = Math.max(min.Z, max.Z)

    return (X >= minX && X <= maxX && Z >= minZ && Z <= maxZ)
  }

  private canLoad() {
    const { scene } = this
    const { playerList } = scene

    for (let player of playerList) {
      if (this.inBoundingRect(player)) return true
    }

    return false
  }

  // TODO: implement it :p
  async init(_userData: any) {
    await this.initNew()
  }

  async initNew() {
    const { scene, groupList } = this
    const { entityManager } = scene

    await this.loadSceneBlockData()

    const wob = new WaitOnBlock(MAX_BLOCK_MS)

    for (let group of groupList) {
      if (group.dynamicLoad) continue
      await group.load(wob)
    }

    await entityManager.flushAll()
  }

  async load() {
    const { scene, id, groupList, loaded } = this
    const { entityManager } = scene

    if (loaded) return
    this.loaded = true

    logger.debug('Load block:', id)

    const wob = new WaitOnBlock(MAX_BLOCK_MS)

    for (let group of groupList) {
      if (!group.dynamicLoad) continue
      await group.load(wob)
    }

    await entityManager.flushAll()
  }

  async unload() {
    const { scene, id, groupList, loaded } = this
    const { entityManager } = scene

    if (!loaded) return
    this.loaded = false

    logger.debug('Unload block:', id)

    const wob = new WaitOnBlock(MAX_BLOCK_MS)

    for (let group of groupList) {
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