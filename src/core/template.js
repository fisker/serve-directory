import {existsSync} from 'fs'
import _template from 'lodash.template'
import imports from './imports'
import identity from '../utils/identity'
import readFile from '../utils/read-file'
import isFunction from '../utils/is-function'
import isString from '../utils/is-string'

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
