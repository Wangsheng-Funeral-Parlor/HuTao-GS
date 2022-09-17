import ConfigSceneArea from './ConfigSceneArea'
import ConfigScenePoint from './ConfigScenePoint'
import ConfigForceField from './ConfigScenePoint/Child/ConfigForceField'
import ConfigLoadingDoor from './ConfigScenePoint/Child/ConfigLoadingDoor'
import ConfigLocalEntity from './ConfigScenePoint/Child/ConfigLocalEntity'

export default interface ConfigScene {
  TransRadius: number
  Points: { [key: string]: ConfigScenePoint }
  Areas: { [key: string]: ConfigSceneArea }
  Forces: { [key: string]: ConfigForceField }
  Entities: { [key: string]: ConfigLocalEntity }
  Doors: { [key: string]: ConfigLoadingDoor }
}