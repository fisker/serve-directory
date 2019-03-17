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
      /(<style>)([\s\S]*?)(<\/style>)/gm,
      (_, openingTag, content, closingTag) =>
        openingTag + minifyCSS(content) + closingTag
    )

    .replace(
      /(<%[-=]?)([\s\S]*?)(>)/gm,
      (_, openingTag, content, closingTag) =>
        openingTag + minifyJST(content) + closingTag
    )
    .replace(/\s+/, ' ')
    .replace(/>\s*</g, '><')
}

export default unsafeTemplateMinify
