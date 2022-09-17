import AttachToStateIDMixin from './AttachToStateIDMixin'

export default interface AttachToAnimatorStateIDMixin extends Omit<AttachToStateIDMixin, '$type'> {
  $type: 'AttachToAnimatorStateIDMixin'
}