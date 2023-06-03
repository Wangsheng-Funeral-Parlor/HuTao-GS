import ConfigAnimationBulletMove from "./Child/ConfigAnimationBulletMove"
import ConfigItanoCircusBulletMove from "./Child/ConfigItanoCircusBulletMove"
import ConfigLinerBulletMove from "./Child/ConfigLinerBulletMove"
import ConfigParabolaBulletMove from "./Child/ConfigParabolaBulletMove"
import ConfigPinballBulletMove from "./Child/ConfigPinballBulletMove"
import ConfigSurroundBulletMove from "./Child/ConfigSurroundBulletMove"
import ConfigTrackBulletMove from "./Child/ConfigTrackBulletMove"

type ConfigBulletMove =
  | ConfigAnimationBulletMove
  | ConfigItanoCircusBulletMove
  | ConfigLinerBulletMove
  | ConfigParabolaBulletMove
  | ConfigPinballBulletMove
  | ConfigSurroundBulletMove
  | ConfigTrackBulletMove

export default ConfigBulletMove
