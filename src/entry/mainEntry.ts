import { appendFileSync } from "fs"
import { join } from "path"
import { cwd } from "process"

import sourceMapSupport from "source-map-support"

import AbilityData from "$/gameData/data/AbilityData"
import AvatarData from "$/gameData/data/AvatarData"
import DungeonData from "$/gameData/data/DungeonData"
import GadgetData from "$/gameData/data/GadgetData"
import GrowCurveData from "$/gameData/data/GrowCurveData"
import MapAreaData from "$/gameData/data/MapAreaData"
import MaterialData from "$/gameData/data/MaterialData"
import MonsterData from "$/gameData/data/MonsterData"
import ReliquaryData from "$/gameData/data/ReliquaryData"
import SceneData from "$/gameData/data/SceneData"
import ShopData from "$/gameData/data/ShopData"
import SkillData from "$/gameData/data/SkillData"
import TalentData from "$/gameData/data/TalentData"
import WeaponData from "$/gameData/data/WeaponData"
import WeatherData from "$/gameData/data/WeatherData"
import WorldData from "$/gameData/data/WorldData"
import CLI from "@/cli"
import { registerBuiltInCommands } from "@/cli/commands"
import Logger from "@/logger"
import Server from "@/server"
import TLogger from "@/translate/tlogger"
import { getTTY } from "@/tty"
import parseArgs, { ParsedArgs } from "@/utils/parseArgs"

sourceMapSupport.install()
;(async (args: ParsedArgs) => {
  // initialize tty
  getTTY().setIO()

  await resourceCache()

  const server = new Server()
  const logger = new Logger()
  const cli = new CLI(server)

  let hasError = false

  // restart on error
  process.on("uncaughtException", (err) => {
    if (hasError) return
    hasError = true

    try {
      appendFileSync(join(cwd(), "data/log/server/uncaught.txt"), `${err.stack || err.message}\n`)
    } catch (e) {}

    logger.fatal("Uncaught exception:", err)
    server.restart(5e3)
  })

  logger.debug("Launch arguments:", process.argv)

  if (args.updateState != null) {
    // start update
    server.update?.start()
  } else {
    // register commands
    registerBuiltInCommands()

    // start server
    server.start()
    cli.start()

    // check for update
    server.update?.checkForUpdate()
  }
})(parseArgs(process.argv))

async function resourceCache() {
  const tLogger = new TLogger()

  tLogger.info("message.cache.info.start")

  await Promise.all([
    AbilityData.getData(),
    AvatarData.getData(),
    DungeonData.getData(),
    GadgetData.getData(),
    GrowCurveData.getData(),
    MapAreaData.getData(),
    MaterialData.getData(),
    MonsterData.getData(),
    ReliquaryData.getData(),
    SceneData.getData(),
    ShopData.getData(),
    SkillData.getData(),
    TalentData.getData(),
    WeaponData.getData(),
    WeatherData.getData(),
    WorldData.getData(),
  ])

  tLogger.info("message.cache.info.success")
}
