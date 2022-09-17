import ConfigCharacter from './ConfigCharacter'
import ConfigMoveStateEffect from './ConfigMoveStateEffect'
import ConfigAvatarAudio from './ConfigAvatarAudio'
import ConfigAvatarControllerAssembly from './ConfigAvatarControllerAssembly'
import ConfigAvatarPerform from './ConfigAvatarPerform'
import ConfigAvatarShoot from './ConfigAvatarShoot'

export default interface ConfigAvatar extends ConfigCharacter {
  ShootConfig: ConfigAvatarShoot
  Audio: ConfigAvatarAudio
  ControllerAssembly: ConfigAvatarControllerAssembly
  MoveStateEffect: ConfigMoveStateEffect
  Perform: ConfigAvatarPerform
}