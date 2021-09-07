import path from 'path'
import defaults from '../defaults.js'
import isBoolean from '../utils/is-boolean.js'
import Connection from './connection.js'
import imports from './imports.js'
import template from './template.js'
import responser from './responser.js'

class ServeDirectory {
  constructor(root, options) {
    // root required
    // resolve root to absolute and normalize
    root = path.resolve(root)

    this.root = root

    this.responser = {}
    this.options = {
      hidden: defaults.hidden,
      relative: defaults.relative,
    }
    this.imports = {
      ...imports,
    }

    this.config(defaults)

    if (options) {
      this.config(options)
    }
  }

  config({hidden, relative, imports = {}, process = []} = {}) {
    if (isBoolean(hidden)) {
      this.options.hidden = hidden
    }

    if (isBoolean(relative)) {
      this.options.relative = relative
    }

    Object.assign(this.imports, imports)

    for (let {accept, render} of process.filter(Boolean)) {
      accept = (Array.isArray(accept) ? accept : accept.split(','))
        .map((x) => x.trim())
        .filter(Boolean)
      for (const type of accept) {
        if (render) {
          this.responser[type] = responser(
            type,
            template(render, {imports: this.imports}),
          )
        } else {
          delete this.responser[type]
        }
      }
    }
  }

  middleware(request, response, next) {
    try {
      return new Connection(this, request, response, next).process()
    } catch (error) {
      return next(error)
    }
  }
}

export default ServeDirectory
