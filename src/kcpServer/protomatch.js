const { readdirSync, readFileSync } = require('fs')
const { join } = require('path')
const { cwd } = require('process')
const { cmdIds } = require('./cmdIds')
const { default: config } = require('../config')

const TYPE_NAMES = {
  0: ['int32', 'int64', 'uint32', 'uint64', 'sint32', 'sint64', 'bool', 'enum'],
  1: ['fixed64', 'sfixed64', 'double'],
  //2: 'length-delimited',
  //3: 'start group',
  //4: 'end group',
  5: ['fixed32', 'sfixed32', 'float']
}

const TYPES = {
  VARINT: 0,
  FIXED64: 1,
  STRING: 2,
  FIXED32: 5
}

const protoDir = join(cwd(), `data/proto/${config.version}`)
const ignoreProtos = Object.keys(cmdIds)

function readUntil(ref, end, include = false) {
  const { data, offset } = ref
  let buf = ''
  let i = 0
  let j = 0

  for (i = offset; data[i] !== end; i++, j++) buf += data[i]
  if (include) {
    buf += data[i]
    ref.offset += j + 1
  } else {
    ref.offset += j
  }

  return buf
}

function decodeFloat(buf, offset) {
  const uint = buf.readUInt32LE(offset)
  const sign = (uint >> 31) * 2 + 1
  const exponent = uint >>> 23 & 255
  const mantissa = uint & 8388607

  if (exponent === 255) return mantissa ? NaN : sign * Infinity

  return exponent === 0 // denormal
    ? sign * 1.401298464324817e-45 * mantissa
    : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608)
}

function decodeDouble(buf, offset) {
  const lo = buf.readUInt32LE(offset)
  const hi = buf.readUInt32LE(offset + 4)
  const sign = (hi >> 31) * 2 + 1
  const exponent = hi >>> 20 & 2047
  const mantissa = 4294967296 * (hi & 1048575) + lo

  if (exponent === 2047) return mantissa ? NaN : sign * Infinity

  return exponent === 0 // denormal
    ? sign * 5e-324 * mantissa
    : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496)
}

function decodeVarint(data, offset, bits = 64, signed = false) {
  const signbit = 1 << (bits - 1)
  const mask = (1 << bits) - 1
  const bytes = []

  while (true) {
    if (offset >= data.length) throw new Error(`Out of range decoding varint. ${offset} out of ${data.length}`)
    const byte = data.readInt8(offset++)

    bytes.push(byte & 0x7F)
    if ((byte & 0x80) === 0) break
  }

  let value = 0
  for (let i = 0; i < bytes.length; i++) value |= bytes[i] << (7 * i)

  if (bits < 64) value &= mask
  if (signed) value = (value ^ signbit) - signbit

  return {
    value: (value >>> 0),
    length: bytes.length
  }
}

class BufferReader {
  constructor(buffer) {
    this.buffer = buffer
    this.offset = 0
    this.checkpoints = []
  }

  readVarint() {
    const varint = decodeVarint(this.buffer, this.offset)
    this.offset += varint.length
    return varint.value
  }

  readFloat() {
    return decodeFloat(this.read(4))
  }

  readDouble() {
    return decodeDouble(this.read(8))
  }

  read(length) {
    this.checkAvailable(length)

    const buf = this.buffer.slice(this.offset, this.offset + length)
    this.offset += length

    return buf
  }

  trySkipGrpcHeader() {
    this.save()

    if (this.buffer[this.offset] === 0) {
      const length = this.buffer.readInt32BE(this.offset++)
      this.offset += 4

      if (length > this.availableBytes()) this.restore()
      else this.unsave()
    }
  }

  save() {
    this.checkpoints.push(this.offset)
  }

  unsave() {
    this.checkpoints.pop()
  }

  restore() {
    this.offset = this.checkpoints.pop() || 0
  }

  availableBytes() {
    return this.buffer.length - this.offset
  }

  checkAvailable(length) {
    const availableBytes = this.availableBytes()
    if (length > availableBytes) throw new Error(`Not enough bytes left. Need:${length} Has:${availableBytes}`)
  }
}

class ProtoMatch {
  constructor() {
    this.protos = this.buildProtos()
    //writeFileSync(join(cwd(), 'test.json'), JSON.stringify(this.protos, null, 2))
  }

  // Compare proto definition to data

  findProto(data) {
    const { protos } = this
    const ret = []
    let hasError = false

    try {
      data = this.parseBuffer(data)
    } catch (err) {
      console.log(err)
      hasError = true
    }

    if (hasError || data.parts.length === 0) return { count: -1, array: [] }

    for (const protoName in protos) {
      const proto = protos[protoName]
      const result = this.compare(proto, data.parts)
      if (!result) continue

      ret.push({ protoName, result, diff: Object.keys(proto).length - data.parts.length })
    }

    const sorted = ret.sort((a, b) => a.diff - b.diff)

    return {
      count: ret.length,
      array: ret.length > 10 ? sorted.slice(0, 3) : sorted
    }
  }

  compare(proto, data) {
    const { props } = proto

    if (!props) return false

    const propEntries = Object.entries(props)
    const ret = {}

    for (const field of data) {
      const propEntry = propEntries.find(e => field.fieldId === e[1].id)

      // field not found
      if (!propEntry) return false

      const [key, prop] = propEntry

      const result = this.compareField(prop, field, key)
      if (!result) return false

      if (prop.repeated && !result.packed) {
        ret[key] = ret[key] || []
        ret[key].push(result)

        continue
      }

      ret[key] = result

    }

    return ret
  }

  compareField(prop, field, propKey) {
    const { type, repeated } = prop
    const { wireType, value, repeat } = field

    const isPackedRepeated = repeated && type === TYPES.VARINT
    const isMistmatchType = (type !== wireType && !(isPackedRepeated && wireType === TYPES.STRING))
    const isMistmatchRepeat = !repeated && repeat

    if (isMistmatchType || isMistmatchRepeat) return false

    switch (wireType) {
      case TYPES.VARINT:
        return this.compareVarintField(prop, field, propKey)

      case TYPES.STRING:
        return this.compareStringField(prop, field, isPackedRepeated)

      // everything else
      default:
        return {
          type: wireType,
          data: value
        }
    }
  }

  compareVarintField(_prop, field, propKey) {
    const { wireType, value } = field

    if (propKey.indexOf('is_') === 0 && value > 1) return false

    return {
      type: wireType,
      data: value
    }
  }

  compareStringField(prop, field, isPackedRepeated) {
    const { type, props, proto } = prop
    const { wireType, value } = field
    const isValueString = typeof value === 'string'

    if (isPackedRepeated && isValueString) this.unpackRepeated(type, value)

    if (props) {
      // object
      if (isValueString && value.length > 0) return false

      const result = this.compare(prop, value)
      if (!result) return false

      return {
        type: wireType,
        data: result
      }
    }

    // string
    if (proto !== 'bytes' && typeof value === 'object' && value.length > 0) return false

    return {
      type: wireType,
      data: value.toString('ascii')
    }
  }

  unpackRepeated(type, value) {
    const reader = new BufferReader(value)
    const unpacked = []

    try {
      while (reader.availableBytes() > 0) {
        reader.save()

        switch (type) {
          case TYPES.VARINT:
            unpacked.push(reader.readVarint())
            break
          case TYPES.FIXED32:
            unpacked.push(reader.readFloat())
            break
          case TYPES.FIXED64:
            unpacked.push(reader.readDouble())
            break
        }

        reader.unsave()
      }
    } catch (err) {
      reader.restore()
    }

    return {
      type,
      packed: true,
      data: unpacked
    }
  }

  regex(data, regex) {
    const match = data.match(regex)
    return match ? match[0] : ''
  }

  // Parse proto file

  buildProtos() {
    const ret = {}

    try {
      const filenames = readdirSync(protoDir)

      while (filenames.length > 0) {
        const filename = filenames.shift()
        const protoname = filename.split('.')[0]

        if (ignoreProtos.includes(protoname)) continue
        if (!filename.includes('Notify') && !filename.includes('Req') && !filename.includes('Rsp')) continue

        const data = readFileSync(join(protoDir, filename), 'utf8')
        Object.assign(ret, this.parseProto(data))
      }

      this.replaceProto(ret, ret)
    } catch (err) { }

    return ret
  }

  replaceProto(obj, protos) {
    for (const key in obj) {
      const value = obj[key]
      if (typeof value === 'object') this.replaceProto(value, protos)
      if (key !== 'proto' || typeof value !== 'string') continue

      const proto = protos[value]
      if (!proto) return

      // enum field
      if (proto.enum[value]) {
        obj.type = 0
        delete obj.proto
        return
      }

      Object.assign(obj, proto)
      return
    }
  }

  parseProto(data) {
    const ret = {}

    // remove comments and spaces
    data = data.replace(/(\/\/.*?$)|(\/\*.*?\*\/)/gms, '').trim()

    const ref = {
      data: data,
      offset: 0
    }

    while (ref.offset < data.length) {
      const cmd = readUntil(ref, ' ').trim()

      switch (cmd) {
        case 'syntax':
        case 'option':
        case 'import':
          readUntil(ref, ';', true)
          break
        case 'message': {
          const { name, block } = this.parseBlock(ref)

          ret[name] = this.parseMessageBlock(block)
          break
        }
        case 'enum': {
          const { name, block } = this.parseBlock(ref)

          ret[name] = ret[name] || { enum: {} }
          ret[name].enum[name] = this.parseEnum(block)
          break
        }
      }
    }

    return ret
  }

  parseMessageBlock(data) {
    const ret = {
      enum: {},
      props: {}
    }
    const ref = {
      data: data,
      offset: 0
    }

    // remove spaces
    data = data.trim()

    while (ref.offset < data.length) {
      let type = readUntil(ref, ' ').trim()
      ref.offset++

      const repeated = type === 'repeated'
      if (repeated) {
        type = readUntil(ref, ' ')
        ref.offset++
      }

      switch (type) {
        case 'message': {
          const { name, block } = this.parseBlock(ref)

          ret[name] = this.parseMessageBlock(block)
          break
        }
        case 'enum': {
          const { name, block } = this.parseBlock(ref)

          ret.enum[name] = this.parseEnum(block)
          break
        }
        case 'oneof': {
          const { block } = this.parseBlock(ref)

          /*ret.props[name] = {
            type: 'oneof',
            oneof: this.parseMessageBlock(block)
          }*/
          Object.assign(ret, this.parseMessageBlock(block))
          break
        }
        default:
          this.parseField(ref, ret, type, repeated)
      }
    }

    return ret
  }

  parseBlock(ref) {
    const name = readUntil(ref, '{').trim()
    ref.offset++

    let block = ''
    let chunk = null
    while (chunk == null || chunk.indexOf('{') > 0) {
      chunk = readUntil(ref, '}', true)
      block += chunk
    }

    block = block.slice(0, -1)

    return {
      name,
      block
    }
  }

  parseEnum(data) {
    return Object.fromEntries(
      data.split(';')
        .filter(l => l.trim().length > 0)
        .map(l => [l.split('=')[0].trim(), parseInt(l.split('=').slice(-1)[0].trim())])
        .filter(e => e[0].indexOf('option ') === -1)
    )
  }

  parseField(ref, ret, type, repeated) {
    let name

    for (const typeId in TYPE_NAMES) {
      let tid = parseInt(typeId)

      const types = TYPE_NAMES[tid]
      if (!types.includes(type)) continue

      name = readUntil(ref, '=').trim()
      ref.offset++

      ret.props[name] = {
        type: tid,
        id: parseInt(readUntil(ref, ';').trim()),
        repeated
      }
      ref.offset++

      if (tid === 0 && type.indexOf('uint') === 0) {
        ret.props[name].unsigned = true
      }

      return
    }

    if (type.indexOf('map<') === 0) {
      if (type.indexOf('>') === -1) type += readUntil(ref, '>', true).trim()

      name = readUntil(ref, '=').trim()
      ref.offset++

      ret.props[name] = {
        type: 2,
        id: parseInt(readUntil(ref, ';').trim()),
        map: type.match(/(?<=<).*?(?=>)/)[0],
        repeated
      }
      ref.offset++

      return
    }

    name = readUntil(ref, '=').trim()
    ref.offset++

    ret.props[name] = {
      type: 2,
      id: parseInt(readUntil(ref, ';').trim()),
      proto: type,
      repeated
    }
    ref.offset++
  }

  // Parse protobuf data

  parseBuffer(data) {
    const reader = new BufferReader(data)

    reader.trySkipGrpcHeader()

    const parts = []

    try {
      while (reader.availableBytes() > 0) {
        reader.save()

        const tag = reader.readVarint()
        const fieldId = tag >>> 3
        const wireType = tag & 0x7

        let value = null

        switch (wireType) {
          case TYPES.VARINT:
            value = reader.readVarint()
            break

          case TYPES.FIXED32:
            value = reader.readFloat()
            break

          case TYPES.FIXED64:
            value = reader.readDouble()
            break

          case TYPES.STRING: {
            value = reader.read(reader.readVarint())

            const parsed = this.parseBuffer(value)
            if (value.length > 0 && parsed.leftOver.length === 0) {
              value = parsed.parts
            } else {
              value = value.toString('utf8')
            }
            break
          }

          // unknown type
          default:
            value = reader.read(reader.readVarint()).toString('hex')
        }

        parts.push({
          fieldId,
          wireType,
          value
        })

        reader.unsave()
      }
    } catch (err) {
      reader.restore()
    }

    for (const field of parts) field.repeat = parts.filter(f => f.fieldId === field.fieldId).length > 1

    return {
      parts,
      leftOver: reader.read(reader.availableBytes())
    }
  }
}

module.exports = ProtoMatch