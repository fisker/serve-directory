const fs = require('fs')
const path = require('path')

let content = fs.readFileSync(path.join(__dirname, './directory.html'), 'utf-8')
content = content.replace(/>\s*</g, '><')
const dir = path.join(__dirname, '../public')
try {
  fs.mkdirSync(dir)
} catch (_) {}

fs.writeFileSync(
  path.join(__dirname, '../public/directory.html'),
  content,
  'utf-8'
)
