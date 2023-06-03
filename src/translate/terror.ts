import translate from "."

export default class TError extends Error {
  constructor(key: string, ...params: (string | number)[]) {
    super(translate(key, ...params))
  }
}
