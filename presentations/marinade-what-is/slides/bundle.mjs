/*
 * Pack the deck into the smallest folder that runs by double clicking index.html.
 *
 *   npm start          # in another terminal
 *   node bundle.mjs
 *
 * Three things make it small and standalone. The markdown is pre-rendered, so the
 * markdown and highlight plugins are not shipped at all. Only assets the deck
 * actually references are copied. And the base theme's embedded base64 fonts are
 * stripped, because the Marinade theme replaces that typeface entirely.
 */
import puppeteer from 'puppeteer'
import { cp, mkdir, readFile, rm, writeFile, stat } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import path from 'node:path'

const run = promisify(execFile)
const args = process.argv.slice(2)
const flag = (n, d) => (args.indexOf(`--${n}`) === -1 ? d : args[args.indexOf(`--${n}`) + 1])
const port = flag('port', '8000')
const out = path.resolve(flag('out', `${process.env.HOME}/Downloads/marinade-deck`))

const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1920, height: 1080 })
await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle0' })
await page.evaluateHandle('document.fonts.ready')
await new Promise(r => setTimeout(r, 2000))

// Serialize the deck as reveal built it: rails, body wrappers and highlighting all
// baked in. Reveal's own per-slide state has to come off, or the copy opens with
// slides stuck hidden.
const { slides, title, count } = await page.evaluate(() => {
  for (const section of document.querySelectorAll('.slides section')) {
    section.removeAttribute('style')
    section.removeAttribute('aria-hidden')
    section.removeAttribute('hidden')
    section.classList.remove('present', 'past', 'future')
    for (const notes of section.querySelectorAll('aside.notes')) notes.remove()
  }
  return {
    slides: document.querySelector('.slides').innerHTML,
    title: document.title,
    count: Reveal.getTotalSlides(),
  }
})
await browser.close()

await rm(out, { recursive: true, force: true })
await mkdir(path.join(out, 'dist/theme'), { recursive: true })
await mkdir(path.join(out, 'images'), { recursive: true })

for (const file of ['dist/reveal.js', 'dist/reveal.css', 'dist/reset.css', 'theme/marinade.css']) {
  await mkdir(path.dirname(path.join(out, file)), { recursive: true })
  await cp(file, path.join(out, file))
}
await cp('fonts', path.join(out, 'fonts'), { recursive: true })

// The base theme carries its own typeface as base64. The Marinade overlay never
// uses it, so it is half a megabyte of dead weight.
const black = await readFile('dist/theme/black.css', 'utf8')
const slimmed = black.replace(/@font-face\s*{[^}]*url\(data:[^}]*}/g, '')
await writeFile(path.join(out, 'dist/theme/black.css'), slimmed)

// Only the images this deck refers to, and photographs re-encoded to webp.
let html = slides
const referenced = new Set()
for (const match of html.matchAll(/(?:src|data-background-image)="(images\/[^"]+)"/g)) {
  referenced.add(match[1])
}
for (const asset of referenced) {
  const target = path.join(out, asset)
  await mkdir(path.dirname(target), { recursive: true })
  const { size } = await stat(asset)
  const photo = /\.(png|jpe?g)$/i.test(asset) && size > 120_000
  if (photo) {
    const webp = asset.replace(/\.(png|jpe?g)$/i, '.webp')
    await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', asset, '-quality', '82', path.join(out, webp)])
    html = html.replaceAll(asset, webp)
  } else {
    await cp(asset, target)
  }
}

await writeFile(
  path.join(out, 'index.html'),
  `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>${title}</title>
		<link rel="stylesheet" href="dist/reset.css" />
		<link rel="stylesheet" href="dist/reveal.css" />
		<link rel="stylesheet" href="dist/theme/black.css" />
		<link rel="stylesheet" href="theme/marinade.css" />
	</head>
	<body>
		<div class="reveal">
			<div class="slides">${html}</div>
		</div>
		<script src="dist/reveal.js"></script>
		<script>
			Reveal.initialize({
				width: 1920,
				height: 1080,
				margin: 0,
				center: false,
				hash: true,
				slideNumber: false,
				transition: "fade",
			});

			// The art scrim rides the background element, which reveal recreates on
			// init, so the tag it needs cannot be baked into the markup above.
			Reveal.on("ready", () => {
				for (const section of document.querySelectorAll(".slides section.art")) {
					Reveal.getSlideBackground(section)?.classList.add("art-bg");
				}
			});
		</script>
	</body>
</html>
`,
)

const zip = `${out}.zip`
await rm(zip, { force: true })
await run('python3', [
  '-c',
  `import shutil,sys;shutil.make_archive(sys.argv[1],'zip',root_dir=sys.argv[2],base_dir=sys.argv[3])`,
  out,
  path.dirname(out),
  path.basename(out),
])
const unpacked = await run('du', ['-sh', out])
const zipped = await stat(zip)
console.log(`${count} slides`)
console.log(`${out}  ${unpacked.stdout.split('\t')[0]} unpacked`)
console.log(`${zip}  ${(zipped.size / 1_048_576).toFixed(1)} MB zipped`)
