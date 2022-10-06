import { UAList, UAPatch } from '@/tools/UAPatch'
import translate from '@/translate'
import { CommandDefinition } from '..'

const uaCommand: CommandDefinition = {
  name: 'ua',
  usage: 2,
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
          await UAPatch(input, output)
          break
        case 'dump':
          (await UAList(input)).forEach((k, i) => print(`Key ${i}: ${k}`))
          break
      }
      print(translate('cli.commands.ua.info.success'))
    } catch (err) {
      printError((<Error>err).message || err)
    }
  }
}

export default uaCommand