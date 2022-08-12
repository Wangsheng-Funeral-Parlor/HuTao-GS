import { ConfigFollowMove } from './ConfigFollowMove'
import ConfigLinerBulletMove from './ConfigLinerBulletMove'

export interface Move {
  $type: string
}

type MoveConfig = ConfigFollowMove | ConfigLinerBulletMove
export default MoveConfig