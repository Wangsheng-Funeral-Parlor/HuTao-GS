import EventEmitter from 'promise-events'
import { ReadStream, WriteStream } from 'tty'
import { formatWithOptions } from 'util'
import TTYInfo from './module/ttyInfo'
import TTYLog from './module/ttyLog'
import TTYPrompt from './module/ttyPrompt'
import { escSeqSplitString } from './utils'

const MAX_HISTORY_COUNT = 10

export class TTY extends EventEmitter {
  stdin: ReadStream
  stdout: WriteStream
  stderr: WriteStream

  info: TTYInfo
  log: TTYLog
  promptList: TTYPrompt[]

  cursorX: number
  cursorY: number
  cursorH: boolean

  constructor() {
    super()

    this.info = new TTYInfo(this)
    this.log = new TTYLog(this)
    this.promptList = []

    this.cursorX = 0
    this.cursorY = 0
    this.cursorH = false

    const ownPropNames = Object.getOwnPropertyNames(this.constructor.prototype)
    for (const name of ownPropNames) {
      if (typeof this[name] === 'function') this[name] = this[name].bind(this)
    }

    const defaultPrompt = new TTYPrompt(this, '>')
    defaultPrompt.on('change', input => this.emit('change', input))
    defaultPrompt.on('input', input => this.emit('line', input))

    this.addPrompt(defaultPrompt)

    setInterval(this.update.bind(this), 250)
  }

  private prevInput() {
    const ttyp = this.getCurPrompt()
    if (ttyp == null) return

    const { buffer, history, historyCursor, historyIndex } = ttyp
    if (history.length <= 0) return

    // clear buffer
    buffer.splice(0)

    // update index
    const index = Math.max(0, historyIndex == null ? history.length - 1 : historyIndex - 1)
    ttyp.historyIndex = index

    // update buffer
    const entry = history[index]
    buffer.push(...entry.split(''))

    // update cursor
    ttyp.cursor = Math.min(entry.length, historyCursor == null ? Infinity : historyCursor)

    ttyp.emit('change')
  }

  private nextInput() {
    const ttyp = this.getCurPrompt()
    if (ttyp == null) return

    const { buffer, history, historyCursor, historyIndex } = ttyp
    if (history.length <= 0 || historyIndex == null) return

    // clear buffer
    buffer.splice(0)

    // update index
    const index = historyIndex + 1
    ttyp.historyIndex = index >= history.length ? null : index

    // update buffer
    const entry = index < history.length ? history[index] : ''
    buffer.push(...entry.split(''))

    // update cursor
    ttyp.cursor = Math.min(entry.length, historyCursor == null ? Infinity : historyCursor)

    ttyp.emit('change')
  }

  update() {
    const { info, log } = this

    info.render()
    log.update()
  }

  setIO(stdin?: ReadStream, stdout?: WriteStream, stderr?: WriteStream) {
    this.unsetIO()

    stdin = stdin || process.stdin
    stdout = stdout || process.stdout
    stderr = stderr || process.stderr

    this.stdin = stdin
    this.stdout = stdout
    this.stderr = stderr

    stdin?.setRawMode(true)
    stdin?.resume()
    stdin?.setEncoding('utf8')

    stdin?.on('data', this.handleInput)
    stdout?.on('resize', this.refresh)

    stdin?.on('error', this.handleError)
    stdout?.on('error', this.handleError)
    stderr?.on('error', this.handleError)

    this.refresh()
  }

  unsetIO() {
    const { stdin, stdout, stderr } = this

    stdin?.off('data', this.handleInput)
    stdout?.off('resize', this.refresh)

    stdin?.off('error', this.handleError)
    stdout?.off('error', this.handleError)
    stderr?.off('error', this.handleError)

    this.stdin = null
    this.stdout = null
    this.stderr = null
  }

  addPrompt(prompt: TTYPrompt) {
    if (prompt.tty !== this) throw new Error('Mismatch instance')

    const { promptList } = this
    if (promptList.includes(prompt)) return

    promptList.push(prompt)
    this.getCurPrompt()?.render()
  }

  removePrompt(prompt: TTYPrompt) {
    const { promptList } = this
    if (!promptList.includes(prompt)) return

    promptList.splice(promptList.indexOf(prompt), 1)
    this.getCurPrompt()?.render()
  }

  getCurPrompt(): TTYPrompt {
    return this.promptList.slice(-1)[0]
  }

  write(str: string) {
    this.stdout?.write(str)
  }

  print(...args: any[]): string {
    const { log } = this
    const formatted = formatWithOptions({ colors: true }, ...args)

    log.write(formatted)
    return formatted
  }

  setCursor(x: number, y: number, hidden: boolean = false) {
    this.cursorX = x
    this.cursorY = y
    this.cursorH = hidden

    this.write(`\x1b[${y + 1};${x + 1}H\x1b[?25${hidden ? 'l' : 'h'}`)
  }

  clearLine(lines: number = 1) {
    const { cursorX, cursorY, cursorH } = this
    this.write('\x1b[2K\x1b[B'.repeat(Math.max(1, lines)))
    this.setCursor(cursorX, cursorY, cursorH)
  }

  refresh() {
    // clear screen
    this.write('\x1b[3J')

    this.info.render()
    this.log.render()
    this.getCurPrompt()?.render()
  }

  pushHistory(line: string) {
    if (line.trim().length <= 0) return

    const ttyp = this.getCurPrompt()
    if (ttyp == null) return

    const { history } = ttyp

    while (history.length > MAX_HISTORY_COUNT) history.shift()
    history.push(line)
  }

  handleError(err: Error) {
    this.print('stdio error:', err)
  }

  handleInput(data: string) {
    const chars: string[] = escSeqSplitString(data)
    for (const char of chars) this.handleChar(char)
  }

  handleChar(char: string) {
    const ttyp = this.getCurPrompt()
    if (ttyp == null) return

    const { log } = this
    const { cursor, buffer } = ttyp

    let resetHistory = true

    switch (char) {
      case '\x03': { // ctrl-c
        this.emit('exit')
        break
      }
      case '\x08': { // backspace
        if (buffer.length <= 0 || cursor <= 0) break

        buffer.splice(cursor - 1, 1)
        ttyp.cursor--

        ttyp.emit('change')
        break
      }
      case '\x0d': { // carriage return
        if (buffer.join('').trim().length <= 0) break

        const line = buffer.splice(0, buffer.length).join('')
        ttyp.cursor = 0

        ttyp.emit('input', line)
        this.pushHistory(line)
        break
      }
      case '\x09': { // tab
        ttyp.fillAutocomplete()
        break
      }
      case '\x1b': { // esc
        resetHistory = false
        ttyp.emit('cancel')
        break
      }
      case '\x1b[A': { // cursor up
        resetHistory = false
        this.prevInput()
        break
      }
      case '\x1b[B': { // cursor down
        resetHistory = false
        this.nextInput()
        break
      }
      case '\x1b[C': { // cursor forward
        resetHistory = false
        if (cursor >= buffer.length) {
          ttyp.fillAutocomplete()
          break
        }

        ttyp.cursor++
        ttyp.historyCursor = ttyp.cursor
        break
      }
      case '\x1b[D': { // cursor back
        resetHistory = false
        if (cursor <= 0) break

        ttyp.cursor--
        ttyp.historyCursor = ttyp.cursor
        break
      }
      case '\x1b[5~': { // page up
        log.scrollUp()
        break
      }
      case '\x1b[6~': { // page down
        log.scrollDown()
        break
      }
      default: {
        buffer.splice(cursor, 0, char)
        ttyp.cursor += char.length

        ttyp.emit('change')
      }
    }

    ttyp.render()

    if (resetHistory) {
      ttyp.historyCursor = null
      ttyp.historyIndex = null
    }
  }
}

let TTYInstance: TTY = null
export const getTTY = (): TTY => {
  if (TTYInstance) return TTYInstance

  TTYInstance = new TTY()
  console.log = TTYInstance.print

  return TTYInstance
}