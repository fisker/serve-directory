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

var _lodash = _interopRequireDefault(require('lodash.template'))

var _parseurl = _interopRequireDefault(require('parseurl'))

var _mimeTypes = require('mime-types')

var _debug = _interopRequireDefault(require('debug'))

var _package = _interopRequireDefault(require('../package.json'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj}
}

var nativeToString = Object.prototype.toString
var nativeTrim = String.prototype.trim

var path = require('path')

var fs = require('fs')

var CHARSET = 'utf-8'
var debug = (0, _debug.default)(_package.default.name)
var _ = {
  CHARSET: CHARSET,
  path: path,
  fs: fs,
  noop: noop,
  identity: identity,
  type: type,
  directoryFirst: directoryFirst,
  sortBy: sortBy,
  notHidden: notHidden,
  sortFile: sortFile,
  trim: trim,
  template: template,
  mime: mime,
  parseUrl: _parseurl.default,
  read: read,
  pkg: _package.default,
  debug: debug,
}

function noop() {}

function identity(x) {
  return x
}

function type(x) {
  return nativeToString.call(x).slice(8, -1)
}

function directoryFirst(a, b) {
  return b.isDirectory() - a.isDirectory()
}

function notHidden(file) {
  return file.name.slice(0, 1) !== '.'
}

function sortBy(key) {
  return function(a, b) {
    if (b[key] === a[key]) {
      return 0
    }

    return b[key] < a[key] ? 1 : -1
  }
}

function sortFile(a, b) {
  return directoryFirst(a, b) || sortBy('name')(a, b)
}

function trim(s) {
  return nativeTrim.call(s)
}

function read(file) {
  try {
    return fs.readFileSync(path.resolve(file), CHARSET)
  } catch (err) {
    return ''
  }
}

function template(template, options) {
  var templateType = type(template)

  if (templateType === 'Function') {
    return template
  }

  if (templateType === 'String') {
    template = read(template) || template
    return (0, _lodash.default)(
      template,
      options || {
        imports: _,
      }
    )
  }

  return identity
}

function mime(ext) {
  return (0, _mimeTypes.lookup)(ext) || ''
}

var _default = _
exports.default = _default
module.exports = exports.default
