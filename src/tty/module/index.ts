import EventEmitter from 'promise-events'
import { TTY } from '..'

export default class TTYModule extends EventEmitter {
  tty: TTY

  constructor(tty: TTY) {
    super()

    this.tty = tty
  }

  get y(): number {
    return 0
  }

  get width(): number {
    return this.tty.stdout?.columns || 1
  }

  get height(): number {
    return this.tty.stdout?.rows || 1
  }

  clear(hideCursor: boolean = false) {
    const { tty, y, height } = this
    const { cursorH } = tty

    tty.setCursor(0, y, true)
    tty.cursorH = hideCursor || cursorH

    tty.clearLine(height)
  }
}