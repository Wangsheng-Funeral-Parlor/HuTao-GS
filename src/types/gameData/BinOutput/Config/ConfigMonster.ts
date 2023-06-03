import ConfigAIBeta from "./ConfigAIBeta"
import ConfigAnimal from "./ConfigAnimal"
import ConfigCharacter from "./ConfigCharacter"
import ConfigCharacterRendering from "./ConfigCharacterRendering"
import ConfigEmojiBubble from "./ConfigEmojiBubble"
import ConfigKeyInput from "./ConfigKeyInput"
import ConfigMonsterAudio from "./ConfigMonsterAudio"
import ConfigMonsterInitialPose from "./ConfigMonsterInitialPose"
import ConfigMove from "./ConfigMove"
import ConfigSpecialCamera from "./ConfigSpecialCamera"
import ConfigTrigger from "./ConfigTrigger"

export default interface ConfigMonster extends ConfigCharacter {
  $type: "ConfigMonster"
  InitialPoses: { [key: string]: ConfigMonsterInitialPose }
  Aibeta: ConfigAIBeta
  InputKeys: ConfigKeyInput[]
  Move: ConfigMove
  Audio: ConfigMonsterAudio
  EmojiBubble: ConfigEmojiBubble
  CharacterRendering: ConfigCharacterRendering
  Animal: ConfigAnimal
  CameraAdjust: ConfigSpecialCamera
  Field: ConfigTrigger
}
