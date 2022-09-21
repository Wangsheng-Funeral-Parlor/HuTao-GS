const ResEdit = require('resedit')
const { join } = require("path")
const { access, createWriteStream, constants, existsSync, mkdirSync, readFileSync, unlink, writeFileSync } = require('fs')
const { get } = require('https')

function download(url, dest) {
  return new Promise((resolve, reject) => {
    access(dest, constants.F_OK, (accessErr) => {
      if (accessErr === null) return reject('File already exists')

      const request = get(url, response => {
        if (response.statusCode === 200) {
          const file = createWriteStream(dest, { flags: 'wx' })

          file.on('finish', () => resolve())
          file.on('error', err => {
            file.close()
            if (err.code === 'EEXIST') reject('File already exists')
            else unlink(dest, () => reject(err.message)) // Delete temp file
          })

          response.pipe(file)
        } else if (response.statusCode === 302 || response.statusCode === 301) {
          download(response.headers.location, dest).then(() => resolve())
        } else {
          reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`)
        }
      })

      request.on('error', err => reject(err.message))
    })
  })
}

const packageConfig = require('./package.json')
const supportedNodeVersions = Object.keys(require('pkg-fetch/patches/patches.json')).map(v => v.slice(1))
const pkgFetchVersion = `v${require('pkg-fetch/package').version.split('.').slice(0, 2).join('.')}`
const cachePath = join(process.env['PKG_CACHE_PATH'], pkgFetchVersion)

function getTargetInfo(target) {
  const targetVersion = target.match(/node(.*?)-/)[1]
  const nodeVersion = supportedNodeVersions.find(v => v.split('.')[0] === targetVersion)

  return {
    nodeVersion,
    fetchedPath: join(cachePath, `fetched-v${nodeVersion}-win-x64`),
    builtPath: join(cachePath, `built-v${nodeVersion}-win-x64`),
    url: `https://github.com/vercel/pkg-fetch/releases/download/${pkgFetchVersion}/node-v${nodeVersion}-win-x64`
  }
}

function checkExistingBuild(builtPath, versionSegments) {
  const buildVersion = `${versionSegments[0]}.${versionSegments[1]}.${versionSegments[2]}.${versionSegments[3]}`

  if (!existsSync(builtPath)) return false

  const builtExe = ResEdit.NtExecutable.from(readFileSync(builtPath))
  const builtRes = ResEdit.NtExecutableResource.from(builtExe)

  const builtViList = ResEdit.Resource.VersionInfo.fromEntries(builtRes.entries)
  const builtVersion = builtViList[0].getStringValues({ lang: 1033, codepage: 1200 })?.['FileVersion']

  if (buildVersion === builtVersion) {
    console.log('Using existing build')
    return true
  }

  console.log('Version changed, rebuilding...')
  return false
}

module.exports = async () => {
  const targets = packageConfig.pkg.targets.map(getTargetInfo)

  for (let target of targets) {
    const { nodeVersion, fetchedPath, builtPath, url } = target

    const versionSegments = `${packageConfig.version.replace('-', '.')}`.split('.').map(v => parseInt(v))
    while (versionSegments.length < 4) versionSegments.push(0)

    console.log('Target:', nodeVersion)

    if (checkExistingBuild(builtPath, versionSegments)) continue

    if (!existsSync(fetchedPath)) {
      console.log('Downloading file...')

      // attemp to create directory
      try { mkdirSync(cachePath, { recursive: true }) } catch (e) { console.error(e) }

      // attemp to download file
      try {
        await download(url, fetchedPath)
      } catch (e) {
        console.error(e)
        process.exit(1)
      }
      console.log('Downloaded file.')
    } else {
      console.log('Using existing file')
    }

    console.log('Reading EXE')

    const exe = ResEdit.NtExecutable.from(readFileSync(fetchedPath))
    const res = ResEdit.NtExecutableResource.from(exe)

    const viList = ResEdit.Resource.VersionInfo.fromEntries(res.entries)
    const vi = viList[0]

    console.log(vi.data.strings)

    console.log('Removing OriginalFilename')
    vi.removeStringValue({ lang: 1033, codepage: 1200 }, 'OriginalFilename')
    console.log('Removing InternalName')
    vi.removeStringValue({ lang: 1033, codepage: 1200 }, 'InternalName')

    console.log('Setting Product Version')
    vi.setProductVersion(versionSegments[0], versionSegments[1], versionSegments[2], versionSegments[3], 1033)
    console.log('Setting File Version')
    vi.setFileVersion(versionSegments[0], versionSegments[1], versionSegments[2], versionSegments[3], 1033)

    console.log('Setting File Info')
    vi.setStringValues(
      { lang: 1033, codepage: 1200 },
      {
        FileDescription: packageConfig.description,
        ProductName: packageConfig.name,
        CompanyName: '',
        LegalCopyright: packageConfig.author
      }
    )
    console.log(vi.data.strings)
    vi.outputToResourceEntries(res.entries)

    console.log('Replacing Icon')
    const iconFile = ResEdit.Data.IconFile.from(readFileSync(join(__dirname, 'appIcon.ico')))
    ResEdit.Resource.IconGroupEntry.replaceIconsForResource(
      res.entries,
      1,
      1033,
      iconFile.icons.map((item) => item.data)
    )
    res.outputResource(exe)

    console.log('Generating EXE')
    const newBinary = exe.generate()

    console.log('Saving EXE')
    writeFileSync(builtPath, Buffer.from(newBinary))
  }
}