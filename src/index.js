import ServeDirectory from './serve-directory'

export default function serveDirectory(root, options) {
  const sd = new ServeDirectory(root, options)
  return sd.middleware.bind(sd)
}
