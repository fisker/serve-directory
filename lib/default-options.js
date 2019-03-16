/*
 * serve-index
 * Copyright(c) 2011 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 *
 * serve-directory
 * Copyright(c) 2017- fisker Cheung
 * MIT Licensed
 */
'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0

var _utils = _interopRequireDefault(require('./utils'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj}
}

var _default = {
  hidden: false,
  relative: true,
  process: [
    {
      accept: 'text/html',
      render: _utils.default.path.join(__dirname, 'directory.ejs'),
    },
    {
      accept: 'text/plain',
      render: function render(data) {
        return ''.concat(
          data.files
            .map(function(file) {
              return file.name
            })
            .join('\n'),
          '\n'
        )
      },
    },
    {
      accept: 'application/json',
      render: function render(data) {
        return JSON.stringify(
          data.files.map(function(file) {
            return file.name
          })
        )
      },
    },
  ],
}
exports.default = _default
module.exports = exports.default
