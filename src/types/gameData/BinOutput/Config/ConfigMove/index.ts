import ConfigAnimatorMove from './Child/ConfigAnimatorMove'
import ConfigBulletMove from './Child/ConfigBulletMove'
import ConfigFollowMove from './Child/ConfigFollowMove'
import ConfigPlatformMove from './Child/ConfigPlatformMove'
import ConfigRigidbodyMove from './Child/ConfigRigidbodyMove'
import ConfigScenePropAnimatorMove from './Child/ConfigScenePropAnimatorMove'
import ConfigSimpleMove from './Child/ConfigSimpleMove'
import ConfigWindmillMove from './Child/ConfigWindmillMove'

type ConfigMove =
  ConfigAnimatorMove |
  ConfigBulletMove |
  ConfigFollowMove |
  ConfigPlatformMove |
  ConfigRigidbodyMove |
  ConfigScenePropAnimatorMove |
  ConfigSimpleMove |
  ConfigWindmillMove

export default ConfigMove