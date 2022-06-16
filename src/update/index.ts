import Logger from '@/logger'
import * as QueryCurRegion from './curRegion'
import * as QueryRegionList from './regionList'

const logger = new Logger('UPDATE')

export const checkForUpdate = async (): Promise<void> => {
  logger.info('Checking for updates...')
  await QueryCurRegion.checkForUpdate()
  await QueryRegionList.checkForUpdate()
  logger.info('Update complete.')
}

export const update = async (): Promise<void> => {
  logger.info('Updating...')
  await QueryCurRegion.update()
  await QueryRegionList.update()
  logger.info('Update complete.')
}