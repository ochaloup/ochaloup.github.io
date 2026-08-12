# Use case 1: the delinquent stake incident

Research note for the Liquid Staking section. Everything below is read from source, not from
memory. Sources are listed at the bottom so the claims can be re-checked before the talk.

## The one-line version

Marinade's program assumed it was the only actor that could change the state of its own stake
accounts. Solana later shipped an instruction that let **anyone** change it. Nothing was stolen,
but SOL got stranded.

## The invariant that made it safe

The liquid staking program keeps its own mirror of every stake account it owns:

- a `StakeRecord` per stake account, in the stake list
- `active_balance` per validator, in the validator list
- `total_active_balance` globally, in `State`

The mSOL price is derived from those totals. So the program's state machine treats them as
authoritative, and every transition between active, cooling down, and emergency-unstaking runs
through Marinade's own crank instructions. That closed loop is the security property: outside
code cannot make the program mis-price mSOL.

## What Solana changed under it

Solana added the `DeactivateDelinquent` stake instruction. It is **permissionless**. Anyone can
deactivate a stake account whose validator has not voted for
`MINIMUM_DELINQUENT_EPOCHS_FOR_DEACTIVATION` epochs, proving the delinquency by passing a
reference vote account that has voted. No stake authority signature is required. The only checks
are that the reference vote account has acceptable recent credits, that the delinquent vote
account matches the stake's `voter_pubkey`, and that the delinquency threshold is met.

Relevant code, `solana/programs/stake/src/stake_state.rs`:

```rust
if eligible_for_deactivate_delinquent(&delinquent_vote_state.epoch_credits, current_epoch) {
    deactivate_stake(invoke_context, &mut stake, &mut stake_flags, current_epoch)?;
    stake_account.set_state(&StakeStateV2::Stake(meta, stake, stake_flags))
} else {
    Err(StakeError::MinimumDelinquentEpochsForDeactivationNotMet.into())
}
```

This did not exist when Marinade was written. Delinquency was not a concept the program had to
defend against.

## What actually broke

A third party could now flip a Marinade-owned stake account from active to deactivating without
Marinade knowing about it.

1. On chain, the stake account is deactivating.
2. In Marinade's mirror, the `StakeRecord` still says active, and the amount is still counted in
   `validator.active_balance` and `total_active_balance`.
3. The crank eventually runs `UpdateDeactivated` on that account. That path assumed the stake was
   already sitting in one of the cooling-down buckets, `delayed_unstake_cooling_down` or
   `emergency_cooling_down`, and subtracted the amount from it.
4. The amount was in neither bucket. The subtraction underflows, the instruction fails, and it
   fails the same way every time.

The stake account is now stuck, and **the SOL behind it cannot be unstaked.**

### The framing worth using on stage

This was not a security breach. Nobody could steal anything, and mSOL could not be mis-minted.
The state machine did its job: it refused to process a transition it had no rule for. But an
outside actor could still push the program into a state with no legal exit, and that stranded
liquidity.

That is the transferable lesson: **an invariant strong enough to protect correctness can still
strand funds when the environment changes underneath it.** Defending the state machine and
defending liveness are two different problems.

## The fix, in two parts

The user remembered this as a two-part process. It is, and both parts are visible in the code.

### Part 1, the detector, so it cannot strand again

In `UpdateDeactivated`: if the on-chain account is deactivating but the internal record still says
active, treat it as an emergency unstake instead of failing. The program gains a legal transition
for "somebody else deactivated my stake".

```rust
if stake.is_active {
    // Detected deactivation of deliquent stake-account
    // applying emergency unstake procedure before processing the stake deletion
    require!(!stake.is_emergency_unstaking, MarinadeError::StakeAccountIsEmergencyUnstaking);
    stake.is_emergency_unstaking = true;
    self.state.emergency_cooling_down += stake.last_update_delegated_lamports;
    self.state.validator_system.total_active_balance -= stake.last_update_delegated_lamports;
    validator.active_balance -= stake.last_update_delegated_lamports;
    // ... write the validator record back
}
```

The accounting is corrected on the fly rather than underflowing.

### Part 2, the migration, to repair state already on chain

The `is_active` flag was new, so every `StakeRecord` already on chain had to be initialized, and
every validator's `active_balance` recomputed. Hundreds of accounts, so it cannot be one
transaction. It became a resumable cursor stored in program state:

```rust
pub enum DelinquentUpgraderState {
    IteratingStakes { visited_count, total_active_balance, total_delinquent_balance },
    IteratingValidators { visited_count, delinquent_balance_left },
    Done,
}
```

- **Phase 1** walks the stake list, initializes `is_active`, and sums what is genuinely active
  against what is genuinely delinquent.
- **Phase 2** walks the validator list, rewrites each `active_balance` to the recomputed value,
  and decrements `delinquent_balance_left` as it goes.
- Instructions refuse to touch indices the cursor has not reached yet, returning
  `MarinadeError::UpgradingData`.

The detail worth showing on a slide is the last check before the migration declares itself
finished:

```rust
if visited_count == self.state.validator_system.validator_count() {
    require_eq!(delinquent_balance_left, 0, MarinadeError::UpgradingInvariantViolation);
    self.state.delinquent_upgrader = DelinquentUpgraderState::Done;
}
```

The two passes have to agree to the lamport, or the migration refuses to complete. **The
migration proves itself correct before declaring done.** That is a good closing beat for the use
case, and it is a habit worth recommending to the room.

## Sources

| What | Where |
|---|---|
| Detector commit | `liquid-staking-program`, `1c46d37` "Add detector for the forced unstake from the delinquent validator situation", 2023-12-27 |
| Enum plus migration commit | `liquid-staking-program`, `de13a0b` "Replace bool by enum and fix the upgrade data process", 2024-01-04 |
| Branches | `fix-delinquent`, `fix-delinquent-audit`, `fix-delinquent-plus-depositfee`, `fix-forced-unstake` |
| Migration state | `programs/marinade-finance/src/state/delinquent_upgrader.rs` |
| Migration phase 2 | `programs/marinade-finance/src/instructions/crank/finalize_delinquent_upgrade.rs` |
| Detector | `programs/marinade-finance/src/instructions/crank/update.rs` |
| Solana side | `solana/programs/stake/src/stake_state.rs`, `deactivate_delinquent` and `eligible_for_deactivate_delinquent` |
| Solana constant | `MINIMUM_DELINQUENT_EPOCHS_FOR_DEACTIVATION`, `solana/programs/stake/src/stake_instruction.rs` |

## Still to check before the talk

- The exact epoch threshold value of `MINIMUM_DELINQUENT_EPOCHS_FOR_DEACTIVATION`. Commonly cited
  as 5, but read it from the constant rather than quoting from memory.
- Whether this was ever triggered on mainnet by a real third party, or whether it was found
  defensively. That changes the story from "we got hit" to "we saw it coming", and the two need
  different wording on stage.
- How much SOL was affected, and for how long. Only usable if there is a public source.
