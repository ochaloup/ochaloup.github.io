# Marinade as building blocks

Working document for a 20 minute talk: what Marinade is, where it came from, what it brings to Solana, and which of its products a builder can build on.
Context, decisions, sources and the slide plan live here. Slide copy is drafted here first, then moved into `slides/deck.md`.

## Brief (from Ondra, 2026-10-02)

- **Audience:** crypto people who know Solana, some building on it. Mixed roles: developers, founders, marketing, UX, frontend. Not all technical.
- **Length:** 20 minutes, about 15 slides.
- **Goal:** show what Marinade does so the room wants to build tooling around it, for it, or on top of it. Products are presented as building blocks.
- **Weight:** mostly Marinade, what it is, how it developed, what it brings to the ecosystem. Staking itself is a small part.
- **Four lines of what Marinade is:**
  1. **Staking:** the base layer.
  2. **DeFi:** what is built on top of staking.
  3. **Infrastructure and data:** marking validators, working with Solana, knowing the ecosystem, working with data.
  4. **DAO:** MNDE governance and what it needs. Realms has no good open-source UI, which is a gap a builder can fill.
- **Core line (Ondra's words):** "Staking is Solana's base yield layer, and Marinade routes it: mSOL as the liquid version, MNDE to manage the DAO, and public data on every validator. Pick whichever part you want to improve: DeFi integration, staking data and dashboards, or governance UX."
- **NFT era:** only one history slide. The NFT picture shows a bootstrapped DAO, nothing more.

## Repo layout

```
marinade-what-is/
  README.md     <- this file
  slides/       <- copy of ../marinade-staking-stack/slides (reveal.js 6, Marinade theme)
    deck.md     <- slide content, 16 slides, speaker notes under each
    index.html  <- reveal bootstrap, loads deck.md
  resources/    <- downloaded public sources: pages/, images/, README.md index
```

Running, PDF export and offline bundle work exactly as in `../marinade-staking-stack/README.md` ("Running the slides", "Packing the deck"). The live URL will be https://chalda.cz/presentations/marinade-what-is/slides/.

## Design: inherited from marinade-staking-stack

Same theme, fonts, palette, archetypes and reveal quirks. The rationale is in `../marinade-staking-stack/README.md`, section "Design system", and is not repeated here.

Changes made for this deck:

- `slides/index.html` title is "Marinade as building blocks: staking, DeFi, data and governance on Solana".
- **The journey rail becomes the building-blocks rail.** `RAILS.blocks` is `Staking, DeFi, Data, DAO`, lit with `data-stage="defi"` etc., or `data-stage="all"` on the summary. Same motif as the old deck, now carrying the four lines so the room always knows which block it is in.
- `export-pdf.mjs` writes `~/Downloads/marinade-building-blocks.pdf`. `bundle.mjs` writes `~/Downloads/marinade-building-blocks/`, so it never overwrites the staking-stack bundle.
- Exports carry no speaker notes. Do not use `--notes`.

- `theme/marinade.css` gains `grid-4`, four equal cards, for the map slide.
- Anchor-top was dropped from the statement, timeline and metrics slides: the content now centres instead of leaving the bottom half empty.
- Staking-stack-only images were removed from `slides/images`.

Brand art per block, so each block opens on its own painting under the scrim:

| File | Source | Used on |
|---|---|---|
| `brand-art/p-liquidity.jpg` | marinade.finance video poster (from staking-stack) | Cover, closing |
| `brand-art/p-rewards.jpg` | same | Block 1, "Two ways in" |
| `brand-art/s-slicing.jpg` | marinade.finance site art, chefs at a cutting board, resized to 1600px | Block 2, DeFi |
| `brand-art/s-ledger.jpg` | site art, chef hat and flying papers, resized | Block 3, data |
| `brand-art/p-manage.jpg` | video poster (from staking-stack) | Block 4, DAO |
| `brand-art/s-hat.jpg` | site art, floating chef hat over coins, resized | "Pick your block" |
| `octopus-voting.jpg` | `marinade-dao-knowledgeshare` governance art, 900px JPEG | "A bootstrapped DAO" |

## Rules for slide copy

Brand voice, from `marinade-finance/internal-docs` skills `marinade-brand` and `marinade-content-writing` (private, context only):

- Never call Marinade "a staking protocol". It is a platform that puts onchain assets to work, self-custodial, no lockups.
- "The original Solana LST" is fine as a fact, not as a tagline.
- No exclamation marks, no em-dashes. Sentence case. Expand acronyms on first use.
- No kitchen metaphors in words: chefs, kitchen, cooking up, secret sauce. Brand art with chefs is fine as pictures. "Marinade Recipes" stays as a product name.
- Banned words: unlock, supercharge, trustless, top-tier, best-in-market, world-class, industry-leading, next-gen, revolutionary, battle-tested, OG.
- No promised APY. "Stakers", not "investors". No competitor named as weak, no competitor logos.
- Product casing: Marinade Liquid, Marinade Native, Marinade Select, Marinade Max Yield, Marinade Recipes, Marinade Borrow, USDC Vault, mSOL, MNDE.
- Marinade Labs is the company, Marinade is the protocol, Marinade DAO is governance.

Confidentiality, because this repo is public:

- Nothing from internal docs or Notion goes on a slide unless it is also public. Every fact below is tagged with its public source.
- Never mention or imply Marinade runs its own validator. Three downloaded pages said so for Recipes and were deleted. The topic stays out entirely.
- Internal-only and excluded: the 2026 BHAG and strategy bets, revenue targets, "Spend" pillar (not shipping), competitive framing about other LSTs overtaking, layoffs and bear-market details, any unannounced product date.

## Story spine

1. **Cover.**
2. **Who talks to you.** Reuse the bio slide from the staking-stack deck.
3. **Marinade in one line.** "Staking is Solana's base yield layer. Marinade routes it." The four blocks shown once, as the map of the talk.
4. **Where it came from.** Timeline 2021 to 2026, one line per year.
5. **A bootstrapped DAO.** One picture, the MNDE crab and octopus NFT infographic. Funds raised $0, fair launch, governed by holders.
6. **What it brings to Solana.** Stake spread over 100+ validators with concentration caps, open-source delegation strategy, public data, numbers.
7. **Staking in one slide.** Why staking matters: security, three reward sources, stake account authorities. Kept short on purpose.
8. **Block 1, staking.** Marinade Liquid (mSOL) and Marinade Native: two ways stake enters.
9. **Block 1, staking.** SAM, Validator Bonds, PSR: validators bid, bonds back the promise.
10. **Block 1, staking.** Instant Unstake: exit as an RFQ to market makers.
11. **Block 2, DeFi.** mSOL as a DeFi primitive, plus Borrow, Recipes, USDC Vault.
12. **Block 3, data.** Public data on every validator: APIs, dashboards, scoring.
13. **Block 3, infrastructure.** Knowing the ecosystem: marking validators, blacklist for commission rugs and sandwich MEV, working with Solana core teams.
14. **Block 4, DAO.** MNDE governance on Realms, SPL Governance, the tooling gaps.
15. **Pick your block.** DeFi integration, staking data and dashboards, governance UX.
16. **Closing.** "Build on top", links and QR.

Slides 8 to 14 carry the building-blocks rail.

## History, with sources

Public source for every line. `B/` means `https://marinade.finance/blog/`. Saved copies are in `resources/pages/`.

| When | What | Source |
|---|---|---|
| Mar 2021 | Solana x Serum hackathon, 3rd place with a liquid staking prototype | B/the-first-liquid-staking-solution-on-solana |
| 28 Apr 2021 | Merge with the Smart Pool team | B/stronger-together |
| 2 Aug 2021 | Mainnet, first liquid staking on Solana. 100k SOL cap filled in 2.5 days | B/what-a-launch |
| Aug–Sep 2021 | Audits by Ackee and Kudelski, Neodyme review before. Program behind a 6/11 multisig | B/why-we-take-it-slow-security-first |
| 7 Oct 2021 | MNDE fair launch, no sale, no investors | B/mnde-launch-serving-the-tastiest-token |
| 4 Apr 2022 | Onchain DAO governance on Tribeca with Chef NFTs, lock MNDE to vote | B/marinade-announces-the-launch-of-on-chain-dao-governance-thru-nfts |
| Nov 2022 | Shark NFTs. FTX: Alameda, Serum and Saber replaced as multisig signers, no treasury exposure | B/meet-the-sharks, B/state-of-marinade-in-the-wake-of-ftx-alameda |
| Jul 2023 | Governance moves to Realms. 19 Jul: Marinade Native launches | docs …/the-mnde-token, B/marinade-native-rapid-growth |
| Apr 2024 | Protected Staking Rewards (PSR) live | docs …/protected-staking-rewards |
| 14 Aug 2024 | Stake Auction Marketplace (SAM) live | B/phase-2-of-marinades-stake-auction-marketplace-sam |
| 2025 | Select (21 May), SOC 2 Type II (23 Jul), Instant Unstake with Anza (27 Oct), Canary Marinade Solana ETF (17 Nov) | B/marinade-select-…, B/marinade-is-soc-2-type-2-certified, B/instant-unstake-…, B/introducing-solc-… |
| 2026 | USDC Vault (24 Mar), Anchorage (23 Apr), first step to Borrow (7 May) | B/earn-up-to-6-apy-on-usdc-…, B/institutional-solana-staking-…, B/a-first-step-toward-marinade-borrow |

Conflicts between sources, settle before quoting:

- MNDE launch: blog says 7 Oct 2021, `marinade.finance/mnde` says November 2021. Use October, the blog post is dated.
- PSR coverage: docs say 0–99% since MIP-23, product pages still say 50–99%. Use the docs.
- Marinade Select: docs say not open for new stake, the site still markets it. Ask before presenting it as open.
- Borrow: the blog calls it a read-only first step, docs say live for everyone. Check on the day.
- Validator count: 100+ on the site, other figures vary. Use "100+".

## Numbers

Retrieved 2026-10-01 from the DefiLlama API and the homepage. Refresh before the talk.

- TVL 7.70M SOL, about $908M. Liquid 2.30M, Native 3.72M, Select 1.68M.
- Peak TVL $2.51B on 13 Sep 2025.
- "150K+ total holders" and "Funds raised $0" on the homepage.
- MNDE: 1B minted, 300M burned by MIP-14, about 700M left.
- "6 audits and 1 code review", latest Neodyme May 2026.

## What Marinade cares about

Public phrasing, usable on slides:

- "A stake automation platform that helps you maximize SOL staking rewards while supporting the decentralization and performance of the Solana network." (docs)
- "Founded as a public good", open source, "collaboration over competition".
- DAO goals since 2022: "Decentralize Solana" and "Decentralize Marinade".
- Values: Adaptable, Approachable & Honest, Responsible (docs, marinade-dao page).
- Self-custody: with Native the staker keeps withdraw authority, Marinade holds only stake authority.
- Concentration caps in SAM: 15% of TVL per validator, 30% per hosting provider, 40% per country.

## Builder surface

What a builder can use today, checked on 2026-10-02: APIs answered `curl` without auth, repos are public by `gh api`, packages exist on npm. OpenAPI specs are saved in `resources/pages/api-*`.

| Block | Item | Where |
|---|---|---|
| Staking | mSOL SDK and CLI | npm `@marinade.finance/marinade-ts-sdk`, `marinade-ts-cli` |
| Staking | Native SDK, Native API | npm `@marinade.finance/native-staking-sdk`, native-staking.marinade.finance/docs |
| Staking | Anchor IDLs: Liquid, Native Proxy, Validator Bonds, Directed Stake | docs.marinade.finance/developers/anchor-idl |
| Staking | Validator bonds CLI and SDK, Bonds API | npm `validator-bonds-*`, validator-bonds-api.marinade.finance/docs |
| Staking | SAM logic and every epoch's auction data | github `ds-sam`, `ds-sam-pipeline`, npm `@marinade.finance/ds-sam-sdk` |
| DeFi | Recipes runs, Recipes APY | recipes-api.marinade.finance, apy.marinade.finance/docs |
| DeFi | Borrow, USDC Vault | docs only, no public SDK or API |
| Data | Validators API, about 30 routes | validators-api.marinade.finance/docs |
| Data | Scoring API | scoring.marinade.finance/docs.json |
| Data | APY API, Stats API, Snapshots API | apy., api., snapshots-api.marinade.finance/docs |
| Data | Dashboards | psr., stats., select.marinade.finance, app.marinade.finance/network/validators |
| DAO | Marinade DAO on Realms: SPL Governance, VSR, veMNDE, council of 5 | app.realms.today/dao/MNDE, app.marinade.finance/governance |
| DAO | Forks and plugins | github `voter-stake-registry` (archived), `vote-aggregator` (not audited), `spl-gov-notifier`, `multisig` |

Gaps worth naming on stage, each grounded in what the research saw:

- **Staking:** no maintained Rust client crate. `marinade-sdk` is archived, and the IDLs are public.
- **DeFi:** a yield comparator across mSOL venues. A Recipes payout and tax ledger. A tracker that finds every Native position, because filtering by one stake authority misses Select and Recipes.
- **Data:** validator comparison pages, widgets, bots and bond health alerts on the open APIs.
- **DAO:** the open-source Realms UI (Mythic-Project/governance-ui) has been idle since February 2026. A veMNDE voting-power viewer, an audited vote aggregator, proposal notifications for any Realm.

Kept off the slides:

- The referral program, paused since 8 May 2026.
- The unstake API: it answers publicly, but it is undocumented and its repo is private.
- The native-staking repo is private, even though the docs link it. Point at the npm package only.
- The Recipes doc mentions a "dedicated validator". Never quote it.

## Sources

- Public: marinade.finance, docs.marinade.finance, marinade.finance/blog, DefiLlama API, solana.com docs. Index of saved copies: `resources/README.md`.
- Private, context only, never on slides: `marinade-finance/internal-docs` (brand skills, `org/strategy/story-beats.md`, `org/strategy/2021-2026-history.md`), Notion ("Marinade V2 2.0 article", "Marinade Values", "Grayscale ETF - Deck", "Notes for Milk Road feature", "2025 Solana Staking Report").
- Reused: `../marinade-staking-stack/` (theme, intro slides, analogies), `marinade-dao-knowledgeshare/slides/images/octopus-voting.png` (NFT governance infographic).
- Not readable: Medium and Messari (Cloudflare), X posts (login), Slack all-hands recaps.

## Decision log

- **2026-10-02** Slides copied from marinade-staking-stack to reuse the look unchanged.
- **2026-10-02** Spine is "Marinade first, staking small, products as building blocks", per Ondra. A "why staking first" spine was proposed and rejected.
- **2026-10-02** NFT era gets one slide, a picture for "bootstrapped DAO".
- **2026-10-02** Journey rail repurposed as the four-block rail.
- **2026-10-02** Brand book PDF (23 MB) not kept in `resources/`, URL recorded instead.
- **2026-10-02** First `deck.md` written, 16 slides, following the spine above. Rendered headless at 1600x900: no overflow, no failed requests.
- **2026-10-02** The bootstrapped DAO slide says "Funds raised: $0", the homepage's own wording, rather than "grants, not VC", which the staking-stack deck flagged as possibly aged.
- **2026-10-02** Closing title "Build on top", PT Serif on "top". It replaces "Stake it till you make it", because this talk asks for builders, not stakers.
