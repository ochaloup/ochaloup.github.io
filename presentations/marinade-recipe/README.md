# The Marinade Recipe: Building Staking Infrastructure on Solana

Working document for a public presentation about the Marinade tech stack.
This file is the single source of truth: context, decisions, outline, ideas, and links all live here.

## Title

**The Marinade Recipe: Building Staking Infrastructure on Solana** _(locked in)_

Note: keep the culinary metaphor light — it's in the title, but the talk content stays literal/technical, not metaphor-driven.

## Short description

> Marinade is the home for staking on Solana. This talk goes behind the scenes of the tech that
> powers it: liquid staking (mSOL), native staking with its validator auction (SAM), Marinade
> Select, and Instant Unstake. A quick tour of how on-chain programs, backend services, data
> pipelines, and validator infrastructure fit together to turn raw SOL into optimized, protected
> staking rewards.

## Product / terminology reference (from marinade.finance)

- **Liquid Staking (mSOL)** — liquid token representing staked SOL, usable across DeFi.
- **Native Staking** — non-custodial; funds stay in the user's wallet with optimized delegation.
- **Stake Auction Marketplace (SAM)** — validators bid competitively for delegated stake; all rewards (incl. priority fees) shared.
- **Marinade Max Yield** — 100+ bidding validators, auto-delegation to top performers.
- **Marinade Select** — curated set of verified validators (identity-verified, institutional focus).
- **Instant Unstake** — unstake from any validator instantly, no liquid-token conversion needed.
- **Protected Staking Rewards (PSR)** — validator's bond absorbs the loss if they underperform or raise fees.

## Meta

- **Topic:** Marinade tech stack ("the recipe")
- **Duration:** 25 minutes
- **Audience:** public / conference (mixed technical background — assume Solana familiarity is NOT guaranteed)
- **When:** ~August 2026 (next month; exact date TBD)
- **Where:** TBD
- **Format:** TBD (reveal.js like sibling `web3/`, or PDF export like most others)

## Goal / thesis

_TBD — the one sentence the audience should remember. To be worked out in discussion._

## Constraints & guardrails

- 25 min is short: realistically ~20 min content + ~5 min Q&A/buffer. That is roughly 15–20 slides.
- Public audience → lead with the "why", keep deep code to a few punchy examples.

## Outline

_Draft — to be built out together._

1. Hook / why Marinade
2. ...
3. ...

## Ideas / parking lot

- Possible trivia / interactive opener (see `../solana-blockchain-trivia.md` — Q1 is Marinade as first liquid staking program on mainnet).

## Open questions

- Exact date & venue?
- Which subset of the stack to focus on (liquid staking / native staking / validator delegation strategy / SDKs)?
- Delivery format (reveal.js vs slides/PDF)?

## Links

- [how-to-native-staking](https://github.com/marinade-finance/how-to-native-staking) — Marinade native staking how-to
- [Solana blockchain trivia](../solana-blockchain-trivia.md) — existing quiz, possible opener material

## Decision log

- _(date)_ — Created this working doc.

## Conversation notes

_Running notes from planning discussions get appended here._
