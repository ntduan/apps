import { schemaToJson, fieldsToJson } from './utility.js'

const Spec = {
  spec(url) {
    return fetch(url, { credentials: 'include' })
      .then(response => response.json())
      .then(result => {
        const bundle = Object.create(this.bundle)
        bundle.data = result
        bundle.transform()
        return bundle
      })
  },

  getSpec() {
    const path = window.SPEC_PATH === '%SPEC_PATH%' ? 'http://10.0.5.58:2124/' : window.SPEC_PATH
    return fetch(path, { credentials: 'include' })
      .then(response => response.json())
      .then(result => {
        const bundle = Object.create(this.bundle)
        bundle.data = result
        bundle.transform()
        return bundle
      })
  },

  bundle: {
    data: null,
    getData() {
      return this.data
    },
    transform(path) {
      const spec = this.data
      const tags = spec.tags.reduce((result, tag) => {
        result[tag.name] = { ...tag, subMenu: {} }
        return result
      }, {})
      Object.keys(spec.paths).forEach(path => {
        Object.keys(spec.paths[path]).forEach(method => {
          const info = spec.paths[path][method]
          info.interface = `${method.toUpperCase()} ${path}`
          // NOTE: 接口侧边栏只通过第一个 tag 区分
          const tag = info.tags && info.tags[0]
          if (tags[tag]) tags[tag].subMenu[info.interface] = info
        })
      })
      spec.menu = tags
    },
    getContent(tag, path) {
      const data = this.data.menu[tag].subMenu[path]
      return {
        title: data.summary || data.interface,
        method: data.interface.split(' ')[0],
        type: data['x-type'],
        description: data.description,
        path: data.interface,
        parameters: data.parameters,
        consumes: data.consumes && data.consumes.join('; '),
        responses: data.responses,
      }
    },
    getSpecMenu() {
      return this.data.menu
    },
    getVersion() {
      return `v${this.data.info.version}`
    },
    getOverviewPage() {
      return this.data['x-pages'].index
    },
    getErrorCode() {
      return this.data['x-errors']
    },
    getAllPath() {
      return Object.keys(this.data.menu).reduce((result, tag) => {
        return result.concat(
          Object.keys(this.data.menu[tag].subMenu).map(path => {
            return {
              path: path,
              tag: tag,
            }
          }),
        )
      }, [])
    },
    getSecurityDefinitions() {
      return this.data.securityDefinitions
    },
  },
}

export default Spec
