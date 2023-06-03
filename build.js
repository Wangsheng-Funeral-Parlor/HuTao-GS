const { exec } = require("child_process")
const { join } = require("path")
const { cwd } = require("process")

process.env["PKG_CACHE_PATH"] = join(cwd(), "cache")
process.env["MAKE_JOB_COUNT"] = 8

/**
 * Execute command
 * @param {string} cmd
 * @param {boolean} slient
 * @returns {Promise<string>}
 */
function execCommand(cmd, slient = false) {
  return new Promise((res, rej) => {
    const cp = exec(cmd, { env: process.env, cwd: cwd() })

    if (!slient) cp.stdout.pipe(process.stdout)
    cp.on("exit", () => res())
    cp.on("error", (err) => rej(err))
  })
}

;(async () => {
  const mode =
    process.argv
      .find((arg) => arg.indexOf("-mode:") === 0)
      ?.split(":")?.[1]
      ?.toLowerCase() || null
  console.log("Welcome to Wangsheng Funeral Parlor~")

  console.log("Building development...")
  await execCommand("tsc --incremental")

  console.log("Resolving alias...")
  await execCommand("tsc-alias")

  if (mode === "dev") return console.log("Build complete.")

  console.log("Preparing node binary...")
  await require("./prepNodeBin")()

  console.log("Packing executable...")
  await execCommand('pkg . --compress Brotli -o "dist/HuTao-GS.exe" --build', true)

  console.log("Build complete.")
})()
