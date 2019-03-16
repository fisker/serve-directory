/* eslint-disable import/no-extraneous-dependencies */

const finalhandler = require('finalhandler')
const http = require('http')
const serveStatic = require('serve-static')
const serveDirectory = require('./src')

const directory = serveDirectory('test/fixtures')
const staticServer = serveStatic('test/fixtures')

http
  .createServer(function onRequest(req, res) {
    const done = finalhandler(req, res)

    staticServer(req, res, function onNext(err) {
      return err ? done(err) : directory(req, res, done)
    })
  })
  .listen(3000)
