import EventEmitter from 'promise-events'

function getPropNames(proto: any): string[] {
  if (proto.__proto__ == null) return []

  const ret = Object.getOwnPropertyNames(proto)
  ret.push(...getPropNames(proto.__proto__))

  return ret.filter((n, i, arr) => arr.indexOf(n) === i)
}

export default class BaseClass extends EventEmitter {
  constructor() {
    super()
  }

  initHandlers(eventTarget?: BaseClass) {
    this.bindHandlers()

    if (eventTarget) {
      this.registerHandlers = this.registerHandlers.bind(this, eventTarget)
      this.unregisterHandlers = this.unregisterHandlers.bind(this, eventTarget)

      this.registerHandlers()
    } else {
      this.registerHandlers = this.registerHandlers.bind(this)
      this.unregisterHandlers = this.unregisterHandlers.bind(this)
    }
  }

  bindHandlers() {
    const ownPropNames = getPropNames(this.constructor.prototype)

    for (const name of ownPropNames) {
      if (!name.match(/^handle[A-Z]/) || typeof this[name] !== 'function') continue
      this[name] = this[name].bind(this)
    }
  }

  registerHandlers(target?: BaseClass) {
    if (!target) return

    const ownPropNames = getPropNames(this.constructor.prototype)

    for (const name of ownPropNames) {
      if (!name.match(/^handle[A-Z]/) || typeof this[name] !== 'function') continue
      target.on(name.slice(6), this[name])
    }
  }

  unregisterHandlers(target?: BaseClass) {
    if (!target) return

    const ownPropNames = getPropNames(this.constructor.prototype)

    for (const name of ownPropNames) {
      if (!name.match(/^handle[A-Z]/) || typeof this[name] !== 'function') continue
      target.off(name.slice(6), this[name])
    }
  }
}