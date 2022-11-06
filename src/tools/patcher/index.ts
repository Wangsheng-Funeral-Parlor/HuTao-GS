import config from '@/config'
import translate from '@/translate'
import TError from '@/translate/terror'
import { deleteFile, dirExists, fileExists, fileSize, readFile, writeFile } from '@/utils/fileSystem'
import {versionStrToL, versionStrToNum} from '@/utils/version'
import { join } from 'path'
import { patchMetadata } from '../metadata'
import { UAPatch } from '../UAPatch'

const dataDirs = ['GenshinImpact_Data', 'YuanShen_Data']
const managedMetadataPath = 'Managed/Metadata/global-metadata.dat'
const nativeMetadataPath = 'Native/Data/Metadata/global-metadata.dat'
const uaPath = 'Native/UserAssembly.dll'

async function getDataDir(gameDir: string): Promise<string> {
  for (const dataDir of dataDirs) {
    const path = join(gameDir, dataDir)
    if (await dirExists(path)) return path
  }
  return null
}

export async function patchGame(gameDir: string) {
  const dataDir = await getDataDir(gameDir)
  if (dataDir == null) throw new TError('message.tools.patcher.error.noDataDir')
  const vL:Number[] = versionStrToL(config.version) //get version

  try { // Default
    console.log(translate('message.tools.patcher.info.patchMeta'))
    await patchMetadata(join(dataDir, nativeMetadataPath), join(dataDir, managedMetadataPath))
  } catch (err) {
    console.log(err) // TODO: add "please Elevate privileges" in json
  }
  try { //version > 3.0.0
    if (vL[0] > 3 || (vL[0] == 3 && vL[1] != 0 && vL[2] != 0)) {
      console.log(translate('message.tools.patcher.info.patchUA'))
      const UApath = join(dataDir, uaPath)
      const bakUApath = join(dataDir, `${uaPath}.bak`)

      if (!await fileExists(UApath)) throw new TError('generic.fileNotFound', UApath)

      // Check if backup already exists
      if (await fileExists(bakUApath) && await fileSize(UApath) === await fileSize(bakUApath)) throw new TError('message.tools.patcher.error.patched')

      // Create backup
      await writeFile(bakUApath, await readFile(UApath))
      await UAPatch(bakUApath, UApath)
    }
  } catch (err) {
    console.log(err) // TODO: add "please Elevate privileges" in json
  }
}

export async function unpatchGame(gameDir: string) {
  const dataDir = await getDataDir(gameDir)
  if (dataDir == null) throw new TError('message.tools.patcher.error.noDataDir')
  const vL:Number[] = versionStrToL(config.version) //get version

  try { // Default
    console.log(translate('message.tools.patcher.info.unpatchMeta'))
    await writeFile(join(dataDir, managedMetadataPath), await readFile(join(dataDir, nativeMetadataPath)))
  } catch (err) {
    console.log(err)
  }
  try { //version > 3.0.0
    if (vL[0] > 3 || (vL[0] == 3 && vL[1] != 0 && vL[2] != 0)) {
      console.log(translate('message.tools.patcher.info.unpatchUA'))

      const UApath = join(dataDir, uaPath)
      const bakUApath = join(dataDir, `${uaPath}.bak`)

      if (!await fileExists(bakUApath)) throw new TError('generic.fileNotFound', bakUApath)

      await writeFile(UApath, await readFile(bakUApath))
      await deleteFile(bakUApath)
    }
  } catch (err) {
    console.log(err)
  }
}
