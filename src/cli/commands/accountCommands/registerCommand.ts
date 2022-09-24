import TTYPrompt from '@/tty/module/ttyPrompt'
import { CommandDefinition } from '..'

const registerCommand: CommandDefinition = {
  name: 'register',
  desc: 'Register account',
  exec: async (cmdInfo) => {
    const { cli, tty, server } = cmdInfo
    const { print, printError } = cli
    const { auth } = server

    const prompt = new TTYPrompt(tty, 'Enter Username', false)
    tty.addPrompt(prompt)

    const name = await prompt.nextInput()

    prompt.setSecret(true)

    prompt.setPrompt('Enter Password')
    const pass = await prompt.nextInput()
    prompt.setPrompt('Retype Password')
    const retypePass = await prompt.nextInput()

    tty.removePrompt(prompt)

    if (pass !== retypePass) return printError('Password mismatch')

    const { success, message } = await auth.register(name, pass)
    if (success) print('Account registered successfully')
    else printError(message)
  }
}

export default registerCommand