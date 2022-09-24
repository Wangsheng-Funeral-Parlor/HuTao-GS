import TTYModule from '.'
import { TTY } from '..'
import { escSeqSplitString, noColor } from '../utils'

const MAX_LINES = 10000

export default class TTYLog extends TTYModule {
  lines: string[]
  updated: boolean

  scrollIndex: number | null

  constructor(tty: TTY) {
    super(tty)

    this.lines = []
    this.updated = false

    this.scrollIndex = null
  }

  private wrapString(str: string, width: number) {
    const chars: string[] = escSeqSplitString(str)
    const lines: string[] = []

    let line = ''
    for (const char of chars) {
      line += char
      if (noColor(line).length < width) continue

      lines.push(line)
      line = ''
    }

    if (line.length > 0) lines.push(line)
    return lines
  }

  get y(): number {
    return 2
  }

  get height(): number {
    return super.height - 3
  }

  get visibleLines(): string[] {
    const { lines, scrollIndex, width, height } = this
    const visibleLines: string[] = []

    const startIndex = scrollIndex == null ? (lines.length - 1) : scrollIndex

    let totalHeight = 0
    for (let i = startIndex; i >= 0; i--) {
      if (totalHeight >= height) break

      const wrappedLines = this.wrapString(lines[i], width).reverse()
      for (const line of wrappedLines) {
        visibleLines.push(line)
        if (++totalHeight >= height) break
      }
    }

    return visibleLines.reverse()
  }

  update() {
    if (!this.updated) return

    this.render()
    this.updated = false
  }

  render() {
    const { tty, y, visibleLines } = this
    const { cursorX, cursorY } = tty

    this.clear(true)

    let offsetY = 0
    for (const line of visibleLines) {
      tty.setCursor(0, y + offsetY)
      tty.write(line)
      offsetY++
    }

    // restore cursor position
    tty.setCursor(cursorX, cursorY, false)
  }

  write(str: string) {
    if (str == null || str.length <= 0) return

    const { lines, scrollIndex, height } = this
    const newLines = str.split('\n')

    this.updated = scrollIndex == null || Math.abs((lines.length - 1) - scrollIndex) <= height

    lines.push(...newLines)
    while (lines.length > MAX_LINES) {
      lines.shift()
      if (scrollIndex != null && this.scrollIndex >= height) this.scrollIndex--
    }
  }

  scrollUp() {
    const { lines, scrollIndex, height } = this
    if (lines.length <= 0) return

    const lastIndex = lines.length - 1
    const curIndex = scrollIndex == null ? lastIndex : scrollIndex

    this.scrollIndex = Math.min(lastIndex, Math.max(height - 1, Math.ceil(curIndex - height / 2)))

    this.updated = true
  }

  scrollDown() {
    const { lines, scrollIndex, height } = this
    if (lines.length <= 0) return

    const lastIndex = lines.length - 1
    const curIndex = scrollIndex == null ? lastIndex : scrollIndex

    if (curIndex + height >= lastIndex) this.scrollIndex = null
    else this.scrollIndex = Math.min(lastIndex, Math.max(height - 1, Math.ceil(curIndex + height / 2)))

    this.updated = true
  }
}