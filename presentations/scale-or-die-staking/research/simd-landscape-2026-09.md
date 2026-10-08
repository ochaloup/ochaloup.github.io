# The SIMD landscape, from a staking stack

Verified 2026-09-08. Statuses read from the `status:` frontmatter of a shallow clone of
`solana-foundation/solana-improvement-documents` at that date, not from blog posts. Dates and
rollout schedules come from Anza's published release schedules.

**Re-read the statuses before the talk.** Four of the entries below are mid-rollout and three are
expected to change status before 14 November.

## Why this document exists

The Belgrade deck carried one unstated motif: Marinade builds machinery where Solana has a gap, and
deletes it when the protocol catches up. It named two gaps, priority fees and transaction size, and
left the pattern as a closing line.

Between September and November 2026 that pattern stops being a motif and becomes a schedule.
Alpenglow activates. Transaction v1 is already live. Block revenue sharing is landing in agave
master. Slashing has a program. This note is the evidence for a talk that takes the pattern
seriously.

## Status table

| SIMD | Title | Status | Why a staking provider cares |
|---|---|---|---|
| 0033 | Timely vote credits | **Activated** | The current input to every validator scoring system |
| 0096 | Reward collected priority fee in entirety | **Activated** | Created the gap. 100% of priority fees to the validator, no in-protocol path to delegators |
| 0118 | Partitioned epoch reward distribution | **Activated** | Rewards are paid across the first blocks of an epoch, not at the boundary |
| 0148 | Stake program move instructions | **Activated** | `MoveStake` / `MoveLamports`. Solved moving value between your own accounts, not between validators |
| 0185 | Vote account v4 | **Accepted** | Splits `commission` into `inflation_rewards_commission_bps` and `block_revenue_commission_bps`, adds two collectors and `pending_delegator_rewards` |
| 0385 | Transaction v1 | Review | **Live on mainnet 9 Sept 2026.** 4096 bytes, no address lookup tables, still 64 accounts |
| 0326 | Alpenglow | Review | **Mainnet activation 28 Sept 2026.** Votes leave the chain. Rewards become per-vote-in-aggregate |
| 0357 | Alpenglow validator admission ticket | Review | 2,000 validator cap, VAT burned per epoch. A delegation decision becomes an admission decision |
| 0384 | Alpenglow migration | Review | The 82% stake threshold that gates the switch |
| 0123 | Block revenue distribution | Review | In-protocol block reward sharing. Strictly stake-proportional, no favouring a delegator |
| 0232 | Custom commission collector | Review | Breaks reading a reward row backwards onto a validator |
| 0180 | Vote account leader schedule | Review | Leader schedule keyed by vote account, while `getLeaderSchedule` answers in identities |
| 0249 | Delay commission updates | Review | Would retire half of what PSR covers. Only for the inflation commission |
| 0204 | Slashable event verification | Review | Feature gate `create_slashing_program`. Logs duplicate block proofs, changes no stake |
| 0212 | Slashing on Solana | **Not merged, PR only** | The economics. Burns delegated stake |
| 0490 | Upgrade stake to v5 | Review | Minimum delegation 1 lamport becomes **1 SOL**. `Merge` and `Split` change |
| 0550 | Double disinflation rate | Review | Taper -15% to -30%. Shrinks the part of yield nobody competes over |
| 0608 | Closed vote delegation cleanup | Review | Extends `DeactivateDelinquent`, the instruction behind Marinade's delinquent stake incident |
| 0022 | Multi stake | **Withdrawn** | Would have allowed redelegation inside one account. Dead since 2023 |
| 0196 | Migrate stake to core BPF | **Implemented** | The stake program is a BPF program now |
| 0406 | Maximum instruction accounts | Review | Caps accounts per instruction at 255 |
| 0437 | Incremental rent reduction | Idea | Step 1 shipped. `lamports_per_byte` 6960 to 6333, target 696 |
| 0599 | Remove inactive stakes from PER | Idea | Inactive stake accounts stop being walked at reward time |
| 0391 | Replace stake program floating point | Idea | Fixed point warmup and cooldown arithmetic |

## Rollout dates, as published

Agave 4.3, from Anza's schedule of 12 August 2026:

| Date | Event |
|---|---|
| 4 Sept 2026 | Mainnet upgrade candidate tagged |
| 8 Sept 2026 | 10% validator stake rollout |
| 9 Sept 2026 | **Transaction v1 on mainnet** |
| 14 Sept 2026 | 25% validator stake rollout |
| 21 Sept 2026 | General adoption recommended |
| 28 Sept 2026 | **Mainnet feature activation, Alpenglow** |

All dates are marked subject to change. The talk is on 14 November, so Alpenglow will have roughly
six weeks of mainnet epochs behind it. That is the single biggest reason this talk is worth giving
in November rather than in August.

## 1. Rewards you cannot read

The strongest section, and the one nobody else has published. Three SIMDs each break a different
part of reading what a validator earned, and Marinade's bid settlement and PSR both depend on
reading exactly that.

### The gap that started it

**SIMD-0096, Activated.** 100% of priority fees go to the validator. Before it, half were burned.
Good for validator economics, and it left Solana with no in-protocol way for a validator to hand any
of it back to the stake that earned it.

Two teams built a bridge over that gap, and the architectures are worth contrasting:

- **Marinade.** An off-chain auction. Validators bid PMPE, allocation runs highest to lowest until
  stake or constraints bind, and the last group in sets the clearing price. The bid is paid out of a
  bond through merkle settlements. Public: `ds-sam`, `validator-bonds`.
- **Jito.** JIP-16 extended the TipRouter NCN to distribute priority fees alongside tips, and
  Steward's scoring now grades a validator on its priority fee commission. Public reporting says a
  validator needs to share at least 50% to receive stake. Enforcement by scoring rather than by
  collateral.

Same gap, two mechanisms: Marinade prices it, Jito mandates it.

### What SIMD-0123 actually does

Status **Review**. Approved by stake-weighted vote in March 2025 at about 74.9%. Distribution is at
an epoch boundary, computed at the first block of epoch N off active stake in N-1, then partitioned
across the epoch's reward blocks. Validators set `block_revenue_commission_bps` and keep that; the
rest goes to every delegator in proportion to stake.

**The nuance that matters, and it cuts against the obvious reading.** SIMD-0123 shares
*proportionally with every delegator and offers no way to exclude or favour one*. A validator that
wants to attract one pool's stake specifically still cannot express that in protocol. So SIMD-0123
removes the need for bespoke *settlement plumbing*. It does not remove the need for a *market*.
The auction survives its own success; the bond settlement rail may not.

### What breaks in the data, concretely

**[PRIVATE: `marinade-finance/stakes-etl` README, dated 2026-09-07. See the clearance list.]**
The findings below are analysis of public agave source and public chain state, so they are
reproducible without the repo. The repo is where they are written down.

`inflation-etl` refuses any epoch reporting `features.block_revenue_sharing_active`, because it
would be wrong quietly rather than loudly, in two directions at once:

- `deposit_or_burn_fee` splits each block's revenue between the collector and the leader's own vote
  account, so the `Fee` reward rows carry only the validator's share. Block revenue is
  **under-counted**.
- The delegator half accrues in the vote account's `pending_delegator_rewards` and is paid out
  merged into the next epoch's `Staking` rows. `distribution.rs` writes
  `inflation.stake_reward + block_reward` as **one number**. Block revenue is **counted as
  inflation**.

No column anywhere separates the two revenues, so nothing downstream can tell. Every APY figure,
every PSR calculation and every bid settlement reads those rows.

As of 2026-09-07 the feature account `B1ockRevenueSharing111111111111111111111111` exists on no
cluster, and the implementation is landing in agave master `4.4.0-alpha.3`. The staker-payout half
additionally needs Alpenglow. The `Fee`-row half does not, **so the under-count breaks first**.

### SIMD-0232, and a griefing vector

Status Review. A validator may have its inflation commission paid to another account. Where several
vote accounts name the same collector, the runtime **merges their commissions into one reward row**
before emitting it, in agave's `accumulate_lamports`. The merge destroys the split, so the row
cannot be read backwards onto a validator.

And it can be forced. `validate_and_resolve_collector_key` asks the collector for no signature of
its own. **Anyone can point a throwaway vote account at somebody else's collector for the price of
one vote account's rent**, and merge their reward row. Sharing is not only an attack either: a
revenue-sharing program has every validator in a pool pointing at one PDA by design.

The consequence for anyone building on reward rows: attribution has to run **forward**, from vote
account to collector, because that direction is a function. Backwards is not.

Two more edges from the same source, both public-verifiable:

- A commission the runtime **burns** emits no row at all. `collector_type_checked` rejects a
  collector that is not system-program owned, is reserved, or would not be rent-exempt once the
  commission lands, and `load_and_reward_commission_accounts` then burns and returns before
  emitting. The validator earned it. Nothing is readable.
- A validator at **100% commission emits no staker row**, so the commission cannot be inverted out
  of the payout. 126 mainnet validators were at 100% as of epoch 1030.

### SIMD-0180, and why identity is the wrong key

Status Review. The leader schedule is keyed by **vote account**: agave builds it with
`leader_schedule_from_vote_accounts`, and `deposit_or_burn_fee` credits `self.leader.vote_address`.
A validator identity is not one vote account.

Measured on mainnet 2026-09-07: a `getProgramAccounts` read of the vote program held **6856 vote
accounts over 6468 distinct identities. 248 identities carried more than one**, and 9 of those were
leaders of epoch 1030 holding 2740 of its 432000 slots. RPC `getLeaderSchedule` answers in
identities: on epoch 1030 all 669 of its keys were `nodePubkey`.

So attributing block fees by the credited pubkey resolved as an identity is wrong, and under
SIMD-0232 the pubkey on a `Fee` row stops naming the leader at all.

### The ask for the room

If you ship a reward path, ship its attribution. One column separating inflation from block revenue
in the reward rows would remove an entire class of silent error from every staking provider, every
APY dashboard and every tax report on the network.

## 2. Stake does not move sideways

### What we know

Solana's stake-level `Redelegate` was specified and never enabled. SPL stake pool still carries the
instruction marked `#[deprecated(since = "2.0.0", note = "The stake redelegate instruction used in
this will not be enabled.")]`. Marinade deleted `crank/redelegate.rs` outright; git history has it.

So moving stake from validator A to B means deactivate, wait, land in the reserve, delegate, warm
up. The cost is not four epochs, it is the arc where nothing earns: **Deactivating still earns for
that epoch. Inactive and Activating earn nothing.** Inactive to Activating can happen in the same
epoch.

Every rebalance is therefore a trade of yield lost moving against yield lost staying. That is why
Marinade's auction emits `stakePriority` and `unstakePriority` rather than a bare target: the system
has to decide what is *worth* moving.

### The convergence worth showing

Two teams, opposite architectures, the same guardrail:

| | Cap | Where enforced |
|---|---|---|
| Stock SPL pool with a keypair staker | **none** | nowhere; only minimums and physics |
| Jito | `scoring_unstake_cap_bps` 750, `instant_unstake_cap_bps` 1000, `stake_deposit_unstake_cap_bps` 1000 | Steward, the program holding the staker key |
| Marinade | `max_stake_moved_per_epoch`, % of lamports under control | the staking program itself |

Steward's stated reason is "this helps prevent yield drag from excessive unstaking". Neither team
chose the constraint. Solana did.

### What changed

- **SIMD-0022 multi-stake is Withdrawn.** One account holding several `Delegation`s would have made
  redelegation an in-account operation. It has been dead since 2023. Worth saying out loud, because
  a room will assume it is coming.
- **SIMD-0148 is Activated**, and it is narrower than it reads. `MoveStake` aborts if the
  destination is active and source and destination are *not* delegated to the same vote account. An
  inactive destination becomes active with the source's delegation, so you can create active stake
  with no warm-up, but only on the validator you were already on. It solved moving value between
  your own accounts. It did not make stake move sideways.
- **SIMD-0490, stake v5, Review.** Minimum delegation goes from 1 lamport to **1 SOL**. `Merge` now
  moves all lamports rather than delegation plus reserve. `Split` is rewritten and self-splitting
  errors. Rent maths moves from `Meta.rent_exempt_reserve` to the `Rent` sysvar, to support the rent
  reduction work.

The 1 SOL floor is the one to think hardest about. Every partial-exit and dust-restaking strategy
assumes you can split small. Marinade's "claim extra balance" order exists precisely to re-stake MEV
that landed as undelegated lamports inside a stake account, and a 1 SOL floor puts a size on when
that is even possible.

### The ask

A movement primitive that does not cost an epoch. Failing that, say clearly that there will never be
one, so everyone can stop designing for it.

## 3. Who decides where stake goes

### The one question, asked of five designs

Every pool has something that decides where your stake goes. The interesting question is what that
something is.

| | What holds the decision | What it is |
|---|---|---|
| Stock SPL pool | the `staker` authority | a keypair or multisig. People |
| Jito | the `staker` authority, assigned to Steward | an on-chain program, permissionlessly cranked |
| Marinade | `manager_authority`, fed by an off-chain auction | a market |
| Sanctum single-validator LSTs | the depositor's choice of LST | nobody. One validator |
| SPL single-validator pool | nothing | a canonical pool per vote account, permissionlessly created |

Detail worth keeping for questions: in a stock SPL pool the `staker` key names the entire validator
set and can decrease stake "up to the total activated stake" on any validator, with no percentage
cap anywhere in the program. It cannot take the money, because withdrawals burn pool tokens. So the
honest risk statement is that the key cannot steal your principal but can destroy your yield.

Jito's split is the interesting engineering: **Validator History** is the data layer, up to 512
epochs per validator in one `zero_copy` `CircBuf`; **Steward** is the decision layer holding the
pool's staker authority. Most of the data is *copied, not uploaded*: `copy_vote_account`,
`copy_cluster_info`, `copy_tip_distribution_account` and friends take `pub signer: Signer` with no
authority constraint, so a caller cannot lie, because the program reads the real source account. Only
what cannot be derived on chain needs an oracle, chiefly total active stake, rank and superminority,
gated `has_one = oracle_authority`.

### What Alpenglow changes

This is the part that has not been written about from a staking seat.

**Votes stop being on-chain transactions.** The SIMD is plain: "votes are not transactions on chain
anymore, but just sent directly between validators."

**Rewards become per-vote-in-aggregate.** In slot s+8, and only that slot, the leader may post up to
two vote aggregates for the votes it saw for slot s. For each submitted vote in those aggregates the
voter receives `R × T / 2`, where R is fractional stake and T is target issuance per slot. The
submitting leader gets the same amount as each voter it included. Nodes receiving 0 SOL at the end
of the epoch are removed from the active set.

Three consequences for anyone scoring validators:

1. **Vote credits as a scoring input are on notice.** This is not hypothetical for Marinade:
   `ds-sam` reads `credits` per validator per epoch, filters candidates on `credits > 0` across the
   last three epochs, and its `sdk.ts` *throws* when credits data for an epoch is unavailable. That
   is a public repo, so the exposure is public too.
2. **Reward-earning becomes a latency property, and partly somebody else's choice.** Your vote earns
   if it reached the leader in time and the leader included it. The leader is paid per voter
   included, which aligns the incentive, but the mechanism is no longer "did you vote" and geography
   matters more than it did.
3. **Delegation becomes admission.** SIMD-0357 caps the set at the 2,000 highest-staked validators
   and charges a Validator Admission Ticket per epoch, burned. A validator that cannot fund the VAT
   is removed from the active set. So unstaking a small validator is no longer only a yield
   decision: it can be the thing that pushes it below its own cost floor. For anyone weighting
   decentralisation, that is a new and uncomfortable coupling.

**SIMD-0550, double disinflation, Review.** Doubling the taper from -15% to -30% shrinks inflation
rewards faster. Marinade's own decomposition is `totalPmpe = inflationPmpe + mevPmpe + bidPmpe`. If
the first term shrinks structurally, the terms that come from competition grow as a share of what a
staker earns. The auction gets more important as the protocol pays less.

### The ask

Whatever replaces vote credits must be readable per validator per epoch, from a snapshot, without an
oracle. Every stake pool on the network scores on that number.

## 4. PSR is not slashing, and slashing is coming

### What Marinade built, stated precisely

There is no protocol slashing on Solana today. A badly chosen validator costs rewards, not
principal.

Marinade's Protected Staking Rewards pays out **rewards a staker did not receive**, from a bond the
validator posted voluntarily. Principal is never touched. Publicly stated coverage: 100% of rewards
lost when uptime falls between 50% and 99%, and commission increases mid-epoch, which the site calls
commission rugging.

The pipeline, from the public `validator-bonds` README: `snapshot -> bid-distribution CLI ->
settlement JSON -> merkle trees -> on-chain settlements -> claims`. Same collateral pays two things,
the bid a validator promised and the rewards it failed to earn.

Worth saying once and then dropping: on Solana "slashing" means the protocol destroys staked
principal. Marinade cannot do that and does not.

### What is actually coming

- **SIMD-0204, Review.** Feature gate `create_slashing_program` deploys an enshrined program that
  verifies and records slashable events at an epoch boundary. Today it verifies exactly one
  infraction, `DuplicateBlockProof`. It explicitly "does not modify any stakes or rewards". It is a
  logger.
- **SIMD-0212 is not merged.** No file in `proposals/` as of 2026-09-08; it is a pull request and a
  discussion. It proposes the economics: a quadratic function of stake-weighted slashable offences
  in a reporting period, weight 1 for voting infractions and 10 for duplicate blocks, and it burns
  delegated stake.

Being accurate about this matters, because "Solana is getting slashing" is repeated widely and the
merged state of the repo says the economics have not been agreed.

- **SIMD-0249, delay commission updates, Review.** Commission changes would apply from a state one
  full epoch old, giving delegators time to react. That is exactly the harm PSR's commission
  coverage exists to absorb.

### The differences worth drawing

| | PSR today | Slashing as proposed |
|---|---|---|
| What is at risk | rewards that were not earned | delegated principal, burned |
| Whose money | the validator's, posted as collateral | the delegator's |
| Consent | voluntary, a bond the validator funded | involuntary |
| Who computes it | off-chain, settled by merkle proof | the runtime |
| Sizing | epochs of rewards. Marinade caps unstake fees at 0.2%, about four epochs of yield | a percentage of principal |

Two consequences to say out loud:

1. **Bond sizing changes category.** Covering "the rewards you missed" is a number in epochs of
   yield. Covering a burn is a percentage of principal. These are different instruments and a bond
   sized for the first does not cover the second.
2. **An LST price becomes exposed to a burn event.** Today an LST's price only goes up. After
   slashing it can go down for a reason that has nothing to do with the pool's own code, and every
   pool that quotes an exchange rate has to decide how to socialise that.

If SIMD-0249 lands, half of PSR's commission coverage is retired by the protocol. Only half though:
vote account v4 splits commission into inflation and block revenue, and SIMD-0249 as written speaks
only to the inflation rewards commission.

### The ask

Slashing needs a delegator-visible reporting path, not only a log. A staker needs to know that stake
was burned, whose it was, and why, without running a validator.

## 5. Getting out

### The three exits, and where liquidity comes from

Marinade Liquid exposes three; a stock SPL pool exposes roughly one and a half.

| Exit | Marinade | SPL stake pool |
|---|---|---|
| Instant, from a liquidity pool, fee by scarcity | yes, 0.3% to 3% | no |
| Ticket, claim after cooldown | yes, `delayed_unstake_ticket` | no |
| Receive a raw stake account and wait | yes | yes, the main path |
| SOL from the reserve | yes | yes, reserve-limited |

The fee curve is a straight line from `lp_max_fee` at zero liquidity to `lp_min_fee` once the SOL
leg reaches `lp_liquidity_target`, initially 10,000 SOL, with `validate()` hard-capping the max at
10%. The price is proven and bounded. The *supply* is not: the SOL leg is funded by third-party LPs
and nobody is obliged to provide it. The program says so in a comment, which is the honest version
of an economic assumption:

```rust
// We assume this pool is always UNBALANCED, there should be more SOL than mSOL 99% of the time
```

The failure mode is mild. If the leg empties, instant unstake becomes unavailable and the user falls
back to the ticket, which is where an SPL pool user lives permanently.

Three architectures, one problem:

| | Capital | Price when scarce |
|---|---|---|
| Marinade | rented from LPs, inside the staking program | rises on a linear curve to a 10% cap |
| SPL / Jito | owned reserve, refilled on the epoch clock | flat, or `WithdrawSol` fails |
| Sanctum | externalised into Reserve and Infinity, shared across LSTs | by utilisation of the shared pool |

Sanctum's is the clever one for a reason worth naming: a single-validator LST is tiny and would have
useless exit liquidity alone, so pooling every LST's exit into one place is what makes the
single-validator LST viable at all.

Instant unstake for a raw stake account is a different mechanism again: an atomic swap, the buyer
takes the account and inherits the cooldown, and the gap between what you get and what the account
holds is the price of not waiting. It works on stake accounts no pool ever touched.

### The 1232-byte story, and its correction

Good decentralisation means a user's stake sits on 100+ validators, which means 100+ stake accounts.
Exiting means finding a subset that sums to the requested amount, deactivating each, merging next
epoch, then one withdrawal. None of that fits in one transaction.

**[PRIVATE: `marinade-finance/native-staking`. See the clearance list.]** What grew on top of that:
a byte-length-driven greedy bin-packer against `MAX_TX_SIZE = 1232`, address lookup tables,
bundles, two queues, three stages, a redo log, a dead letter queue, a resume cursor and a saga
compensation with a bounded retry. A textbook distributed system behind a withdraw button.

**And here is the correction that makes this section worth giving to this audience.** Transaction v1
went live on mainnet on 9 September 2026. From the SIMD-0385 constraint table:

| value | v1 | prior |
|---|---|---|
| transaction size | 4096 | 1232 |
| num accounts | **64** | **64** |
| num instructions | 64 | 64 |
| signatures | 12 | 12 |

The byte limit tripled. **The account ceiling did not move, and v1 does not support address lookup
tables at all.** For a transaction whose cost is dominated by account references rather than
instruction data, v1 is not obviously a win: 64 static accounts at 32 bytes each is 2048 of the 4096
bytes, and the thing that actually bounds a hundred-stake-account exit is the count, not the size.

So the honest version of "the protocol will delete our machinery" is: it deletes the ALT plumbing and
the byte-counting, and it leaves the fan-out exactly where it was. **SIMD-0406 is the one to watch**,
and the ask is the account ceiling.

Rent is the quieter win. SIMD-0437 step 1 cut `lamports_per_byte` from 6960 to 6333, with a target of
696, a 90% reduction across five gates. On tens of thousands of stake accounts that is real money,
and it changes the account-count economics that motivated canonical stake accounts in the first
place.

### The ask

Raise the account ceiling. The byte limit was never the interesting half.

## 6. The instruction that deactivated our stake, and the SIMD extending it

The best single beat available, and it is a genuine war story with a live proposal attached.

Solana shipped `DeactivateDelinquent`: permissionless, needing no stake authority signature. A third
party could flip a Marinade-owned stake account to deactivating while Marinade's own mirror of that
state still said active. `UpdateDeactivated` then subtracted from a bucket the stake was never in,
underflowed, and stranded the SOL. Nothing was stolen. The state machine refused a transition it had
no rule for, **which is exactly why the money got stuck**. Fixed with a detector and a resumable
two-phase migration that refuses to declare itself finished unless both passes agree to the lamport,
`require_eq!(delinquent_balance_left, 0)`.

The lesson is not "we had a bug". It is that **protecting correctness and protecting liveness are
different jobs**, and a state machine that is right can still strand funds.

**SIMD-0608, Review, filed 24 August 2026.** It extends `DeactivateDelinquent` to treat stake as
delinquent when its vote account is no longer owned by the vote program or contains uninitialised
data. Written for a real problem: stake delegated to a closed vote account is an orphaned delegation
with no permissionless way out.

It is also the same class of change, again. Any program that mirrors the state of stake accounts it
does not exclusively control now has a second way for that mirror to go stale, and this one triggers
on an event the program cannot observe from its own accounts.

The general principle for the room: **a permissionless instruction on an account somebody else's
program is tracking is a liveness change, not only a convenience.** Ship them, but say in the SIMD
what invariant a dependent program can no longer assume.

## Where the material comes from

### Public and safe to cite

| What | Where |
|---|---|
| SIMD text and statuses | `solana-foundation/solana-improvement-documents`, `proposals/` |
| Rollout dates | Anza's Agave 4.3 release schedule, published 12 Aug 2026 |
| Auction mechanism, credits as an input | `marinade-finance/ds-sam` |
| Bonds, PSR, settlement pipeline | `marinade-finance/validator-bonds` |
| Liquidity pool, fee curve, fee ceilings | `marinade-finance/liquid-staking-program` |
| Reclaiming stake authority without Marinade | `marinade-finance/how-to-native-staking` |
| PSR figures | marinade.finance public pages, `marinade-finance/psr-dashboard` |
| Steward, Validator History, caps | `jito-foundation/stakenet`, `programs/steward/README.md` |
| Jito priority fee sharing | JIP-16, forum.jito.network |
| SPL pool authorities and instruction gating | `solana-program/stake-pool` |
| Sanctum Reserve and Infinity | sanctum.so public documentation |
| agave internals named above | `anza-xyz/agave` |

### Private, needs clearance before it goes on a slide

Listed with what the public substitute is, where one exists.

| Claim | Private source | Public route |
|---|---|---|
| The `Fee` row under-count and the merged `Staking` row under SIMD-0123 | `stakes-etl` README | SIMD-0123 text plus agave `deposit_or_burn_fee` and `distribution.rs`. Reproducible |
| The SIMD-0232 collector merge and the missing-signature griefing vector | `stakes-etl` README | agave `accumulate_lamports`, `validate_and_resolve_collector_key`. Reproducible |
| 6856 vote accounts / 6468 identities / 248 with more than one, epoch 1030 | `stakes-etl` README | a `getProgramAccounts` read anyone can repeat. **Re-derive before the talk and quote your own number** |
| 126 validators at 100% commission, epoch 1030 | `stakes-etl` README | same. Re-derive |
| `getLeaderSchedule` returning 669 identity keys on epoch 1030 | `stakes-etl` README | public RPC. Re-derive |
| The native staking exit pipeline: `MAX_TX_SIZE`, bin-packing, queues, redo log, DLQ, saga compensation, order schedule | `native-staking` | **none.** The repo is PRIVATE, not public. See the correction below |
| Instant unstake auction mechanics beyond "somebody buys your stake account" | `unstake-program`, `unstake-auction-service` | none. Both non-public |
| Anything about Marinade's own Alpenglow validator rollout | `ansible`, `internal-docs` | none |

**Correction to carry forward.** `research/native-staking-undelegation.md` in the Belgrade repo
states that `marinade-finance/native-staking` "is a public repo, so this material is safe to
present". It is not: `gh repo view` reports **PRIVATE** as of 2026-09-08. `unstake-program` reports
INTERNAL. The Belgrade deck's native section was built on that assumption. Nothing published can be
unpublished, but this talk goes deeper into exactly that machinery, so the assumption has to be
fixed before it is relied on again.

## Still to verify before 14 November

1. **Statuses.** Re-read the frontmatter. 0123, 0204, 0490 and 0608 are all live proposals.
2. **Did Alpenglow actually activate on 28 September**, and on what epoch. The talk's tense depends
   on it, and "we have run six weeks of it" is the strongest version.
3. **Whether the block revenue feature gate is on any cluster yet**, and whether the agave
   implementation still merges the two revenues into one `Staking` row. If a separating column has
   been added since, section 1's ask is already answered and the section needs rewriting.
4. **What replaced vote credits in practice** after Alpenglow, and whether `ds-sam` still reads
   `credits`. If Marinade has already shipped a change here, that is the talk's best single piece of
   new information and it should be promoted.
5. **SIMD-0212's merged state.** If it lands as a proposal file before November, section 4 changes
   from "not agreed" to "agreed, here are the numbers".
6. **The mainnet counts** in the clearance table. Re-derive them yourself, in public, and quote your
   own numbers.
7. **Marinade's live liquidity pool configuration**, since the code comments say "initially".
8. Whether canonical stake accounts are live, and whether `tx-router` still carries the fallback
   path.
