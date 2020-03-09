function minifyCSS(content) {
  return content
    .replace(/\s/g, '')
    .replace(/;}/g, '}')
    .trim()
}

function minifyJST(content) {
  return content.replace(/\s/g, '').trim()
}

function unsafeTemplateMinify(template) {
  return template
    .replace(
      /(<style>)([\S\s]*?)(<\/style>)/gm,
      (_, openingTag, content, closingTag) =>
        openingTag + minifyCSS(content) + closingTag
    )

    .replace(
      /(<%[=-]?)([\S\s]*?)(>)/gm,
      (_, openingTag, content, closingTag) =>
        openingTag + minifyJST(content) + closingTag
    )
    .replace(/\s+/, ' ')
    .replace(/>\s*</g, '><')
}

export default unsafeTemplateMinify
