import path from 'path'
import fs from 'fs'
import httpError from 'http-errors'
import accepts from 'accepts'
import {original as parseUrl} from 'parseurl'
import debug from './debug.js'
import mime from '../utils/mime.js'
import sortFile from '../utils/sort-file.js'
import notHiddenFile from '../utils/not-hidden-file.js'
import isHiddenPath from '../utils/is-hidden-path.js'

class Connection {
  constructor(sd, request, response, next) {
    this.sd = sd
    this.request = request
    this.response = response
    this.next = next
    this.url = parseUrl(this.request)
  }

  getMethod() {
    const {method} = this.request
    if (method !== 'GET' && method !== 'HEAD') {
      this.response.statusCode = method === 'OPTIONS' ? 200 : 405
      this.response.setHeader('Allow', 'GET, HEAD, OPTIONS')
      this.response.setHeader('Content-Length', '0')
      this.response.end()
      return
    }

    this.method = method

    return method
  }

  getPathname() {
    let {pathname} = this.url
    const {hidden} = this.sd.options

    try {
      pathname = decodeURIComponent(pathname)
    } catch {
      this.next(httpError(400))
      return
    }

    if (!hidden && isHiddenPath(pathname)) {
      debug('hidden folder "%s" deny.', pathname)
      this.next(httpError(403))
      return
    }

    // null byte(s), bad request
    if (pathname.includes('\0')) {
      debug('null byte(s) in "%s", bad request.', pathname)
      this.next(httpError(400))
      return
    }

    pathname = pathname.replace(/\/+/g, '/')

    this.pathname = pathname

    return pathname
  }

  getResponseType() {
    const acceptMediaTypes = Object.keys(this.sd.responser)
    const responseType = accepts(this.request).type(acceptMediaTypes)

    if (!responseType) {
      debug('mime not acceptable "%s".', responseType)
      this.next(httpError(406))
      return
    }

    this.responseType = responseType

    return responseType
  }

  getResponser() {
    const responser = this.sd.responser[this.responseType]
    this.responser = responser
    return responser
  }

  getPath() {
    // join / normalize from root dir
    const filePath = path.join(this.sd.root, this.pathname)

    // malicious path
    if (!filePath.startsWith(this.sd.root + path.sep)) {
      debug('malicious path "%s".', this.pathname)
      this.next(httpError(403))
      return
    }

    this.path = filePath

    return filePath
  }

  getDirectory() {
    debug('get directory "%s".', this.path)

    let stats
    try {
      stats = fs.statSync(this.path)
    } catch (error) {
      if (error.code === 'ENOENT' || error.code === 'ENOTDIR') {
        this.next()
        return
      }

      error.status = error.code === 'ENAMETOOLONG' ? 414 : 500
      this.next(error)
      return
    }

    if (!stats.isDirectory()) {
      this.next()
      return
    }

    if (this.pathname.slice(-1) !== '/') {
      debug('add "/" to "%s".', this.pathname)
      this.response.writeHead(301, {
        Location: `${this.url.pathname}/`,
      })
      this.response.end()
      return
    }

    stats.path = this.path
    stats.pathname = this.pathname
    stats.url = this.sd.options.relative ? '.' : this.url.pathname

    this.directory = stats
    return stats
  }

  getFiles() {
    debug('get files "%s"', this.path)

    const {path: directoryPath} = this
    const urlPrefix = this.sd.options.relative ? '' : this.url.pathname
    let files

    try {
      files = fs
        .readdirSync(directoryPath)
        .map((file) => {
          const stats = fs.statSync(path.join(directoryPath, file))
          stats.name = file
          stats.ext = path.extname(file)
          stats.type = mime(stats.ext)
          stats.url =
            urlPrefix +
            encodeURIComponent(file) +
            (stats.isDirectory() ? '/' : '')
          return stats
        })
        .sort(sortFile)
    } catch (error) {
      this.next(error)
      return
    }

    if (!this.sd.options.hidden) {
      files = files.filter((file) => notHiddenFile(file))
    }

    this.files = files
    return files
  }

  process() {
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
      this.responser(this.request, this.response, {
        path: this.path,
        pathname: this.pathname,
        url: this.url,
        method: this.method,
        responseType: this.responseType,
        directory: this.directory,
        files: this.files,
        fileNames: this.files.map(({name}) => name),
      })
    } catch (error) {
      error.status = 500
      this.next(error)
    }
  }
}

export default Connection
