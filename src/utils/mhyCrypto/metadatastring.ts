import MT19937 from "../mt19937"

export type StructDefinition = [string, number][]

export const mHeaderFields: StructDefinition = [
  ["filler00", 4],
  ["filler04", 4],
  ["filler08", 4],
  ["filler0C", 4],
  ["filler10", 4],
  ["filler14", 4],
  ["stringLiteralDataOffset", 4], // 18
  ["stringLiteralDataCount", 4], // 1c
  ["stringLiteralOffset", 4], // 20
  ["stringLiteralCount", 4], // 24
  ["genericContainersOffset", 4], // 28
  ["genericContainersCount", 4], // 2C
  ["nestedTypesOffset", 4], // 30
  ["nestedTypesCount", 4], // 34
  ["interfacesOffset", 4], // 38
  ["interfacesCount", 4], // 3C
  ["vtableMethodsOffset", 4], // 40
  ["vtableMethodsCount", 4], // 44
  ["interfaceOffsetsOffset", 4], // 48
  ["interfaceOffsetsCount", 4], // 4C
  ["typeDefinitionsOffset", 4], // 50
  ["typeDefinitionsCount", 4], // 54
  ["filler58", 4], // Unknown!
  ["filler5C", 4], // Unknown!
  ["filler60", 4],
  ["filler64", 4],
  ["filler68", 4],
  ["filler6C", 4],
  ["imagesOffset", 4], // 70
  ["imagesCount", 4], // 74
  ["assembliesOffset", 4], // 78
  ["assembliesCount", 4], // 7C
  ["fieldsOffset", 4], //  80
  ["fieldsCount", 4], // 84
  ["genericParametersOffset", 4], // 88
  ["genericParametersCount", 4], // 8C
  ["fieldAndParameterDefaultValueDataOffset", 4], // 90
  ["fieldAndParameterDefaultValueDataCount", 4], // 94
  ["fieldMarshaledSizesOffset", 4], // 98
  ["fieldMarshaledSizesCount", 4], // 9C
  ["referencedAssembliesOffset", 4], // A0
  ["referencedAssembliesCount", 4], // A4
  ["attributesInfoOffset", 4], // A8
  ["attributesInfoCount", 4], // AC
  ["attributeTypesOffset", 4], // B0
  ["attributeTypesCount", 4], // B4
  ["unresolvedVirtualCallParameterTypesOffset", 4], // B8
  ["unresolvedVirtualCallParameterTypesCount", 4], // BC
  ["unresolvedVirtualCallParameterRangesOffset", 4], // C0
  ["unresolvedVirtualCallParameterRangesCount", 4], // C4
  ["windowsRuntimeTypeNamesOffset", 4], // C8
  ["windowsRuntimeTypeNamesSize", 4], // CC
  ["exportedTypeDefinitionsOffset", 4], // D0
  ["exportedTypeDefinitionsCount", 4], // D4
  ["stringOffset", 4],
  ["stringCount", 4],
  ["parametersOffset", 4], // E0
  ["parametersCount", 4], // E4
  ["genericParameterConstraintsOffset", 4], // E8
  ["genericParameterConstraintsCount", 4], // EC
  ["fillerF0", 4],
  ["fillerF4", 4],
  ["metadataUsagePairsOffset", 4], // F8
  ["metadataUsagePairsCount", 4], // FC
  ["filler100", 4],
  ["filler104", 4],
  ["filler108", 4],
  ["filler10C", 4],
  ["fieldRefsOffset", 4], // 110
  ["fieldRefsCount", 4], // 114
  ["eventsOffset", 4], // 118
  ["eventsCount", 4], // 11C
  ["propertiesOffset", 4], // 120
  ["propertiesCount", 4], // 124
  ["methodsOffset", 4], // 128
  ["methodsCount", 4], // 12C
  ["parameterDefaultValuesOffset", 4], // 130
  ["parameterDefaultValuesCount", 4], // 134
  ["fieldDefaultValuesOffset", 4], // 138
  ["fieldDefaultValuesCount", 4], // 13C
  ["filler140", 4],
  ["filler144", 4],
  ["filler148", 4],
  ["filler14C", 4],
  ["metadataUsageListsOffset", 4], // 150
  ["metadataUsageListsCount", 4], // 154
]

export const mLiteral: StructDefinition = [
  ["offset", 4],
  ["length", 4],
]

export function getFieldOffset(struct: StructDefinition, fieldName: string): number {
  const field = struct.map((f, i) => [f[0], f[1], i]).find((f) => f[0] === fieldName) || 0
  return struct
    .map((f) => f[1])
    .filter((_, i) => i < field[2])
    .reduce((offset, fSize) => offset + fSize, 0)
}

export function sizeofStruct(struct: StructDefinition) {
  return struct.map((f) => f[1]).reduce((sSize, fSize) => sSize + fSize, 0)
}

const seedLayout = [
  0x060, 0x064, 0x068, 0x06c, 0x140, 0x144, 0x148, 0x14c, 0x100, 0x104, 0x108, 0x10c, 0x0f0, 0x0f4, 0x008, 0x00c, 0x010,
  0x014,
]

function getSeed(data: Buffer): bigint {
  const values = seedLayout.map((offset) => data.readUInt32LE(offset))
  const buf = Buffer.alloc(8)

  buf.writeUInt32LE(values[values[0] & 0xf], 4)
  buf.writeUInt32LE(values[(values[0x11] & 0xf) + 2])

  return buf.readBigUInt64LE()
}

export const generateKeyForGlobalMetadataHeaderString = (data: Buffer, len: number, literalDecKey: Buffer): void => {
  if (len < sizeofStruct(mHeaderFields)) {
    throw new Error("data not big enough for global metadata header")
  }

  const mt = new MT19937()
  mt.seed(getSeed(data))

  for (let i = 0; i < 6; i++) mt.int64() // Skip

  for (let i = 0; i < 0xa00; i++) {
    literalDecKey.writeBigUInt64LE(mt.int64(), i << 3)
  }
}

export const recryptGlobalMetadataHeaderStringFields = (data: Buffer, len: number, literalDecKey: Buffer): void => {
  if (len < sizeofStruct(mHeaderFields)) {
    throw new Error("data not big enough for global metadata header")
  }

  const mt = new MT19937()
  mt.seed(getSeed(data))

  const header = data.subarray(0, sizeofStruct(mHeaderFields))

  let offset = getFieldOffset(mHeaderFields, "stringCount")
  header.writeUInt32LE((header.readUInt32LE(offset) ^ Number(mt.int64() & 0xffffffffn)) >>> 0, offset)
  offset = getFieldOffset(mHeaderFields, "stringOffset")
  header.writeUInt32LE((header.readUInt32LE(offset) ^ Number(mt.int64() & 0xffffffffn)) >>> 0, offset)

  mt.int64()

  offset = getFieldOffset(mHeaderFields, "stringLiteralOffset")
  header.writeUInt32LE((header.readUInt32LE(offset) ^ Number(mt.int64() & 0xffffffffn)) >>> 0, offset)
  offset = getFieldOffset(mHeaderFields, "stringLiteralDataCount")
  header.writeUInt32LE((header.readUInt32LE(offset) ^ Number(mt.int64() & 0xffffffffn)) >>> 0, offset)
  offset = getFieldOffset(mHeaderFields, "stringLiteralDataOffset")
  header.writeUInt32LE((header.readUInt32LE(offset) ^ Number(mt.int64() & 0xffffffffn)) >>> 0, offset)

  for (let i = 0; i < 0xa00; i++) {
    literalDecKey.writeBigUInt64LE(mt.int64(), i << 3)
  }
}

export const recryptGlobalMetadataHeaderStringLiterals = (data: Buffer, len: number, literalDecKey: Buffer): void => {
  if (len < sizeofStruct(mHeaderFields)) {
    throw new Error("data not big enough for global metadata header")
  }

  const header = data.subarray(0, sizeofStruct(mHeaderFields))

  const stringLiteralCount = header.readUint32LE(getFieldOffset(mHeaderFields, "stringLiteralCount"))
  const stringLiteralOffset = header.readUInt32LE(getFieldOffset(mHeaderFields, "stringLiteralOffset"))
  const stringLiteralDataOffset = header.readUint32LE(getFieldOffset(mHeaderFields, "stringLiteralDataOffset"))
  if (stringLiteralCount + stringLiteralOffset > len) {
    throw new Error("file trimmed or string literal offset/count field invalid")
  }

  const literals = data.subarray(stringLiteralOffset)
  const count = stringLiteralCount / sizeofStruct(mLiteral)
  for (let i = 0; i < count; i++) {
    const soff = literals.readUInt32LE(i << 3)
    const slen = literals.readUInt32LE((i << 3) + 4)
    const str = data.subarray(stringLiteralDataOffset + soff)
    const okey = literalDecKey.subarray(i % 0x2800)

    if (stringLiteralDataOffset + soff + slen > len) {
      throw new Error("file trimmed or contains invalid string entry")
    }

    for (let j = 0; j < slen; j++) {
      str[j] ^= literalDecKey[(j + 0x1400) % 0x5000] ^ (okey[j % 0x2800] + j)
    }
  }
}
