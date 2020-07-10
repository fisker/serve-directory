import {join, basename} from 'path'
import babel from 'rollup-plugin-babel'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import {dependencies, module, main} from './package.json'
import readFile from './src/utils/read-file'
import writeFile from './src/utils/write-file'
import unsafeTemplateMinify from './scripts/template-minify'
import {DEFAULT_HTML_TEMPLATE_FILE} from './src/constants'

const TEMPLATE_FILE_NAME = basename(DEFAULT_HTML_TEMPLATE_FILE)
const TEMPLATE_FILE_SOURCE = join(__dirname, 'src', TEMPLATE_FILE_NAME)
const TEMPLATE_FILE_DEST = join(__dirname, 'dist', TEMPLATE_FILE_NAME)

writeFile(
  TEMPLATE_FILE_DEST,
  unsafeTemplateMinify(readFile(TEMPLATE_FILE_SOURCE))
)

const external = [...Object.keys(dependencies), 'path', 'fs']

const banner = readFile('./src/banner.txt')

export default {
  input: 'src/index.js',
  output: [
    {
      file: main,
      format: 'cjs',
      banner,
    },
    {
      file: module,
      format: 'esm',
      banner,
    },
  ],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
    commonjs(),
    json(),
  ],
  external,
}
