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
import CLI from '@/cli'
import { registerBuiltInCommands } from '@/cli/commands'
import Logger from '@/logger'
import printIcon from '@/printIcon'
import Server from '@/server'
import TLogger from "@/translate/tlogger"
import { getTTY } from '@/tty'
import parseArgs, { ParsedArgs } from '@/utils/parseArgs'
import { appendFileSync } from 'fs'
import { join } from 'path'
import { cwd } from 'process'

const logger = new Logger()
const tLogger = new TLogger()

;(async (args: ParsedArgs) => {
  // initialize tty
  getTTY().setIO()

  // print icon to terminal
  printIcon()

  tLogger.info("message.cache.info.start")

  await AbilityData.getData()
  tLogger.debug("message.cache.debug.ability")

  await AvatarData.getData()
  tLogger.debug("message.cache.debug.avatar")

  await DungeonData.getData()
  tLogger.debug("message.cache.debug.dungeon")

  await GadgetData.getData()
  tLogger.debug("message.cache.debug.gadget")

  await GrowCurveData.getData()
  tLogger.debug("message.cache.debug.growCurve")

  await MapAreaData.getData()
  tLogger.debug("message.cache.debug.mapArea")

  await MaterialData.getData()
  tLogger.debug("message.cache.debug.material")

  await MonsterData.getData()
  tLogger.debug("message.cache.debug.monster")

  await ReliquaryData.getData()
  tLogger.debug("message.cache.debug.reliquary")

  await SceneData.getData()
  tLogger.debug("message.cache.debug.scene")

  await ShopData.getData()
  tLogger.debug("message.cache.debug.shop")

  await SkillData.getData()
  tLogger.debug("message.cache.debug.skill")

  await TalentData.getData()
  tLogger.debug("message.cache.debug.talent")

  await WeaponData.getData()
  tLogger.debug("message.cache.debug.weapon")

  await WeatherData.getData()
  tLogger.debug("message.cache.debug.weather")

  await WorldData.getData()
  tLogger.debug("message.cache.debug.world")

  tLogger.info("message.cache.info.success")

  const server = new Server()
  const cli = new CLI(server)

  let hasError = false

  // restart on error
  process.on('uncaughtException', (err) => {
    if (hasError) return
    hasError = true

    try {
      appendFileSync(join(cwd(), 'data/log/server/uncaught.txt'), `${err.stack || err.message}\n`)
    } catch (e) { }

    logger.fatal('Uncaught exception:', err)
    server.restart(5e3)
  })

  logger.debug('Launch arguments:', process.argv)

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