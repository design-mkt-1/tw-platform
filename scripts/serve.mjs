/*
 * Serve a static export for review.mjs and a11y.mjs.
 *
 *   node scripts/serve.mjs <outDir> [port=4173] [basePath=/tw-platform]
 *
 * Why this exists: the Pages build sets `basePath: '/tw-platform'`, so every URL in the export
 * starts with that prefix while the files sit at the root of `out/`. And `python -m http.server`
 * is single-threaded — review.mjs drives it with enough parallel requests that it answers
 * ERR_EMPTY_RESPONSE and the run reads as an app failure (CLAUDE.md, "Build and the dev server").
 * Node's http server has no such limit.
 *
 * The export sets `trailingSlash: true`, so `/sport/` is `out/sport/index.html`.
 * It lived in the gitignored `.review-tmp/` until 2026-09-10 and did not travel to the next PC.
 */
import { createReadStream, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'

const [, , outDir, portRaw = '4173', basePath = '/tw-platform'] = process.argv
if (!outDir) {
  console.error('usage: node scripts/serve.mjs <outDir> [port] [basePath]')
  process.exit(1)
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
}

createServer((req, res) => {
  let path = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  if (path === basePath || path.startsWith(`${basePath}/`)) path = path.slice(basePath.length)
  if (path === '' || path.endsWith('/')) path += 'index.html'
  let file = join(outDir, normalize(path))
  let size
  try {
    let stat = statSync(file)
    // `/sport` without the slash is a directory; streaming it throws EISDIR and took the whole
    // server down on the first run. Pages would redirect to `/sport/`; serving the index directly
    // is the same page, since every asset URL in the export is absolute.
    if (stat.isDirectory()) {
      file = join(file, 'index.html')
      stat = statSync(file)
    }
    size = stat.size
  } catch {
    res.writeHead(404).end('not found')
    return
  }
  res.writeHead(200, {
    'content-type': MIME[extname(file)] ?? 'application/octet-stream',
    'content-length': size,
  })
  createReadStream(file).pipe(res)
}).listen(Number(portRaw), '127.0.0.1', () => {
  console.log(`serving ${outDir} at http://127.0.0.1:${portRaw}${basePath}/`)
})
