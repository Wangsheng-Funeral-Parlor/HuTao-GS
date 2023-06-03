import * as http from "http"
export * from "http"

export interface IncomingMessageExt extends Omit<http.IncomingMessage, "url"> {
  url: string | URL
  body?: string | Buffer
  checkContinue?: boolean
}

export interface ServerResponseExt extends Omit<http.ServerResponse, "end"> {
  _end?: Function
  end: Function
}

export type RequestListenerExt = (
  req: http.IncomingMessage | IncomingMessageExt,
  res: http.ServerResponse | ServerResponseExt
) => void

export type ServerConfig = {
  port: number
  useHttps?: boolean
}
