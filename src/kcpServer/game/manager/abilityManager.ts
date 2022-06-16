import Ability from '$/ability'
import Scene from '$/scene'
import Logger from '@/logger'

const logger = new Logger('ABIMAN', 0xa0a0ff)

export default class AbilityManager {
  scene: Scene

  usedId: number[]
  abilityIdInfoMap: {
    [name: string]: {
      [overrideName: string]: [number, Ability[]]
    }
  }

  constructor(scene: Scene) {
    this.scene = scene

    this.usedId = []
    this.abilityIdInfoMap = {}
  }

  private getNewId(): number {
    const { usedId } = this

    let id = 0
    while (usedId.includes(++id));

    usedId.push(id)
    return id
  }

  private freeId(id: number) {
    const { usedId } = this
    if (usedId.includes(id)) usedId.splice(usedId.indexOf(id), 1)
  }

  register(ability: Ability) {
    const { abilityIdInfoMap } = this
    const { name, overrideName } = ability

    const map = abilityIdInfoMap[name] = abilityIdInfoMap[name] || {}
    const info = map[overrideName] = map[overrideName] || [this.getNewId(), []]
    const id = info[0]

    ability.id = id
    info[1].push(ability)

    logger.verbose('Register:', id, '->', `${name}[${overrideName}]`)

    return id
  }

  unregister(ability: Ability) {
    const { abilityIdInfoMap } = this
    const { id, name, overrideName } = ability

    const map = abilityIdInfoMap[name]
    const info = map?.[overrideName]
    if (!info?.[1]?.includes(ability)) return

    logger.verbose('Unregister:', id, '->', `${name}[${overrideName}]`)

    info[1].splice(info[1].indexOf(ability), 1)
    ability.id = 0

    if (info[1].length === 0) {
      this.freeId(info[0])

      if (Object.keys(map).length === 0) delete abilityIdInfoMap[name]
      else delete map[overrideName]
    }
  }
}