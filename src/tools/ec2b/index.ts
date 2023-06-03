import { join } from "path"
import { cwd } from "process"

import TError from "@/translate/terror"
import { QueryCurrRegionHttpRsp } from "@/types/proto"
import { fileExists, readFile } from "@/utils/fileSystem"
import { getEc2bKey } from "@/utils/mhyCrypto/ec2b"
import { dataToProtobuffer } from "@/utils/proto"

export async function dumpEc2bKey(version: string, name: string): Promise<Buffer> {
  const binPath = join(cwd(), `data/bin/${version}/${name}.bin`)

  if (!(await fileExists(binPath))) throw new TError("generic.fileNotFound", binPath)

  const curRegionRsp: QueryCurrRegionHttpRsp = await dataToProtobuffer(await readFile(binPath), name, true)
  return getEc2bKey(Buffer.from(curRegionRsp.clientSecretKey))
}
