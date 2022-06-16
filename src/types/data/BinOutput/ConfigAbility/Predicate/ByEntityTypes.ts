import { Predicate } from '.'

export default interface ByEntityTypes extends Predicate {
  EntityTypes: string[]
}