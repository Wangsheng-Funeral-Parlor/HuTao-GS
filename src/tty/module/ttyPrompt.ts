import TTYModule from '.'
import { TTY } from '..'

export default class TTYPrompt extends TTYModule {
  prompt: string
  secret: boolean

  cursor: number

  buffer: string[]
  history: string[]

  historyCursor: number
  historyIndex: number

  constructor(tty: TTY, prompt: string = '', secret: boolean = false) {
    super(tty)

    this.prompt = prompt
    this.secret = !!secret

    this.cursor = 0

    this.buffer = []
    this.history = []

    this.historyCursor = null
    this.historyIndex = null
  }

  get y(): number {
    return super.height - 1
  }

  get height(): number {
    return 1
  }

  get promptLen(): number {
    return this.prompt.length + 1
  }

  get visibleInputLen(): number {
    return this.width - this.promptLen - 1
  }

  get overflowLeft(): number {
    const { cursor, visibleInputLen } = this
    return Math.max(0, cursor - visibleInputLen)
  }

  get overflowRight(): number {
    const { buffer, visibleInputLen, overflowLeft } = this
    return Math.max(0, buffer.join('').length - overflowLeft - visibleInputLen)
  }

  render() {
    const { tty, prompt, cursor, buffer, y, promptLen, visibleInputLen, overflowLeft, overflowRight } = this

    this.clear(true)

    let input = buffer.join('').slice(overflowLeft, overflowLeft + visibleInputLen)

    if (overflowLeft) input = input.slice(1)
    if (overflowRight) input = input.slice(1)

    tty.write(`\x1b[97m${prompt}>${overflowLeft ? '[' : ''}${input}\x1b[97m${overflowRight ? ']' : ''}\x1b[m`)
    tty.setCursor(promptLen + (cursor - overflowLeft - (overflowRight ? 1 : 0)), y, false)
  }

  nextInput(): Promise<string> {
    return new Promise<string>(resolve => this.once('input', async input => resolve(input)))
  }
}