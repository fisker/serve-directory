import {join} from 'path'
import {writeFileSync, existsSync, mkdirSync} from 'fs'
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import {dependencies, module, main} from './package.json'
import readFile from './src/utils/read-file'

if (!existsSync('lib')) {
  mkdirSync('lib')
}

const DEFAULT_TEMPLATE_FILE = 'directory.ejs'
const content = readFile(
  join(__dirname, 'src', DEFAULT_TEMPLATE_FILE),
  'utf8'
).replace(/>\s*</g, '><')
writeFileSync(join(__dirname, 'lib', DEFAULT_TEMPLATE_FILE), content)

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
  // treeshake: false,
  external,
}
