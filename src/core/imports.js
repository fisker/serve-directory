import * as utils from '../utils'
import {CHARSET} from '../constants'
import {name, version} from '../../package.json'

const packageJson = {
  name,
  version,
}

export default Object.freeze({
  CHARSET,
  pkg: packageJson,
  // `@rollup/plugin-commonjs@11.1.0` can't export the `require`
  require: global.require,
  ...utils,
})
