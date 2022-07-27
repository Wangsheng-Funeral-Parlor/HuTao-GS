import Entity from '$/entity'
import GadgetData from '$/gameData/data/GadgetData'
import GrowCurveData from '$/gameData/data/GrowCurveData'
import { EntityTypeEnum } from '@/types/enum'
import { SceneGadgetInfo } from '@/types/proto'
import { LifeStateEnum, ProtEntityTypeEnum } from '@/types/proto/enum'
import EntityUserData from '@/types/user/EntityUserData'

export const destructibleGadgetNameList = [
  'WoodenMaterial',
  'WatchTower',
  'RoadBlock',
  'QQTotem'
]

export const flammableGadgetNameList = [
  'FireMaterial'
]

export default class Gadget extends Entity {
  gadgetId: number

  interactId: number | null
  destructible: boolean
  flammable: boolean

  constructor(gadgetId: number) {
    super()

    this.gadgetId = gadgetId
    this.interactId = null
    this.destructible = false

    this.protEntityType = ProtEntityTypeEnum.PROT_ENTITY_GADGET
    this.entityType = EntityTypeEnum.Gadget

    super.initHandlers(this)
  }

  private async loadGadgetData() {
    const { gadgetId } = this

    this.config = await GadgetData.getFightPropConfig(gadgetId)
    this.growCurve = await GrowCurveData.getGrowCurve('Gadget')

    const gadgetData = await GadgetData.getGadget(gadgetId)
    if (!gadgetData) return

    this.name = gadgetData.JsonName
    this.entityType = EntityTypeEnum[gadgetData.Type || ''] || EntityTypeEnum.Gadget

    this.destructible = this.config.HpBase > 0 || !!destructibleGadgetNameList.find(n => this.name.includes(n))
    this.flammable = !!flammableGadgetNameList.find(n => this.name.includes(n))
  }

  async init(userData: EntityUserData): Promise<void> {
    await this.loadGadgetData()
    super.init(userData)

    if (!this.destructible) this.lifeState = LifeStateEnum.LIFE_NONE
  }

  async initNew(level?: number): Promise<void> {
    await this.loadGadgetData()
    super.initNew(level)

    if (!this.destructible) this.lifeState = LifeStateEnum.LIFE_NONE
  }

  exportSceneGadgetInfo(): SceneGadgetInfo {
    const { gadgetId, groupId, configId, interactId } = this

    const info: SceneGadgetInfo = {
      gadgetId,
      groupId,
      configId
    }

    if (interactId != null) {
      info.isEnableInteract = true
      info.interactId = interactId
    }

    return info
  }
}