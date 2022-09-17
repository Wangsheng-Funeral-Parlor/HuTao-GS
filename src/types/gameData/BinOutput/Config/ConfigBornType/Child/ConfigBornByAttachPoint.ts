import ConfigBaseBornType from '.'

export default interface ConfigBornByAttachPoint extends ConfigBaseBornType {
  $type: 'ConfigBornByAttachPoint'
  AttachPointName: string
  AttachPointTargetType: string
}