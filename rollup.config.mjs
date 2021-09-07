import path from 'node:path'
import rollupPluginNodeResolve from '@rollup/plugin-node-resolve'
import rollupPluginReplace from '@rollup/plugin-replace'
import rollupPluginBabel from 'rollup-plugin-babel'
import rollupPluginPrettier from 'rollup-plugin-prettier'
import createEsmUtils from 'esm-utils'
import readFile from './src/utils/read-file.js'
import writeFile from './src/utils/write-file.js'
import unsafeTemplateMinify from './scripts/template-minify.js'
import {DEFAULT_HTML_TEMPLATE_FILE} from './src/constants.js'

const {json, __dirname} = createEsmUtils(import.meta)
const {dependencies} = json.loadSync('./package.json')

const TEMPLATE_FILE_NAME = path.basename(DEFAULT_HTML_TEMPLATE_FILE)
const TEMPLATE_FILE_SOURCE = path.join(__dirname, 'src', TEMPLATE_FILE_NAME)
const TEMPLATE_FILE_DEST = path.join(__dirname, 'dist', TEMPLATE_FILE_NAME)

writeFile(
  TEMPLATE_FILE_DEST,
  unsafeTemplateMinify(readFile(TEMPLATE_FILE_SOURCE)),
)

const external = [...Object.keys(dependencies), 'path', 'fs'].filter(
  (module) => module !== 'esm-utils',
)
const banner = readFile('./src/banner.txt')

export default {
  input: 'src/index.js',
  output: [
    {
      file: './dist/index.cjs',
      format: 'cjs',
      banner,
      exports: 'auto',
    },
    {
      file: './dist/index.js',
      format: 'esm',
      banner,
    },
  ],
  plugins: [
    rollupPluginBabel({
      exclude: 'node_modules/**',
    }),
    rollupPluginPrettier({parser: 'meriyah'}),
    rollupPluginNodeResolve(),
    rollupPluginReplace({
      'node:path': 'path',
      'node:module': 'module',
      'node:url': 'url',
      'node:fs': 'fs',
      '../../package.json': '../package.json',

      delimiters: ['', ''],
      preventAssignment: true,
    }),
  ],
  external,
}
