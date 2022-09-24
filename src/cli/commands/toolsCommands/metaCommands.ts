import { decryptMetadata, dumpStringLiterals, encryptMetadata, patchMetadata } from '@/tools/metadata'
import { CommandDefinition } from '..'

const metaCommand: CommandDefinition = {
  name: 'meta',
  desc: 'Metadata patching tools',
  usage: [
    'meta patch <input file> <output file> - Patch metadata',
    'meta dump <input file> <output file>  - Dump metadata strings',
    'meta dec <input file> <output file>   - Decrypt metadata',
    'meta enc <input file> <output file>   - Encrypt metadata'
  ],
  args: [
    { name: 'mode', type: 'str', values: ['patch', 'dump', 'dec', 'enc'] },
    { name: 'input', type: 'str' },
    { name: 'output', type: 'str' }
  ],
  exec: async (cmdInfo) => {
    const { args, cli } = cmdInfo
    const { print, printError } = cli

    const [mode, input, output] = args
    try {
      switch (mode) {
        case 'dec':
          await decryptMetadata(input, output)
          break
        case 'enc':
          await encryptMetadata(input, output)
          break
        case 'patch':
          await patchMetadata(input, output)
          break
        case 'dump':
          await dumpStringLiterals(input, output)
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

export default metaCommand