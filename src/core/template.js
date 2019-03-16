import {existsSync} from 'fs'
import loashTemplate from 'lodash.template'
import imports from './imports'
import type from '../utils/type'
import identity from '../utils/identity'
import readFile from '../utils/read-file'

function template(template, options) {
  const templateType = type(template)
  if (templateType === 'Function') {
    return template
  }
  if (templateType === 'String') {
    if (existsSync(template)) {
      template = readFile(template)
    }
    return loashTemplate(template, options || {imports})
  }

  return identity
}

export default template
