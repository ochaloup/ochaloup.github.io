import puppeteer from 'puppeteer'
const PORT = process.argv[2], OUT = process.argv[3]
const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1600, height: 900 })
const errors = []
page.on('pageerror', e => errors.push(`pageerror: ${e.message}`))
page.on('response', r => { if (r.status() >= 400 && !r.url().includes('favicon')) errors.push(`${r.status()} ${r.url()}`) })
await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' })
const total = await page.evaluate(() => Reveal.getTotalSlides())
const bad = []
for (let n = 0; n < total; n++) {
  await page.evaluate(i => Reveal.slide(i), n)
  await new Promise(r => setTimeout(r, 1100))
  if (await page.evaluate(() => { const s = Reveal.getCurrentSlide(); return s.scrollHeight > s.clientHeight })) bad.push(n)
  if (n === 8 || n === 15 || n === 17) {
    const anim = await page.evaluate(() => {
      const s = Reveal.getCurrentSlide()
      const flow = s.querySelector('.funnel .flow')
      const drain = s.querySelector('.funnel .drain')
      const gear = document.querySelector('.gears .gear')
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
      return { reduce, gear: gear ? getComputedStyle(gear).animationName : 'absent', flow: flow ? getComputedStyle(flow).animationName : 'absent', drain: drain ? getComputedStyle(drain).animationName : 'absent' }
    })
    console.log(JSON.stringify({ slide: n, anim }))
    await page.screenshot({ path: `${OUT}/slide-${n}.png` })
  }
}
console.log(JSON.stringify({ total, overflowing: bad, errors }))
await browser.close()
