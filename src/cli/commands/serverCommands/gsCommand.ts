import GlobalState, { DEFAULT_GSTATE } from '@/globalState'
import LanguageData from '@/translate/data'
import { getTTY } from '@/tty'
import { CommandDefinition } from '..'

function suggestValue(): (string | number)[] {
  const values = []
  const tty = getTTY()
  const input = tty.getCurPrompt()?.buffer?.join('') || ''

  const key = input.split(' ')[2]
  if (input.indexOf('gs set') !== 0 || DEFAULT_GSTATE[key] == null) return

  const targetType = typeof DEFAULT_GSTATE[key]
  switch (targetType) {
    case 'string':
      if (key === 'Language') values.push(...Object.keys(LanguageData))
      break
    case 'number':
      break
    case 'boolean':
      values.push(
        'TRUE', 'FALSE',
        'True', 'False',
        'true', 'false',
        'YES', 'NO',
        'Yes', 'No',
        'yes', 'no',
        'T', 'F',
        't', 'f',
        'Y', 'N',
        'y', 'n'
      )
      break
  }

  return values
}

const gsCommand: CommandDefinition = {
  name: 'gs',
  usage: 3,
  args: [
    { name: 'mode', type: 'str', values: ['set', 'toggle', 'list'] },
    { name: 'name', type: 'str', values: Object.keys(DEFAULT_GSTATE), optional: true },
    { name: 'value', type: 'str', get values() { return suggestValue() }, optional: true }
  ],
  exec: async (cmdInfo) => {
    const { args } = cmdInfo
    const [mode, name, value] = args

    switch (mode) {
      case 'set':
        GlobalState.set(name, value)
        break
      case 'toggle':
        GlobalState.toggle(name)
        break
      case 'list':
        GlobalState.printAll()
        break
    }
  }
}

export default gsCommand