import puppeteer from 'puppeteer'

const PORT = process.argv[2]
const OUT = process.argv[3]
const SLIDES = [14]

const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1600, height: 900 })

const errors = []
page.on('pageerror', e => errors.push(`pageerror: ${e.message}`))
page.on('response', r => {
  if (r.status() >= 400 && !r.url().includes('favicon')) {
    errors.push(`${r.status()} ${r.url()}`)
  }
})

await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' })
await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important }' })

const total = await page.evaluate(() => Reveal.getTotalSlides())

for (const n of SLIDES) {
  await page.evaluate(i => Reveal.slide(i), n)
  await new Promise(r => setTimeout(r, 1400))
  const info = await page.evaluate(() => {
    const s = Reveal.getCurrentSlide()
    return {
      heading: (s.querySelector('h1, h2')?.textContent || '').trim(),
      overflow: s.scrollHeight > s.clientHeight,
      scrollHeight: s.scrollHeight,
      clientHeight: s.clientHeight,
      codeBlocks: s.querySelectorAll('pre').length,
    }
  })
  console.log(JSON.stringify({ slide: n, ...info }))
  await page.screenshot({ path: `${OUT}/slide-${n}.png` })
}

console.log(JSON.stringify({ total, errors }))
await browser.close()
