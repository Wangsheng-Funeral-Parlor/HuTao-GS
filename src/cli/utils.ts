import { ArgumentDefinition, CommandDefinition } from "./commands"

import TError from "@/translate/terror"

type ParsedCLIArg = string | number | Buffer

interface ParseCLICtx {
  argsDef: ArgumentDefinition[]
  args: string[]
  error: any[] | null
  parsingDynamic: boolean
  parsedArgs: ParsedCLIArg[]
}

const ARGS_CTYPES = [
  { type: "GRP", list: ['"', "`", "'"] },
  { type: "SEP", list: [" "] },
]

function typeError(ctx: ParseCLICtx, def: ArgumentDefinition): null {
  ctx.error = ["cli.error.typeError", def.name, def.type || "str"]
  return null
}

export function castCLIArg(ctx: ParseCLICtx, arg: string, def: ArgumentDefinition): ParsedCLIArg | null {
  // optional argument check
  if (def.optional && arg == null) return

  // argument type check
  const type = def.type || "str"
  switch (type) {
    case "str": {
      if (typeof arg !== "string") return typeError(ctx, def)
      return arg
    }
    case "flt": {
      const float = parseFloat(arg)
      if (isNaN(float)) return typeError(ctx, def)
      return float
    }
    case "int": {
      const int = parseInt(arg)
      if (isNaN(int)) return typeError(ctx, def)
      return int
    }
    case "num": {
      const num = Number(arg)
      if (isNaN(num)) return typeError(ctx, def)
      return num
    }
    case "b64":
    case "hex": {
      try {
        return Buffer.from(arg, <BufferEncoding>type.split("-")[0])
      } catch (err) {
        return typeError(ctx, def)
      }
    }
    default:
      ctx.error = ["cli.error.defUnexpectedType", type]
      return null
  }
}

export function parseCLIArg(ctx: ParseCLICtx, i: number): void {
  const { argsDef, args, parsingDynamic, parsedArgs } = ctx
  const def = argsDef[i]
  const nextDef = argsDef[i + 1]
  let arg = args[i]

  // definition error check
  if (nextDef && def.optional && !nextDef.optional) {
    ctx.error = ["cli.error.defUnexpectedOptional"]
    return
  }
  if (parsingDynamic) {
    ctx.error = ["cli.error.defUnexpectedArg"]
    return
  }

  if (def.dynamic) {
    ctx.parsingDynamic = true
    arg = args.slice(i).join(" ")
  }

  const result = castCLIArg(ctx, arg, def)
  if (result == null || ctx.error) return

  if (Array.isArray(def.values) && !def.values.includes(<string | number>result)) {
    ctx.error = ["cli.error.invalidValue", result, def.values.join("|")]
    return
  }

  parsedArgs.push(result)
}

export function parseCLIArgs(args: string[], cmdDef: CommandDefinition): ParseCLICtx {
  const { args: argsDef } = cmdDef
  const ctx: ParseCLICtx = {
    argsDef,
    args,
    error: null,
    parsingDynamic: false,
    parsedArgs: [],
  }

  if (argsDef == null) return ctx

  for (let i = 0; i < argsDef.length; i++) parseCLIArg(ctx, i)

  return ctx
}

export function splitArgs(str: string, GRPskip?: boolean): string[] {
  const args: string[] = []

  str = str.trim()

  let chunk = ""
  for (let i = 0; i < str.length; i++) {
    const char = str[i]

    const { type } = ARGS_CTYPES.find((ct) => ct.list.find((c) => c === char)) || {}
    const isGrp = GRPskip ? false : type === "GRP"
    const isSep = type === "SEP"

    // Start group
    if (isGrp) {
      const end = str.slice(i + 1).indexOf(char) + (i + 1)
      if (end <= 0) throw new TError("cli.error.missing", char)
      chunk += str.slice(i + 1, end)
      i = end // NOSONAR
      continue
    }

    if (isSep) {
      if (chunk.length > 0) args.push(chunk)
      chunk = ""
      continue
    }

    chunk += char
  }

  if (chunk.length > 0) args.push(chunk)

  return args
}
