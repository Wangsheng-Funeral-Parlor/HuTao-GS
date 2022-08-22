import Logger from '@/logger'
import * as QueryCurRegion from './curRegion'
import * as QueryRegionList from './regionList'

const logger = new Logger('APATCH')

export const checkForUpdate = async (): Promise<void> => {
  logger.info('Checking for updates...')
  await QueryRegionList.checkForUpdate()
  await QueryCurRegion.checkForUpdate()
  logger.info('Update complete.')
}

export const update = async (): Promise<void> => {
  logger.info('Updating...')
  await QueryRegionList.update()
  await QueryCurRegion.update()
  logger.info('Update complete.')
}