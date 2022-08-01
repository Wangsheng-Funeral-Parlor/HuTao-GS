import { Readable } from 'stream'
import DnsPacket, { PacketResource, ResA, ResAAAA, ResCNAME, ResSVCB } from './packet'
import { NAME_TO_QTYPE, QTYPE_TO_NAME } from './packet/consts'

function getAnsValue(res: PacketResource) {
  switch (res.type) {
    case NAME_TO_QTYPE.A:
      return (res as ResA).address
    case NAME_TO_QTYPE.AAAA:
      return (res as ResAAAA).address
    case NAME_TO_QTYPE.CNAME:
      return (res as ResCNAME).domain
    case NAME_TO_QTYPE.SVCB:
    case NAME_TO_QTYPE.HTTPS:
      return (res as ResSVCB).priority + JSON.stringify(Object.fromEntries(Object.entries((res as ResSVCB).fields).map(e => [e[0], e[1].toString('utf8')])))
    default:
      return res.data?.toString()
  }
}

export const listAnswer = (response: Buffer): string => {
  const results = []
  const res = DnsPacket.parse(response)

  for (const r of res.answer) {
    results.push(`${QTYPE_TO_NAME[r.type] || r.type}:${getAnsValue(r)}`)
  }

  return results.join(',') || 'nxdomain'
}

export const readStream = (stream: Readable): Promise<Buffer> => {
  return new Promise<Buffer>((resolve, reject) => {
    let chunks: Buffer[] = []
    let chunkLen = 0
    let contentLen = -1
    let received = false

    function processMessage() {
      if (received) return
      received = true
      resolve(Buffer.concat(chunks, chunkLen).subarray(2))
    }

    stream.on('error', reject)
    stream.on('end', processMessage)
    stream.on('readable', () => {
      let chunk: Buffer
      while (chunk = stream.read()) {
        chunks.push(chunk)
        chunkLen += chunk.length
      }

      if (contentLen === -1 && chunkLen >= 2) {
        if (chunks.length > 1) chunks = [Buffer.concat(chunks, chunkLen)]
        contentLen = chunks[0].readUInt16BE(0)
      }

      if (chunkLen >= 2 + contentLen) processMessage()
    })
  })
}