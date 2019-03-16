const babel = require('@babel/core')
const prettier = require('prettier')
const fs = require('fs')
const path = require('path')
const SOURCE_DIR = path.join(__dirname, '..', 'src')
const DIST_DIR = path.join(__dirname, '..', 'lib')
const MINIFY_JS = false
const CHARSET = 'utf-8'
const banner = fs.readFileSync(path.join(SOURCE_DIR, 'banner.txt'), CHARSET)
const babelConfig = require('../babel.config.js')

if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR)
}

buildJS()
buildTemplate()

function buildTemplate() {
  let content = fs.readFileSync(path.join(SOURCE_DIR, 'directory.ejs'), CHARSET)
  content = content.replace(/>\s*</g, '><')
  fs.writeFileSync(path.join(DIST_DIR, 'directory.ejs'), content)
}

function buildJS() {
  const files = [
    'index.js',
    'default-options.js',
    'serve-directory.js',
    'connection.js',
    'utils.js',
  ]

  files.forEach(function(file) {
    let code = fs.readFileSync(path.join(SOURCE_DIR, file), CHARSET)
    const distFile = path.join(DIST_DIR, file)
    code = babel.transform(code, babelConfig).code
    if (MINIFY_JS) {
      code = babel.transform(code, {
        presets: [['minify']],
      }).code
    } else {
      const prettierConfig = prettier.resolveConfig.sync(distFile, {
        editorconfig: true,
      })
      code = prettier.format(code, prettierConfig)
    }
    fs.writeFileSync(distFile, banner + code)
  })
}
