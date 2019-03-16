import path from 'path'
import fs from 'fs'
import * as utils from '../utils/index'
import {CHARSET} from '../constants'
import {name, version} from '../../package.json'

const pkg = {
  name,
  version,
}

function deprecated(method, msg) {
  return function(...args) {
    // eslint-disable-next-line no-console
    console.log(msg)
    return method.apply(this, args)
  }
}

const deprecatedImports = {
  notHidden: deprecated(
    utils.notHiddenFile,
    '`notHidden` is deprecated, use `notHiddenFile` instead'
  ),
  trim: deprecated(function(x) {
    return String(x).trim()
  }, '`trim` is deprecated, use `String#trim` instead'),
  read: deprecated(function(x) {
    return String(x).trim()
  }, '`read` is deprecated, use `readFile` instead'),
  parseUrl: deprecated(function() {
    throw new Error('`parseUrl` is deprecated')
  }, '`parseUrl` is deprecated'),
}

export default Object.freeze({
  CHARSET,
  pkg,
  path,
  fs,
  require,
  ...utils,
  ...deprecatedImports,
})
