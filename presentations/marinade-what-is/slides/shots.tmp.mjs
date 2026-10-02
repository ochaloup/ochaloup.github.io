import puppeteer from 'puppeteer'
const out = process.argv[2]
const only = process.argv[3] ? process.argv[3].split(',').map(Number) : null
const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
const page = await browser.newPage()
const problems = []
page.on('pageerror', e => problems.push(`pageerror: ${e.message}`))
page.on('response', r => { if (r.status() >= 400 && !r.url().includes('favicon')) problems.push(`${r.status()} ${r.url()}`) })
await page.setViewport({ width: 1600, height: 900 })
await page.goto('http://localhost:8000/', { waitUntil: 'networkidle0' })
await page.evaluateHandle('document.fonts.ready')
await new Promise(r => setTimeout(r, 1500))
const total = await page.evaluate(() => Reveal.getTotalSlides())
for (let i = 0; i < total; i++) {
  if (only && !only.includes(i)) continue
  await page.evaluate(n => Reveal.slide(n), i)
  await new Promise(r => setTimeout(r, 3000))
  const m = await page.evaluate(() => {
    const s = Reveal.getCurrentSlide()
    const body = s.querySelector('.slide-body')
    const foot = s.querySelector('.slide-foot')
    const kids = body ? [...body.children].filter(e => !e.matches('.slide-foot')) : []
    const bottom = Math.max(0, ...kids.map(e => e.getBoundingClientRect().bottom))
    return { title: s.querySelector('h1,h2')?.textContent.slice(0, 40), foot: foot ? Math.round(foot.getBoundingClientRect().top) : null, bottom: Math.round(bottom) }
  })
  console.log(i, JSON.stringify(m))
  await page.screenshot({ path: `${out}/slide-${String(i).padStart(2, '0')}.png` })
}
console.log('total', total, 'problems', problems.join('; '))
await browser.close()
