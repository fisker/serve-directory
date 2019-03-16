import _ from './utils'
import Connection from './connection'
import defaultOptions from './default-options'

function responser(mime, render) {
  return function(req, res, data) {
    const body = render(data)

    // security header for content sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff')

    // standard headers
    res.setHeader('Content-Type', `${mime}; charset=${_.CHARSET}`)
    res.setHeader('Content-Length', Buffer.byteLength(body, _.CHARSET))

    // body
    res.end(body, _.CHARSET)
  }
}

class ServeDirectory {
  constructor(root, options) {
    // root required
    // resolve root to absolute and normalize
    try {
      root = _.path.normalize(_.path.resolve(root) + _.path.sep)
      _.fs.statSync(root)
    } catch (err) {
      throw err
    }

    this.root = root
    this.responser = {}
    this.options = {
      hidden: defaultOptions.hidden,
      relative: defaultOptions.relative,
    }
    this.imports = Object.assign({}, _)

    this.config(defaultOptions)

    if (options) {
      this.config(options)
    }
  }

  config(options) {
    const sd = this

    if (options.hidden === true || options.hidden === false) {
      sd.options.hidden = options.hidden
    }

    if (options.relative === true || options.relative === false) {
      sd.options.relative = options.relative
    }

    if (options.imports) {
      Object.assign(sd.imports, options.imports)
    }

    if (options.process) {
      options.process.filter(Boolean).forEach(function(processor) {
        processor.accept
          .split(',')
          .map(_.trim)
          .filter(Boolean)
          .forEach(function(type) {
            if (processor.render) {
              sd.responser[type] = responser(
                type,
                _.template(processor.render, {imports: sd.imports})
              )
            } else {
              delete sd.responser[type]
            }
          })
      })
    }
  }

  middleware(req, res, next) {
    try {
      return new Connection(this, req, res, next).response()
    } catch (err) {
      return next(err)
    }
  }
}

export default ServeDirectory
