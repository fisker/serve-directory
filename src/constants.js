import path from 'path'
import createEsmUtils from 'esm-utils'

const {__dirname} = createEsmUtils(import.meta)

export const CHARSET = 'utf-8'
export const EOL = '\n'
export const DEFAULT_HTML_TEMPLATE_FILE = path.join(__dirname, 'directory.jst')
