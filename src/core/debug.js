import debug from 'debug'

import createEsmUtils from 'esm-utils'

const {readJsonSync} = createEsmUtils(import.meta)
const {name} = readJsonSync('../../package.json')

export default debug(name)
