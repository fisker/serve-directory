import {lookup} from 'mime-types'

function mime(extension) {
  return lookup(extension) || ''
}

export default mime
