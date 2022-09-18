import HealHP from './HealHP'

export default interface ReviveAvatar extends Omit<HealHP, '$type'> {
  $type: 'ReviveAvatar'
}