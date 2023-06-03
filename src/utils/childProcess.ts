import { ChildProcess, exec, spawn } from "child_process"
import { cwd, env } from "process"

function quoteSpaces(arg: string) {
  return arg.includes(" ") ? `"${arg.replace(/"/, '\\"')}"` : arg
}

export function execCommand(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const cp = exec(cmd, { env, cwd: cwd() })
    let buffer = ""
    cp.stdout?.setEncoding("utf8")
    cp.stdout?.on("data", (data) => (buffer += data))
    cp.stderr?.setEncoding("utf8")
    cp.stderr?.on("data", (data) => (buffer += data))
    cp.on("exit", () => resolve(buffer))
    cp.on("error", (err) => reject(err))
  })
}

export function attachedSpawn(path: string, args: string[]): Promise<ChildProcess> {
  return new Promise<ChildProcess>((resolve, reject) => {
    const cp = spawn(path, args, { env, cwd: cwd(), stdio: "pipe" })
    cp.on("spawn", () => resolve(cp))
    cp.on("error", (err) => reject(err))
  })
}

export function detachedSpawn(path: string, args: string[]): Promise<ChildProcess> {
  return new Promise<ChildProcess>((resolve, reject) => {
    const cp = spawn(`"${path}"`, args.map(quoteSpaces), {
      env,
      cwd: cwd(),
      shell: true,
      detached: true,
      stdio: "ignore",
    })
    cp.unref()
    cp.on("spawn", () => resolve(cp))
    cp.on("error", (err) => reject(err))
  })
}
