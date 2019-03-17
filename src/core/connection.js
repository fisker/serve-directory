import {join, extname, sep} from 'path'
import {readdirSync, statSync} from 'fs'
import httpError from 'http-errors'
import accepts from 'accepts'
import {original as parseUrl} from 'parseurl'
import debug from './debug'
import mime from '../utils/mime'
import sortFile from '../utils/sort-file'
import notHiddenFile from '../utils/not-hidden-file'
import isHiddenPath from '../utils/is-hidden-path'

class Connection {
  constructor(sd, req, res, next) {
    this.sd = sd
    this.req = req
    this.res = res
    this.next = next
    this.url = parseUrl(this.req)
  }

  getMethod() {
    const {method} = this.req
    if (method !== 'GET' && method !== 'HEAD') {
      this.res.statusCode = method === 'OPTIONS' ? 200 : 405
      this.res.setHeader('Allow', 'GET, HEAD, OPTIONS')
      this.res.setHeader('Content-Length', '0')
      this.res.end()
      return null
    }

    this.method = method

    return method
  }

  getPathname() {
    let {pathname} = this.url
    const {hidden} = this.sd.options

    pathname = decodeURIComponent(pathname)

    if (!hidden && isHiddenPath(pathname)) {
      debug('hidden folder "%s" deny.', pathname)
      this.next(httpError(403))
      return null
    }

    // null byte(s), bad request
    if (pathname.includes('\0')) {
      debug('null byte(s) in "%s", bad request.', pathname)
      this.next(httpError(400))
      return null
    }

    pathname = pathname.replace(/\/+/g, '/')

    this.pathname = pathname

    return pathname
  }

  getResponseType() {
    const acceptMediaTypes = Object.keys(this.sd.responser)
    const responseType = accepts(this.req).type(acceptMediaTypes)

    if (!responseType) {
      debug('mime not acceptable "%s".', responseType)
      this.next(httpError(406))
      return null
    }

    this.responseType = responseType

    return responseType
  }

  getResponser() {
    const responser = this.sd.responser[this.responseType]
    return (this.responser = responser)
  }

  getPath() {
    // join / normalize from root dir
    const path = join(this.sd.root, this.pathname)

    // malicious path
    if (!path.startsWith(this.sd.root + sep)) {
      debug('malicious path "%s".', this.pathname)
      this.next(httpError(403))
      return null
    }

    this.path = path

    return path
  }

  getDirectory() {
    debug('get directory "%s".', this.path)

    let stats
    try {
      stats = statSync(this.path)
    } catch (err) {
      if (err.code === 'ENOENT' || err.code === 'ENOTDIR') {
        this.next()
        return null
      }

      err.status = err.code === 'ENAMETOOLONG' ? 414 : 500
      this.next(err)
      return null
    }

    if (!stats.isDirectory()) {
      this.next()
      return null
    }

    if (this.pathname.slice(-1) !== '/') {
      debug('add "/" to "%s".', this.pathname)
      this.res.writeHead(301, {
        Location: `${this.url.pathname}/`,
      })
      this.res.end()
      return null
    }

    stats.path = this.path
    stats.pathname = this.pathname
    stats.url = this.sd.options.relative ? '.' : this.url.pathname

    this.directory = stats
    return stats
  }

  getFiles() {
    debug('get files "%s"', this.path)

    const {path} = this
    const urlPrefix = this.sd.options.relative ? '' : this.url.pathname
    let files

    try {
      files = readdirSync(path)
        .map(function(file) {
          const stats = statSync(join(path, file))
          stats.name = file
          stats.ext = extname(file)
          stats.type = mime(stats.ext)
          stats.url =
            urlPrefix +
            encodeURIComponent(file) +
            (stats.isDirectory() ? '/' : '')
          return stats
        })
        .sort(sortFile)
    } catch (err) {
      this.next(err)
      return null
    }

    if (!this.sd.options.hidden) {
      files = files.filter(notHiddenFile)
    }

    this.files = files
    return files
  }

  response() {
    if (
      !this.getMethod() ||
      !this.getPathname() ||
      !this.getResponseType() ||
      !this.getResponser() ||
      !this.getPath() ||
      !this.getDirectory() ||
      !this.getFiles()
    ) {
      return
    }

    try {
      this.responser(this.req, this.res, {
        path: this.path,
        pathname: this.pathname,
        url: this.url,
        method: this.method,
        responseType: this.responseType,
        directory: this.directory,
        files: this.files,
        fileNames: this.files.map(({name}) => name),
      })
    } catch (err) {
      err.status = 500
      this.next(err)
    }
  }
}

export default Connection
