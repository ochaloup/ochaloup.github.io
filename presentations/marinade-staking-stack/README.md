# The Marinade Recipe: Building Staking Infrastructure on Solana

Working document for a public conference talk about the Marinade tech stack.
This file is the single source of truth: context, decisions, outline, ideas, and links all live here.
Slide content gets drafted here first, then moved into `slides/deck.md`.

## Event

| | |
|---|---|
| **Event** | Solana Summit Serbia 2026 |
| **When** | 26–27 August 2026 (talk slot TBD) |
| **Where** | Sava Centar, Belgrade, Serbia |
| **Host** | Superteam Balkan |
| **Scale** | 1,000+ attendees, 50+ speakers, 50+ companies |
| **Entry** | Free, Luma registration required |
| **Duration** | 20 minutes (cut from 25, confirmed 2026-08-18) |
| **Links** | [luma](https://luma.com/solana-summit-serbia) · [solanasummit.rs](https://solanasummit.rs/) · [Belgrade Blockchain Week](https://belgradeblockchainweek.com/) |

Audience is mixed: developers, founders, investors, banks, regulators, government.
Summit themes: DeFi, infrastructure, payments, stablecoins, RWA, AI, startups, venture.
Part of a wider week that includes a Rust Summit and a Demo Day.

**Audience implication:** Solana familiarity is not guaranteed. Lead with the "why",
keep deep code to two or three punchy examples.

## Submitted materials

Carried over from the original working doc. The title was marked _(locked in)_ there, which
probably means the abstract already went to the organizers. Confirm before renaming anything.

**Title as submitted:** The Marinade Recipe: Building Staking Infrastructure on Solana

**Short description as submitted:**

> Marinade is the home for staking on Solana. This talk goes behind the scenes of the tech that
> powers it: liquid staking (mSOL), native staking with its validator auction (SAM), Marinade
> Select, and Instant Unstake. A quick tour of how on-chain programs, backend services, data
> pipelines, and validator infrastructure fit together to turn raw SOL into optimized, protected
> staking rewards.

**Speaker bio as submitted:**

> Backend engineer and Solana tech enthusiast, contractor at Marinade Finance.

Note on the abstract: "Marinade is the home for staking on Solana" predates the current
Earn / Borrow platform positioning, and the brand guide says not to define Marinade as a
staking protocol. Not worth chasing if the abstract is already published, but the talk itself
should use the current framing.

## Product and terminology reference

From marinade.finance and the internal product portfolio. Use exact casing.

- **Marinade Liquid (mSOL)** — liquid token representing staked SOL, usable across DeFi.
  First non-custodial liquid staking token on Solana, launched 2021 out of the
  Solana x Serum DeFi hackathon.
- **Marinade Native** — non-custodial. The stake account stays in the user's wallet,
  Marinade only optimizes delegation.
- **Stake Auction Marketplace (SAM)** — validators bid competitively for delegated stake.
  Clears once per epoch.
- **Marinade Max Yield** — the retail default Native strategy, auto-delegation to SAM winners.
- **Marinade Select** — curated, identity-verified validator set. Institutional and ETF focus.
- **Marinade Recipes** — third Native strategy. Rewards are swapped and paid out in a different
  token via merkle drop. The public page lists USDG, ZBTC, MNDE, BONK, FWOG, NOBODY, TRENCHER
  and USDC.
- **Protected Staking Rewards (PSR)** — the validator's bond absorbs the loss if they
  underperform or raise fees.
- **Validator Bonds** — the on-chain escrow backing SAM bids and PSR coverage.
- **Instant Unstake** — RFQ auction against liquidity providers. Exit without converting
  to a liquid token.
- **USDC Vault** — USDC yield routed through Kamino. Earn pillar, not staking.
- **Marinade Borrow** — stablecoin loans against staked SOL. Early access, not live.

## Repo layout

```
marinade-staking-stack/
  README.md          <- this file: context, ideas, links, slide drafts
  slides/            <- reveal.js 6.0.1, shallow clone, .git removed
    deck.md          <- the actual slide content, markdown
    index.html       <- reveal bootstrap, loads deck.md
    theme/
      marinade.css        <- Marinade brand overlay on the black theme
    fonts/                <- self-hosted DM Sans and PT Serif woff2, no network needed
    images/
      marinade-white.svg  <- white hat, use this one on dark slides
      marinade.svg        <- dark hat, invisible on the dark background
      solana-logo.svg
      brand-backgrounds/  <- teal-gradient, deep-teal-solid, light-teal-solid
  PUNCHLINES.md      <- lines to say out loud, or keep ready for Q&A. Not slide copy.
  research/          <- my summaries of code and product research, one file per topic
  resources/         <- original sources: downloaded articles, screenshots, exports
```

`research/` holds the write-ups. `resources/` holds the untouched originals they are based on,
so every claim can be traced back and re-read without me in the loop.

### Running the slides

reveal.js 6 moved to Vite. The 5.x instructions from the auction deck no longer apply.

```sh
cd slides
npm install
npm start
```

Open http://localhost:8000. reveal.js pins Vite to port 8000 in `vite.config.ts`, so the URL
is the same as with 5.x. Override with `npm start --port=8001`.

`deck.md` is loaded over HTTP, so opening `index.html` from the filesystem will not work.

PDF export: append `?print-pdf` to the URL, then print to PDF.

Notable 6.x differences from 5.2.1:
- Plugins live under `dist/plugin/`, not `plugin/`.
- `dist/` ships prebuilt, so no build step is needed for a plain deck.
- Markdown separators are configured on the `<section data-markdown>` element in `index.html`.
  Current setup: `---` horizontal, `--` vertical, `Note:` speaker notes.

Markdown reference: https://revealjs.com/markdown/

## Design system

### Where the brand rules come from

`marinade-finance/internal-docs` carries two skills that are the actual source of truth:

- `.claude/skills/marinade-brand/SKILL.md` — palette, typography, voice, tone
- `.claude/skills/marinade-slide-design/SKILL.md` — 16 slide archetypes, type scale, grid, assets

Those skills target Marp. We are on reveal.js, so the archetypes are guidance, not a template.
The palette, typography, and voice rules carry over unchanged.

### Decisions taken

- **Keep the dark deck.** The old auction deck is dark and it reads well in a big room.
- **Swap the ad-hoc colors for brand tokens.** The dark background is now `dark-primary`
  `#151A1A`, which is an actual palette color, not a generic `#191919`. Links and accents are
  `light-teal` `#94C9C8` (9.6:1 on dark, passes WCAG AA). Markers and rules are
  `brand-teal` `#308D8A`.
- **DM Sans replaces Source Sans Pro.** DM Sans 400/600 is the brand marketing typeface.
  PT Serif italic is available as an accent, one word in the whole deck, maximum.
- **Headings are sentence case.** The reveal black theme uppercases all headings.
  The brand rule is sentence case, so `--r-heading-text-transform` is overridden to `none`.
- **Numbers use `tabular-nums`.** Brand rule, applied globally.
- **Canvas is 1920x1080.** Set in `Reveal.initialize`. This is the cookbook's canonical slide
  size, and it makes the point-based type scale meaningful instead of arbitrary.
- **The type scale is the cookbook's, converted at 96 DPI.** The guide specifies points on a
  20 inch slide, so 1pt renders as 1.333px. Body 30pt becomes 40px, H1 72pt becomes 96px.
  The `--mn-*` variables in the theme carry the conversion, with the point value in a comment.
- **Margins follow the 12-column grid.** 80px left and right, 82px top and bottom, which is the
  guide's 0.83in and 0.85in on a 20 x 11.25in slide.
- **Slides anchor to the top, not the middle.** `center: false`, because the archetypes put the
  title upper-left and a fixed title baseline stops headings jumping between slides. Sparse
  slides opt back into vertical centering with `class="vcenter"`.
- **The deck has a visual motif: the journey rail.** A five-stage rail, Stake, Auction, Bond,
  Settle, Exit, sits at the bottom of every content slide with the current stage lit. A slide
  opts in with `data-stage="auction"`, or `data-stage="all"` for the infrastructure section,
  which lights the whole rail. The stage list lives in `index.html`, not the theme. This does
  three jobs at once: it fills the dead bottom third that top-anchored slides used to leave,
  it gives the deck a signature that is not just "dark reveal.js", and it keeps the
  follow-one-SOL structure visible to the audience the whole way through.
- **Backgrounds are a gradient, not a flat fill.** `.reveal-viewport` carries two radial
  gradients interpolated between `dark-primary` and `deep-teal`. Flat `#151A1A` over 20 slides
  read as monotone.
- **Content is optically centred.** `index.html` wraps everything below the heading in
  `.slide-body` at ready time, so the heading baseline still does not move between slides but
  the content no longer clings to the top with a void underneath.
- **The slide counter is gone.** `slideNumber: false`. The progress bar already carries
  position, and a counter on a conference slide invites the audience to count what is left.
- **Canvas margin is zero.** `margin: 0.04` drew a visible band around every full-bleed
  background. The theme's own 80px grid margin is the breathing room.
- **The art scrim lives on the background, not the section.** Put on the section it was a
  `background-image`, so reveal's exit fade dropped the scrim's opacity along with the text and
  flashed the raw, undimmed painting for a moment before the background cross-faded.
  `index.html` now tags each art slide's background with `.art-bg` via
  `Reveal.getSlideBackground()`, and the gradients render on `.slide-background-content::after`,
  so the scrim fades in lockstep with the image it dims.
- **Every external link opens in a new tab.** `index.html` sets `target="_blank"` plus
  `rel="noopener noreferrer"` on every `a[href^="http"]` at ready time, rather than putting the
  attribute on each anchor in `deck.md`. Doing it in one place means links added later are
  covered automatically, reveal's own `#/` navigation is untouched, and the `rel` that should
  always accompany `_blank` cannot be forgotten. The point is that clicking a link during the
  talk must never navigate the deck away from the slide you are standing on.
- **Sparse slides carry a hat-only brand mark, `.brand-mark`.** 216px since 2026-08-18, bottom-left,
  60% opacity,
  no wordmark. The cover already showed the full lockup, so later slides only need the mark, and
  dropping the text means the slide gains presence while losing an element rather than adding
  one. Two alternatives were considered and rejected: the hat inside the terminal frame (clever,
  but merges two ideas into one muddled object) and a large watermark top-right (most brand
  presence, but a third element competing with the heading and the glyph).
- **The agenda is a flat list.** A staircase indent was tried and rejected on sight: all three
  products now sit at one indentation, each with its shout-out inset below it.
- **Light slides are one attribute away.** The theme drives colors through semantic tokens
  (`--mn-surface`, `--mn-fg`, `--mn-accent`), so a slide flips to the guide's white-dominant
  look with `class="light"` plus `data-background-color="#FFFFFF"`. This matters because the
  dark-versus-light question below stays open, and switching should not mean a rewrite.

### Known deviations from the brand guide (deliberate, worth a sanity check)

1. **Dark is the default background here.** The slide-design skill says white is the dominant
   slide background and dark should be reserved for cover and section breaks. A fully dark deck
   is a deviation. Every color used is still from the palette. The `light` class exists so this
   can be reversed cheaply if you want to go guide-faithful.
2. **Not matching the 16 archetypes exactly.** reveal.js is a different medium. Layouts stay
   close in spirit: one message per slide, low density, generous white space.

### Archetypes implemented in `theme/marinade.css`

Each maps to a numbered archetype in the slide-design skill.

| Class | Archetype | Notes |
|---|---|---|
| `cover` | 1, title / cover | Background image, hat watermark at 12% opacity, logo row |
| `statement` | 4, statement / quote | Centered, pairs with `label` and `vcenter` |
| `grid-3` | 2 and 10, point grids | Equal-height cards |
| `columns`, `columns-3` | 3, multi-column feature | Plain CSS grid |
| `steps` | 8, four-step process | Numbered circles on a connector line |
| `timeline` | 11, timeline / roadmap | Alternating brand-teal and light-teal dots |
| `flow` | 15, flow diagram | Nodes with CSS arrows between them |
| `bar-chart` | 9, bar chart | Light-teal fills, chart-teal labels, no gridlines |
| table + `mn-col` | 16, comparison table | Teal tint on the Marinade column |
| `metrics`, `metric`, `metric-label` | 6, three-metric | Teal numbers, muted labels |

Added since: `stamp` (coral starburst carrying a section name, Native only), `qr` (white ground so a
code actually scans), `code-sm` (three stacked code blocks instead of two, left aligned, last block a
size up), `funnel` (the many-to-one exit diagram on N4), `side-art` (a picture pinned beside the
content, N2), `cycle-edge.wait` (the two epoch labels on the state ring, set bold because the waiting
is the cost the slide is about).

**Turning a borrowed photo into a deck asset.** `side-art` expects an image already processed into the
palette, because a raw photo next to teal reads as a foreign object and a hard rectangle. The recipe
used for the coin, reproducible with PIL: square crop centred on the subject, greyscale,
`autocontrast(cutoff=1)`, `colorize(black=#0E1414, white=#BEE0DF)` so shadows land on the slide ground
and highlights on light teal, then a feathered elliptical alpha mask (`GaussianBlur`, radius about 7%
of the width) so the edge dissolves instead of ending. Rendered at 80% opacity. Flat greyscale was the
first instinct and is worse: it reads as a dead grey patch rather than a chosen image.

Inline helpers: `label`, `tag`, `accent` (PT Serif italic), `note`, `highlight`, `step-num`,
`watermark`, `logo-row`, `lockup`, `icon`, `yes`, `no`, `text-sm`, `text-xs`.
Slide modifiers: `light`, `art`, `vcenter`, `center-text`, `compact`, `dense`, `anchor-top`,
`code-sm`.
Injected at runtime: `journey`, `slide-body`.

### Two reveal.js quirks the theme has to work around

Both cost time to find, so they are written down rather than rediscovered.

1. **reveal sets `display` as an inline style via JS.** No stylesheet rule can beat that, so
   `.vcenter` needs `display: flex !important`. Verified this does not leak hidden slides:
   reveal hides past and future slides with `opacity: 0`, so forcing display stays safe.
2. **Sections default to `box-sizing: content-box`.** Slide padding is added on top of the
   1080px canvas height, which pushes content off the bottom and puts absolutely positioned
   elements like the watermark outside the visible area. The theme sets `border-box`.
3. **A centred `.slide-body` grows into the footnote band, and nothing warns you.** `.slide-foot`
   is pinned 200px up on any slide carrying the rail, but the body is centred in the whole area
   below the heading, so a tall stack simply overlaps it. Measured on N2: the last code block ended
   3px *below* the footnote's top. The body has to reserve that height itself, which is why
   `section.code-sm > .slide-body` carries `padding-bottom: 150px`. 56px was tried first and was not
   enough. Measure the gap, do not eyeball it: in puppeteer, compare
   `foot.getBoundingClientRect().top` with the last `pre`'s `bottom`.
4. **Two code blocks per slide is the ceiling at full size, and going over it fails silently.** N2
   runs three, but only because `code-sm` drops them to 21px and 26px and the body reserves the
   footnote band as above. At 28px the third block breaks the slide. Mechanism: `.reveal pre`
   carries `overflow: hidden`, which makes its automatic minimum size zero inside the flex
   `.slide-body`. A third block does not overflow the section, it makes every block *shrink* and
   clip its own closing brace, and `scrollHeight > clientHeight` stays false so the overflow check
   passes. Measured budget: about 700px of body height, and at 28px with `line-height: 1.45` a
   block costs 40.6px per line plus 48px padding, plus a 32px gap between blocks. Prefer cutting
   lines over shrinking type. 28px is the floor for code the room is meant to *read*; 21px is
   acceptable only on an anatomy slide, where the small blocks are scanned for shape and the block
   that matters is set larger. Found on the "Solana splits the keys" slide, 2026-08-18.
   **Always look at the screenshot, and measure the gaps.**

### Verified

Rendered headless at 1600x900 and screenshotted. All 20 slides build, cards sit at equal
height, and the only network 404 is `favicon.ico`.

Then re-run with every non-localhost request aborted, simulating dead conference wifi:
zero external requests, only the local woff2 files fetched, DM Sans 400 / 600 / italic all
loaded, and the cover pixel-identical to the online run.

### Fonts are self-hosted

The deck needs no network. `slides/fonts/` holds six woff2 files, about 196 kB total,
declared as `@font-face` at the top of `theme/marinade.css`.

| File | Covers |
|---|---|
| `dm-sans-latin.woff2` | DM Sans 400 and 600, latin |
| `dm-sans-latin-ext.woff2` | DM Sans 400 and 600, latin-ext (Czech and Serbian Latin diacritics) |
| `dm-sans-italic-latin.woff2` | DM Sans italic 400, latin |
| `dm-sans-italic-latin-ext.woff2` | DM Sans italic 400, latin-ext |
| `pt-serif-italic-latin.woff2` | PT Serif italic 400, latin |
| `pt-serif-italic-latin-ext.woff2` | PT Serif italic 400, latin-ext |

Notes:

- DM Sans is a **variable** font, so 400 and 600 share one file per subset. Verified the weight
  axis actually works rather than the browser faking bold: at 96px the same string measures
  918.7px at weight 400 and 974.5px at weight 600.
- `unicode-range` is preserved from the Google Fonts response, so latin-ext only downloads when
  a diacritic appears. Verified `Ondřej Đorđević žluťoučký Čačak` renders correctly in DM Sans.
- `font-display: block` rather than `swap`. On a projector a brief blank beats a visible
  font swap mid-sentence.
- **DM Sans has no Cyrillic subset.** Google does not publish one. Any Cyrillic on a slide,
  say a Belgrade greeting, falls back to a system font. Set that text in PT Serif or use an
  image if it needs to look right.

To refresh the files, request the css2 URL with a browser User-Agent and pull the woff2 links
out of the response:

```sh
curl -A "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140.0.0.0" \
  "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,600;1,9..40,400&family=PT+Serif:ital@1&display=swap"
```

### Brand artwork

`marinade.finance` runs short looping videos as section heroes. Their poster frames are
painterly illustrations, 720x720, and four of them are now in `slides/images/brand-art/`:

| File | Subject | Used on |
|---|---|---|
| `p-liquidity.jpg` | Grand kitchen, copper pots, a mountain of gold coins | Cover |
| `p-rewards.jpg` | Chef writing at a table covered in coins | "Where does the stake go?" |
| `p-security.jpg` | Vault door in a seawall, gold spilling into the water | "What if the validator misbehaves?" |
| `p-manage.jpg` | Chef at a desk in a huge pantry | Infrastructure section, closing slide |

The treatment is copied from the site's own OpenGraph card: painting full-bleed, a teal scrim
over it, white DM Sans heading, one PT Serif italic word. Add `class="art"` plus
`data-background-image` and the theme does the rest.

**Worth knowing: the metaphor ban is on words, not pictures.** `marinade-brand` retires
"recipes", "kitchen", "chefs", "cooking up". The live marketing site's hero art is literally
chefs in kitchens. So the deck can carry the warmth of the metaphor visually while the copy
stays in the fintech-clarity register. This does not reopen the title question, the product
collision with Marinade Recipes is a separate problem.

Two caveats. The source art is 720x720, so a 16:9 full-bleed crop upscales about 1.5x. It
holds up because the images are painterly and sit under a heavy scrim, but do not use them
as a sharp foreground image. And the videos exist too, `-transcode.mp4`, about 1.7 MB and
5 seconds each, if a moving section break is ever wanted.

### Open styling TODOs

- [x] Marinade wordmark. No vector lockup ships on the CDN or in `internal-docs`, so the
      `lockup` class rebuilds it the way the OpenGraph card does: `marinade-white.svg` plus
      the word set in DM Sans 600. Vector-crisp at any size, no asset to source.
- [x] QR code on the closing slide. Generated offline with `qrencode` into
      `slides/images/qr-marinade.svg`, pointing at https://marinade.finance. Version 2 code, 29
      modules including a 2-module quiet zone, dark `#151A1A` on white, rendered at 300px. Kept low
      density on purpose so it scans from the back of a room. **Not machine-verified**: no decoder
      is installed on this machine, but **Ondra scanned it on 2026-08-18 and it resolves correctly**.
      Regenerate with
      `qrencode -t SVG -o slides/images/qr-marinade.svg -m 2 -s 8 --foreground=151A1A --background=FFFFFF "https://marinade.finance"`
- [ ] Decide on a Solana Summit / Superteam Balkan logo on the cover slide.
- [ ] "Getting out" and "What I would take away" section breaks have no artwork. Either find
      two more paintings or leave them on the plain teal glow for rhythm.

## Naming: "Recipe" is a problem

**Status: decided 2026-08-15. The deck is retitled. "The Marinade Recipe" is gone from the
slides.**

The cover now reads:

> # Inside Marinade's staking stack
> ### Building staking infrastructure on Solana

The programme still carries the submitted line, *The Marinade Recipe: Building Staking
Infrastructure on Solana*, and that is fine. The subtitle is deliberately unchanged, so anyone
matching the slide against the programme still recognises it.

The document `<title>` in `index.html` is
*Inside Marinade's staking stack: liquid, native, and getting out early*. That line was rejected
for the cover but is useful for the browser tab and the PDF export name.

## The objection that still holds

**`Recipes` is a real, live Marinade product.** It is the third Native Staking strategy next to
Max Yield and Select. Rewards are swapped and paid out in a different token via a merkle drop.
Anyone in the room who knows Marinade reads "The Marinade Recipe" and expects a talk about *that*
product, so the first minute is spent correcting an expectation the program created.

## The objection that turned out weaker than it looked

The original note claimed the food metaphor was retired brand vocabulary, full stop. The brand
guide does ban "recipes", "kitchen", "chefs", "cooking up", "secret sauce" **in copy**. But
sourcing artwork for this deck turned up the fact that marinade.finance's own hero images are
literally chefs in kitchens, and its OpenGraph card is a cow in a chef's hat. **The ban is on
vocabulary, not imagery.**

Consequence for this deck: the paintings are fine and on-brand. The words are the thing to watch.
Note the agenda heading currently reads *"What we are going to cook through"*, which is in the
banned register. It is kept as a deliberate exception because it pairs with the artwork, but it
is an exception, not a default.

## Preferred replacement, chosen 2026-08-15

> # Inside Marinade's staking stack

Chosen over the alternatives because it names the company, has nothing to misread, and promises
exactly what the deck now delivers. The trade accepted knowingly: it reads as a session title
rather than a thesis, and it is the least distinctive of the options considered in a 50-speaker
program.

**The cover is not affected and does not change.** It keeps the submitted H1 *The Marinade
Recipe* and the H2 *Building staking infrastructure on Solana*, which is the subtitle wanted
regardless of any rename.

*Liquid, native, and getting out early* was tried as a cover subtitle and rejected on sight. It
now lives only in the document `<title>` in `index.html`, which reads
*The Marinade Recipe: liquid, native, and getting out early*. That keeps the browser tab and the
PDF export name aligned with the programme while still saying what the talk contains.

## Rejected

- *Staking is the easy part / Everything that happens after you click stake.* Was the standing
  recommendation until 2026-08-15. Dropped because it promises a talk about the user journey and
  the deck is product internals. Wrong promise for the content.
- *Three products, three constraints.* Strong and it matches the real spine of the research,
  every product being an answer to something the chain makes hard. Riskier, because the title
  then owes the room exactly three and they had better land.
- *One SOL, end to end.* **Withdrawn.** Its premise was the follow-one-SOL narrative that the
  product-tour restructure replaced. It no longer describes the talk.
- *What it takes to stake N million SOL.* A number in a title has to be current on the day, needs
  a public source, and dates the deck the moment it is reused. Keep numbers on slides.
- *Where does your stake actually go?* Good question, wrong venue. At a summit with other staking
  providers in the room, "actually" reads as a dig.

## Content

### Introduction block, built 2026-08-19

Ondra tried talking the deck through and the opening was missing. Four changes, and the deck is now
22 slides:

| # | Slide | Carries |
|---|---|---|
| 0 | Cover | Subtitle now reads *An introductory tour of staking infrastructure on Solana*. "Introductory" was Ondra's ask: the room should know this is a tour and not a deep dive, so nobody waits for depth that never comes. It no longer matches the submitted programme line word for word, which is a deliberate trade. |
| 1 | Agenda | Four lines now. *What is staking* leads, and the last line became *Bonds and instant unstake*, because the auction and the collateral take real time and the old agenda never named them. |
| 3 | **Who is Marinade** | Deliberate echo of "Who talks to you". Big hat as a watermark, three lines: born in a hackathon in 2021, a DAO with a public forum, a stake automation platform. |
| 4 | **What is staking** | Three cards: skin in the game, somebody else runs it, the work pays. Foot quotes Solana on delegation not transferring ownership. |
| 5 | **Stake decides who builds** | The diagram: stakers delegate, validators carry different weight, an epoch of slots follows that weight, rewards loop back. |

**Where the facts come from, all public and quoted rather than paraphrased.**

- *Stake as collateral*: solana.com/docs/references/terminology defines stake as "tokens forfeit to the
  cluster if malicious validator behavior can be proven".
- *Delegation keeps ownership*: solana.com/staking, "Delegating your tokens to a validator does NOT
  give the validator ownership or control over your tokens."
- *Stake-weighted consensus*: same page, "Validator's consensus votes are stake-weighted."
- *The leader schedule*: terminology page, "A sequence of validator public keys mapped to slots", and
  an epoch is "the time, i.e. number of slots, for which a leader schedule is valid".
- *The two reward kinds*: solana.com/docs/core/fees, "Base fee: per-signature, split 50% burned / 50%
  to the validator", 5,000 lamports per signature, and "Prioritization fee ... 100% to the
  validator". Inflation and vote credits from the terminology page.
- *Marinade's own positioning*: docs.marinade.finance, "a stake automation platform that helps you
  maximize SOL staking rewards while supporting the decentralization and performance of the Solana
  network."
- *DAO history*: Marinade's own education article, born spring 2021 out of two hackathons, MNDE
  launched 7 October 2021, on-chain governance in 2022, bootstrapped by grants with no venture
  capital.

**Two accuracy traps in the staking intro, both handled in the speaker notes.**

1. **Do not say Solana slashes stake today.** The terminology page defines stake as forfeitable, but
   protocol slashing is not live, so in practice backing a bad validator costs you rewards, not
   principal. The slide says "locking SOL says you care", which is true either way.
2. **Stake buys slots, not a lottery ticket.** The natural phrasing is "a bigger chance to produce a
   block", and the mechanism is a leader schedule computed per epoch, stake-weighted. The diagram
   draws proportional slots for exactly this reason.

**The diagram is drawn, not sourced.** `.pos` in the theme, generated geometry so proportions are
exact: validator A carries five stake pips and gets five of the nine slots, B three, C one. The
dashed return arrow is the reward loop, and its first version grazed validator C's box, which is why
the path drops to y=400 now.

### Speaker notes are the second half of this deck

Every slide carries a `Note:` block, all 22 of them, about 3,400 words in total and a median of 160
words a slide. Reveal parses them into `aside.notes`.

**Three ways to read them.**

1. **Press `s` in the deck** for the speaker view: current slide, next slide, notes and two timers in
   a second window. It is a popup, so the browser has to allow one for localhost, and the deck has to
   be served over HTTP, which `npm start` already does.
2. **`TALK-TRACK.md`** at the top of this directory, for rehearsing away from the deck. Generated from
   `deck.md`, see below.
3. **In the PDF**, with `?print-pdf&showNotes=separate-page`. Verified 2026-08-19: reveal merges
   query parameters into its config, and that URL renders all 22 note blocks into the print view, one
   page each. `showNotes` is deliberately **not** set in `index.html`, because turning it on there
   would also print the notes onto the slides in the live deck.

### `TALK-TRACK.md`, the deck read as a script

`python3 tools/talk-track.py > TALK-TRACK.md` renders the whole deck slide by slide: the heading, the
slide's classes, and each note broken into its separate points. It opens with **the question chain**,
a table of what each slide leaves the room asking, extracted from the "Leaves the question" lines.

It is generated, never hand-edited, so it cannot drift from the deck. The chain table is also a
review tool rather than just a reading aid: an em dash in that column means a slide hands nothing to
the next one, which for anything except the cover, the agenda, the bio and the closing is a seam to
go and look at.

Two extraction details worth knowing, both already handled: a note point starts at an ALL-CAPS
lead-in **only** where the previous line ended a sentence, because a capitalised word wrapping onto
the next line used to truncate the point; and "Then hand off" counts as a handoff when no explicit
"Leaves the question" line exists.

The convention that grew here, worth keeping: the notes are not a script to read out. They carry the
*message* of the slide in caps, then the detail that did not earn slide space, then the question the
slide hands to the next one. Where something must be said but must not be printed, the note says so
explicitly, and for the private material it names the file under `$K` instead of repeating it.

### How to introduce Marinade Recipes, answered 2026-08-19

Ondra asked what Recipes actually is, and whether it needs its own slide. **It does not.** One card on
the strategies slide plus forty seconds of talk covers it, and a whole slide for the third strategy
would unbalance a section that already runs long. What was missing was the framing, not the space.

**The framing is DCA, and it comes from Marinade's own page**, which says "DCA into token:
automatically convert your staking rewards into the token you want, bit by bit". So:

> Your principal stays in SOL. Only the yield is converted, epoch after epoch, into a token you chose.
> It is dollar cost averaging paid for by staking rewards instead of out of your wallet.

That single sentence is what the product is. Three flavours, all named publicly: **stablecoins** for
yield without market swings, and USDG is the one live today; **utility tokens**, MNDE and zBTC;
**memecoins**, which is where `$FWOG` and `$NOBODY` come in. The page also advertises a boosted APY
for subscribers.

Say the caveat, it costs a sentence and buys trust: **the price risk is on the payout token, not on
the stake.** The SOL principal is untouched.

The card now reads "Your rewards are swapped, epoch by epoch, into a token you pick", which is the DCA
mechanism in plain words. And the standing constraint still holds: **describe Recipes by its payout
rail only, never by where the stake is delegated.**

### Timing budget, 20 minute slot (2026-08-18)

The slot was cut from 25 to 20 minutes. Assume **17 minutes on stage, 3 for questions**, until the
organizers say whether Q&A sits inside the slot or after it.

17 minutes is 1020 seconds. Rehearsed estimate for the current 22 slides:

| Block | Slides | Seconds |
|---|---|---|
| Cover, agenda, who talks to you | 3 | 95 |
| Liquid staking, no break, 8 slides | 8 | 470 |
| Native staking, no break, 5 slides | 5 | 305 |
| Instant unstake, no break, 2 slides | 2 | 105 |
| Closing | 1 | 20 |
| **Total** | **19** | **995, about 16.5 min** |

**Still slightly over.** A rehearsal estimate runs 20 to 30% short of the real delivery, which puts
this at about 20 minutes on the day against a 17 minute stage budget. Folding all three section
breaks bought three slides back, Instant unstake and the Native strategies slide spent three, and
cutting the "Everyone waits" statement paid one back. **One cut from the shortlist below is still
owed.**

Rules that follow from this:

- **There is no appendix any more.** The war stories were dropped from this deck on 2026-08-18, so
  the budget below is the whole talk.
- **Anything added before the closing has to be paid for.** New slide in means a slide out, or an
  existing one gets faster.
- **Cutting happens after the deck is complete**, not while writing it. Decided 2026-08-18: finish
  the whole idea first, then remove parts. A half-built section cannot be judged against a full one.

Parked cut candidates, in the order they would go. Not decided, just the shortlist:

1. **N3 "Not a hot wallet"** folds into N2 as one spoken sentence. The recovery argument is strong
   but it is one non-obvious sentence, not a slide. Saves about 60s.
2. **"Who talks to you"** trimmed to a 20 second read rather than four spoken points. Saves 15s.
3. **L3b the state ring** becomes one line on the crank slide. Saves 70s, and it is the most
   painful of the three because the ring is the best diagram in the deck.

### Deck plan as of 2026-08-12 (current, supersedes "follow one SOL" below)

Structure changed from a single narrative thread to a **product tour**. Captured verbatim in
intent from the planning session. This is the working outline now.

**The organising principle, decided 2026-08-15: every slide raises the question the next one
answers.**

This is the main line of the talk. Not the chain-limits motif, not a thesis, not a metaphor.
**A chain of questions.** Each slide should end owing the audience something, and the next slide
should pay it. If a slide can be removed without breaking a question, it was decoration. If two
adjacent slides have no question between them, the order is wrong or one of them is filler.

Practical tests when writing or reordering any slide:

- What question does the audience have in their head as this slide ends?
- Does the next slide answer *that* question, or a different one?
- Is the last slide of a section leaving a question that the next section opens with?

Section-crossing matters as much as within a section. The seams are where a product tour usually
falls apart into an inventory, and the questions are what keep it a single argument.

The chain as currently designed for Liquid staking:

| Slide | Leaves the room asking |
|---|---|
| L1 What an LST is, who was first | Fine, but does that mean it is just the standard pool? |
| L2 Who does the waiting | So who decides where my stake actually goes? |
| L3 The loop | Great, it runs. But *who* gets it, and on what basis? |
| L4 Who gets the stake | Why would a validator want to be picked badly enough to give something up? |
| L5 Three sources of yield | The bid is a promise. What makes a promise pay out? |
| L6 One bond, two jobs | Sets up Native staking: this whole thing is a program. What if you do not want a program at all? |

Note L6 deliberately hands off into the Native section rather than closing the topic. Do the same
at the end of Native and Instant Unstake.

**On memes and borrowed images. Read before sourcing any.**

The repo is public and the deck goes on a conference screen, so third-party artwork is a real
problem, not a technicality:

- **Scrooge McDuck is Disney.** Raised as a risk, and **Ondra decided to use it anyway** on
  2026-08-15. It is `slides/images/now-what.jpg` on the "You staked. Now what?" slide, logged in
  `resources/README.md`. Informed decision, do not re-litigate it. If it ever needs pulling, the
  slide works with `brand-art/p-liquidity.jpg` instead, whose lower right corner is a mountain of
  gold coins.
- **Factorio screenshots are Wube Software's.** Game screenshots get tolerated a lot in practice,
  but "tolerated" is not "licensed", and this deck is published.
- Most reaction memes carry someone's photograph or film still underneath.

Two safe routes, both already used:

1. **The Marinade paintings.** They are first-party and they already contain the imagery wanted.
   `p-liquidity.jpg` is a mountain of gold coins, which is exactly the "now you get paid" beat
   without borrowing anyone's duck.
2. **Draw it.** The gears on the validator-choosing slide are the Lucide cog composed three times
   at different sizes and rotation speeds, in brand teal, as an original SVG. No IP, no download,
   scales to any projector, and it moves.

If a genuine meme is still wanted, source one with a clear licence and log it in
`resources/README.md` like every other asset.

**Meme wanted: the settlement slide.** `slides/deck.md`, "From promise to payment". Holding
`brand-art/p-security.jpg` as a placeholder, which Ondra finds too generic. The joke should be
about **inevitability** or **everybody getting paid**, not money in general, because the slide's
claim is *this runs every epoch whether anyone is watching or not, and the claim needs nobody's
permission*. Shortlist:

**Settled 2026-08-16: the Scrooge callback**, `slides/images/settle-payout.webp`. Same duck as
the "You staked. Now what?" slide, now at a desk counting and stacking the money. Superhero ideas
were offered and rejected, Ondra is not a fan; the alternatives considered were Fantasia's
marching brooms (for a process that runs while the operator sleeps), Disney's Robin Hood handing
out coins, and Gringotts goblins.

The callback is the reason it works: first appearance he is the staker dreaming about the money,
second appearance he is the one doing the paperwork that actually pays it out. Two slides, one
running joke, and it costs no explanation.

**The bond slide image is settled**, 2026-08-16. `slides/images/bond-chips.png`, a poker buy-in,
supplied by Ondra. It was the top recommendation of the six candidates because it is the only one
carrying *both* halves of the idea: money on the table before you play, **and** losses coming out
of your own pile rather than the house's. The other five (swear jar, Gandalf, bouncer, Fry, a
Scrooge callback) each covered one half.

The source lives at `resources/images/chipin2.png` and is copied into `slides/images/` because
vite serves from `slides/`, so a `../resources/...` path would not resolve.

**Slide copy rules, added 2026-08-15. These are hard.**

- **Never name a competitor on a slide.** Jito, Helius, Sanctum and the rest stay off the screen
  unless Ondra says otherwise. Comparisons are worth two sentences spoken, never a table. A
  comparison slide reads as defensive with other providers in the room.
- **Never state the epoch length on a slide.** Not "two days", not any number. Epoch time is
  moving and may be close to a day by the conference. Say "every epoch" instead.
- **One sentence per box.** Nobody reads a paragraph on a slide, and if they are reading they are
  not listening. Long explanations belong in the speaker notes.
- **Small asides go to the bottom of the slide**, in `.slide-foot`, not trailing the content.
  It clears the journey rail automatically.
- **Token names use `.token`**, a subtle chip rather than bold. Bolding every mention of mSOL
  gets noisy, and inside an already-accented card heading a colour change does not read at all.

**Overall tone**

- Playful. Memes and joke pictures are wanted, not just diagrams.
- Technical over promotional. Even the company slide should read as engineering, not branding.
- Every product section leads with **why**, then how or what. Never the reverse.

**Slide 1, cover**

- Keep a background image. The reference is the marinade.finance hero: painting behind, heavily
  faded, text on top. Screenshot saved at `resources/marinade-finance-hero.png`.
- Title stays as submitted. It breaks the brand rules, it went to the organizers, it is not
  changing. Stop revisiting it.
- **Remove the conference name from the cover.** No "Solana Summit Serbia".

**Slide 2, agenda**

- What the audience can expect, expressed as products, not as chapter numbers.
- Layout: product name, then its one-line shout-out on the next line beside it, then the next
  product indented a step further. A descending staircase.
- Products to cover: Liquid Staking, Native Staking, Instant Unstake.
- **Sparse slides get a large Lucide glyph, `.slide-icon`.** The agenda carries a terminal
  window, anchored in the empty right half, to say "this will be technical" before a word is
  spoken. Bare `terminal` was tried first and rejected: two strokes read as an arrow and an
  underscore unless you already know the reference. `square-terminal` adds the frame that makes
  it an object, and its second-line underscore is replaced by a filled block cursor that blinks
  on a 1.2s step-end cycle. The blink is the part that actually sells it, and it is disabled
  under `prefers-reduced-motion`.
  Inlined as SVG rather than an `<img>` so `stroke="currentColor"` picks up the theme colour.
  Two things to know if you add more: Lucide is drawn for small sizes at stroke-width 2, so at
  300px the markup must carry a much thinner stroke (0.9 here) or it reads as heavy bars; and
  `.slide-icon` is excluded from the `.slide-body` wrap in `index.html`.
  A retro CRT drawing was considered and dropped in favour of the brand's own icon set. Note the
  real Windows "My Computer" icon is Microsoft's and must not go on a public deck.
- **The agenda stays at three products.** Native's three strategies were tried nested underneath
  and pulled back out on 2026-08-15: six items to read when the room only needs three, and no
  context yet for what Select or Recipes mean. The block is parked in a comment in `deck.md` and
  should become a strategies slide inside the Native section. This also moves the `$BONK` line
  later, deliberately, so it arrives as a surprise instead of a bullet nobody reads closely.
  Wherever it lands, describe Recipes by its payout rail only, never by where stake is delegated.
- Shout-outs should be punchy, sourced from marinade.finance or the docs. A degen note is
  welcome if the source material supports one.
- Open: is the three-product list complete? See the product research below.

**Slide 3, who talks to you**

- Framing is "who talks to you", not "who am I", if the phrasing fits the design.
- Layout reference: `athensdao2025-realms/slides/index.html#/2`.
- The helmet image is mine and I want to keep using it.
- Points to make, each with a project icon on the line:
  - Backend developer. This is the one to highlight.
  - Formerly a Java engineer at Red Hat. Use the Fedora logo from
    https://www.redhat.com/en/about/brand/standards/logo
  - Interested in distributed systems. Needs rewording, shorter and punchier.
  - Contributor to Realms, worked on it extensively about two years ago.
- A fourth point would balance the slide. No idea what it should be. Suggestions welcome.

**Slide 4, about Marinade**

- Technical perspective, not a branding slide, even though it is short.
- We run the infrastructure that manages staking. Home of staking on Solana.
- What we are actually good for: best yield for stakers, because we understand Solana, we
  operate inside the ecosystem, and we sit between validators who want stake and stakers who
  want yield.
- We assess validator behaviour continuously, finding the honest ones with the best
  performance, and we keep doing it for as long as Solana runs.
- On top of that we ship several products around staking.
- Small aside, not a selling point: we supply validator data to the Foundation, somehow tied to
  `delegation-strategy-2`. Confirm what the program is actually called before saying it aloud.

**Slide 5, section break: "A PRODUCT"**

- Big separator slide with a background image, same treatment as the other art slides.

**Liquid Staking**

Captured 2026-08-15. This is the raw flow of thinking for the section, kept as stated. Not all
of it goes on slides, see "Liquid staking: slide split" below for the structure derived from it.

- **What an LST is, briefly.** Everyone knows it, so keep it short. There is an on-chain program,
  you put SOL in, you get a token back that trades on DeFi protocols. The staked SOL is liquid,
  it is still staked, and the owner still receives the staking rewards.
- **Marinade is the OG protocol**, the first LST on Solana. Built as a joint effort by two
  hackathon teams.
- **How the network is monitored.** Research targets `marcrank` and the delegation-strategy
  side. Explain what watches what.
- **A slide on how the system works**: what calls what, why, and on what schedule.
  `liquid-staking-program/Docs/` has good material for this.
- **Permissionless, but scored.** We rate validators on performance, and because we still believe
  in decentralisation, points are also given for things like location. The main input to the
  ordering is the validator auction.
- **Marinade protects its stakers in more ways than yield.** We monitor the network and run PSR,
  which "slashes" validators that take downtime and therefore stop generating staking rewards.
  Rewards come from voting on chain, so no voting means no rewards.
- **How can we slash at all? Bonds.** A validator that wants to be part of the Marinade staking
  system must have a bond and fund it. That is an on-chain program, `validator-bonds`. Processing
  the end-of-epoch state lets us decide how the validator behaved.
- **Bonds also let us pay stakers more than plain staking rewards.** Until the SIMD that shares
  block rewards is activated, direct priority-fee delegation is not available, so we gather that
  value through the auction instead. A validator decides how much extra of its rewards to share
  with stakers, and that is distributed through the bonds program.
  - **TODO**: find the SIMD number for block-reward sharing. Do not present this without it.
- **Difference from the standard Solana LST program.** This must be something graspable about
  *how our approach works* versus theirs. Differently calculated fees are not interesting here.
  Claim processing is closer, but still not interesting enough on its own.
- **Two war stories, now saved for a different talk entirely**, see "Saved for another talk" below.
  Kept here because the material is good and fully researched. They are challenges of being a
  long-standing OG program while the Solana protocol changes underneath.
  1. **Delinquent stake.** Solana later shipped a permissionless deactivation instruction. The
     program has its own state machine that outside processing must not be able to break, which
     is how security is preserved. Delinquency did not exist at launch, so when it appeared it
     broke an assumption and some SOL could not be unstaked. Explain what broke, why, and the
     two-part fix.
  2. **Canonical / PDA stake accounts.** Marinade is big, and creating many stake accounts is
     unkind to Solana and has a real impact on validators. We want fewer accounts, but delegation
     mechanics and Solana's processing make that hard. Explain what the canonical stake change
     buys.
- Wanted: articles or blog posts on stake account counts and their performance impact, as
  source material to speak from.

**Liquid staking: slide split, proposed 2026-08-15**

Six slides in the main section. Derived from the flow above plus
`research/liquid-staking-system-and-bonds.md`. Restructure freely, but note the order is
deliberate: each slide creates the question the next one answers.

| # | Slide | Carries |
|---|---|---|
| L1 | **You all know what liquid staking is** | Program in, token out, still staked, still earning, tradeable. Marinade first on Solana, 2021, two hackathon teams. One slide, fast. Opens the section itself: `label` "Liquid staking" plus the chef painting, no separate break. Retitled from "What an LST is" on 2026-08-18, because the section name is now on the slide and the acronym did not need to lead. **No stamp here.** Ondra's call, 2026-08-18: the coral burst belongs to Native only, so it stays a surprise instead of becoming the deck's furniture. |
| L2 | **Somebody has to choose the validators** | Watch, Judge, Move. The message is the *machinery*: we collect data off Solana, work out where the best yield and better decentralisation are, and move stake there, continuously. Not "a choice exists" but "we built the thing that keeps making it". |
| L3 | **The loop** | The crank cycle each epoch. `update_price`, `stake_delta`, `merge_stakes`. mSOL price rises, nothing is distributed. **Say the permissionless claim precisely, see below.** |
| L3b | **A stake account cannot move sideways** | The four states drawn as a **ring**, because it is a cycle. Active → Deactivating → Inactive → Activating → Active. Carries the rebalancing problem. |

**Two corrections to that diagram, made 2026-08-15 and worth not undoing:**

- **Deactivating still earns.** The stake stays effective for that epoch. The first version marked
  it as winding down toward nothing, which is wrong.
- **Inactive and Activating are the same from a rewards point of view: both pay nothing.** So the
  yellow is *half the ring*, not one box. And **Inactive can go to Activating in the same epoch**,
  no extra wait, which is why a line diagram misled and a circle does not.
| L4 | *(no heading)* | Poker buy-in picture, one line under it: *Validators back their word with their own SOL.* Nothing else on the slide. |

**L4 has no heading on purpose, 2026-08-16.** It used to carry *"No bond, no stake."* above the
picture, which said the same thing twice and did it in the gatekeeping register this slide had
already moved away from. Picture plus one line is the whole slide.

**L6 does not reuse the horizontal step strip.** Three `.steps` diagrams in a row read as one
long diagram, so the settlement beats moved to `.split-media`: painting on the left, a vertical
numbered list on the right. Same four beats, different shape, and it breaks the run.

**Tone note on L4, 2026-08-15.** An earlier line read *"Their bad days come out of the deposit"*
and was cut for framing validators as the problem. They are not: they are partners who choose to
post collateral so Marinade can promise stakers a floor without asking anyone to trust it. Keep
this slide on the validator's side. The bond is a commitment, not a punishment.

The priority-fee question that sets up the auction (*Solana has no way for a validator to pay you
a share of its priority fees, so how do we get you more?*) moved to the **speaker notes**. It is
said aloud, not printed, so the slide stays at one sentence.
| L5 | **Validators bid for your stake** | The answer. Bid, allocate highest first, last winner clears. Yield decomposition (`inflation + MEV + bid`) is **spoken**, not a slide. |
| L6 | **From promise to payment** | Measure, calculate, settle on chain, permissionless claim. Deliberately light: no six-stage pipeline, no merkle detail unless asked. |

**Order changed 2026-08-18: the keys slide now comes before the strategies slide.** Ondra's call. The
chain still holds because the handoffs were rewritten: N1 leaves *how do you manage my stake without
holding it*, N2 answers with the custody model and leaves *the staker authority is ours, so what do
we do with it*, N2b answers with three policies and leaves *so what is actually holding that key*,
which is exactly what N3 answers.

**Order changed 2026-08-15: bonds now come before the auction.** It reads better and it is also
more correct, because a validator has to fund a bond *before* it can bid. The journey rail was
reordered to match: `Stake → Bond → Auction → Settle → Exit`.

**The standalone "three sources of yield" slide was folded away.** The `RevShare` decomposition is
still worth saying out loud on the auction slide, but it did not earn 60 seconds of its own once
the settlement slide was added. Restore it if the section turns out to have room.

**The settlement slide reverses an earlier decision.** The six-stage pipeline was ruled out on
2026-08-15 as builder detail, and that still holds for the *diagram*. What went in is four beats
of shape only: measured, calculated, settled on chain, claimable by anyone. Merkle trees and the
distribution CLI stay in the speaker notes.
**No appendix. Decided 2026-08-18.** The two war stories are out of this deck entirely, not parked at
the end of it. See "Saved for another talk" below.

**On L2, the difference from the SPL stake pool.** This was the open question. Two candidate
angles, and the recommendation is to lead with the first and use the second only if there is time:

1. **Who does the waiting.** Reframed 2026-08-15 after the first version failed on Ondra himself,
   which is the clearest possible signal it would fail on the room. The earlier wording,
   *"Marinade turns the wait into a price, SPL leaves it as a wait"*, is accurate but silently
   assumes the listener already holds three concepts: what a pool reserve is, the difference
   between `WithdrawSol` and `WithdrawStake`, and LP economics. That is a paragraph of setup for
   a 70-second slide.

   **Moved out of Liquid staking, 2026-08-15.** The "who waits" framing is about *exit
   liquidity*, which is Instant Unstake's territory and a different product. Keep the line, use
   it there or near the end when the products are drawn together. It does not belong in L2.

   > **Everyone waits two days. The only question is who.**

   **L2 became "Somebody has to choose the validators" instead.** One question asked of three
   systems, which is more useful than a feature comparison and is not defensive:

   | Pool | Who decides delegation |
   |---|---|
   | Most SPL stake pools | A `staker` keypair. People. |
   | Jito | An on-chain program, cranked by anyone. |
   | **Marinade** | A market. Validators bid for your stake. |

   Confirmed from the SPL source: `(Staker only)` gates `AddValidatorToPool`,
   `RemoveValidatorFromPool`, `IncreaseValidatorStake`, `DecreaseValidatorStake`,
   `SetPreferredValidator` and `Redelegate`. So in a stock SPL pool **one keypair decides the
   whole validator set**, and "who holds the staker key" is the real question about any
   SPL-based LST. Jito is interesting precisely because it put a *program* in that seat.

   History to say out loud, not put on the slide: Marinade wrote its own program in 2021 because
   it was first and there was nothing to reuse. The original vision was the crank and
   decentralisation. There were no bonds and no auction. Those came later, when it became clear
   they could get stakers a better yield.

   Supporting detail, only if a question comes: Solana forces a cooldown of roughly two days on
   any unstake, so "instant" always means somebody took your staked position and is waiting in
   your place. An SPL pool can only pay you from its own spare reserve, and when that runs dry it
   hands you a stake account to deactivate yourself. Marinade runs a SOL/mSOL pool inside the
   program, funded by third parties who deposit specifically to earn the fee, and the fee rises
   from about 0.3% to 3% as that pool empties. Scarcer liquidity means a higher fee, which pulls
   in more providers. If it empties completely, Marinade users fall back to a ticket and wait
   two days, which is where SPL users live permanently.
2. **The accounting model.** SPL keeps one stake account per validator plus one transient account,
   rigid by construction. Marinade keeps a free list of stake accounts, which is more flexible and
   is exactly why canonical stake is now being retrofitted. It used to be the bridge into the
   canonical stake war story, which is no longer in this deck.

Explicitly **not** the difference to use: fee calculation. Correct but boring, and the audience
will not care.

**On L3, how permissionless the contract really is.** Checked against signer requirements in the
program, not taken from the design doc. The split is clean:

- **Anyone can call** `update_active`, `update_deactivated`, `merge_stakes` (no signer at all),
  and `stake_reserve` / `deactivate_stake` (a signer, but only as **rent payer**, not authority).
- **Only Marinade can call** `add_validator`, `remove_validator`, `set_validator_score`,
  `emergency_unstake`, `partial_unstake`, all gated on `manager_authority` or
  `validator_manager_authority`.

**So the mechanism is permissionless, the policy is not.** Anyone can turn the crank; only
Marinade decides who is on the validator list and what their score is, which is exactly the
staking priority that drives `stake_delta`.

The line to use, because it survives a hostile question from someone who has read the program:

> If Marinade disappeared tomorrow, the mSOL price would keep updating, rewards would keep being
> booked, and you could still deposit and unstake, because anyone can turn those cranks. What
> would stop is the scores. Delegation would freeze at whatever was last written. **Your money
> stays safe and liquid. It just stops getting smarter.**

**On L5 and L6, the framing that makes the section land.** SIMD-0096 sent 100% of priority fees
to validators and left no in-protocol way to share them back with delegators. SIMD-0123 adds
exactly that and passed governance in March 2025. **Until it activates, Marinade's auction plus
bonds is the mechanism that moves that value anyway.**

**On L6, no settlement pipeline. Decided 2026-08-15.** The `validator-bonds` README offers a
ready-made six-stage flow, *snapshot → bid-distribution CLI → settlement JSON → merkle trees →
on-chain settlements → claims*. **It is not going on a slide.** It is builder detail, and the time
is not there: roughly 7 minutes for the whole Liquid section means about 70 seconds a slide, and
that diagram would spend two minutes answering a question nobody in the room asked.

What the bond slide owes the audience is only this: a validator posts collateral to get Marinade
stake, and that one deposit is what makes both the bid and PSR enforceable. **A promise becomes an
account you can read.** The pipeline stays in
`research/liquid-staking-system-and-bonds.md` for Q&A or a longer version of the talk.

**On the "chain limits" motif, decided 2026-08-15.** The recurring shape — *here is a gap in
Solana, here is the machinery we built to bridge it, here is the protocol change that will make
that machinery unnecessary* — appears in both Liquid (block-reward sharing, SIMD-0123) and Native
(transaction size limits). It is a real idea of the talk and should be **present everywhere**.

But it is **not the headline and not a slide.** Keep it **spoken**, in Ondra's own words, as the
connective tissue between sections. Do not build a slide that announces it, do not put it in the
title, and do not turn the deck into a thesis about Solana's limitations. The deck stays a
product tour; this is the thing the speaker keeps noticing out loud.

**On saying "slashing", decided 2026-08-15.** The word stays, used **once with the correction
attached**, then dropped in favour of "the bond covers the loss". On Solana, slashing means the
protocol destroys staked **principal**; Marinade's bonds pay out **rewards** from collateral the
validator posted, and principal is never touched. Saying the imprecision out loud before anyone
in the room does converts an objection into a point in your favour. Full suggested wording in
`research/liquid-staking-system-and-bonds.md`.

**Native staking: slides built 2026-08-16**

| # | Slide | Carries |
|---|---|---|
| N1 | **Not everyone wants a program holding their SOL** | Opens the section itself. Coral stamp reading "Native staking", the vault painting as background, three cards: no contract risk, no token, just the delegation. Foot: launched July 2023, compounds by itself. |
| N2 | **Solana splits the keys** | Coin picture on the right, duotoned into the palette. Three boxes, left aligned: the `StakeStateV2` enum and the field tree at 21px, then `Authorized` at 26px. The two context blocks are deliberately a size under the last one, because the structures are there to be recognised and the last block is there to be read. |
| N2b | **Three ways to run it** | Max Yield, Select, Recipes. Built 2026-08-18. Foot is the payout list, `$USDG` through `$USDC`. Describes Recipes by its payout rail only, never by delegation target. |
| N3 | **Not a hot wallet** | Why the staking authority is a PDA and not a key. |
| N4 | **Getting out is the hard part** | The exit funnel: twelve accounts, three deactivating batches, one withdrawal. The exit authority marks an account as leaving, so the authority *is* the state. |
| I1 | **Somebody buys your stake account** | Opens the section itself, `label` plus the gold-coin painting. Atomic swap, one transaction, both legs or neither. Works on any stake account, even ones Marinade never touched. |
| I2 | **Somebody has to want it** | You get, They get, The gap. Named sides rather than abstract nouns: you get SOL now at a little under face value, the buyer gets the account and inherits the cooldown, and the difference is the price of not waiting. Foot: no unstaking fee from Marinade, price shown before you sign. |
**I3 "Everyone waits. The only question is who." was cut on 2026-08-18**, Ondra's call and the right
one. It carried no information: a phrase, not a slide, spending 25 seconds saying what the room had
already worked out. First cut paid against the 17 minute budget.

**The line itself is gone too, not just its slide.** It was first moved into I2's speaker notes, and
Ondra cut it from there as well on the same day: asked what he was meant to say with it, there was no
answer beyond the sound of it. Recorded in `PUNCHLINES.md` under "Held back deliberately". The general
lesson is worth keeping: a line that only sounds good is decoration, and speaker notes are not a
retirement home for it.

**I2's cards were rewritten in the same pass**, because "Now / Less / Why" was not landing. Abstract
one-word headings made the reader work out who the sentence was about. Naming the two sides, **You
get** and **They get**, then **The gap**, makes the trade legible without a sentence of setup, and it
is the same economics the cut line was gesturing at, made concrete.

**What I2 is for**, since it was asked. I1 is the mechanism, I2 is the price, and without it the room
hears Instant unstake as free magic. Somebody buys your account because they are happy to wait; the
cooldown is not optional, so the buyer takes it on and charges for it; you get slightly less than the
account holds, right now, and that gap is the price of not waiting. Marinade takes no fee from the
unstaker, so the discount goes to whoever does the waiting. It is also where the two private-repo
beats are spoken.

**All three section breaks are gone, 2026-08-18.** Each used to spend a whole slide on a product name
over a painting. Now the first content slide of each section carries the painting plus the section
name, and the rail switch does the rest of the structural work. Three slides back in a deck that is
over budget.

**Only Native gets the stamp.** Liquid and Instant unstake carry a plain `label`, which is Ondra's
call: one coral burst in the deck stays a shock, three make it the deck's furniture. So the pattern
is "quiet label by default, stamp once".

**The stamp sits under the headline, not above it.** The h2 is the slide's message and the section
name is context, so the order is heading first, then the burst. In `deck.md` that means the stamp
div comes *after* the `##` line; it stays pinned because `.stamp` is in the `wrapBody` exclusion
list, so DOM order is preserved.

**What the stamp is, and why coral.** Ondra asked for something strange, floated a rainbow, and
asked for a "pow" image. The rainbow is out because inventing colours is the one thing this deck has
been rigorous about, but the palette already carries category hues that the deck has never used:
`--mn-cat-coral`, indigo, lavender, rose. A coral comic starburst is therefore **in the palette and
still a shock** against twenty teal slides. It is drawn here, an original 24-point polygon, so there
is no third-party artwork on a published deck.

**The burst and its wording are one SVG, and they have to stay that way.** The first attempt put an
absolutely positioned burst behind HTML text and sized it in percentages. Two failures followed:
`.stamp` is a flex item, so `display: inline-block` was blockified to the full slide width, and
`preserveAspectRatio="none"` then stretched the star into a flat streak across the slide. With the
text inside the SVG, the shape cannot be distorted by whatever the words happen to measure. Set the
size once, in CSS, on the wrapper.

**The wrapper must be a `<div class="stamp">`.** marked counts `<svg>` as *inline* HTML and wraps it
in a `<p>`, exactly as it does a bare `<span>`. That `<p>` is not in the `wrapBody` exclusion list,
so `.slide-body` gets anchored above the heading and the h2 lands **below the cards**. This trap was
hit twice in one session, once with a span and once with an svg. Anything that must sit above the
heading is a `div` with an excluded class, and `.stamp` is now on that list in `index.html`.

**A unicorn was offered and declined.** A unicorn reads as mythical or impossible, and the slide's
claim is the opposite: no program, no token, mechanically real. The whimsy would have argued against
the message. The burst is strange without being self-undermining. If the section still wants a joke,
N4 is the better host.

**`section.art .card` went from 66% to 88% opacity.** The art scrim is tuned for text-only slides, so
a card sitting on the bright part of a painting stopped reading as a card. Only the two section
openers have cards over art, so the change is contained.

**On I2 and I3, added 2026-08-18, and on what is deliberately not there.** The three Instant unstake
repositories are private, so the slides and these notes carry only what marinade.finance already
states publicly. The archived product page says "buyer" once and never says "auction", so the deck
does not either. Two mechanics beats **are** said on stage and are deliberately written nowhere in
this repo, speaker notes included, because the notes are public too. They live in the private talk
note under `$K`, `marinade-staking-stack--instant-unstake-mechanics--INVESTIGATION.md`.

I3 must never print an epoch length, per the standing rule. "About two days" spoken is fine.

**Rails are now per section**, `RAILS` in `index.html`, selected with `data-rail`:

- `liquid`: Stake, Bond, Auction, **Settle**. Exit was removed on 2026-08-16, there is no exit
  content in the Liquid section.
- `native`: Stake, Exit.
- `instant`: Stake, Exit. Kept as its own entry rather than sharing `native`, so the two can
  diverge without surprising anybody.

A slide with no `data-rail` falls back to `liquid`.

**Both the proxy and the undelegation story are in, deliberately.** They answer different
questions and each is worth one slide. The proxy answers *who holds the key you gave us*; the
exit machinery answers *what happens when you want to leave*. Dropping either leaves an obvious
hole, and the proxy is cheap because its argument is one non-obvious sentence.

**The proxy argument is the good one, and it is not the obvious one.** The obvious defence is "a
hot wallet cannot steal anything, so it is fine". The real problem is **recovery**: only the
*owner* can assign or revoke the staking authority, so a leaked Marinade key could not be rotated
by Marinade. Every user would have to act individually, on every stake account they own. That is
unfixable from our side, so the key must not exist at all. Hence a PDA. Source:
`native-staking/programs/marinade-native-proxy/README.md`.

**Nothing about the terminology goes on this slide.** Ondra's call, 2026-08-18: it is a talking
point, not slide copy, so the label that briefly carried it is gone. The research stands and lives in
the speaker notes.

**On the terminology, checked 2026-08-18.** Ondra asked to name the model "delegated
proof-of-stake". **solana.com/staking never uses that phrase.** It says "Proof of Stake", and
describes delegation separately: "Staking is the process by which a SOL token holder assigns some or
all of their tokens to a particular validator or validators, which helps increase those validators'
voting weight." DPoS normally implies an elected delegate set, EOS and Tron style, which Solana does
not have, and someone in a Solana Summit audience will know that. So the slide label reads **Proof of
stake, with delegation** and the phrase "delegated proof-of-stake" stays a spoken option with the
caveat in the notes.

That page also hands the slide its best line, and it is Solana's own sentence rather than ours:
**"Delegating your tokens to a validator does NOT give the validator ownership or control over your
tokens."** Quote it if the room needs convincing.

**On the code slide.** `pub struct Authorized { staker, withdrawer }` is the whole custody model
in two fields, from `solana/sdk/program/src/stake/state.rs`. The comments on the slide are ours,
the fields are Solana's. Highlight.js was recoloured from monokai into the brand palette, because
stock pink-and-lime reads as somebody else's deck.

**Native Staking (original capture)**

- Lead with why. Native staking exists because some people are afraid of on-chain program code,
  and because plenty of stakers want yield without touching web3 finance or holding mSOL.
- The consequence is an off-chain backend, which is the interesting engineering.
- The core problem: make it work for both sides. That is the auction.
- Because we are not on-chain we had to build something that still feels "kind of"
  permissionless. That is a contradiction, we do operate it, but the feeling matters and is
  worth naming honestly on the slide.
- **The hard part is undelegation, not delegation.** This is the strongest technical beat in the
  native staking section, and it was missing from the first capture. Delegating is easy.
  Un-delegating in a way that behaves properly for a real user is where the engineering is:
  the revoke process, the state machine behind it, the queues.
  - Root cause is a Solana limit, not a design choice. Only a limited number of stake accounts
    fit into one transaction, so a revoke that spans many accounts cannot be one atomic step.
    Everything else, the queueing and the state machine, is a workaround for that ceiling.
  - Solana is raising transaction size and account-count limits. When that lands, most of this
    machinery can be deleted.
  - Narrative purpose, and it is the reason to include it: show a concrete limitation the chain
    imposes, show the workaround it forced, and show that we track the ecosystem closely enough
    to drop the workaround the moment the platform makes it unnecessary. Being current is the
    point, not the queue design itself.
  - Research target: the `native-staking` component in the stack. Not yet read.
- Some auction detail, reusing `marinade-auction-presentation/slides/index.html#/4`.
- Then Select and Recipes: working with a different collateral and being repaid in it.
- We are moving further into web3 financial strategies to give yield more ways to work.
  I do not know this area well and want a summary of `~/marinade/marinade-web` to learn from.

**Instant Unstake**

- The product I know least, which is exactly why it is worth talking about. There is another
  auction in there.
- Research start point `~/marinade/unstake-taker-client`, then marinade-web, the docs, and the
  Marinade GitHub org.
- Want a suggested why plus the technical hooks, then we discuss.

**Closing: "Stake it till you make it"**

Replaces "Thank you". Attribution was checked on 2026-08-15 and **none is needed**:

- The base idiom *"fake it till you make it"* is generic English, decades old, from self-help and
  recovery contexts. Nobody owns it.
- *"Stake it till you make it"* is the obvious pun and is used widely and independently. The
  most notable public use found is an **SEC Commissioner statement, May 2025**, titled
  "Response to Staff Statement on Protocol Staking Activities: Stake it Till You Make It?".
- **No connection to Staking Facilities was found.** Searched specifically for it; nothing links
  the phrase to them or to any Solana team as a signature slogan. The hunch does not hold up.

So it is a common pun, not anyone's mark, and safe to use with no credit line. If you want to be
generous anyway, the SEC use is the only citable one and it is an odd fit for a closing slide.

The `<span class="accent">make</span>` puts the one PT Serif italic word on "make".

**Closing (original plan)**

- Keep the "Solana to the moon" slide from
  `marinade-auction-presentation/slides/index.html#/19`. The font needs fixing.

### Research status for the plan above

| Topic | State | Where |
|---|---|---|
| Delinquent stake use case | Done and reviewed, accepted 2026-08-12. **Not in this deck**, see "Saved for another talk" | `research/liquid-staking-delinquent-stake.md` |
| Canonical stake use case | Done, open questions listed. **Not in this deck**, see "Saved for another talk" | `research/liquid-staking-canonical-stake.md` |
| Native staking undelegation, revoke, queues | Done | `research/native-staking-undelegation.md` |
| Product list and shout-outs for the agenda slide | Done | `research/products-and-positioning.md` |
| Company positioning for the Marinade slide | Done | `research/products-and-positioning.md` |
| Instant Unstake, product-level mechanics | Done, code research still pending | `research/products-and-positioning.md` |
| Marinade program vs SPL stake pool vs single pool | Done, includes a standard-user view | `research/liquid-staking-vs-spl-stake-pool.md` |
| Competitors: Jito, Helius, Sanctum | Done | `research/competitors-jito-helius-sanctum.md` |
| Articles on stake account count and performance | Not found yet | |
| `marinade-web` summary: Select, Recipes, strategies | Not started | |
| Instant Unstake, from `unstake-taker-client` outward | Not started | |

Slides 1 to 5 are sketched in `deck.md` and render clean. Everything from the "A product"
separator onward is still the old skeleton.

### "Who talks to you" slide, settled 2026-08-15

Name and handle now lead the block: **Ondra Chaloupka @_chalda**, set at H3 beside the helmet
avatar. It was missing entirely, which is a bad thing for an intro slide to be missing.

Four points, in order:

1. **Backend developer** at [Marinade](https://marinade.finance). Highlighted, with Marinade and
   Solana marks.
2. Before that, [Java engineer](https://jbossts.blogspot.com/2018/01/narayana-periodic-recovery-of-xa.html)
   at Red Hat, with the Red Hat mark.
3. Came for distributed systems, [stayed for Solana](https://blog.chalda.cz/).
4. Contributor to Realms, and author of its
   [SPL Governance deep dive](https://docs.realms.today/developer-resources/spl-governance),
   with the Realms mark.

The handle links to https://x.com/_chalda.

**On point 3.** The original read "Distributed systems are my thing", and that was dropped as an
overclaim: the interest predates Marinade and is not currently backed by work or side projects,
and a room of engineers can smell that. The past-tense arc is the honest version and it does more
work, because it explains how the speaker got to Solana instead of just asserting a taste. It
sits directly under the Red Hat line, where the Narayana recovery post is the evidence for it.

**Dropped:** "These days, building mostly with AI" was tried as a closing bullet and cut as
filler.

**Link styling.** Bio links keep the body colour and carry a thin teal rule underneath rather
than taking the default light-teal link colour. With the role and the handle already accented,
coloured links would have put four teal fragments on one line.

Rejected earlier, for the record:

- **SPL Governance Deep Dive** as its own bullet. Real, but folded *into* the Realms line. It was
  written for a DAO conference audience and this is not one.
- **Vote Aggregator plugin.** Out completely. Private project, since decommissioned.

### Recommended structure: follow one SOL (superseded 2026-08-12, kept for its material)

Single narrative thread. A user stakes 1 SOL, and we follow it through every layer.
This beats a layered "here are our programs, here are our services" tour, because the mixed
audience gets a story instead of an inventory, and every component appears when it is needed.

Draft timing for a 25 minute slot (20 content, 5 Q&A):

| # | Segment | Min | Content |
|---|---|---|---|
| 1 | Hook | 2 | Trivia question: who deployed the first liquid staking program on Solana mainnet? Answer: Marinade, 2021, out of the Solana x Serum DeFi hackathon. Sets credibility without a company-history slide, and the hackathon origin lands well at a summit that runs its own Demo Day. |
| 2 | The click | 1 | The user experience. One button. Then: what actually has to happen. |
| 3 | Two shapes of staking | 2 | Native (self-custodial, stake account stays yours) vs Liquid (mSOL). Same delegation brain underneath. |
| 4 | Where does the stake go? | 4 | SAM, the Stake Auction Marketplace. Validators bid, auction clears once per epoch, last-price mechanics. The core "why" of the whole stack. |
| 5 | What if the validator misbehaves? | 3 | Validator Bonds as on-chain escrow. PSR: the bond absorbs the loss. Merkle-tree settlements once per epoch. |
| 6 | Getting out | 2 | Instant Unstake. An RFQ auction against liquidity providers, no liquid-token conversion. |
| 7 | The unglamorous half | 4 | The off-chain stack: tx-router, snapshot parsing, ETL, the settlement pipeline, ArgoCD/K3s. The part nobody puts in a pitch deck. |
| 8 | What I would tell a builder | 1.5 | Two or three transferable lessons. See "Takeaways". |
| 9 | Close + links | 0.5 | QR code to repos and docs. |

Section 7 is the differentiator. Every staking talk covers 3–6. Almost nobody shows the
epoch-cadence machinery, and this audience has a Rust Summit next door, so they will want it.

### Alternative structures considered

- **Layered tour** (programs / backend / data / infra). Encyclopedic, easier to write,
  worse to listen to. Rejected unless the slot changes.
- **Problem-driven** (four hard problems and their solutions). Strong, but overlaps the
  narrative version. Its best parts are folded into sections 4–7 above.

### Candidate deep-dive moments (pick two, not five)

Each of these is a "slow down and show the real thing" beat. Two fit in 20 minutes.

| Candidate | Why it lands | Risk |
|---|---|---|
| **Last-price auction clearing** | Genuinely interesting mechanism design, one diagram | Needs care for a non-technical half of the room |
| **Merkle settlement per epoch** | Concrete, visual, explains PSR enforcement | Can get deep fast |
| **Snapshot parsing at epoch boundary** | Rust, big data, very "Solana infra" | Niche |
| **tx-router: one API prepares every staking transaction** | Practical, reusable idea for builders | Less dramatic |
| **Instant Unstake RFQ auction** | Second auction in the stack, nice symmetry with SAM | Overlaps section 4 |

Current lean: **last-price auction** plus **the epoch pipeline** (settlements + snapshots
compressed into one diagram).

### Takeaways for builders (draft)

1. Put the decision logic off-chain, put the enforcement on-chain. SAM computes off-chain and
   settles through merkle proofs, because a per-epoch auction over hundreds of validators
   does not belong in a program.
2. The epoch is the heartbeat. Almost every service in the stack is scheduled by it.
3. Bonds turn a promise into a number. Slashing conditions are easier to reason about when
   the collateral is an account you can read.

### Reusable material from the previous deck

`../../../marinade-auction-presentation/` (January 2026, DS SAM deep dive).

Directly reusable:
- Product table (Liquid / Native / Select / Recipes with token, SAM participation, contracts).
- Last-price auction explanation slides.
- `images/delegation-strategy.excalidraw` and its SVG export. Diagrams were made in
  https://excalidraw.com/.
- Cover slide construction and the dark styling that this deck extends.

Needs rework:
- It is a deep dive for a SAM-literate audience. This talk is broader and shallower.
- Uses the older `#6b8a9c` link color, not a brand token.
- Product framing predates the Earn / Borrow platform positioning.

## Brand voice rules to follow in slide copy

Copied from the brand skill because these are easy to violate while writing slides.

- No exclamation marks. Anywhere.
- No em-dashes. Use a period, comma, or colon.
- Sentence case. ALL CAPS only for acronyms (SOL, APY, MEV, TVL, SAM, PSR, MNDE, mSOL).
- Expand acronyms on first use: "Stake Auction Marketplace (SAM)".
- Number first, context second. "$2.1B in TVL across 100+ validators."
- No banned superlatives: best-in-market, industry-leading, next-gen, revolutionary.
- No banned verbs: unlock, supercharge.
- No "we are excited to" throat-clearing.
- Product names keep their casing: Marinade Native, Marinade Liquid, Marinade Select,
  Marinade Max Yield, USDC Vault, Marinade Borrow.
- Do not call Marinade "a staking protocol". Current positioning is a multi-product platform:
  Earn (Native, Liquid, USDC Vault) and Borrow (Marinade Borrow, early access).

## Slide drafts

Drafts land here before moving to `slides/deck.md`. Keep them in reveal markdown syntax.

### Cover

```markdown
<!-- .slide: data-background="images/brand-backgrounds/deep-teal-solid.png" -->

# [title TBD]

## Building staking infrastructure on Solana

<span class="note">Ondra Chaloupka · Solana Summit Serbia · Belgrade, 26 August 2026</span>
```

### Hook: trivia

```markdown
<span class="label">Warm-up</span>

## Who deployed the first liquid staking program on Solana mainnet?

<div class="columns">
<div class="card">Jito</div>
<div class="card">Lido</div>
<div class="card">Marinade</div>
<div class="card">0xPr0phet</div>
</div>

Note:
Answer: Marinade, 2021. Do not dwell. One beat, then move to the click.
```

### Statement slide pattern

```markdown
<span class="label">The point</span>

## Staking one SOL is a click.
## Deciding where it goes is a system.
```

### Metric pattern

```markdown
<div class="metric">$2.1B</div>
<div class="metric-label">Total value locked</div>
```

_Numbers above are placeholders. Pull live figures before the talk._

## Confidentiality check

This repo is public: https://github.com/ochaloup/ochaloup.github.io

Much of the stack detail available to me comes from `marinade-finance/internal-docs`,
which is a private repo, and several of its pages carry an "AI generated, no review" banner.

**Before any of the following goes on a slide, confirm it is public and correct:**

- Service counts and the internal services catalog.
- Infrastructure specifics: K3s on OVH Proxmox, ArgoCD, Buildkite, AWS ECR, Kustomize.
- Any TVL, APY, or validator-count figure. Use the public sources listed below and cite them.
- Unreleased or early-access products.

Public repos under https://github.com/marinade-finance are safe to name and link.

## Saved for another talk

Material that is researched, written up, and deliberately **not** in this deck. Decided 2026-08-18:
the two war stories do not fit a 20 minute product tour for a mixed audience. Both are debugging
stories about one program, they need setup the tour never provides, and neither answers a question
the tour raises. They are the spine of a different talk, not an appendix to this one.

The natural home is a developer-audience session, something like *five years of running an LST while
the chain changes underneath you*. A Rust Summit or a Solana developer meetup, not a summit main
stage.

**War story 1: delinquent stake.** `research/liquid-staking-delinquent-stake.md`, reviewed and
accepted. Solana shipped `DeactivateDelinquent`, permissionless and needing no stake-authority
signature. A third party could flip a Marinade-owned account to deactivating while Marinade's own
mirror of the state still said active, so `UpdateDeactivated` subtracted from a bucket the stake was
never in, underflowed, and stranded the SOL. Nothing was stolen and it was not a break: the state
machine refused a transition it had no rule for, which is exactly why the money got stuck. Fixed with
a detector plus a resumable two-phase migration that ends on
`require_eq!(delinquent_balance_left, 0)`.

The lesson, and the reason it deserves its own talk: **protecting correctness and protecting liveness
are different jobs**, and a state machine that is right can still strand funds.

**War story 2: canonical stake accounts.** `research/liquid-staking-canonical-stake.md`. One stake
account per validator at a PDA derived from `[MLIQUID_STATE, validator_vote, b"canonical_stake"]`, so
the address *is* the information: choosing what to unstake becomes a local derivation instead of an
RPC round trip per candidate. The motivation is being a good neighbour. Marinade is big enough that
account count is its own responsibility, not a nice-to-have.

Both notes carry their own sources and open questions, so neither needs re-researching. The open
verification for the second one is whether canonical stake is live yet: `tx-router` still has the
fallback path.

Punchlines already written for these, in `PUNCHLINES.md` under "On the appendix war stories", stay
there for the same reason. Do not delete them.

## Links

### Marinade, public

- [marinade.finance](https://marinade.finance)
- [docs.marinade.finance](https://docs.marinade.finance)
- [SAM in the docs](https://docs.marinade.finance/marinade-protocol/protocol-overview/stake-auction-market)
- [ds-sam](https://github.com/marinade-finance/ds-sam) and its [blog-post.md](https://github.com/marinade-finance/ds-sam/blob/main/blog-post.md) — auction implementation and writeup
- [ds-sam-pipeline](https://github.com/marinade-finance/ds-sam-pipeline) — the per-epoch auction run
- [validator-bonds](https://github.com/marinade-finance/validator-bonds) — bonds program, settlements, merkle trees
- [liquid-staking-program](https://github.com/marinade-finance/liquid-staking-program) — mSOL
- [tx-router](https://github.com/marinade-finance/tx-router) — single API for staking transactions
- [how-to-native-staking](https://github.com/marinade-finance/how-to-native-staking) — native staking how-to
- [marinade-ts-sdk](https://github.com/marinade-finance/marinade-ts-sdk)
- [marinade-ts-cli](https://github.com/marinade-finance/marinade-ts-cli)
- [solana-snapshot-parser](https://github.com/marinade-finance/solana-snapshot-parser)
- [distributor](https://github.com/marinade-finance/distributor) — merkle distributor
- [ops-infra](https://github.com/marinade-finance/ops-infra) — ArgoCD and Kustomize manifests

### Event

- [Solana Summit Serbia on Luma](https://luma.com/solana-summit-serbia)
- [solanasummit.rs](https://solanasummit.rs/)
- [Belgrade Blockchain Week](https://belgradeblockchainweek.com/)
- [Superteam Balkan announcement](https://x.com/SuperteamBLKN/status/2075857954524303515)
- [beincrypto coverage](https://beincrypto.com/belgrade-to-host-solana-summit-serbia/)

### Tooling

- [reveal.js markdown docs](https://revealjs.com/markdown/)
- [reveal.js PDF export](https://revealjs.com/pdf-export/)
- [excalidraw](https://excalidraw.com/) — diagrams in the previous deck
- [Lucide icons](https://lucide.dev/) — the icon set the brand guide specifies

### Internal (not for slides, context only)

- `marinade-finance/internal-docs` — brand skills, product portfolio, services catalog
- `../../../marinade-auction-presentation/` — the January 2026 DS SAM deck
- [../solana-blockchain-trivia.md](../solana-blockchain-trivia.md) — 10 trivia questions, Q1 is the hook

## Open questions

Ordered by how much they block the next step.

1. **Title.** Keep "The Marinade Recipe" despite the product-name collision and the retired
   food metaphor, or switch? This gates the cover slide and the abstract.
2. **Which two deep dives?** Current lean is last-price auction plus the epoch pipeline.
3. **How much infrastructure detail is publicly sayable?** Section 7 is the most differentiated
   part of the talk and also the part most likely to need clearance.
4. **Live demo or not?** A CLI or explorer walkthrough is memorable but eats 3 minutes and
   depends on conference wifi. Recommendation: pre-recorded gif or screenshots instead.
5. **Trivia opener: one question or a short run?** One question costs 2 minutes.
   Three questions cost 5 and would force cutting a deep dive.
6. **Talk slot?** Day 1 or day 2, and which track, affects how much Solana context to assume.
7. **Do we mention Marinade Borrow and USDC Vault?** They are the current platform positioning
   but they are not staking infrastructure. Probably one sentence in the framing, nothing more.
8. **Dark deck or guide-faithful white?** The cookbook wants white-dominant with dark reserved
   for covers and section breaks. The deck is currently dark throughout. The theme supports
   both, so this is a per-slide decision rather than a rebuild. One middle option: keep dark
   for cover, section breaks, and statements, and flip the content slides to `light`.

## Decision log

- 2026-08-06 — reveal.js 6.0.1 cloned into `slides/`, `.git` removed. Markdown-driven deck
  via external `deck.md`.
- 2026-08-06 — Dark deck kept, recolored to Marinade brand tokens in `theme/marinade-dark.css`.
- 2026-08-06 — Event confirmed: Solana Summit Serbia, Sava Centar Belgrade, 26–27 August 2026.
- 2026-08-06 — Title flagged for change. "Recipes" collides with a live Marinade product and
  the food metaphor is retired brand vocabulary. Abstract already went to the organizers,
  so a rename means asking them. Parked until the content is written, then revisit.
  `deck.md` carries *Staking is the easy part* as a placeholder.
- 2026-08-06 — Theme rebuilt against the cookbook: 1920x1080 canvas, point-based type scale,
  12-column margins, archetype classes, semantic tokens so `light` slides are one attribute
  away. `marinade-dark.css` renamed to `marinade.css` since it now drives both surfaces.
- 2026-08-06 — `deck.md` filled with the 20-slide skeleton from the outline. Content is
  placeholder, marked `[TODO]`, structure and styling are real.
- 2026-08-06 — Fonts self-hosted into `slides/fonts/`. The Google Fonts `@import` is gone and
  the deck runs with no network at all.
- 2026-08-12 — Design pass. The deck was diagnosed as flat: every content slide left its
  bottom half empty, all 20 slides shared one background, cards at 4% white would have
  disappeared on a projector, and nothing on a content slide identified the talk. Fixes: the
  journey rail, gradient backgrounds, `.slide-body` centring, card contrast raised to teal
  at 10% fill and 45% border, slide counter removed, canvas margin zeroed.
- 2026-08-12 — Brand artwork sourced from marinade.finance video posters. Cover, closing, and
  three section breaks now carry painterly illustrations under a teal scrim. Verified all 20
  slides render with no overflow and no console errors.
- 2026-08-18 — Slot cut to 20 minutes, confirmed. Timing budget added above. Order of work
  unchanged: finish Instant unstake, the Native strategies slide, the appendix and the QR code
  first, then cut against the budget.
- 2026-08-18 — Instant unstake grew to three content slides, I1 to I3. The section's engineering
  detail stays spoken, because its source repositories are private and this repo is not.
- 2026-08-18 — N2 gained the `StakeStateV2` enum as a frame above `Authorized`, and lost the `Meta`
  block to pay for it. Two code blocks is the hard ceiling, see quirk 3 above.
- 2026-08-18 — Native section break folded into N1. Deck is 21 slides, verified headless at
  1600x900: no overflow, no console errors, only the known favicon 404.
- 2026-08-18 — The `stamp` replaced both remaining product break slides. Liquid's break folded into
  L1, which is retitled *You all know what liquid staking is*. Coral, drawn here, palette-legal.
- 2026-08-18 — N2 rebuilt as three boxes: the enum, the whole account as a field tree, then
  `Authorized`. Needed `code-sm` at 23px, and `pre` now refuses to shrink so a too-tall code slide
  fails visibly instead of clipping its own braces.
- 2026-08-18 — Native strategies slide built as *Three ways to run it*. Recipes described by payout
  rail only, per the standing constraint.
- 2026-08-18 — QR code generated offline and placed on the closing slide. Needs one scan test.
- 2026-08-18 — Liquid's stamp reverted to a plain `label`, and Native's stamp moved under the
  headline. Both on Ondra's call.
- 2026-08-18 — `Authorized` on N2 set one size up, 26px against the 23px anatomy above it, and the
  code blocks on that slide left aligned instead of centred.
- 2026-08-18 — Keys and strategies slides swapped, handoff questions rewritten to match.
- 2026-08-18 — Instant unstake break folded into I1 with a plain `label`. Deck is 20 slides.
- 2026-08-18 — N2 context blocks dropped to 21px, and the body now reserves the footnote band, see
  quirk 3. Gaps then measured and rebalanced: 108px of reserved band gives 38px under the heading and
  55px above the footnote, in canvas pixels. The terminology label was tried and removed on Ondra's
  call, after checking that solana.com/staking does not use "delegated proof-of-stake".
- 2026-08-18 — N2 gained the coin picture on its right via `side-art`, duotoned into the palette. The
  long `// the two keys...` comment came off the `Authorized` block to make the room: it repeated the
  footnote and was what made that block 1322px wide.
- 2026-08-18 — "Everyone waits" statement slide cut, its line moved into I2's speaker notes. Deck is
  19 slides, verified headless: no overflow, no errors.
- 2026-08-19 — `tools/talk-track.py` and the generated `TALK-TRACK.md` added, so the speaker notes can
  be read as one document and the question chain can be reviewed as a table.
- 2026-08-19 — "Four years on one chain" corrected to five, Ondra's catch. 2021 to 2026. Also fixed in
  `PUNCHLINES.md` and in the war-story talk title above.
- 2026-08-19 — Recipes reframed as DCA on the strategies card and in its notes, no separate slide.
  The Instant unstake technical script and the auction vocabulary went into the private `$K` note,
  since both are derived from private repositories.
- 2026-08-19 — Introduction block built: Marinade slide, "What is staking", and the stake-weighted
  slots diagram. Agenda gained a fourth line and the cover subtitle gained "introductory tour". Deck
  is 22 slides, verified headless: no overflow, no errors.
- 2026-08-18 — I2 cards rewritten to You get / They get / The gap, and the "everyone waits" line
  deleted from the speaker notes as well as the deck.
- 2026-08-18 — Agenda list anchored under the heading with `anchor-top`, and the chef hat back up to
  216px. Optical centring is right for cards and diagrams and wrong for a list you read top down: the
  gap under the title read as a mistake.
- 2026-08-18 — The two war stories are out of this deck for good, not parked in an appendix. They are
  a different talk for a developer audience, written up under "Saved for another talk". N3 stays for
  now, so the deck runs slightly long on purpose.
- 2026-08-18 — The two `epoch` labels on the state ring set bold, Ondra's call. They are the cost of
  the cycle, so they carry the weight.
- 2026-08-18 — N4 rebuilt as the exit funnel, a drawn many-to-one diagram, replacing the four-step
  strip. Three `.steps` diagrams in the deck read as one long diagram, and the merge is the argument.

## Conversation notes

Running notes from planning discussions get appended here.

### 2026-08-06

- Scaffolding session. Structure, theme, and this document created.
- Content discussion started. Structure proposed, deep dives not yet chosen.
