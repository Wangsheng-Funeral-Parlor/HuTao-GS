import { deleteFile, dirExists, fileExists, fileSize, readFile, writeFile } from '@/utils/fileSystem'
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
  if (dataDir == null) throw new Error('Unable to find Data directory')

  try {
    console.log('Patching metadata...')

    await patchMetadata(join(dataDir, nativeMetadataPath), join(dataDir, managedMetadataPath))
  } catch (err) {
    console.log(err)
  }

  try {
    console.log('Patching UA...')

    const UApath = join(dataDir, uaPath)
    const bakUApath = join(dataDir, `${uaPath}.bak`)

    if (!await fileExists(UApath)) throw new Error('Unable to find UserAssembly.dll')

    // Check if backup already exists
    if (await fileExists(bakUApath) && await fileSize(UApath) === await fileSize(bakUApath)) throw new Error('Already patched.')

    // Create backup
    await writeFile(bakUApath, await readFile(UApath))

    await UAPatch(bakUApath, UApath)
  } catch (err) {
    console.log(err)
  }
}

export async function unpatchGame(gameDir: string) {
  const dataDir = await getDataDir(gameDir)
  if (dataDir == null) throw new Error('Unable to find Data directory')

  try {
    console.log('Unpatching metadata...')

    await writeFile(join(dataDir, managedMetadataPath), await readFile(join(dataDir, nativeMetadataPath)))
  } catch (err) {
    console.log(err)
  }

  try {
    console.log('Unpatching UA...')

    const UApath = join(dataDir, uaPath)
    const bakUApath = join(dataDir, `${uaPath}.bak`)

    if (!await fileExists(bakUApath)) throw new Error('Unable to find UserAssembly.dll.bak')

    await writeFile(UApath, await readFile(bakUApath))
    await deleteFile(bakUApath)
  } catch (err) {
    console.log(err)
  }
}