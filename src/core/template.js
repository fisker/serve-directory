import {existsSync} from 'fs'
import _template from 'lodash.template'
import identity from '../utils/identity.js'
import readFile from '../utils/read-file.js'
import isFunction from '../utils/is-function.js'
import isString from '../utils/is-string.js'
import imports from './imports.js'

function template(template, options) {
  if (isFunction(template)) {
    return template
  }

  if (isString(template)) {
    if (existsSync(template)) {
      template = readFile(template)
    }
    return _template(template, options || {imports})
  }

  return identity
}

export default template
