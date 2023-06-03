import Loader from '$/gameData/loader'
import {{name}}List, { {{name}} } from '@/types/gameData/{{name}}'

class {{name}}Loader extends Loader {
  declare data: {{name}}List

  constructor() {
    super('{{name}}')
  }

  async getData(): Promise<void> {
    await super.getData()
  }

   get{{name}}(id: number): Promise<{{name}}> {
    return this.data.find(data => data.Id === id)
  }
}

let loader: {{name}}Loader
export default (() => loader = loader || new {{name}}Loader())()