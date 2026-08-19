/*
 * Export the deck to PDF. Lives here rather than in ../tools because puppeteer is a
 * reveal.js devDependency, so a bare import only resolves from inside slides/.
 *
 *   npm start                                  # in another terminal
 *   node export-pdf.mjs                        # -> inside-marinades-staking-stack.pdf
 *   node export-pdf.mjs --notes                # notes on their own pages
 *   node export-pdf.mjs --port 8001 --out x.pdf
 *   node export-pdf.mjs --raw                  # skip the ghostscript recompression
 */
import puppeteer from 'puppeteer'
import { rename, rm, stat } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const run = promisify(execFile)

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const at = args.indexOf(`--${name}`)
  return at === -1 ? fallback : args[at + 1]
}
const port = flag('port', '8000')
// Defaults outside the repo: a 4MB binary in here would get committed by accident.
const out = flag('out', `${process.env.HOME}/Downloads/inside-marinades-staking-stack.pdf`)
const notes = args.includes('--notes')

// The page size has to match the deck's own canvas, or reveal's print layout
// scales slides down and leaves a white margin on every page.
const url = `http://localhost:${port}/?print-pdf${notes ? '&showNotes=separate-page' : ''}`

const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
const page = await browser.newPage()
const problems = []
page.on('pageerror', e => problems.push(`pageerror: ${e.message}`))
page.on('response', r => {
  if (r.status() >= 400 && !r.url().includes('favicon')) problems.push(`${r.status()} ${r.url()}`)
})

await page.goto(url, { waitUntil: 'networkidle0' })
// Fonts are self-hosted and block on first paint, so wait for them explicitly.
await page.evaluateHandle('document.fonts.ready')
await new Promise(r => setTimeout(r, 1500))

const pages = await page.evaluate(() => document.querySelectorAll('.pdf-page').length)
const raw = `${out}.raw.pdf`
await page.pdf({
  path: raw,
  width: '1920px',
  height: '1080px',
  printBackground: true,
  preferCSSPageSize: false,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
})
await browser.close()

/*
 * Chrome passes JPEG sources through but re-encodes PNG and webp losslessly, so a
 * single 1.8MB png landed in the file as a 2.5MB uncompressed bitmap and viewers
 * took seconds to open it. Ghostscript re-encodes those as JPEG at the same
 * resolution: measured 4.4MB down to 1.1MB with no visible difference.
 */
const mb = async (p) => ((await stat(p)).size / 1_048_576).toFixed(1)
let note = ''
if (args.includes('--raw')) {
  await rename(raw, out)
  note = ' (not recompressed)'
} else {
  try {
    await run('gs', [
      '-q', '-o', out, '-sDEVICE=pdfwrite',
      '-dPDFSETTINGS=/printer',
      '-dAutoFilterColorImages=false',
      '-dColorImageFilter=/DCTEncode',
      '-dJPEGQ=88',
      '-dCompatibilityLevel=1.5',
      raw,
    ])
    note = ` (recompressed from ${await mb(raw)} MB)`
    await rm(raw, { force: true })
  } catch {
    await rename(raw, out)
    note = ' (ghostscript missing, left as produced)'
  }
}

console.log(`${out}: ${pages} pages, ${await mb(out)} MB${notes ? ', with notes' : ''}${note}`)
if (problems.length) console.log('problems:', problems.join('; '))
