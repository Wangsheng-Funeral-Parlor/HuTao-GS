import { TTY } from ".."
import { cRGB } from "../utils"

import TTYModule from "."

export default class TTYPrompt extends TTYModule {
  prompt: string
  secret: boolean

  cursor: number
  autocomplete: string | null

  buffer: string[]
  history: string[]

  historyCursor: number
  historyIndex: number

  constructor(tty: TTY, prompt = "", secret = false) {
    super(tty)

    this.prompt = prompt
    this.secret = !!secret

    this.cursor = 0
    this.autocomplete = null

    this.buffer = []
    this.history = []

    this.historyCursor = null
    this.historyIndex = null

    this.on("input", this.clearAutocomplete.bind(this))
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

  get inputLen(): number {
    return this.buffer.join("").length
  }

  get visibleInputLen(): number {
    const { width, promptLen, suggestion } = this
    return width - promptLen - suggestion.length - 1
  }

  get overflowLeft(): number {
    const { cursor, visibleInputLen } = this
    return Math.max(0, cursor - visibleInputLen)
  }

  get overflowRight(): number {
    const { inputLen, visibleInputLen, overflowLeft } = this
    return Math.max(0, inputLen - overflowLeft - visibleInputLen)
  }

  get suggestion(): string {
    const { buffer, autocomplete } = this
    if (autocomplete == null) return ""

    const filled = buffer.join("").split(" ").slice(-1)[0] || ""
    if (autocomplete.indexOf(filled) !== 0) return ""

    return autocomplete.slice(filled.length)
  }

  render() {
    const { tty, prompt, secret, cursor, buffer, y, promptLen, inputLen, overflowLeft, overflowRight, suggestion } =
      this

    this.clear(true)

    let input = buffer.join("").slice(overflowLeft, inputLen - overflowRight)
    if (secret) input = input.replace(/./g, "*")

    tty.write(`\x1b[97m${prompt}>${input}${cRGB(0xa0a0a0, suggestion)}\x1b[m`)
    tty.setCursor(promptLen + (cursor - overflowLeft), y, false)
  }

  setPrompt(prompt: string) {
    this.prompt = prompt
    this.render()
  }

  setSecret(secret: boolean) {
    this.secret = !!secret
    this.render()
  }

  setAutocomplete(str: string) {
    this.autocomplete = str
    this.render()
  }

  clearAutocomplete() {
    this.autocomplete = null
    this.render()
  }

  fillAutocomplete() {
    const { buffer, suggestion } = this

    buffer.push(...suggestion.split(""))
    this.cursor += suggestion.length

    this.clearAutocomplete()
    this.emit("change")
  }

  nextInput(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let inputCallback: (input: string) => Promise<void>
      let cancelCallback: () => Promise<void>

      inputCallback = async (input: string) => {
        this.off("cancel", cancelCallback)
        resolve(input)
      }
      cancelCallback = async () => {
        this.off("input", inputCallback)
        this.tty.removePrompt(this)
        reject("Input cancelled")
      }

      this.once("input", inputCallback)
      this.once("cancel", cancelCallback)
    })
  }
}
