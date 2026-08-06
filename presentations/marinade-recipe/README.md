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
| **Duration** | 25 minutes |
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
- **Marinade Recipes** — third Native strategy. One Marinade validator, rewards swapped and
  paid out in another token (USDG today) via merkle drop.
- **Protected Staking Rewards (PSR)** — the validator's bond absorbs the loss if they
  underperform or raise fees.
- **Validator Bonds** — the on-chain escrow backing SAM bids and PSR coverage.
- **Instant Unstake** — RFQ auction against liquidity providers. Exit without converting
  to a liquid token.
- **USDC Vault** — USDC yield routed through Kamino. Earn pillar, not staking.
- **Marinade Borrow** — stablecoin loans against staked SOL. Early access, not live.

## Repo layout

```
marinade-recipe/
  README.md          <- this file: context, ideas, links, slide drafts
  slides/            <- reveal.js 6.0.1, shallow clone, .git removed
    deck.md          <- the actual slide content, markdown
    index.html       <- reveal bootstrap, loads deck.md
    theme/
      marinade-dark.css   <- Marinade brand overlay on the black theme
    images/
      marinade-white.svg  <- white hat, use this one on dark slides
      marinade.svg        <- dark hat, invisible on the dark background
      solana-logo.svg
      brand-backgrounds/  <- teal-gradient, deep-teal-solid, light-teal-solid
  resources/         <- downloaded articles, docs, references cited in slides
```

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

### Known deviations from the brand guide (deliberate, worth a sanity check)

1. **Dark is the default background here.** The slide-design skill says white is the dominant
   slide background and dark should be reserved for cover and section breaks. A fully dark deck
   is a deviation. Every color used is still from the palette. Flagging it because it is the one
   place this deck knowingly departs from the guide.
2. **Not matching the 16 archetypes exactly.** reveal.js is a different medium. Layouts stay
   close in spirit: one message per slide, low density, generous white space.

### Utility classes available in `theme/marinade-dark.css`

`.label` (teal category label above a statement), `.metric`, `.metric-label`, `.tag`,
`.accent` (PT Serif italic), `.note`, `.highlight`, `.card`, `.columns`, `.columns-3`,
`.step-num`, `.watermark`, `.text-sm`, `.text-xs`.

### Open styling TODOs

- [ ] **Self-host DM Sans and PT Serif.** The theme currently pulls them from Google Fonts.
      Conference wifi is unreliable. Download the woff2 files into `slides/fonts/` before the talk.
- [ ] Get the full Marinade wordmark. What we have is only the hat icon:
      `images/marinade.svg` (dark `#151A1A`), `images/marinade-white.svg` (white, generated
      by recoloring the dark one), and `images/marinade.png` (white hat, raster). The brand
      guide also expects a wordmark and an icon+text lockup for cover slides. Only the three
      background PNGs are bundled in the internal-docs skill, so the rest needs sourcing.
      Use `marinade-white.svg` on the dark slides, the dark one would be invisible.
- [ ] Decide on a Solana Summit / Superteam Balkan logo on the cover slide.

## Naming: "Recipe" is a problem

Two independent conflicts with the working title.

1. **`Recipes` is a real, live Marinade product.** It is the third Native Staking strategy
   next to MaxYield and Select. Stake goes to one Marinade validator, rewards are swapped and
   paid out in another token (USDG today) via a merkle drop. An audience that knows Marinade
   will expect a talk about that product.
2. **The food metaphor is retired brand vocabulary.** The brand guide explicitly bans
   "recipes", "kitchen", "chefs", "cooking up", "secret sauce" as narrative framing.
   Marinade is moving from DeFi-charm to fintech-clarity.

**First check whether renaming is even possible.** The original doc marked the title
_(locked in)_. If the abstract is already on solanasummit.rs or in the printed program,
the program line is fixed and the rest of this section applies to the deck only.

**Recommended, if the title is still open:**

> # Staking is the easy part
> ### Everything that happens after you click stake

Why this one:

- It states the thesis of the talk instead of labelling the topic. The whole deck argues
  that the stake instruction is trivial and the interesting engineering is everything around it.
- It works on both halves of a mixed room. A regulator understands it. A Rust developer
  hears a promise of depth.
- No product-name collision, no retired metaphor, sentence case, no superlatives.
- It survives being read out loud, and it gives the closing slide something to pay off.

Marinade is not in the title. Conference programs list speaker affiliation, so it shows up
anyway. If it must be explicit, swap the subtitle for *Inside Marinade's staking stack*.

**Fallbacks, in order:**

| Title | When to prefer it |
|---|---|
| *Inside Marinade: the stack behind Solana staking* | If a plain, zero-risk, descriptive line is wanted |
| *One SOL, end to end* | If the deck locks to the follow-one-SOL narrative and the program shows a description under the title |

**Rejected:**

- *What it takes to stake N million SOL.* Brand loves a number-first line, but a number in a
  title has to be current on the day, needs a public source, and dates the deck the moment it
  is reused. Keep numbers on slides where they can be updated.
- *Where does your stake actually go?* Good question, wrong venue. At a summit with other
  staking providers in the room, "actually" reads as a dig.

Decision still open. See "Open questions".

## Content

### Thesis (draft)

> Staking one SOL is a single click. Keeping that click honest, optimized, and reversible
> takes on-chain programs, an auction, a data pipeline, and a fleet of services running every epoch.

The one sentence to leave behind: **the interesting engineering in staking is not the stake
instruction, it is everything that decides where the stake goes and proves it stayed honest.**

### Recommended structure: follow one SOL

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

## Decision log

- 2026-08-06 — reveal.js 6.0.1 cloned into `slides/`, `.git` removed. Markdown-driven deck
  via external `deck.md`.
- 2026-08-06 — Dark deck kept, recolored to Marinade brand tokens in `theme/marinade-dark.css`.
- 2026-08-06 — Event confirmed: Solana Summit Serbia, Sava Centar Belgrade, 26–27 August 2026.
- 2026-08-06 — Title flagged for change. "Recipes" collides with a live Marinade product and
  the food metaphor is retired brand vocabulary. Not yet decided.

## Conversation notes

Running notes from planning discussions get appended here.

### 2026-08-06

- Scaffolding session. Structure, theme, and this document created.
- Content discussion started. Structure proposed, deep dives not yet chosen.
