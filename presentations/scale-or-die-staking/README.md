# Scale or Die 2026: staking infrastructure against a moving protocol

Working document for the talk. Context, angle, structure and decisions live here. Slide copy gets
drafted here first, then moves into `slides/deck.md` once the shape is agreed.

Predecessor: `../marinade-staking-stack/`, the Solana Summit Serbia talk given 26-27 August 2026.
That deck is an introductory product tour for a mixed room. **This is not a rewrite of it.** It is
the developer talk its own README predicted:

> The natural home is a developer-audience session, something like *five years of running an LST
> while the chain changes underneath you*. A Rust Summit or a Solana developer meetup, not a summit
> main stage.

## Event

| | |
|---|---|
| **Event** | Scale or Die |
| **When** | 14 November 2026, leading into Breakpoint |
| **Where** | London, United Kingdom |
| **Host** | Solana Foundation |
| **Entry** | Application only, host approval required |
| **Duration** | **15 minutes** (Ondra, 2026-09-08, believed rather than confirmed) |
| **Audience** | Fully technical. "engineers, validators, protocol developers, infrastructure teams, and researchers pushing the network to its limits" |
| **Programme themes** | validator performance, consensus, transaction landing, RPC, Firedancer, post-quantum readiness, agentic infrastructure, high-performance onchain applications |
| **Format** | technical talks, hands-on workshops, and a "DevCave" for debugging and collaboration through the day |
| **Speaker application** | Airtable form, linked from the Luma page. Not Luma itself |
| **Links** | [luma](https://luma.com/scale-or-die-26) · [speaker form](https://airtable.com/appCy7M2j24UF6QqT/pag8nSnDP4LUKD13W/form) |

**Audience implication, and it inverts every decision the Belgrade deck made.** Solana familiarity
is the entry requirement, not an assumption. Part of the room *writes the SIMDs this talk is about*,
and another part operates the validators being scored. So:

- **Zero minutes of primer.** No "what is staking", no product tour, no agenda slide.
- No analogies. The Belgrade deck carries a `LIKE THIS` line on sixteen slides; none belong here.
- Name competitors and protocols directly. Jito, Sanctum, SPL, agave function names. The Belgrade
  rule about never naming a competitor on screen was for a summit stage with those companies in the
  room. Here the comparison *is* the technical content.
- Show source. Struct fields, instruction constraints, SIMD numbers with statuses.
- The room can and will check claims live. Every number needs a source, and unverified numbers stay
  off the slides.

## The angle

Old Marinade knowledge, against what the SIMDs are about to change. Per topic: **here is what we
learned building it, here is the proposal that changes the ground under it, here is what actually
breaks.**

The reason to give this talk in November specifically:

| Date | What |
|---|---|
| 9 Sept 2026 | Transaction v1 live on mainnet. 4096 bytes, no address lookup tables |
| 28 Sept 2026 | Alpenglow mainnet feature activation |
| 14 Nov 2026 | **This talk.** Roughly six weeks of Alpenglow epochs behind it |

Nobody has yet described what the current wave of proposals does to a staking stack, from inside
one. That is the whole pitch.

**The line for the room, and it is the title too:** every SIMD that ships costs a staking provider a
subsystem. Sometimes it deletes one we were glad to be rid of. Sometimes it breaks one quietly, and
the failure is a wrong number rather than an error.

### What this talk is not

- Not a Marinade pitch. Marinade is the vantage point, not the subject.
- Not a list of complaints. Every section that has room for one ends in a concrete ask a protocol
  developer could act on, and two of the SIMDs discussed are ones we want shipped faster.
- Not a survey. At 15 minutes a survey of six topics is six shallow claims and no evidence.

## Structure

**15 minutes.** Budget 13 minutes of content, no Q&A, and about **ten slides**. That is roughly
1,700 spoken words, so every sentence has to carry something.

The shape that survives the cut: **one pattern, one deep dive, four fast.** All six of the topics
Ondra named are present. Exactly one is taken to source level, because a 15-minute talk that goes
deep on one thing is remembered and a 15-minute talk that covers six is not.

| Time | Slides | Section |
|---|---|---|
| 0:00 - 1:30 | 1 | Cold open: the instruction that deactivated our stake |
| 1:30 - 1:45 | - | One spoken line: who is talking, and from what seat |
| 1:45 - 8:15 | 4 | **Deep dive: rewards you cannot read** |
| 8:15 - 12:15 | 4 | **Four more, one minute each** |
| 12:15 - 13:15 | 1 | Close: the pattern, and two asks |
| 13:15 - 15:00 | - | Buffer. Overrunning a 15-minute slot is the one unforgivable thing |

### Cold open, 1:30, one slide

`DeactivateDelinquent` is permissionless and needs no stake authority signature. A third party
flipped Marinade-owned accounts to deactivating while our own mirror of that state still said
active. `UpdateDeactivated` subtracted from a bucket the stake was never in, underflowed, and
stranded the SOL. Nothing was stolen. The state machine refused a transition it had no rule for, and
that is precisely why the money got stuck.

Then the turn, which is what makes it an opening rather than an anecdote: **SIMD-0608, filed 24
August 2026, extends that same instruction to stake delegated to closed vote accounts.** Same class
of change, again, for a good reason.

State the pattern once, here, and never again until the close: *the protocol keeps moving, and every
move lands on somebody's invariant.*

Why open here: it earns the room in ninety seconds, it is a bug rather than a boast, and it puts a
live proposal on screen before any Marinade product is named.

- **The ask:** when a SIMD makes an instruction permissionless, say which invariant a dependent
  program can no longer assume. It is a liveness change, not a convenience.

No bio slide. One spoken line after the cold open: Marinade, since 2021, an LST with its own
program, a bond and settlement program, native staking where no program holds funds, and a market
for stake accounts. Fifteen seconds, no slide, keep walking.

### Deep dive, 6:30, four slides — rewards you cannot read

**This is the talk.** Most novel, most technical, and the section nobody else can give. It is on
screen for nearly half the slot, which is the right allocation for a 15-minute technical talk.

**Slide 1, the gap and the two bridges.** SIMD-0096, Activated, sent 100% of priority fees to
validators and left no in-protocol path back to the stake that earned them. Marinade priced that gap
with an auction, `totalPmpe = inflationPmpe + mevPmpe + bidPmpe`, settled out of validator
collateral through merkle claims. Jito mandated it through Steward scoring and TipRouter. Same gap,
two mechanisms: one prices it, one requires it.

**Slide 2, what SIMD-0123 actually does, and the thing everyone gets backwards.** Block revenue is
shared strictly in proportion to stake, with no way to exclude or favour a delegator. So it removes
the need for bespoke *settlement plumbing* and does **not** remove the need for a *market*: a
validator that wants one pool's stake specifically still cannot express that in protocol. The
auction survives its own success. The settlement rail may not.

**Slide 3, the two-direction break.** `deposit_or_burn_fee` splits each block's revenue between the
collector and the leader's own vote account, so the `Fee` rows carry only the validator's share and
block revenue is **under-counted**. The delegator half accrues in `pending_delegator_rewards` and is
paid merged into the next epoch's `Staking` rows, where `distribution.rs` writes
`inflation.stake_reward + block_reward` as **one number**, so block revenue is **counted as
inflation**. No column anywhere separates the two revenues, so nothing downstream can tell. Every
APY figure, every PSR calculation and every bid settlement reads those rows.

**Slide 4, two more ways attribution dies.** SIMD-0232: where several vote accounts name one
collector the runtime merges their commissions into a single row, and
`validate_and_resolve_collector_key` asks the collector for no signature of its own, so **anyone can
point a throwaway vote account at somebody else's collector** for the price of one vote account's
rent. Attribution has to run forward, because that direction is a function. SIMD-0180: the leader
schedule is keyed by vote account while `getLeaderSchedule` answers in identities, and hundreds of
identities carry more than one vote account.

- **The ask, and it is the one to land:** if you ship a reward path, ship its attribution. One
  column separating inflation from block revenue removes a class of silent error from every staking
  provider, every APY dashboard and every tax report on the network.

### Four more, 4:00, four slides

One minute each, one slide each, and each slide is three lines: what we built, what changes, the
ask. Say up front that this is four things quickly, so the pace reads as deliberate rather than
rushed.

**1. Stake does not move sideways.** `Redelegate` was specified and never enabled. SIMD-0022, which
would have made redelegation an in-account operation, is **Withdrawn**. SIMD-0148 is Activated and
narrower than it reads: an active destination must share the source's vote account, so it moves
value between your own accounts and never between validators. Marinade rate-limits itself with
`max_stake_moved_per_epoch` in its staking program; Jito rate-limits itself with three `*_cap_bps`
in Steward. Opposite architectures, same guardrail, neither team's choice. Stake v5 raises minimum
delegation from one lamport to **1 SOL**.
*Ask: a movement primitive that does not cost an epoch, or a clear statement that there never will
be one.*

**2. Every stake pool scores on vote credits. Alpenglow takes them off chain.** Votes stop being
transactions. Rewards become per-vote-included-in-the-leader's-aggregate at slot s+8, and the leader
is paid per voter it includes, so reward-earning becomes a latency property and partly another
party's choice. The exposure is public and it is ours: `ds-sam` reads `credits` per epoch, filters
candidates on `credits > 0` across three epochs, and throws when an epoch's credits are unavailable.
*Ask: whatever replaces vote credits must be readable per validator per epoch, from a snapshot,
without an oracle.*

**3. Protected staking rewards are not slashing.** What a bond covers today is rewards a staker did
not receive, from collateral a validator posted voluntarily, and principal is never touched.
SIMD-0204 is a **logger** for one infraction and changes no stake. SIMD-0212 is **not merged**, and
it burns delegated stake. A bond sized in epochs of yield does not cover a percentage of principal,
and an LST price that only ever went up can now go down for reasons outside the pool's own code.
*Ask: slashing needs a delegator-visible reporting path, not only a log.*

**4. The limit that did not move.** A hundred validators means a hundred stake accounts, and an exit
has to find a subset, deactivate each, merge, then withdraw. Transaction v1 tripled the size limit
to 4096 bytes, dropped address lookup table support entirely, and left `num accounts` at **64**. 64
static accounts at 32 bytes is half the new budget, and the constraint that actually bounds the
fan-out never moved. Rent is the quieter win: `lamports_per_byte` 6960 to 6333, target 696.
*Ask: raise the account ceiling. The byte limit was never the interesting half.*

### Close, 1:00, one slide

Not a summary. The pattern, stated the second and last time, and the two asks worth repeating: ship
attribution with reward paths, and treat the account ceiling as a first-class limit.

Then the honest line: four of the five subsystems in this talk are being deleted or broken in the
same quarter, and that is the system working. We would rather delete code than defend it.

### What the 15-minute slot costs, recorded deliberately

Cut from the 25-minute plan, so it is not reinvented:

- **The exit-liquidity comparison.** Rented from LPs inside the program, an owned reserve on the
  epoch clock, or externalised into a pool shared across every LST. Sanctum's is what makes a
  single-validator LST viable at all. This was a whole act and is now one line in fast item 4. It is
  the best material to restore if the slot turns out to be 20 minutes.
- **The `// We assume this pool is always UNBALANCED` comment**, and the fee curve. A good slide, and
  it needs two minutes to pay off.
- **Who decides where stake goes, asked of five designs.** Keypair, program, market, one validator,
  nothing. Jito's Validator History and the copied-not-uploaded instruction split. Reduced to
  nothing; the Alpenglow half of that act survives as fast item 2.
- **SIMD-0550 and disinflation**, the argument that the term of yield nobody competes over is
  shrinking. One spoken sentence at most, if at all.
- **SIMD-0249**, which would retire half of PSR's commission coverage. Have it ready for a question.

Everything cut is still written up in `research/simd-landscape-2026-09.md`, so a longer slot is a
restoration job rather than new work.

### If the slot is confirmed at 20 minutes

Restore the exit-liquidity act as a fifth section of four minutes, and give the close its second
minute back. Do not restore it by lengthening the four fast items; that is what makes a talk feel
padded.

## Content sitting ready

`research/simd-landscape-2026-09.md` carries the verified catalogue: every SIMD with its status read
from the repository frontmatter, the rollout dates, the agave function names, and the clearance
table.

Reusable from the Belgrade repo, without rework:

- `slides/theme/marinade.css` and the whole reveal.js setup, including the PDF export and the
  bundler. Copy the `slides/` scaffold, not the deck.
- The state ring diagram from *A stake account cannot move sideways*. Still exactly right, and at 15
  minutes it is the only diagram fast item 1 can afford.
- The `StakeStateV2` and `Authorized` code blocks, if a slide needs them. Probably no longer
  affordable.
- `research/liquid-staking-vs-spl-stake-pool.md` and `research/competitors-jito-helius-sanctum.md`
  are where the cut material lives, already verified from source.

Not reusable: the cover, the agenda, the "What is staking" and stake-weighted-slots introduction,
the Marinade product slides, the three-strategies slide, the exit funnel, and every `LIKE THIS`
analogy.

## Confidentiality

**This repo is public**: https://github.com/ochaloup/ochaloup.github.io

The clearance table in `research/simd-landscape-2026-09.md` lists every claim sourced from a private
repository, with the public route where one exists. Two things to know before drafting slides:

1. **`marinade-finance/native-staking` is PRIVATE**, and `unstake-program` is INTERNAL. The Belgrade
   research note asserts native-staking is public and safe to present. It is not.
2. The best material in the deep dive comes from a private repo's README, but it is *analysis of
   public agave source and public chain state*. The findings are reproducible without the repo.
   Re-derive the mainnet counts yourself before the talk and quote your own numbers.

**The 15-minute cut helps here.** Fast item 4 no longer needs the native staking pipeline at all: it
needs the transaction v1 constraint table, which is public, and one sentence about stake account
fan-out, which is a property of delegating across a hundred validators rather than a detail of any
repository. The deep dive's dependency on private material is now the only clearance question that
blocks slides.

## Open questions

Ordered by how much they block the next step.

1. **Confirm 15 minutes.** Recorded as believed, not confirmed. The structure above is built for it,
   and there is a marked restoration path if it turns out to be 20.
2. **Clearance on the deep dive.** It works with public sources if the mainnet counts are
   re-derived. This is the only thing standing between the plan and slides.
3. **How will Marinade score validators once vote credits leave the chain?** **Open, and Ondra is
   taking it to the CTO** (noted 2026-09-08). Until that lands, fast item 2 presents the *exposure*
   rather than an answer: `ds-sam` reads credits per epoch and refuses to run without them, which is
   public and verifiable, and the replacement signal is stated as an open problem. That version is
   submittable and stays true whatever the answer is. If a decision arrives before 14 November it
   becomes the best new information in the deck, and the item should be promoted into the deep-dive
   slot with rewards demoted to a fast item.
4. **Does the cold open stay first?** The alternative is opening on the deep dive and using the war
   story as a closing callback. Recommendation: keep it first. It is a bug, and a room of engineers
   trusts somebody who leads with one. At 15 minutes it is also the only narrative moment in the
   deck.
5. **Any live demo?** No. At 15 minutes there is no room. A screenshot of a re-derived
   `getProgramAccounts` count on the deep dive's fourth slide is the affordable version of the same
   evidence.
6. ~~**Title.**~~ Settled: *Five years of Solana staking infrastructure*. Alternatives and the one
   tradeoff are recorded in `ABSTRACT.md`.
7. **Directory name.** `scale-or-die-staking` is event-anchored, unlike `marinade-staking-stack`
   which is content-anchored. Rename if the content name settles.

## Decision log

- 2026-09-08 — Repo created. Angle agreed with Ondra: mix the six topics he named with the SIMD
  landscape, contrasting old Marinade knowledge against what is coming, rather than picking one of
  the three spines offered.
- 2026-09-08 — Audience inversion recorded: no analogies, name competitors directly, show source.
  Every rule the Belgrade deck followed for a mixed summit room is reversed here.
- 2026-09-08 — SIMD statuses read from repository frontmatter rather than blog posts, after search
  summaries proved unreliable in two places: SIMD-0148's constraint list was read inverted, and a
  claim that the Validator Admission Ticket activated on mainnet in July 2026 does not survive
  Alpenglow's own 28 September activation date. Neither is used.
- 2026-09-08 — Cold open set to the delinquent stake war story, paired with SIMD-0608. The Belgrade
  deck deliberately cut this story as "a different talk for a developer audience". This is that
  audience.
- 2026-09-08 — The headline finding for the transaction-limit topic is that transaction v1 does not
  move the account ceiling and drops address lookup table support, so the constraint that bounds
  stake-account fan-out is unchanged. This corrects the Belgrade research note's expectation that
  rising transaction limits would delete the machinery.
- 2026-09-08 — Recorded that `marinade-finance/native-staking` is PRIVATE, contradicting
  `../marinade-staking-stack/research/native-staking-undelegation.md`.
- 2026-09-08 — **The abstract names no company at all**, Ondra's call. The focus is staking's
  technical problems, not a stack. Consequence: the abstract's first sentence became the four
  protocol constraints instead of the vantage point, which is a better opening because it is
  checkable. The affiliation lives in the bio and why-this-audience fields only. This applies to the
  abstract, not to the talk: on stage the war story, the auction, the bonds and the rate limit are
  all Marinade's, and the Jito comparison needs both names to work.
- 2026-09-08 — Coverage follows the Serbia talk's flow and topic set, with the depth moved from
  product to mechanism, rather than the one-deep-dive-plus-four-fast shape drafted earlier. Both
  abstracts are kept in `ABSTRACT.md` and **they promise different talks**, so whichever is
  submitted, the outline and the structure section have to be made consistent with it before slides
  start. At 15 minutes the Serbia flow means roughly 90 seconds per topic: one mechanism and one
  SIMD each, no diagrams beyond the state ring.
- 2026-09-08 — Title set to *Five years of Solana staking infrastructure*, Ondra's call: short, no
  colon, no explainer clause. The noted tradeoff is that it reads as a retrospective while the talk
  is forward-looking, so the cold open has to turn to SIMD-0608 fast to reset the expectation the
  title sets. Two fixes that keep the short form are recorded in `ABSTRACT.md` if it is revisited.
- 2026-09-08 — **Slot is 15 minutes, not 25.** Structure rebuilt rather than trimmed: one pattern,
  one deep dive, four one-minute items, ten slides. Five acts of roughly equal weight do not survive
  a 40% cut, because the deep dive is the only part of the talk that could not be given by somebody
  else. What the cut costs is written down above so it is not reinvented, and the restoration path
  for a 20-minute slot is one act rather than a redesign.
