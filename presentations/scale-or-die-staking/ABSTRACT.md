# Submission text for the Scale or Die speaker form

Form: https://airtable.com/appCy7M2j24UF6QqT/pag8nSnDP4LUKD13W/form

Written for a **15-minute** slot and a fully technical room. Everything in a code block is flush
left and unformatted, to be pasted straight into a form field. Field names are a guess at the
form's shape; move text between them as needed.

**Nothing here promises an answer we do not have.** In particular the Alpenglow scoring item is
framed as an open problem and an exposure, because how Marinade will score validators after vote
credits leave the chain is not decided yet. Do not upgrade that sentence later without checking.

## Title

**Chosen by Ondra, 2026-09-08.** He asked for a short name, with no colon and no explainer clause:

```
Five years of Solana staking infrastructure
```

Recorded with its tradeoff, so it is known rather than re-argued. The phrase is clean, it states the
vantage point, and five years is the credential that buys the room. What it does not do is signal
direction: *five years of X* is the shape of a retrospective, and this talk is mostly about what
breaks in the next six weeks. A protocol developer scanning the programme may read it as war stories
and skip a talk that is largely about their own proposals.

Two ways to keep the short name and fix the signal, if either appeals:

- **Add three words.** `Five years of Solana staking infrastructure, and what the SIMDs break`.
  Still one line, still no colon, and it points forwards.
- **Demote it to the subtitle.** A sharper line on top, this one underneath. Most programme listings
  show both, so it costs nothing.

### Alternatives, kept so they are not reinvented

**A. The sharper one, and the previous recommendation.**

```
Your SIMD, Our Subsystem
```

Four words, and it speaks directly to a room half of which writes the proposals. It promises the
talk's content rather than the speaker's vantage point. Longer form for a subtitle field: *five
years of Solana staking infrastructure, and what the current wave breaks*.

**B. Narrower, leads with the deep dive.**

```
Rewards You Cannot Read: what block revenue sharing does to every APY number on Solana
```

Stronger if the programme is already deep on consensus and wants a data and economics slot. It also
matches the talk's actual weighting, since reward attribution holds nearly half the slot. Risk: the
four fast items then read as bolted on.

**C. Most quotable, least accurate.**

```
Stake Does Not Move Sideways
```

Memorable, and it undersells the talk. Keep it as a slide title instead.

## One-line summary

```
What the current wave of SIMDs does to a staking stack, from inside one that has been running since 2021.
```

## Abstract

### CHOSEN

**Approved by Ondra, 2026-09-08.** Then simplified: shorter sentences, plainer words.

```
Staking on Solana is one button for the user. Underneath it: a stake account that splits custody from control, no way to move stake sideways, priority fees the protocol cannot pass back to stakers, and a cooldown nobody can skip. This talk is five years of building around those limits — what a stake authority can really do, what a rebalance costs because redelegation was never enabled, how fee sharing works with no protocol support, and what really happens when you unstake.
```

78 words. Technical, matches the short title, covers the Serbia ground, names no company.

**What is missing, on purpose.** Nothing here says the talk is about what is changing *now*. That
was the reason to give it in November. A reviewer sees a retrospective.

One sentence fixes it, if wanted:

```
Most of it is scaffolding over gaps in the protocol, and the current SIMDs are starting to take it away.
```

**Not restored:** *"SIMD-0123, Alpenglow, stake v5 and the arrival of slashing are about to remove
half of it and quietly break the rest."* Best line written for this abstract. Also a prediction, made
while Alpenglow scoring is undecided. Save it for the stage.

How the sentences work, so an edit does not break one:

- **One** sets the frame. One button. Everything after it is what sits underneath.
- **Two** is the four limits. Protocol facts, not anyone's architecture. Checkable, and it commits
  the talk to the protocol's problems rather than a stack.
- **Three** is the work, and where a reviewer decides the talk is technical. It names four
  **mechanisms**, not four topics: the authority, the cost of a rebalance, the fee path, the exit.
  "Five years" earns the title without naming an employer.

**Where the affiliation goes.** The bio, and why-this-audience if the form has one. Those are the
credibility fields. Keeping it out of the abstract is what makes this read as a technical talk and
not a vendor slot.

**If the lesson goes back in, state the thesis.** Never the words "lessons learned". This room reads
that as filler.

### Longer variant, 168 words

Use it if the form has room for a full abstract. Written to be true on 14 November, after Alpenglow
has activated. Note that it promises **one deep dive plus four fast items**, which is a different
talk from the three-sentence version's broader coverage — pick one and keep the outline consistent
with it.

```
Solana staking infrastructure is mostly scaffolding built over gaps in the protocol. Priority fees that could not be shared. Stake that cannot move sideways. A hundred stake accounts that do not fit in one transaction. I have been building that scaffolding since 2021, and this quarter the protocol moved more than in the previous four years.

Fifteen minutes: one problem taken to source, and four taken quickly.

The deep dive is reward attribution, because that is the failure that is silent rather than loud. SIMD-0123 splits block revenue across two reward paths and pays the delegator half merged into the next epoch's staking rows, with no column separating it from inflation. SIMD-0232 merges several validators' commissions into a single reward row, and asks the collector for no signature of its own.

Then four, fast: the redelegation that never shipped, the vote credits that Alpenglow takes off chain and that every stake pool scores on, protected rewards that are not slashing, and the transaction limit that did not actually move.

Each one ends with a concrete ask for the people shipping these proposals.
```

### Shorter variant, 95 words

For a form with a tight character limit.

```
Solana staking infrastructure is scaffolding over gaps in the protocol, and this quarter the protocol moved. Fifteen minutes from inside a stack running since 2021: one problem taken to source, four taken quickly. The deep dive is reward attribution, where the failures are silent. Block revenue sharing pays delegators through a reward row that does not separate it from inflation, and custom commission collectors make a reward row unreadable backwards while needing no signature. Then: redelegation that never shipped, vote credits that Alpenglow takes off chain, protected rewards that are not slashing, and the transaction limit that did not move.
```

### One-sentence variant

If the form wants a hook before the abstract.

```
Every SIMD that ships costs a staking provider a subsystem, and this quarter four of ours are being deleted or quietly broken.
```

## Outline, if the form asks for one

Matches the 15-minute structure in `README.md`.

**The no-Marinade rule applies to the abstract fields, not here.** The outline names Marinade and
Jito against each other because at this conference the comparison *is* the technical content: two
teams, opposite architectures, the same guardrail. Naming neither would make the strongest point in
the talk unsayable. If a reviewer would rather see it anonymised, "one pool" and "another pool" work
everywhere below, at some cost in credibility.

```
Cold open, 90 seconds. DeactivateDelinquent is permissionless and needs no stake authority signature. A third party deactivated our stake accounts while our own mirror of that state still said active, an accounting bucket underflowed, and the SOL was stranded. Nothing was stolen: the state machine refused a transition it had no rule for, which is exactly why the money got stuck. SIMD-0608, filed in August 2026, extends that same instruction to stake delegated to closed vote accounts. Ask: when a SIMD makes an instruction permissionless, say which invariant a dependent program can no longer assume.

Deep dive, 6 to 7 minutes. Rewards you cannot read. SIMD-0096 sent all priority fees to validators and left no in-protocol path back to the stake that earned them; Marinade priced that gap with an auction settled out of validator collateral, Jito mandated it through Steward scoring. SIMD-0123 closes the gap strictly in proportion to stake, with no way to favour one delegator, so it removes the settlement plumbing and not the market. It also splits revenue across two reward paths that no column separates: the Fee rows under-count block revenue, and the delegator half is paid merged into the next epoch's Staking rows as a single number that reads as inflation. SIMD-0232 merges several validators' commissions into one row and asks the collector for no signature, so attribution has to run forward. SIMD-0180 keys the leader schedule by vote account while getLeaderSchedule answers in identities. Ask: ship attribution with the reward path.

Then four items, one minute each.

Stake does not move sideways. Redelegate was specified and never enabled, SIMD-0022 is withdrawn, and SIMD-0148 moves value between your own stake accounts but never between validators. Marinade rate-limits itself in its staking program and Jito rate-limits itself in Steward: opposite architectures, the same guardrail, neither team's choice. Stake v5 raises minimum delegation from one lamport to one SOL. Ask: a movement primitive that does not cost an epoch, or a clear statement that there never will be one.

Every stake pool scores on vote credits, and Alpenglow takes them off chain. Votes stop being transactions, and rewards become per-vote-included-in-the-leader's-aggregate, so reward-earning becomes a latency property and partly another party's choice. The exposure is public: Marinade's auction reads credits per epoch, filters on credits greater than zero across three epochs, and refuses to run without them. What replaces that signal is an open question and I will present it as one. Ask: whatever replaces vote credits must be readable per validator per epoch, from a snapshot, without an oracle.

Protected staking rewards are not slashing. What a bond covers today is rewards a staker did not receive, from collateral a validator posted voluntarily, and principal is never touched. SIMD-0204 is a logger for one infraction and changes no stake; SIMD-0212 is not merged, and it burns delegated stake. A bond sized in epochs of yield does not cover a percentage of principal, and an LST price that only ever went up can now go down for reasons outside the pool's own code. Ask: slashing needs a delegator-visible reporting path, not only a log.

The limit that did not move. A hundred validators means a hundred stake accounts, and an exit has to find a subset, deactivate each, merge, then withdraw. Transaction v1 tripled the size limit, dropped address lookup table support, and left the account count at 64. The constraint that actually bounds the fan-out never moved. Ask: raise the account ceiling.

Close, 1 minute. Four of the five subsystems in this talk are being deleted or broken in the same quarter, and that is the system working. Two asks worth repeating.
```

## Speaker bio

```
Ondra Chaloupka, backend engineer at Marinade. Works on the staking stack: the liquid staking program, the validator bond and settlement programs, native staking, and the data pipelines that decide where stake goes. Before Solana, a Java engineer at Red Hat working on distributed transactions. Author of an SPL Governance deep dive and a contributor to Realms.
```

Shorter, if the field is one line:

```
Backend engineer at Marinade, working on Solana staking programs and the data pipelines behind them. Previously distributed transactions at Red Hat.
```

## Why this talk for this audience

If the form asks. Do not paste this into the abstract.

```
Marinade has run a liquid staking token since 2021, a bond and settlement program for validator commitments, native staking where no program holds user funds, and a market for stake accounts. That is five years of building around the exact constraints this conference is about, and a set of production pipelines that read reward rows, vote credits and leader schedules every epoch.

Several of the proposals landing now change what those pipelines can read, and the failures are silent rather than loud: a wrong number, not an error. Alpenglow will have roughly six weeks of mainnet epochs behind it by 14 November, so the talk reports what changed rather than predicting it. I have not seen this described from a staking provider's seat, and the people who can act on it are the ones in this room.
```

## Notes for whoever fills the form

- **Do not promise anything from a private repository.** The abstract and outline above are
  deliberately built on public sources: SIMD text, agave source, `ds-sam`, `validator-bonds`,
  `liquid-staking-program`, `jito-foundation/stakenet` and public Sanctum documentation.
- **The Alpenglow scoring sentence is deliberately an open question.** How Marinade scores
  validators once vote credits leave the chain is undecided as of 2026-09-08 and needs a
  conversation with the CTO. The abstract states the exposure, which is public and verifiable, and
  promises to present it as an open problem. That is submittable today and stays true whatever the
  answer turns out to be. If a decision lands before the talk, it becomes the best new information
  in the deck and the item should be promoted, but the abstract does not need rewriting for that.
- **Re-check every SIMD status before submitting.** The abstract and outline call SIMD-0212 "not
  merged" and SIMD-0204 "a logger", and both could change before November. Statuses as read on
  2026-09-08 are in `research/simd-landscape-2026-09.md`.
- The abstract says "this quarter the protocol moved more than in the previous four years". That is
  a judgement, not a measurement. It is defensible on Alpenglow plus transaction v1 plus vote
  account v4, and it should be dropped rather than argued if a reviewer pushes on it.
- The outline totals about 14 minutes against a 15-minute slot. That is the right margin; do not
  fill it.
