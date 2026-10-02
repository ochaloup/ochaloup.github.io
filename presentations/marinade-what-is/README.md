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
    deck.md     <- slide content, speaker notes under each slide
    images/illo <- press-kit line drawings, recoloured into the palette
    index.html  <- reveal bootstrap, loads deck.md
  resources/    <- downloaded public sources: pages/, images/, README.md index
```

Running, PDF export and offline bundle work exactly as in `../marinade-staking-stack/README.md` ("Running the slides", "Packing the deck"). The live URL will be https://chalda.cz/presentations/marinade-what-is/slides/.

## Design: inherited from marinade-staking-stack

Same theme, fonts, palette, archetypes and reveal quirks. The rationale is in `../marinade-staking-stack/README.md`, section "Design system", and is not repeated here.

Changes made for this deck:

- `slides/index.html` title is "Marinade staking and the Solana ecosystem: building blocks for builders".
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

Three parts, reordered 2026-10-02 (second round): Marinade introduction, then the Solana staking space, then the building blocks.

**Part 1, Marinade**

1. **Cover.** "Marinade staking and the Solana ecosystem", subtitle "Building blocks for your next *build*".
2. **Who talks to you.** One bio line, plus the Build Station sidetrack callout with 🥳.
3. **Marinade: a bootstrapped DAO.** The octopus NFT picture, the MNDE crest bobbing beside it, "Funds raised: $0".
4. **Five years on one chain.** Timeline, a flipping Solana coin, product-mix bars that grow in.
5. **What Marinade brings to Solana.** Metrics, then four cards: spread stake, protected rewards, instant exit, a market for stake.

**Part 2, the Solana staking space** (numbers verified, see "Solana staking space" below)

6. **Section break, "Solana staking, *today*".**
   - Arc line: "Inflation pays less every year. Validators now compete for stake and for the block."
   - Four beats pop in: 3.6% inflation (8% at launch), Stake (won by sharing back), Ordering (the block is worth money), Data (RPC and streams pay too).
7. **Where the money goes.** Two same-scale bars: $487M to stakers (over 98% issuance) and $51.0M network revenue split three ways. No Marinade product on it. Foot: Blockworks.
8. **Who orders the block?** Transactions stream into three builder lanes (Jito BAM, Harmonic, Rakurai and others), then into the leader's block, where a sandwich pulses. Foot: the arXiv sandwich count.
9. **Clients, builders and what comes next.** Stake-share bar by client and builder (Syndica, Apr 2026), then three cards:
   - Bigger, faster blocks (100M CU, slots going from 400 ms to 200 ms).
   - Bigger transactions, cheaper accounts (4 KB transactions, rent heading to a tenth).
   - Alpenglow (votes no longer land onchain, about 150 ms finality, mainnet mid-October 2026 per Ondra).

**The arc, and why.** Validators are becoming a commodity. Inflation falls every year, delegation-program support shrank, and the break-even stake rose. So validators compete for stake by sharing revenue back, and for income beyond issuance: block ordering and MEV, priority fees, and data businesses that need stake for transaction landing. The three slides are the evidence, in that order: who gets paid, who orders, what changes.

Arc facts, all saved as `resources/pages/arc-*`:

- **Inflation:** 3.62% at epoch 1047 (mainnet RPC). SIMD-0550, which doubles disinflation, was voted on 28 Aug 2026 but is not active.
- **SFDP:** 11% to 5% of stake.
- **Break-even at 0% commission:** 24k SOL to 87k SOL.
- **Validator count:** about 2,500 (2023) to under 800 (The Block, Jan 2026).
- **0% commission:** 30.4% of stake (RPC, 2 Oct 2026).
- **Upgrades:**
  - v1 transactions: 4,096 bytes, up from 1,232, active 15 Sep 2026.
  - Rent: 6,960 to 696 lamports per byte in five steps. Two are live, the rest waits for Agave 4.4 (Nov 2026).
  - Slots: 300 ms, live 25 Sep 2026.
  - Alpenglow: testnet 24 Sep, devnet 25 Sep. Mainnet gate not queued, and no date announced.
- **Not used:** "Alpenglow mainnet mid-October" could not be confirmed, so the slide says "expected Q4 2026". SIMD-0123 and its 2025 vote are off the slide, per Ondra.

**Part 3, the building blocks**

10. **Staking is Solana's base yield layer. Marinade routes it.** The four bricks drop in. Opens this part, right before the blocks.
11. **Block 1.** "Two ways in": Marinade Liquid and Marinade Native.
12. **Block 1.** "Validators compete for the stake", with the bid ladder behind.
13. **Block 1.** "Getting out without waiting": Instant Unstake.
14. **Block 2, DeFi.** "mSOL is a building block".
15. **Block 3, data.** "Public data on every validator".
16. **Block 3, infrastructure.** "Knowing the ecosystem", with gears behind.
17. **Block 4, DAO.** "MNDE runs the DAO".
18. **Pick your block.** Five rows, the fifth is "Your own".
19. **Closing.** "Build on top".

Removed: "Staking in one slide", because it carried little information.

## Event

Solana Build Station, Prague, 3–7 October 2026. Marinade sponsors a sidetrack: $3,000 for the best Solana staking-focused build. Accretion runs a $500 research and security sidetrack. Source: Solana Community Czech Republic (@SolanaCZE) on X, 1 Oct 2026. The talk is the pitch for the sidetrack, so every block ends on something buildable.

## Solana staking space

Research of 2026-10-02, saved as `resources/pages/ecosystem-*`. For the speaker first, slides second.

**What the fight is about.**

- One leader per slot decides which transactions go into the block and in what order.
- Order is worth money: arbitrage, liquidations, sandwiches.
- Solana has no public mempool, so that value flows through private pipes: Jito bundles and tips, priority fees, and competing block builders (Jito BAM, Harmonic, Rakurai, Paladin).
- They compete on three things: revenue per block, fairness for users, and capacity.
- The risk is concentration. Almost all stake runs Agave-derived code, and much of the block building runs through one company. That is why Firedancer matters.

Facts, with dates:

| Topic | Fact | Source | Confidence |
|---|---|---|---|
| Sandwiches | 28M attacks by 8,631 bots, Jul 2023 to Jun 2026, about $345M profit | arXiv 2609.28115, 23 Sep 2026 | high |
| Fees | Base fee 5,000 lamports per signature, half burned. Priority fees 100% to the leader (SIMD-0096) | solana.com docs, SIMD-0096 | high, activation date unverified |
| Block space | CU limit 48M, then 60M (SIMD-0256, Jul 2025), then 100M (SIMD-0286, 29 Jul 2026) | solana.com/upgrades/100m-cu-blocks | high |
| Revenue sharing | SIMD-0123, block revenue sharing with stakers: passed a vote in Mar 2025, not live | xroot.dev, Agave wiki | high |
| Network revenue Q2 2026 | $51.0M: priority fees $30.8M, Jito tips $9.9M, base and vote fees $10.3M | Blockworks Q2 report, search snippet | medium |
| Staker income Q2 2026 | $487M, over 98% from issuance | Blockworks Q2 | medium |
| BAM | Jito's Block Assembly Marketplace. Ordering in TEE nodes, FIFO execution, plugins. Mainnet 25 Sep 2025. 34.1% of stake on 9 Sep 2026 | helius.dev blog, solanacompass.com | high |
| Clients, Apr 2026 | Agave family 86%, Frankendancer 11%, Firedancer 3% | blog.syndica.io, April 2026 | high for April, newer figures conflict |
| Schedulers inside Agave | Jito 36%, JitoBAM 28%, Harmonic 18%, Rakurai 2%, vanilla 2% | Syndica, April 2026 | high |
| Disputes | Jito accuses Harmonic of late packing. Harmonic disputes Jito's scoring | Blockworks 0xResearch, 8 Jan 2026 | high |
| Alpenglow | New consensus. Votor on testnet 22 Sep 2026, not on mainnet. Votes stop being transactions, finality target about 150 ms | solana.com/upgrades/alpenglow | high |
| Decentralization | Nakamoto coefficient 18 (was 31 in Mar 2023) | chainspect, 2 Oct 2026 | medium, validator counts disagree |

**Verified 2026-10-02** by a second pass against primary text, with copies saved as `resources/pages/verify-*`:

- **Blockworks REV $51.0M (priority $30.8M, Jito tips $9.9M, base and vote $10.3M) and stakers $487M, over 98% issuance, Jito tips $8.2M:** quoted verbatim from the Blockworks Research Solana Q2 2026 Token Holder Report, 20 Jul 2026. The X article was read through api.fxtwitter.com.
  - REV includes vote fees, which validators pay.
  - Blockworks' staker revenue excludes priority fees.
  - All figures are USD.
- **Sandwiches:** 28,042,725 attacks by 8,631 bots, 1 Jul 2023 to 30 Jun 2026, $345.2M net. Source: arXiv 2609.28115, "No Place to Hide", Table 3. It counts attacks on protected order flow only, so it is a lower bound.
- **Clients, April 2026:** Agave 86%, Frankendancer 11%, Firedancer 3%. Schedulers: Jito 36%, JitoBAM 28%, Harmonic 18%, Rakurai 2%, vanilla 2%. Source: blog.syndica.io, 29 May 2026. Newer: full Firedancer 11.64% on 10 Aug 2026 (Solana Compass, citing wenfiredancer.com). Search snippets that said "14–26%" did not trace to a source.
- **Feature gates:**
  - SIMD-0096 active since 12 Feb 2025 (epoch 741).
  - SIMD-0123 has no feature account on mainnet. It passed its vote with 74.9% yes.
  - 100M CU since 29 Jul 2026 (epoch 1009).
  - All checked on mainnet RPC.
- **Alpenglow:** not activated on mainnet. Testnet is active. The solana.com page is stale ("Q3 2026").
- **Nakamoto coefficient:** 18 across about 680 vote accounts, mainnet RPC, epoch 1047.
- **BAM:** 34.1% of stake comes from Solana Compass citing SolanaFloor, so it is second-hand. The 25 Sep 2025 mainnet date comes from SolanaFloor. The Jito page returned 403.

Neutrality rule: the research also has LST size rankings. They stay off the slides, because the room would read them as a comparison with competitors.

## Playful elements

All CSS-only, and all start when the slide becomes `.present`. Their resting state is the final layout, so the PDF export and reduced motion need nothing special.

| Element | Class | Slide |
|---|---|---|
| Bricks dropping in, with studs | `.blocks`, `.blk` | The four-block map |
| Product-mix bars growing | `.mix`, `.mix-bar` | Timeline |
| Flipping Solana coin | `.illo.flip` | Timeline |
| Bobbing MNDE crest | `.illo.lg.bob` | Bootstrapped DAO |
| Bobbing emoji | `.callout .emoji` | Bio, Build Station callout |
| Breathing bid ladder | `.ladder` (from staking-stack) | Validators compete |
| Turning gears | `.gears` (from staking-stack) | Knowing the ecosystem |

The line illustrations are from the Marinade press kit, `resources/images/presskit-illustrations`. They are recoloured on copy by `sed`: `fill="black"` becomes `#94C9C8` for dark slides, or `#151A1A` for the `-dark` variants on coloured bricks. The output is in `slides/images/illo/`.

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
| DAO | Marinade DAO on Realms: SPL Governance, VSR, veMNDE, council of 5 | v2.realms.today/dao/899YG3yk4F66ZgbNWLHriZHTXSKk9e1kvsKEquW7L6Mo (app.realms.today is the old v1), app.marinade.finance/governance |
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
- **2026-10-02, round 2** Per Ondra: the deck is more playful, with moving parts as in staking-stack. The talk gets a Solana staking-space part between the Marinade intro and the blocks.
- **2026-10-02, round 2** The bio is cut to one line, and the slide carries the Build Station sidetrack callout with 🥳.
- **2026-10-02, round 2** "Staking in one slide" deleted.
- **2026-10-02, round 2** The "What Marinade brings" cards changed:
  - "Self-custody" and "Open by default" went, because Ondra doubted their value and accuracy.
  - "Validators pay up front" (bonds and PSR) and "A market for stake" (SAM) replace them.
  - "Spread stake" now states the caps.
- **2026-10-02, round 2** The DAO slide changed:
  - "Real decisions" (the MIP-14 burn) was replaced by "Back to Realms": Marinade's SPL Governance program changes, the deep-dive docs and the vote aggregator.
  - The source for that card is the "Realms Ecosystem Contributions" slide of `marinade-dao-knowledgeshare`.
  - The middle card became "Shared stack", so the word Realms does not repeat.
- **2026-10-02, round 2** "Pick your block" now covers all four blocks as rows. Each row has the brick colour and illustration as its bullet, and the rows pop in.
- **2026-10-02, round 2** The closing link points to Realms v2 (`v2.realms.today/dao/899YG3…`), not the v1 `app.realms.today`.
- **2026-10-02, round 3** The timeline's FTX line was dropped, because it did not belong on a builder slide.
- **2026-10-02, round 3** "What Marinade brings" has four cards: Spread stake, Protected rewards (PSR), Instant exit, A market for stake. "Validators pay up front" was dropped, because it brought nothing to Solana by itself.
- **2026-10-02, round 3** The ecosystem part has three slides. Companies are named. LST comparisons are completely off the slides. Every number on them carries a small source line.
- **2026-10-02, round 3** Where Marinade fits in the ecosystem part is one punch line on "Where the money goes": priority fees stay with the validator, and SAM bids are how validators share block revenue with stakers today. It is pending Ondra's approval.
- **2026-10-02, round 3** The Marinade Borrow card left the DeFi block. Borrow routes to Kamino and Jupiter Lend, so it is not a block for builders. Replaced by "Priced onchain" (mSOL price readable by any program). The DeFi ask is now "find, and mine, a non-obvious mSOL yield source".
- **2026-10-02, round 3** "Pick your block" uses the team's own idea list:
  - Telegram bot for staking actions and alerts.
  - A non-obvious mSOL yield source.
  - Enrich Explore (sandwich report, validator and stake grouping, validator issues).
  - A governance UI.
  - The "third-party frontend volume share" idea is left out. It is the referral model, and the referral program is paused.
- **2026-10-02, round 3** "Pick your block" has a fifth row, per Ondra:
  - "Your own": "Surprise us. If it stands on Solana staking, it counts."
  - It uses a rose brick with the press-kit open-armed chef.
  - The brick lands last and keeps bobbing, as the invitation.
  - The rows shrank from 112px to 92px icons so five fit above the rail.
- **2026-10-02, round 3** The four-block map moved to open Part 3, right before the block slides. The ecosystem part got an art section break, "Solana staking, *today*", using the previously unused p-security.jpg.
- **2026-10-02, round 4** The ecosystem part now has an arc: validators commoditize, so they compete for stake and the block.
  - New order: section break, money, ordering, clients.
  - The SAM punch line was removed from "Where the money goes", because no Marinade product belongs there.
  - "Revenue sharing" (SIMD-0123) was replaced by "Bigger transactions, cheaper accounts".
  - The Alpenglow card says votes no longer land onchain, and "mainnet expected Q4 2026", because mid-October is unconfirmed.
- **2026-10-02, round 4** Per Ondra: the slide says slots are going from 400 ms to 200 ms. Per solana.com/upgrades/reduced-slot-times, 300 ms is live and 200 ms is the target, already live on devnet and testnet.
- **2026-10-02, round 4** Per Ondra: Alpenglow mainnet "mid-October 2026" is on the slide. Public sources on 2 Oct 2026 showed no announced date and no queued mainnet gate. The date is Ondra's call.
- **2026-10-02, round 2** The timeline bars show product shares, not totals. The totals fell from 11.0M SOL (2023) to 7.7M (2026), and the slide's point is the mix.
