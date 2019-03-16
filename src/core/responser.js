import {CHARSET} from '../constants'

function responser(mime, render) {
  return (req, res, data) => {
    const body = render(data)

    // security header for content sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff')

    // standard headers
    res.setHeader('Content-Type', `${mime}; charset=${CHARSET}`)
    res.setHeader('Content-Length', Buffer.byteLength(body, CHARSET))

    // body
    res.end(body, CHARSET)
  }
}

export default responser
