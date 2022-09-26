import translate from '@/translate'
import TTYPrompt from '@/tty/module/ttyPrompt'
import { CommandDefinition } from '..'

const registerCommand: CommandDefinition = {
  name: 'register',
  exec: async (cmdInfo) => {
    const { cli, tty, server } = cmdInfo
    const { print, printError } = cli
    const { auth } = server

    const prompt = new TTYPrompt(tty, translate('cli.commands.register.prompt.name'), false)
    tty.addPrompt(prompt)

    const name = await prompt.nextInput()

    prompt.setSecret(true)

    prompt.setPrompt(translate('cli.commands.register.prompt.pass'))
    const pass = await prompt.nextInput()
    prompt.setPrompt(translate('cli.commands.register.prompt.retypePass'))
    const retypePass = await prompt.nextInput()

    tty.removePrompt(prompt)

    if (pass !== retypePass) return printError(translate('cli.commands.register.error.mismatch'))

    const { success, message } = await auth.register(name, pass)
    if (success) print(translate('cli.commands.register.info.success'))
    else printError(message)
  }
}

export default registerCommand