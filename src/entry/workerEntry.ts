import sourceMapSupport from "source-map-support"

sourceMapSupport.install()
import Worker from "#/socket/worker"
import parseArgs, { ParsedArgs } from "@/utils/parseArgs"
;(async (args: ParsedArgs) => {
  let worker: typeof Worker

  switch (args.lm) {
    case "kcp":
      worker = (await import("#/socket/worker/kcpWorker")).default
      break
    case "recv":
      worker = (await import("#/socket/worker/recvWorker")).default
      break
    default:
      return
  }

  worker.create()
})(parseArgs(process.argv))
