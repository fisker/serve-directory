import {lookup} from 'mime-types'

function mime(ext) {
  return lookup(ext) || ''
}

export default mime
