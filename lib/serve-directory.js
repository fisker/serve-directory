/*
 * serve-index
 * Copyright(c) 2011 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 *
 * serve-directory
 * Copyright(c) 2017- fisker Cheung
 * MIT Licensed
 */
'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0

var _utils = _interopRequireDefault(require('./utils'))

var _connection = _interopRequireDefault(require('./connection'))

var _defaultOptions = _interopRequireDefault(require('./default-options'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj}
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i]
    descriptor.enumerable = descriptor.enumerable || false
    descriptor.configurable = true
    if ('value' in descriptor) descriptor.writable = true
    Object.defineProperty(target, descriptor.key, descriptor)
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps)
  if (staticProps) _defineProperties(Constructor, staticProps)
  return Constructor
}

function responser(mime, render) {
  return function(req, res, data) {
    var body = render(data) // security header for content sniffing

    res.setHeader('X-Content-Type-Options', 'nosniff') // standard headers

    res.setHeader(
      'Content-Type',
      ''.concat(mime, '; charset=').concat(_utils.default.CHARSET)
    )
    res.setHeader(
      'Content-Length',
      Buffer.byteLength(body, _utils.default.CHARSET)
    ) // body

    res.end(body, _utils.default.CHARSET)
  }
}

var ServeDirectory =
  /*#__PURE__*/
  (function() {
    function ServeDirectory(root, options) {
      _classCallCheck(this, ServeDirectory)

      // root required
      // resolve root to absolute and normalize
      try {
        root = _utils.default.path.normalize(
          _utils.default.path.resolve(root) + _utils.default.path.sep
        )

        _utils.default.fs.statSync(root)
      } catch (err) {
        throw err
      }

      this.root = root
      this.responser = {}
      this.options = {
        hidden: _defaultOptions.default.hidden,
        relative: _defaultOptions.default.relative,
      }
      this.imports = Object.assign({}, _utils.default)
      this.config(_defaultOptions.default)

      if (options) {
        this.config(options)
      }
    }

    _createClass(ServeDirectory, [
      {
        key: 'config',
        value: function config(options) {
          var sd = this

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
                .map(_utils.default.trim)
                .filter(Boolean)
                .forEach(function(type) {
                  if (processor.render) {
                    sd.responser[type] = responser(
                      type,
                      _utils.default.template(processor.render, {
                        imports: sd.imports,
                      })
                    )
                  } else {
                    delete sd.responser[type]
                  }
                })
            })
          }
        },
      },
      {
        key: 'middleware',
        value: function middleware(req, res, next) {
          try {
            return new _connection.default(this, req, res, next).response()
          } catch (err) {
            return next(err)
          }
        },
      },
    ])

    return ServeDirectory
  })()

var _default = ServeDirectory
exports.default = _default
module.exports = exports.default
