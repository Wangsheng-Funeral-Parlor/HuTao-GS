import * as QueryCurRegion from "./curRegion"
import * as QueryRegionList from "./regionList"

import TLogger from "@/translate/tlogger"

const logger = new TLogger("APATCH")

export const checkForUpdate = async (): Promise<void> => {
  logger.info("message.tools.autoPatch.info.check")
  await QueryRegionList.checkForUpdate()
  await QueryCurRegion.checkForUpdate()
  logger.info("message.tools.autoPatch.info.success")
}

export const update = async (): Promise<void> => {
  logger.info("message.tools.autoPatch.info.update")
  await QueryRegionList.update()
  await QueryCurRegion.update()
  logger.info("message.tools.autoPatch.info.success")
}
