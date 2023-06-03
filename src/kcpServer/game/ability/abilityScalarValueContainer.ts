import BaseClass from "#/baseClass"
import { AbilityScalarValueEntry, AbilityString } from "@/types/proto"
import { AbilityScalarTypeEnum } from "@/types/proto/enum"

interface ValueEntry {
  key: AbilityString
  type: AbilityScalarTypeEnum
  val: string | number | boolean
}

export default class AbilityScalarValueContainer extends BaseClass {
  public valList: ValueEntry[]

  public constructor() {
    super()

    this.valList = []

    super.initHandlers()
  }

  public getKeys(): AbilityString[] {
    return this.valList.map((v) => v.key)
  }

  public getValue(key: AbilityString) {
    return this.valList.find((v) => v.key.hash === key?.hash || (key?.str && v.key.str === key?.str)) || null
  }

  public setValue(sval: AbilityScalarValueEntry) {
    const valEntry = this.toValueEntry(sval)
    if (valEntry == null) return

    const oldValEntry = this.getValue(valEntry.key)

    if (oldValEntry) {
      Object.assign(oldValEntry.key, valEntry.key)
      oldValEntry.type = valEntry.type
      oldValEntry.val = valEntry.val
    } else {
      this.valList.push(valEntry)
    }

    this.emit("ChangeValue", sval.key)
  }

  public setValues(valList: AbilityScalarValueEntry[]) {
    for (const val of valList) this.setValue(val)
  }

  public clear() {
    this.valList.splice(0)
  }

  public export(): AbilityScalarValueEntry[] {
    return this.valList.map(this.toScalarValueEntry).filter((svalEntry) => svalEntry != null)
  }

  private toValueEntry(svalEntry: AbilityScalarValueEntry): ValueEntry {
    const { key, valueType: type, floatValue, stringValue, intValue, uintValue } = svalEntry || {}
    switch (type) {
      case AbilityScalarTypeEnum.FLOAT:
        return { key, type, val: floatValue }
      case AbilityScalarTypeEnum.STRING:
        return { key, type, val: stringValue }
      case AbilityScalarTypeEnum.INT:
        return { key, type, val: intValue }
      case AbilityScalarTypeEnum.UINT:
        return { key, type, val: uintValue }
      case AbilityScalarTypeEnum.BOOL:
        return { key, type, val: intValue === 1 || uintValue === 1 } // too lazy to check, it's probably one of this :D
      case AbilityScalarTypeEnum.TRIGGER:
        return null // now i really can't guess what this could be...
      default:
        return null
    }
  }

  private toScalarValueEntry(valEntry: ValueEntry): AbilityScalarValueEntry {
    const { key, type: valueType, val } = valEntry || {}
    switch (valueType) {
      case AbilityScalarTypeEnum.FLOAT:
        return { key, valueType, floatValue: <number>val }
      case AbilityScalarTypeEnum.STRING:
        return { key, valueType, stringValue: <string>val }
      case AbilityScalarTypeEnum.INT:
        return { key, valueType, intValue: <number>val }
      case AbilityScalarTypeEnum.UINT:
        return { key, valueType, uintValue: <number>val }
      case AbilityScalarTypeEnum.BOOL:
        return { key, valueType, intValue: <number>val, uintValue: <number>val } // too lazy to check, it's probably one of this :D
      case AbilityScalarTypeEnum.TRIGGER:
        return null // now i really can't guess what this could be...
      default:
        return null
    }
  }
}
