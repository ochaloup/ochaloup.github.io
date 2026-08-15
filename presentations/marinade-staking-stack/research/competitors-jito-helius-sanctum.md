# Competitors: Jito, Helius, Sanctum

Product-level comparison, with the on-chain program identified for each. Web-sourced, retrieved
2026-08-12, links at the bottom. Treat the numbers as needing a re-check on the day.

## The headline finding

**Almost nobody writes their own stake pool program. Marinade is the outlier.**

| | On-chain pool program | Validators | Who picks them |
|---|---|---|---|
| **Marinade Liquid** | Own program, Anchor | 100+ | Off-chain auction, SAM |
| **Jito, jitoSOL** | **Stock SPL stake pool**, unforked | ~400 | **On-chain program**, Steward |
| **Helius, hSOL** | Sanctum's SPL deployment | **1** | Nobody, it is their own validator |

Jito is explicit that not forking is a deliberate safety decision. From their docs, jitoSOL runs
on the standard SPL program at `SPoo1Ku8WFXoNDMHPsrGSTSG1Y47rzgn41SLUNakuHy`, and using it
"provides minimal risk compared to deploying or writing our own stake pool implementation". The
same program backs bSOL, laineSOL and Marginfi's LST.

That reframes the earlier "Marinade vs SPL" note. The real question is not *whose pool program is
better*, it is **what each protocol chose to build instead of a pool program.**

## Where each one put its effort

### Marinade: a market

Custom program, and the differentiator is economic. SAM is an auction: validators **bid** for
delegated stake, clearing every epoch, and the bid is shared back with stakers. Plus PSR, where
the validator's bond covers lost rewards. The extra yield comes from **competition between
validators**.

Marinade also built the liquidity pool *inside* the staking program, which is why instant unstake
exists at a scarcity-priced fee.

### Jito: on-chain automation, and MEV

**Verified from source 2026-08-15**, `jito-foundation/stakenet` cloned at
`/home/chalda/marinade/stakenet`. Everything below is from `programs/steward/README.md` rather
than marketing pages.

Stock pool, and the effort went into **StakeNet / Steward**, an Anchor program that holds the
staking authority for the SPL pool and does validator selection **on chain**. Quoting its README:

> "The Steward Program is an Anchor program designed to manage the staking authority for a SPL
> Stake Pool... The core operations of the Steward Program are permissionless such that any
> cranker can operate the system... the steward surfaces this staking algorithm through variable
> parameters to be decided by Jito DAO. In turn, this greatly decentralizes the stake pool
> operations."

- **10-epoch cycle**, run as an explicit state machine: `RebalanceDirected` → `ComputeScores` →
  `ComputeDelegations` → `Idle` → `ComputeInstantUnstake` → `Rebalance`.
- `num_delegation_validators` = **400**, and the README is explicit that the top N by score
  "become our validator set... with each receiving 1/N of the pool's stake". **Equal split, not
  proportional to score.**
- Score is **tiered and bit-packed** into an integer, e.g. "Tier 2 (bits 42-55): MEV commission
  average (inverted)", so ranking is a single integer comparison.
- Extra yield comes from **MEV**, via the Jito-Solana client.

Two details worth knowing that did not appear in the docs pages:

- **Directed staking (JIP-27)** lets JitoSOL holders name the validators their stake backs.
  Marinade has a `directed-stake` repo too, so this is a shared idea rather than a Jito-only one.
- **Priority-fee scoring is built but switched off**, via `priority_fee_max_commission_bps` =
  10000 and `priority_fee_scoring_start_epoch` = 65535, with a note that governance could enable
  it later. That is the same territory as SIMD-0123, and it says Jito is staged and waiting too.

### Who fills the data in, and does anyone pay them

StakeNet is two programs, and the split matters:

- **Validator History** is the data layer. Up to **512 epochs per validator**, in one `zero_copy`
  account holding a `CircBuf` of per-epoch entries.
- **Steward** is the decision layer. It holds the SPL pool's `staker` authority and scores from
  that history.

**Most of the data is copied, not uploaded, and that is the clever part.** The instruction set
splits cleanly:

| Instruction | Who can call it |
|---|---|
| `copy_vote_account`, `copy_gossip_contact_info`, `copy_cluster_info`, `copy_tip_distribution_account`, `copy_priority_fee_distribution` | **Anyone.** `pub signer: Signer` with no authority constraint. |
| `update_stake_history`, `update_priority_fee_history`, `upload_validator_age` | **Oracle only.** `has_one = oracle_authority`. |

So it is only *partly* an oracle. The `copy_*` path is trustless by construction: the program reads
the real on-chain source account and copies from it, so a caller cannot lie. What genuinely needs
an oracle is the handful of fields that are not cheap to derive on chain, chiefly total active
stake, stake rank and superminority status, which come from a `getVoteAccounts` call. There is a
separate `priority_fee_oracle_authority` too, and `set_new_oracle_authority` to rotate them.

**Nobody gets paid.** No reward, fee-share or incentive appears anywhere in the keeper setup. The
quick-start is blunt about the direction of the money: the keeper keypair *"signs and pays for all
transactions"*. Jito runs its own keeper; anyone else running one is subsidising the network.

**This is worth internalising because Marinade is in the same position.** Marinade's cranks are
permissionless and equally unfunded, and in practice `marcrank` on a cron job does the work and
Marinade pays the fees. In both systems permissionless means *nobody can be locked out or held to
ransom*, not *a crowd of independent operators competes to do it*. It is a fallback guarantee, not
an active market.

Say that honestly if the topic comes up. "Anyone can turn the crank, and in practice we are the
ones who do, because we are the ones who care" is a much stronger answer than implying a
decentralised keeper economy that neither protocol has.

### The convergent guardrail, and this is the best find of the comparison

Steward caps how much stake can be unstaked per cycle, in basis points of the whole pool:

| Parameter | Value | Guards against |
|---|---|---|
| `scoring_unstake_cap_bps` | 750 | Churn from a new delegation set |
| `instant_unstake_cap_bps` | 1000 | Churn from instant-unstake triggers |
| `stake_deposit_unstake_cap_bps` | 1000 | Churn from deposits above target |

The README's stated reason: *"This helps prevent yield drag from excessive unstaking."*

**Marinade has exactly the same guardrail**, `max_stake_moved_per_epoch`, a percentage of total
lamports under control, enforced in the program and reset each epoch.

Two independent teams, different architectures, one on-chain and one off-chain, arrived at the
same rate limit for the same reason: **moving stake on Solana costs about two epochs of yield,
because redelegation was never enabled.** Neither team chose that constraint, and both had to
build the same defence against it.

That is the generous, credible way to talk about a competitor: not "we are better", but "this
constraint is real enough that everyone who builds this discovers it". It also quietly proves the
point about Solana's limits shaping architecture, without the deck having to argue it.

**This is the most interesting contrast in the whole deck, and it is a direct challenge to one of
the draft takeaways.** The old "what I would tell a builder" list says *put the decision logic
off-chain, put the enforcement on-chain*, on the grounds that a per-epoch auction over hundreds
of validators does not belong in a program. Jito put its selection logic **on chain** and made
the crank permissionless. Two serious teams, opposite answers.

Do not present the takeaway as settled wisdom. Present the trade:

| | Marinade, off-chain | Jito, on-chain |
|---|---|---|
| Cadence | Every epoch | Every 10 epochs |
| Allocation | By bid and score, unequal | Equal, top 400 |
| Verifiability | Merkle-settled results | Logic itself is readable and permissionlessly crankable |
| Flexibility | Change the algorithm without a deploy | Needs a program upgrade or DAO parameters |
| Cost | Off-chain compute is free and unbounded | Bounded by compute limits, hence 10 epochs |

The honest reading: **frequency and expressiveness pushed Marinade off chain, verifiability and
decentralisation pulled Jito on chain.** An auction clearing every epoch over hundreds of
validators is not something you can run inside a program. Scoring on a 10-epoch cadence with an
equal split is. The architecture follows from the product, not from taste.

### Helius: no selection at all

hSOL is a **single-validator** LST. All stake goes to the Helius validator at 0% commission.
Pool address `3wK2g8ZdzAH8FJ7PKr2RcvGh7V9VYson5hrVsJM5Lmws`, running Sanctum's SPL deployment,
listed as `SanctumSpl`.

There is no validator selection problem, because there is one validator, theirs. 0% fees on
issuance and 0% on MEV.

The product insight worth naming: **Helius can afford 0% because the LST is not the business.**
They sell RPC infrastructure. The validator and the LST are customer acquisition. Marinade has no
other business, so the protocol economics have to close on their own. Different constraint, so
different product.

## Where exit liquidity comes from: three answers

This extends the same question from the SPL note, and it is now a genuinely good slide because
there are three distinct architectures.

| | Mechanism | Capital | Price when scarce |
|---|---|---|---|
| **Marinade** | Liquidity pool **inside** the staking program, LP token, SOL and mSOL legs | Rented from LPs | Rises on a linear curve, 0.3% to 3%, hard cap 10% |
| **SPL / Jito** | Reserve stake account only | Owned by the pool | Flat fee, or `WithdrawSol` simply fails |
| **Sanctum / Helius** | **Externalised** to the shared Infinity AMM | Pooled across many LSTs | AMM pricing, shared across all Sanctum LSTs |

Sanctum's model is the clever one to call out: individual validator LSTs are tiny and would each
have terrible exit liquidity on their own, so Sanctum lets any validator mint a branded
single-validator LST and routes them all through **one shared exit pool**. It solves the
liquidity fragmentation that would otherwise make a single-validator LST useless.

So: Marinade owns its liquidity pool, Jito has none and relies on the reserve plus deep secondary
markets, Sanctum shares one pool across everybody.

## Suggested framing for the talk

Do not do a competitor scorecard. It looks defensive, and with other staking providers in the
room at a Solana summit it reads badly. Instead use them to make an architectural point:

> Every LST solves the same three problems: which validators, where does extra yield come from,
> and how do you get out early. Marinade answers with an auction, a bond, and an internal
> liquidity pool. Jito answers with an on-chain scoring program, MEV, and the reserve. Helius
> answers with one validator, zero fees, and somebody else's AMM. All three are coherent. The
> architecture follows from the answer.

That is generous to competitors, technically substantive, and still lands why Marinade's stack
looks the way it does.

## Verify before presenting

- ~~The 400-validator count and 10-epoch cadence~~ **verified from source 2026-08-15**. They are
  still DAO-tunable parameters, so re-read `programs/steward/README.md` near the talk date if a
  number goes on a slide.
- Whether Sanctum's `SanctumSpl` is a straight redeployment of SPL stake pool or a modified fork.
  Not verified, no local clone.
- Marinade's own validator count and TVL, for any side-by-side number.
- hSOL fee claims are from Helius marketing pages, not from code.

## Sources

- [Jito, deployed programs](https://www.jito.network/docs/jitosol/jitosol-liquid-staking/security/deployed-programs/)
- [Jito technical FAQs, why not fork SPL](https://www.jito.network/docs/jitosol/faqs/technical-faqs/)
- [Jito, SPL stake pool internals](https://docs.stakenet.jito.network/advanced/spl-stake-pool-internals.html)
- [Jito StakeNet introduction](https://docs.stakenet.jito.network/)
- [Jito Steward program overview](https://www.jito.network/docs/stakenet/jito-steward/program-overview/)
- [Jito Steward, managing validator states](https://docs.stakenet.jito.network/advanced/managing-validator-states.html)
- [stakenet source, programs/steward](https://github.com/jito-foundation/stakenet/tree/master/programs/steward)
- [Helius, all you need to know about hSOL](https://www.helius.dev/blog/what-is-hsol)
- [Helius, LSTs on Solana](https://www.helius.dev/blog/lsts-on-solana)
- [hSOL stake pool statistics, Solana Compass](https://solanacompass.com/stake-pools/3wK2g8ZdzAH8FJ7PKr2RcvGh7V9VYson5hrVsJM5Lmws)
- [jitoSOL stake pool statistics, Solana Compass](https://solanacompass.com/stake-pools/Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb)
- [sanctum-lst-list](https://github.com/igneous-labs/sanctum-lst-list/blob/master/sanctum-lst-list.toml)
