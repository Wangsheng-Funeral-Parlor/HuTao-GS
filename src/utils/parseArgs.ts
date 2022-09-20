const ARGUMENT_SEPARATION_REGEX = /([^=\s]+)=?\s*(.*)/

export interface ParsedArgs {
  [name: string]: string | number | boolean
}

export default function parseArgs(argv: string[]) {
  // Removing node/bin and called script name
  argv = argv.slice(2)

  const parsedArgs: ParsedArgs = {}
  let argName: string
  let argValue: string | number | boolean

  argv.forEach(arg => {
    // Separate argument for a key/value return
    const seperatedArg = arg.match(ARGUMENT_SEPARATION_REGEX)
    seperatedArg.splice(0, 1)

    // Retrieve the argument name
    argName = seperatedArg[0]

    // Remove "--" or "-"
    if (argName.indexOf('-') === 0) argName = argName.slice(argName.slice(0, 2).lastIndexOf('-') + 1)

    // Parse argument value or set it to `true` if empty
    if (seperatedArg[1] === '') argValue = true
    else argValue = parseFloat(seperatedArg[1]).toString() === seperatedArg[1] ? +seperatedArg[1] : seperatedArg[1]

    parsedArgs[argName] = argValue
  })

  return parsedArgs
}