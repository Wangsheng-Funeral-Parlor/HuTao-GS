import Loader from '$/gameData/loader'
import LoaderTemplateList, { LoaderTemplate } from '@/types/gameData/LoaderTemplate'

class LoaderTemplateLoader extends Loader {
  declare data: LoaderTemplateList

  constructor() {
    super('LoaderTemplate')
  }

  async getData(): Promise<LoaderTemplateList> {
    return super.getData()
  }

  async getLoaderTemplate(id: number): Promise<LoaderTemplate> {
    return (await this.getData()).find(data => data.Id === id)
  }
}

let loader: LoaderTemplateLoader
export default (() => loader = loader || new LoaderTemplateLoader())()