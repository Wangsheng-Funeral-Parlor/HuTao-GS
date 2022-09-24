import { UAList, UAPatch } from '@/tools/UAPatch'
import { CommandDefinition } from '..'

const uaCommand: CommandDefinition = {
  name: 'ua',
  desc: 'UA patching tools',
  usage: [
    'ua patch <input file> <output file> - Patch UA RSA keys',
    'ua dump <input file>                - Print UA RSA keys to console'
  ],
  args: [
    { name: 'mode', type: 'str', values: ['patch', 'dump'] },
    { name: 'input', type: 'str' },
    { name: 'output', type: 'str', optional: true }
  ],
  exec: async (cmdInfo) => {
    const { args, cli } = cmdInfo
    const { print, printError } = cli

    const [mode, input, output] = args
    try {
      switch (mode) {
        case 'patch':
          (await UAList(input)).forEach((k, i) => print(`Key ${i}: ${k}`))
          break
        case 'dump':
          await UAPatch(input, output)
          break
        default:
          throw new Error(`Unknown mode: ${mode}`)
      }
      print('Success')
    } catch (err) {
      printError((<Error>err).message || 'Unknown error')
    }
  }
}

export default uaCommand