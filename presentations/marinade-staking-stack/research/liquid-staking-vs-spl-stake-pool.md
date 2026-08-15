# Marinade's program vs the SPL stake pool

Research note for the Liquid Staking section: what is technically different about Marinade's
program compared to the standard library pool. Read from the three program sources locally.

## The one-line version

The SPL stake pool is a pool. Marinade is a pool with a liquidity backstop bolted inside it, and
that backstop is what makes "unstake right now" possible at all.

## Three programs, three scopes

| | Scope | Program |
|---|---|---|
| **SPL Stake Pool** | Many validators, one LST, manager-operated | `spl-stake-pool` |
| **SPL Single-Validator Stake Pool** | Exactly one validator, fully permissionless, zero fees | `SVSPxpvHdN29nkVg9rPapPNDddN5DipNLRUFhyjFThE` |
| **Marinade Liquid** | Many validators, mSOL, plus an internal SOL/mSOL liquidity pool | `MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD` |

### What single-pool is, since it was an open question

From its README: *"an onchain program that enables liquid staking with zero fees, no
counterparty, and 100% capital efficiency. The program defines a canonical pool for every vote
account, which can be initialized permissionlessly."*

One pool per vote account, created by anyone, no manager, no fee, no validator selection. It is
the minimal wrapper that turns one validator's stake into a token. Not a competitor to Marinade,
it is a primitive. Worth one sentence at most, mainly to make the point that "liquid staking
program" spans a wide range of ambition.

Note it also does permissionless MEV harvesting, same problem Marinade Native solves with its
"claim extra balance" order. Nice cross-reference if the Native section already covered it.

## The real difference: Marinade has a liquidity pool inside the staking program

This is the thing to put on a slide. `state/liq_pool.rs`:

```rust
pub struct LiqPool {
    pub lp_mint: Pubkey,
    pub msol_leg: Pubkey,
    /// Liquidity target. If the Liquidity reach this amount, the fee reaches lp_min_discount_fee
    pub lp_liquidity_target: u64,   // 10_000 SOL initially
    pub lp_max_fee: Fee,            // 3% initially
    pub lp_min_fee: Fee,            // 0.3% initially
    pub treasury_cut: Fee,          // 25% of the unstake fee
    ...
}
```

A second token, LP, a SOL leg and an mSOL leg, and a **dynamic fee curve**. The unstake fee is
not fixed. It slides between 0.3% and 3% depending on how depleted the SOL leg is against the
10,000 SOL target. The fee is the price of scarcity: the emptier the pool, the more it costs to
be the next person out.

The source comment is refreshingly direct about the assumption the design rests on:

```rust
// We assume this pool is always UNBALANCED, there should be more SOL than mSOL 99% of the time
```

Two things worth saying out loud from that one line. First, it is an economic assumption written
into a program, not a mathematical invariant. Second, someone wrote down the 99% case and shipped
the fee curve as the defence for the other 1%. That is honest engineering and it makes a good
talk moment.

### Why it matters

The SPL stake pool can only pay you SOL out of its reserve. Past that, `WithdrawStake` hands you
a **stake account**, and you deactivate and wait out the cooldown yourself. Marinade's liquidity
pool means a user can swap mSOL for SOL immediately, at a fee that reflects available liquidity,
without touching the delegation machinery at all.

And there is a third path: a `delayed_unstake_ticket`. Instead of handing back a stake account,
Marinade issues a ticket account representing a claim, redeemable after the cooldown. The user
never has to know what a stake account is.

So Marinade exposes three exits where the SPL pool exposes roughly one and a half:

| Exit | Marinade | SPL stake pool |
|---|---|---|
| Instant, from a liquidity pool, dynamic fee | Yes | No |
| Ticket, claim after cooldown | Yes, `delayed_unstake_ticket` | No |
| Receive a raw stake account, wait yourself | Yes | Yes, the main path |
| SOL straight from the reserve | Yes | Yes, reserve-limited |

## Other structural differences

- **Stake account bookkeeping.** SPL keeps one stake account per validator plus a *transient*
  account per validator for in-flight increase and decrease. Marinade keeps a list of stake
  accounts in its own `stake_system` that is not one-per-validator, which is exactly the
  looseness the canonical stake work is now tightening up. See
  `liquid-staking-canonical-stake.md`, and note the two notes connect: Marinade is moving toward
  the property SPL had by construction, but for its own reasons.
- **Framework.** Marinade is Anchor. SPL stake pool is a native program with a hand-rolled
  `big_vec` for its lists.
- **Admin surface.** Marinade carries `emergency_unstake` and `partial_unstake` admin
  instructions, which is what made the delinquent fix expressible. SPL has manager and staker
  roles with `SetFee`, `SetManager`, `SetStaker`, and no equivalent emergency path.
- **Per-epoch crank.** Both need one. SPL: `UpdateValidatorListBalance`,
  `UpdateStakePoolBalance`, `CleanupRemovedValidatorEntries`. Marinade: `update_active`,
  `update_deactivated`, `stake_reserve`, `merge_stakes`. Same shape of problem, different names.

## What it means for a standard user

The architectural difference above only matters if it changes something the user feels. It does,
in four places.

### 1. Getting out in a hurry

- **Marinade.** Swap mSOL for SOL immediately from the internal liquidity pool. Price is the
  dynamic fee, 0.3% to 3%.
- **SPL stake pool.** `WithdrawSol` works only while the reserve has SOL. Past that you get
  `WithdrawStake`, which hands you a **stake account**. You then deactivate it and wait out the
  cooldown yourself, and you need to know what a stake account is.

  Marinade wins on user experience, clearly. But the honest caveat is worth saying on stage:
  **the fee is highest exactly when you most want to leave.** The curve prices scarcity of SOL in
  the pool, and the pool is emptiest during a rush. It is good protocol design and a bad surprise
  for the user who panics with everyone else.

### 2. Getting out patiently

- **Marinade.** A `delayed_unstake_ticket`, a claim you redeem after the cooldown. You never
  touch a stake account.
- **SPL stake pool.** The stake account is the receipt.

Same waiting period either way. The difference is entirely in who carries the complexity.

### 3. How you are protected from fee changes

This is the real philosophical split, and both are defensible.

**Marinade puts hard ceilings in the program.** From `state/mod.rs`:

```rust
pub const MAX_REWARD_FEE: Fee = Fee::from_basis_points(1_000);            // 10%
// Note as of July 2023, observable staking reward per epoch is 0.045%
// set a max fee to protect users
pub const MAX_DELAYED_UNSTAKE_FEE: FeeCents = FeeCents::from_bp_cents(2000);       // 0.2%
pub const MAX_WITHDRAW_STAKE_ACCOUNT_FEE: FeeCents = FeeCents::from_bp_cents(2000); // 0.2%
```

Plus the liquidity pool's own `MAX_FEE` of 10%. These are compile-time constants. No admin, no
governance vote, no upgrade short of redeploying the program can push the fee past them. Note
the comment showing its work: one epoch of rewards is about 0.045%, so a 0.2% cap is deliberately
sized at roughly four epochs of yield.

**The SPL stake pool rate-limits changes instead of capping them.** Fee changes land through
`FutureEpoch`, which delays them by up to two epoch boundaries, and withdrawal fee increases are
additionally limited per epoch to ×1.5 or +0.5%, whichever binds first:

```rust
/// Maximum factor by which a withdrawal fee can be increased per epoch
/// protecting stakers from malicious users.
pub const MAX_WITHDRAWAL_FEE_INCREASE_FACTOR: Fee = Fee { numerator: 3, denominator: 2 };
pub const MAX_WITHDRAWAL_FEE_INCREASE: Fee = Fee { numerator: 1, denominator: 200 };
```

But note what is *not* capped: `check_withdrawal` is the only such guard in the program. The
`epoch_fee`, the cut taken from staking rewards, has **no ceiling in code**. It is delayed, so
you get notice, and you can leave. It is not bounded.

So the user-facing trade is:

| | Marinade | SPL stake pool |
|---|---|---|
| Reward fee | Can never exceed 10%, enforced in code | No ceiling, but changes are delayed |
| Unstake fees | Capped at 0.2% | Rate-limited, ×1.5 or +0.5% per epoch, delayed |
| Protection model | **A ceiling you can verify once** | **A speed limit plus advance warning** |

Neither is strictly better. A ceiling means you never have to watch. A speed limit plus notice
means you do have to watch, but nothing is permanently off the table for the operator either.
That framing works for a mixed room: it is a governance question, not a Rust question.

### 4. Who decides where your stake goes

- **Marinade.** SAM, an auction plus continuous scoring, spread across 100+ validators.
- **SPL stake pool.** Whatever validator list the pool's manager configured. The program is a
  template, so quality varies entirely by operator. Some are excellent, some are one person.
- **Single pool.** You pick, and it is exactly one validator. No rebalancing, no reaction if that
  validator degrades or goes delinquent. Maximum simplicity, maximum concentration.

### Honest flaws on the Marinade side

Worth including so the comparison does not read as a sales pitch:

- The instant-unstake fee is variable and spikes under stress, see above.
- More machinery means more audit surface. Single pool is a few hundred lines and three audits.
  Marinade has a liquidity pool, a ticket system, a validator system, and a stake system.
- The liquidity pool depends on third parties choosing to fund it. See the section below, which
  corrects a sloppier version of this claim from an earlier draft.
- One caveat on the whole comparison: the SPL program *allows* deposit and withdrawal fees, but
  many real pools built on it set them to zero. Compare capabilities here, not headline numbers,
  and check a specific pool's live configuration before quoting one.

## Where the instant exit liquidity actually comes from

Two mechanisms, and the contrast is one of the better technical beats available for this section.

### Marinade: rented liquidity, priced by scarcity

The pricing itself is fully deterministic and hard-bounded, `state/liq_pool.rs`:

```rust
/// compute a linear fee based on liquidity amount, it goes from fee(0)=max -> fee(x>=target)=min
pub fn linear_fee(&self, lamports: u64) -> Fee {
    if lamports >= self.lp_liquidity_target {
        self.lp_min_fee
    } else {
        Fee { basis_points: self.lp_max_fee.basis_points
            - proportional(self.delta() as u64, lamports, self.lp_liquidity_target).unwrap() as u32 }
    }
}
```

A straight line: maximum fee at zero liquidity, sliding down to the minimum once the SOL leg
reaches the target. `validate()` hard-caps `lp_max_fee` at 10%. So the *price* of exiting is
proven, bounded, and readable from the program.

What is **not** guaranteed is the *supply*. The SOL leg is funded by third-party liquidity
providers who mint LP tokens and earn the unstake fees. Nobody is obliged to provide it. The fee
curve is the incentive, scarcer liquidity means a higher fee means a better return for whoever
tops it up, but that is a behavioural expectation about market participants, not an invariant the
program enforces. That is what the source comment is really admitting:

```rust
// We assume this pool is always UNBALANCED, there should be more SOL than mSOL 99% of the time
```

**Correction to an earlier draft of this note.** I first wrote that the design "rests on an
assumption rather than a proof", which was too loose. The mechanism is proven. The liquidity
supply is assumed. Those are different claims and only the second one is true.

**And the failure mode is mild.** If the SOL leg empties, nothing breaks and no money is at risk.
Instant unstake simply becomes unavailable, and the user falls back to the delayed unstake
ticket. That fallback is exactly where an SPL stake pool user lives all the time. Marinade
degrades *to* the SPL behaviour rather than below it, so this is a strict superset, not a risk
the SPL design avoids.

### SPL stake pool: an owned buffer, refilled on a clock

The SPL program has no liquidity pool and no LP token. Its equivalent is the **reserve stake
account**, and the instruction docs are blunt about the same failure mode:

> `WithdrawSol`: "Withdraw SOL directly from the pool's reserve account. **Fails if the reserve
> does not have enough SOL.**"

The reserve is protocol-owned rather than rented. It fills from two places: SOL deposited but not
yet delegated, and stake pulled back from validators via `DecreaseValidatorStake`, which splits
into a transient stake account and has to wait out deactivation before the lamports are usable.

So refilling is on the epoch clock and requires the pool's staker to actively decide to do it.
There is also no scarcity pricing: `sol_withdrawal_fee` is flat whether the reserve is full or
nearly empty.

### The comparison in one line

|  | Marinade liquidity pool | SPL reserve |
|---|---|---|
| Capital | Rented from third-party LPs | Owned by the pool |
| Refill speed | Instant, an LP can deposit any time | An epoch, stake must deactivate first |
| Refill trigger | Fee incentive, permissionless | Staker decides, permissioned |
| Price when scarce | Rises, up to a 10% hard cap | Flat, unchanged |
| If empty | Fall back to the ticket, wait the cooldown | Fall back to `WithdrawStake`, wait the cooldown |

**Neither design removes the underlying constraint.** Solana makes you wait out a cooldown to
turn stake into SOL. Somebody has to front the SOL if you do not want to wait. Marinade rents
that SOL and lets the price float with how scarce it is. SPL keeps its own buffer and refills it
on the epoch clock at a flat price.

Marinade turns the wait into a price. SPL leaves it as a wait. That is the sentence for the
slide.

## Who decides where the stake goes, in each design

This answers a direct question and turns out to be the best available framing for a comparison
slide, because it is one question asked of three systems rather than a feature table.

**The SPL stake pool has a `staker` authority.** It is a single account, and the instruction docs
gate the delegation surface on it explicitly:

- `(Staker only)` — `AddValidatorToPool`, `RemoveValidatorFromPool`, `IncreaseValidatorStake`,
  `DecreaseValidatorStake`, `SetPreferredValidator`, `Redelegate`
- `(Manager only)` — fees, roles, funding authorities
- `SetStaker` is "Manager or staker only"

So in a stock SPL pool, **one keypair decides the entire validator set and every stake movement.**
That is the honest answer, and it is why "who holds the staker key" is the real question to ask
about any SPL-based LST.

**What each protocol puts in that seat:**

| | Who decides delegation | What that thing is |
|---|---|---|
| Most SPL pools | The `staker` authority | A keypair or multisig, i.e. people |
| **Jito** | The `staker` authority, assigned to **Steward** | An on-chain program, permissionlessly cranked |
| **Marinade** | `manager_authority` on its own program | A keypair, fed by an off-chain auction where validators bid |

**This is the comparison slide.** Not features, not fees, not liquidity. *Every pool has someone
who decides where your stake goes. The interesting question is what that someone is.* A person, a
program, or a market. All three answers are defensible, and Marinade's is the only one where the
validators themselves compete on price for the privilege.

It also sets up L4 directly: if the answer is "a market", the next question is how that market
clears.

## What `staker` actually is, and why redelegation is the real story

### `staker` is a pool-level authority, not the depositor

Confirmed from `stake-pool/program/src/state.rs`, and the doc comments say it outright:

```rust
/// Manager authority, allows for updating the staker, manager, and fee account
pub manager: Pubkey,

/// Staker authority, allows for adding and removing validators, and
/// managing stake distribution
pub staker: Pubkey,
```

Two single pubkeys stored on the `StakePool` account. **The `staker` has nothing to do with the
people depositing SOL.** Anyone can deposit; the depositor gets pool tokens and no authority at
all. The `staker` is one key that names the validator set and moves stake between validators.

So the mental model is right: a specific keypair says "these are the validators", and the program
distributes deposits according to what that key set up.

### Redelegation does not exist on Solana. That is the important part.

This was the interesting find. **Solana's stake-level `redelegate` instruction was never
enabled**, and both implementations had to back out of it:

- SPL still carries the instruction, explicitly deprecated:
  ```rust
  #[deprecated(
      since = "2.0.0",
      note = "The stake redelegate instruction used in this will not be enabled."
  )]
  Redelegate { ... }
  ```
- Marinade **removed** its `crank/redelegate.rs` entirely. Git history shows it existed; the
  crank directory now holds only `update`, `stake_reserve`, `deactivate_stake`, `merge_stakes`,
  `create_canonical_stake` and the two delinquent-migration instructions.

**Consequence, and this is a genuinely good talk point:** you cannot move stake sideways on
Solana. To move stake from validator A to validator B you must deactivate on A, wait out the
cooldown, let it land in the reserve, then activate on B and wait for warm-up. That is roughly
**two epochs, about four days, during which that SOL is earning less or nothing.**

So rebalancing is not free bookkeeping, it is a real yield cost paid by the stakers. That is why
the auction emits `stakePriority` and `unstakePriority` rather than just a target allocation:
the system has to decide **what is worth moving**, not only where things should end up.

### What the SPL `staker` can actually do, and what bounds it

Yes, the SPL `staker` is the same *kind* of role as Marinade's manager authority: it drives
rebalancing. But the powers are bounded very differently.

**What the staker can do:** add and remove validators, decrease stake on any validator, increase
stake on any validator from the reserve, set a preferred deposit/withdraw validator. The
`DecreaseValidatorStake` docs are explicit about the amount:

> "This instruction splits some amount of stake, **up to the total activated stake**, from the
> canonical validator stake account, into its 'transient' stake account."

**There is no percentage cap. Searched `state.rs` and `processor.rs` for any movement counter,
epoch tracker or cap: zero hits.** The SPL program has no equivalent of
`max_stake_moved_per_epoch`. A staker can drain a validator to zero in one instruction, and
every validator in the same epoch.

**What actually bounds the staker is mechanical, not policy:**

1. **One transient stake account per validator.** `DecreaseValidatorStake` "only succeeds if the
   transient stake account does not exist", which naturally limits a validator to one in-flight
   move. But `DecreaseAdditionalValidatorStake` and `IncreaseAdditionalValidatorStake` exist
   precisely to do a second move in the same epoch using an ephemeral account, so even this is
   bypassable by design.
2. **Minimum amounts.** At least rent-exemption plus
   `max(MINIMUM_ACTIVE_STAKE, get_minimum_delegation())`.
3. **Physics.** Deactivation takes an epoch, activation takes an epoch. This is the real brake,
   and it applies to everybody.

**What the staker cannot do: take the money.** The instruction docs state the design intent
directly, "in order to rebalance the pool **without taking custody**, the staker needs a way of
reducing the stake". The stake authority is a program PDA; the staker only signs to authorise the
program to act. Withdrawals require burning pool tokens, so there is no path from staker key to
SOL in a pocket.

So the honest risk statement for a stock SPL pool: **the staker key cannot steal your principal,
but it can destroy your yield**, by churning stake so aggressively that everything sits in warm-up
and cool-down.

### Where the guardrail lives, in each design

| | Cap on stake movement | Where it is enforced |
|---|---|---|
| Stock SPL pool, keypair staker | **None** | Nowhere. Only physics and minimums. |
| **Jito** | `scoring_unstake_cap_bps` 750, `instant_unstake_cap_bps` 1000, `stake_deposit_unstake_cap_bps` 1000 | In **Steward**, the program that holds the staker key |
| **Marinade** | `max_stake_moved_per_epoch`, % of total lamports under control | In **the staking program itself** |

All three can rebalance. None can steal. The difference is whether a cap exists at all, and if so
how deep it sits. Marinade's is in the pool program, so it binds regardless of who holds the
authority. Jito's is in the layer above, which is program-enforced too but is a different program
with its own admin surface, including documented "passthrough instructions for SPL Stake Pool".

**This strengthens L2 considerably.** "Who holds the staker key" is not a rhetorical question for
a stock SPL pool: that key has unlimited rebalancing power over the whole pool, and nothing in the
program says otherwise.

### Marinade caps its own rebalancing on chain

`state/mod.rs`:

```rust
pub last_stake_move_epoch: u64,     // epoch of the last stake move action
pub stake_moved: u64,               // total moved during that epoch
pub max_stake_moved_per_epoch: Fee, // % of total_lamports_under_control
```

`on_stake_moved()` resets the counter at each epoch boundary and rejects anything that would push
`stake_moved` past the cap.

**This is a rate limit on Marinade itself, enforced by the program.** However wrong the off-chain
scoring got, and whoever held the manager key, only a bounded percentage of the pool can move in
a single epoch. It is a strong counterweight to the honest admission that the *policy* is
Marinade's: the policy is ours, but the program bounds how fast we can apply it.

Worth adding to the L3 speaker notes as the answer to "so you can do whatever you like with my
stake?" No. Not in one epoch.

## Suggested slide framing

Do not do a feature table on stage, it will not read. One comparison and one code quote:

1. **Everyone's stake pool answers "how do I get a token for my stake".** Marinade also had to
   answer **"how do I get out right now"**, and the answer was to put an AMM-ish liquidity pool
   inside the staking program with a fee curve priced on scarcity.
2. Show the `// We assume this pool is always UNBALANCED` comment. It is the honest version of
   an economic design decision, in three lines of Rust.

## Sources

| What | Where |
|---|---|
| Liquidity pool, fee curve, the unbalanced assumption | `liquid-staking-program/programs/marinade-finance/src/state/liq_pool.rs` |
| Ticket exit path | `.../state/delayed_unstake_ticket.rs` |
| Marinade user instructions | `.../instructions/user/` |
| Marinade admin instructions | `.../instructions/management/` |
| SPL instruction set | `stake-pool/program/src/instruction.rs` |
| SPL docs | https://spl.solana.com/stake-pool |
| Single pool overview and audits | `single-pool/README.md` |

## Still to check

- Current live values of `lp_liquidity_target`, `lp_min_fee`, `lp_max_fee`. The code comments say
  "initially", so the deployed configuration may differ. Read the on-chain state before quoting
  numbers on a slide.
- Whether the SPL stake pool has since gained anything equivalent to the liquidity pool. The
  local clone may be behind upstream.
