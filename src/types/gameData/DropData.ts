export interface DropSubfieldData {
  Id: number
  MaxLevel: number
  DropId: number
}

export interface DropTreeData {
  Id: number
  MinLevel: number
  MaxLevel: number
  Random: number
  Tier: number
  Leaf: {
    Id: number
    Count: number
    Weight: number
  }[]
}

export interface DropLeafData {
  Id: number
  MinLevel: number
  MaxLevel: number
  Random: number
  Item: {
    Id: number
    Weight: number
    Interval: number
  }[]
}

export interface EntityDropData {
  EntityId: number
  Type: number
  Branch: {
    Type: string
    SubfieldId: number
  }[]
  Limit: number
}

export interface ChestDropData {
  MinLevel: number
  Index: string
  DropId: number
  DropCount: number
  SourceType: number
  Category: string
}

export interface MonsterDropData {
  MinLevel: number
  Index: string
  DropId: number
  DropCount: number
}

export default interface DropDataGroup {
  Subfield: DropSubfieldData[]
  Tree: DropTreeData[]
  Leaf: DropLeafData[]
  Entity: EntityDropData[]
  Chest: ChestDropData[]
  Monster: MonsterDropData[]
}