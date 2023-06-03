import { join } from "path"

import { patchMetadata } from "../metadata"
import { UAPatch } from "../UAPatch"

import config from "@/config"
import translate from "@/translate"
import TError from "@/translate/terror"
import { deleteFile, dirExists, fileExists, fileSize, readFile, writeFile } from "@/utils/fileSystem"
import { versionStrToNum } from "@/utils/version"

const dataDirs = ["GenshinImpact_Data", "YuanShen_Data"]
const managedMetadataPath = "Managed/Metadata/global-metadata.dat"
const nativeMetadataPath = "Native/Data/Metadata/global-metadata.dat"
const uaPath = "Native/UserAssembly.dll"

async function getDataDir(gameDir: string): Promise<string> {
  for (const dataDir of dataDirs) {
    const path = join(gameDir, dataDir)
    if (await dirExists(path)) return path
  }
  return null
}

export async function patchGame(gameDir: string) {
  const dataDir = await getDataDir(gameDir)
  if (dataDir == null) throw new TError("message.tools.patcher.error.noDataDir")

  tryPatchMetadata: try {
    // NOSONAR
    if (versionStrToNum(config.game.version) >= 0x030132) break tryPatchMetadata

    console.log(translate("message.tools.patcher.info.patchMeta"))

    await patchMetadata(join(dataDir, nativeMetadataPath), join(dataDir, managedMetadataPath))
  } catch (err) {
    console.log(err)
  }

  tryPatchUA: try {
    // NOSONAR
    if (versionStrToNum(config.game.version) < 0x030032) break tryPatchUA

    console.log(translate("message.tools.patcher.info.patchUA"))

    const UApath = join(dataDir, uaPath)
    const bakUApath = join(dataDir, `${uaPath}.bak`)

    if (!(await fileExists(UApath))) throw new TError("generic.fileNotFound", UApath)

    // Check if backup already exists
    if ((await fileExists(bakUApath)) && (await fileSize(UApath)) === (await fileSize(bakUApath)))
      throw new TError("message.tools.patcher.error.patched")

    // Create backup
    await writeFile(bakUApath, await readFile(UApath))

    await UAPatch(bakUApath, UApath)
  } catch (err) {
    console.log(err)
  }
}

export async function unpatchGame(gameDir: string) {
  const dataDir = await getDataDir(gameDir)
  if (dataDir == null) throw new TError("message.tools.patcher.error.noDataDir")

  tryUnpatchMetadata: try {
    // NOSONAR
    if (versionStrToNum(config.game.version) >= 0x030132) break tryUnpatchMetadata

    console.log(translate("message.tools.patcher.info.unpatchMeta"))

    await writeFile(join(dataDir, managedMetadataPath), await readFile(join(dataDir, nativeMetadataPath)))
  } catch (err) {
    console.log(err)
  }

  tryUnpatchUA: try {
    // NOSONAR
    if (versionStrToNum(config.game.version) < 0x030032) break tryUnpatchUA

    console.log(translate("message.tools.patcher.info.unpatchUA"))

    const UApath = join(dataDir, uaPath)
    const bakUApath = join(dataDir, `${uaPath}.bak`)

    if (!(await fileExists(bakUApath))) throw new TError("generic.fileNotFound", bakUApath)

    await writeFile(UApath, await readFile(bakUApath))
    await deleteFile(bakUApath)
  } catch (err) {
    console.log(err)
  }
}
