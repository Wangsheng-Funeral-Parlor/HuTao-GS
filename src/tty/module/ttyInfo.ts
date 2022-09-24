import { getTimestamp } from '@/utils/time'
import TTYModule from '.'
import { TTY } from '..'
import { cRGB, noColor } from '../utils'

const BORDER_V = '\u2502'
const BORDER_H = '\u2501'
const BORDER_HV = '\u2537'

const APP_TITLE = `${cRGB(0xdb8265, 'HuTao')} ${cRGB(0xf2d399, 'GS')}`

export default class TTYInfo extends TTYModule {
  constructor(tty: TTY) {
    super(tty)
  }

  private getLine(size: number) {
    return BORDER_H.repeat(Math.max(1, size))
  }

  get height(): number {
    return 2
  }

  render() {
    const { tty, y, width } = this
    const { log, cursorX, cursorY } = tty
    const { scrollIndex } = log

    this.clear(true)

    const ttyp = tty.getCurPrompt()

    const timestamp = getTimestamp()
    const timestampLen = timestamp.length
    const appTitleLen = noColor(APP_TITLE).length

    tty.setCursor(0, y)
    tty.write(
      BORDER_V +
      timestamp +
      BORDER_V +
      APP_TITLE +
      BORDER_V +
      (scrollIndex == null ? 'Auto' : '    ') + // auto scroll indicator
      BORDER_V +
      (ttyp && ttyp.overflowLeft ? '<' : ' ') + // overflow indicator left
      (ttyp && ttyp.overflowRight ? '>' : ' ') // overflow indicator right
    )

    tty.setCursor(0, y + 1)
    tty.write(
      BORDER_HV +
      this.getLine(timestampLen) +
      BORDER_HV +
      this.getLine(appTitleLen) +
      BORDER_HV +
      this.getLine(4) +
      BORDER_HV +
      this.getLine(width - (timestampLen + appTitleLen + 8))
    )

    // restore cursor position
    tty.setCursor(cursorX, cursorY, false)
  }
}