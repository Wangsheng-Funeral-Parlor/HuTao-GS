import Loader from '$/gameData/loader'
import LoaderTemplate from '@/types/data/LoaderTemplate'

class LoaderTemplateLoader extends Loader {
  declare data: LoaderTemplate[]

  constructor() {
    super('LoaderTemplate')
  }

  get(id: number): LoaderTemplate {
    return this.data.find(data => data.Id === id)
  }
}

let loader: LoaderTemplateLoader
export default (() => loader = loader || new LoaderTemplateLoader())()