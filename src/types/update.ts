import { UpdateApiRetcodeEnum } from "./enum"

export interface UpdateApiResponse {
  code: UpdateApiRetcodeEnum
  msg: string
  data?: { pathname: string } | UpdateContent
}

export interface UpdateContent {
  v: number
  c?: string
  s?: string
}
