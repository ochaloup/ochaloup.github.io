# Use case 2: canonical stake accounts

Research note for the Liquid Staking section. Read from source. Less complete than the
delinquent note, see the open questions at the end.

## The one-line version

Marinade is big enough that the number of stake accounts it creates is itself a cost, to Solana
and to validators. Canonical stake gives every validator exactly one stake account at a
deterministic address, which cuts the account count and removes a lookup.

## Why stake account count matters

Two separate costs, worth keeping apart on the slide:

1. **Cost to the network.** Every stake account is a live account in state. At the epoch
   boundary the runtime processes stake activation, deactivation, and reward distribution over
   all of them. More accounts means more work in the most timing-sensitive part of the epoch.
2. **Cost to the validator.** A validator's stake arriving as many small accounts rather than one
   is more accounts to be handled on their side. Marinade is one of the larger delegators on the
   network, so this is not a rounding error for the validators it delegates to.

The honest framing the user wants: **we are big, so being tidy is our responsibility, not a
nice-to-have.** But delegation mechanics push the other way. Stake moves in and out constantly,
splits create new accounts, and merging is only legal between accounts in compatible states. So
keeping the count low is a standing engineering problem, not a one-off cleanup.

## What canonical stake actually is

One stake account per validator, at a program-derived address:

```rust
const CANONICAL_STAKE_SEED: &[u8] = b"canonical_stake";

fn find_canonical_stake_address(validator_vote: &Pubkey) -> Pubkey {
    Pubkey::find_program_address(
        &[MLIQUID_STATE.as_ref(), validator_vote.as_ref(), CANONICAL_STAKE_SEED],
        &MLIQUID_PROGRAM_ID,
    ).0
}
```

The program IDL carries `create_canonical_stake`, plus `canonical_stake` and
`canonical_stake_account` account fields.

## The second benefit, which is the interesting one

Beyond fewer accounts, the derived address is itself information. From the tx-router source:

> Canonical stake accounts let us know the validator, and its score, from the derived address
> without reading the account. Before that on-chain upgrade exists we fall back to the first
> eligible account, validator read from chain.

Concretely, in `find_stake_to_withdraw`:

- **With canonical accounts.** Compute the expected address for every validator up front, build a
  map from address to validator record, then walk the stake list and match by address. Choosing
  which stake to unstake from becomes a pure in-memory ranking, and it can be ranked by the SAM
  unstake priorities because the validator is known for free.
- **Without them, the fallback path.** For each stake account, fetch and parse the account over
  RPC, extract the delegated voter, and only then find out which validator it belongs to. One
  network round trip per candidate account, and the code settles for "first eligible" instead of
  "best".

So canonical stake turns an N-round-trip search into a local lookup, and upgrades the selection
from *any account that works* to *the account the auction most wants drained*. That is a good
slide: the same change buys a smaller footprint on the network and a better decision off it.

## Sources

| What | Where |
|---|---|
| Address derivation, selection logic, fallback path | `tx-router/sdk/src/utils.rs` |
| Instruction and account names | `tx-router/sdk/idls/mliquid.json` |
| SPL strategy comparison | `tx-router/sdk/src/strategy/spl.rs` |
| Program id | `MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD`, `tx-router/sdk/src/anchor.rs` |

## Open questions, must resolve before this goes on a slide

- **Is it live?** The tx-router comment says "before that on-chain upgrade exists we fall back",
  and the fallback path is still present. So this is either recently shipped or still rolling
  out. Do not say "we did this" if it is "we are doing this". Check the deployed program.
- **What is the actual reduction?** The talk wants a number: stake accounts before against after,
  or accounts per validator. Needs a public or publishable source.
- **How does it interact with the split and merge cycle?** One account per validator is the
  steady state, but unstaking still has to split. Worth understanding how the invariant is
  restored, because that is the part an engineer in the audience will ask about.
- **Reference material on stake account cost.** The user asked for articles or blogs on stake
  account counts and their performance impact. Not yet found. Candidates to search: Solana
  validator mailing list and forum threads on epoch boundary cost, Agave release notes on stake
  program performance, Solana docs on stake account rent and minimum delegation.
