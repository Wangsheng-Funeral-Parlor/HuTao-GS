function keepValue(val: any): boolean {
  if (val == null) return false

  const type = typeof val
  switch (type) {
    case 'object':
      if (Array.isArray(val)) return val.length > 0
      return true
    case 'string':
      return val.length > 0
    case 'number':
      return val !== 0
    case 'boolean':
      return val !== false
    default:
      return true
  }
}

export default function protoCleanup(obj: any) {
  obj = Object.assign({}, obj) // clone

  for (const k in obj) {
    const v = obj[k]

    if (!keepValue(v)) {
      delete obj[k]
      continue
    }

    if (
      v != null &&
      typeof v === 'object' &&
      !Array.isArray(v)
    ) obj[k] = protoCleanup(v)
  }

  return obj
}