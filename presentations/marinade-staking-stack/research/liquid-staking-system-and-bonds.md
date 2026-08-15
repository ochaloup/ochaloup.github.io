# How the liquid staking system actually runs, and what bonds buy

Research note for the Liquid Staking section: the crank loop, validator scoring, bonds, PSR, and
the bid. Read from source. This is the material behind the "backend processing", "bonds" and
"auction and PSR" slides.

## 1. The crank loop, and the fact worth leading with

`liquid-staking-program/Docs/Backend-Design.md` describes a bot that turns cranks each epoch. The
sentence to put on a slide, quoted from that doc:

> "These 'turn the crank' functions can be called by any user so users are not dependent on us to
> keep the contract moving."

**The cranks are permissionless.** Marinade runs the bot, but the protocol does not depend on
Marinade running it.

### But be precise about it, because "permissionless" is only half true

Checked against the signer requirements in the program, and the split is clean:

**No authority required — anyone can call these:**

| Instruction | Signer? |
|---|---|
| `update_active`, `update_deactivated` (`crank/update.rs`) | none |
| `merge_stakes` (`crank/merge_stakes.rs`) | none |
| `stake_reserve` (`crank/stake_reserve.rs`) | `rent_payer` only |
| `deactivate_stake` (`crank/deactivate_stake.rs`) | `split_stake_rent_payer` only |

Note the two signers there are **rent payers, not authorities**. They answer "who funds the new
account", not "who is allowed to do this".

**Marinade-only — these carry a real authority check:**

| Instruction | Signer |
|---|---|
| `add_validator` | `manager_authority` |
| `remove_validator` | `manager_authority` |
| `set_validator_score` | `manager_authority` |
| `emergency_unstake` | `validator_manager_authority` |
| `partial_unstake` | `validator_manager_authority` |

**So: the mechanism is permissionless, the policy is not.** Anyone can turn the crank. Only
Marinade decides who is on the validator list and what their scores are, which is exactly the
staking priority that drives `stake_delta`.

### What that means if Marinade vanished tomorrow

Worth saying out loud, because it is the honest and interesting version:

- mSOL price keeps updating and rewards keep being booked. Anyone can crank it.
- Users keep depositing, liquid-unstaking, ordering delayed unstake and claiming tickets.
- Stake keeps being placed, deactivated and merged, **according to the last scores written**.
- What stops: the scores freeze. Delegation stops adapting. A validator that goes bad keeps its
  stake, and nothing rebalances toward better performers.

**Your money stays safe and liquid. It just stops getting smarter.**

That is a much better line than a flat "it is permissionless", and it survives a hostile question
from someone who has read the program. It also sets up the contrast with Native staking, where
the backend genuinely is Marinade's and cannot be anyone else's. Two products, two different
degrees of trustlessness, stated plainly rather than claimed.

### The cranks

| Crank | What it does |
|---|---|
| `update_price` | Walk the stake accounts, book rewards, mint the protocol fee, recompute mSOL price |
| `stake_delta` | When stake orders exceed unstake orders, place new stake |
| `unstake_delta` | When unstake orders exceed stake orders, pull stake back |
| `retrieve_deactivated_funds` | Move fully deactivated SOL into the reserve |
| `merge_stake_accounts` | Collapse accounts back together |

`update_price` dispatches per account state, calling `update_active`, `update_deactivated` or
`update_cooling_down`. For an active account it computes
`rewards = Account.lamports - min_rent - amount_last_checked`, books it into
`validator_system.total_active_balance`, mints the protocol fee in mSOL, and recomputes the price.

**The mSOL price mechanic in one line, and it is worth saying explicitly:** rewards are
auto-staked by Solana, so the crank does not distribute anything to holders. It books the growth
and the mSOL price rises. One token, one number going up.

### The real operator: `marcrank`

`/home/chalda/marinade/marcrank` is the management CLI, run from a cron job in `ops-infra` on the
Kubernetes pipeline at build.marinade.finance. Subcommands map straight onto the cranks:

`update_price`, `stake_delta`, `merge_stakes`, `partial_unstake`, `stake_validator`,
`create_canonical_stake`, `migrate_delinquent_fix`, `finalize_delinquent_upgrade`, `do_work`.

Note two of those are the delinquent migration from the appendix story, and one is the canonical
stake work. **The operational CLI carries the scars of both appendix slides**, which is a nice
way to link the appendix back to the main section if it is ever wanted.

Program: `MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD`, instance
`8szGkuLTAux9XMgZ2vtY39jVSowEcpBfFfD8hXSEqdGC`.

## 2. Where the stake goes: the SAM result feeds the crank

`marcrank/src/scoring.rs` fetches the auction result over HTTP:

```
GET {base}/api/v1/scores/sam/last
```

So the flow for the "what calls what" slide is:

```
snapshot of chain state
      -> SAM auction runs off-chain, once per epoch
      -> results published on an API
      -> marcrank reads them
      -> stake_delta / unstake_delta place stake on chain
```

**The decision is computed off-chain and applied on-chain.** That is the architecture claim of
the whole section, and it is one HTTP call in a Rust file.

### The record that drives it

```rust
pub struct ValidatorSamRecord {
    pub voteAccount: String,
    pub marinadeSamTargetSol: f64,   // how much stake this validator should end up with
    pub revShare: RevShare,
    pub stakePriority: u64,          // order to add stake
    pub unstakePriority: u64,        // order to remove stake
    pub maxStakeWanted: f64,         // validator's own cap
    pub effectiveBid: f64,
    pub constraints: String,
    ...
}
```

`stakePriority` and `unstakePriority` are the interesting fields for a slide: the auction does not
just say *who*, it says *in what order*, because stake has to be moved a bounded amount at a time.

## 3. Yield has three components, and this is the best slide in the section

Also from `scoring.rs`:

```rust
pub struct RevShare {
    pub totalPmpe: f64,
    pub inflationPmpe: f64,
    pub mevPmpe: f64,
    pub bidPmpe: f64,
    pub auctionEffectiveBidPmpe: f64,
}
```

PMPE is per-mille per epoch, the unit used to compare validators. The struct decomposes what a
staker actually earns:

> **total = inflation + MEV + bid**

- **inflation** — the protocol's staking rewards, paid for voting.
- **MEV** — captured by validators running the Jito client.
- **bid** — the extra share a validator chooses to give up to win Marinade stake.

**The bid is the part that only exists because there is an auction.** That is the cleanest
possible answer to "why would I stake through Marinade rather than delegate directly", and it is
three fields in a struct rather than a marketing claim.

## 4. Why the bid exists at all: a protocol gap Solana is about to close

This is the strongest framing available and it needs to be said carefully, with the SIMD numbers.

- **SIMD-0096** changed priority fees so that **100% go to the validator**. Before it, half were
  burned. Good for validator economics, but it left Solana with **no in-protocol way for a
  validator to pass any of that back to its delegators**.
- **SIMD-0123**, "Sharing Block Rewards and Arbitrary Lamports with Stakers", adds exactly that:
  an on-chain commission mechanism so validators can share block rewards with stakers in
  protocol, applied equally to all delegators, settled at epoch end. It **passed governance in
  March 2025 with about 75% in favour**.

Until SIMD-0123 is live, the value cannot flow natively. **Marinade's auction plus bonds is the
mechanism that moves it anyway**: the validator bids a share, and the bonds program pays it out.

The rhyme with the Native staking section is exact and worth using deliberately: *here is a gap in
the chain, here is the machinery we built to bridge it, and here is the protocol change that will
make our machinery unnecessary.* Native staking has the same shape with transaction size limits.
**That is arguably the through-line of the entire talk.**

Verify before presenting: whether SIMD-0123 has activated on mainnet by talk day, and the exact
vote figure. Both change the tense of the sentence.

## 5. Bonds: how "we will slash you" becomes something a program can do

From the `validator-bonds` README:

> "An on-chain protocol where validators post bonds as collateral for Marinade stake. Settlements
> distribute SOL to stakers affected by protected events (PSR) or validator bidding."

Program: `vBoNdEvzMrSai7is21XgVYik65mqtaKXuSdMBJ1xkW4`.

The README also gives the pipeline in one line, and it is a ready-made diagram:

> **snapshot → bid-distribution CLI → settlement JSON → merkle trees → on-chain settlements →
> claims**

Six stages, epoch-cadenced. Worth drawing as a flow rather than describing.

### The point to make about bonds

A validator that wants Marinade stake must post and fund a bond. That single requirement is what
turns two separate promises into enforceable numbers:

1. **PSR.** If the validator underperforms, the bond covers the stakers' lost rewards.
2. **The bid.** If the validator promised to share rewards, the bond is where that payment comes
   from.

Same collateral, two uses. **A bond turns a promise into an account you can read**, which is the
takeaway line already drafted in the scaffold and which this section now genuinely earns.

### Why downtime means lost rewards, stated correctly

Staking rewards on Solana are paid for **voting**. A validator that is down is not voting, so it
earns nothing for that period, so its delegators earn nothing. PSR does not punish downtime for
its own sake, it compensates the staker for rewards that were never minted. Public figure from
marinade.finance: the bond covers **100% of rewards lost when uptime falls between 50% and 99%**,
and also covers commission increases mid-epoch, which the site calls "commission rugging".

### Using the word "slashing" on purpose

**Decision, 2026-08-15: the word stays, with a disclaimer, and is not overused.**

The trap is real. On Solana, *slashing* means protocol-level destruction of the **staked
principal**. Marinade's bonds do nothing of the kind: they pay out **rewards** the staker did not
receive, from collateral the validator posted voluntarily. Principal is never touched. Say it
carelessly to a room that knows the protocol and someone will object, correctly.

But it is a good, vivid word and the audience already has the intuition it points at. So use it
**once, with the correction attached**, roughly:

> "We slash the validator. And I should say what I mean by that, because on Solana slashing means
> the protocol destroys your stake. We do not do that and we cannot. What we do is take from a
> bond the validator posted, to cover the rewards you did not get. Your principal is never
> touched."

That earns the word instead of borrowing it. Then drop back to "the bond covers the loss" for the
rest of the section. Naming the imprecision before anyone else does converts the objection into a
point in your favour.

## 6. Decentralisation is scored, not just performance

The scoring inputs are not only performance. Marinade deliberately gives credit for
decentralisation factors such as geography, so stake does not concentrate purely on the
highest-yield operators. The auction is the main input to ordering, but it runs inside constraints
(`constraints: String` in the record above is where a validator's binding constraint is reported).

**Still to confirm from source before presenting**: the exact scoring components and weights. Look
in `/home/chalda/marinade/ds-sam` and `/home/chalda/marinade/delegation-strategy-2`, and the
public `ds-sam` blog post. This note has not yet read them.

## Sources

| What | Where |
|---|---|
| Crank loop, permissionless cranks, mSOL price mechanic | `liquid-staking-program/Docs/Backend-Design.md` |
| Operational CLI, subcommands, program and instance ids | `marcrank/README.md`, `marcrank/src/commands/` |
| SAM API call, `ValidatorSamRecord`, `RevShare` | `marcrank/src/scoring.rs` |
| Bonds purpose, settlement pipeline, program id | `validator-bonds/README.md` |
| PSR figures, commission rugging | `resources/marinade-finance-pages/native-staking.html` |
| SIMD-0096, SIMD-0123 | See links below |

- [SIMD-0123 discussion, Sharing Block Rewards and Arbitrary Lamports with Stakers](https://github.com/solana-foundation/solana-improvement-documents/discussions/188)
- [SIMD-0096, Reward full priority fee to validators](https://github.com/solana-foundation/solana-improvement-documents/pull/96)
- [Figment on SIMD-123](https://www.figment.io/insights/simd-123-solanas-native-in-protocol-priority-fee-sharing-onchain/)
- [Forum proposal thread](https://forum.solana.com/t/proposal-for-an-in-protocol-distribution-of-block-rewards-to-stakers/3295)

## Still to check

- Scoring components and weights, see section 6.
- Whether SIMD-0123 is active on mainnet by 26 August 2026.
- The protocol fee rate: `Backend-Design.md` says 1% of rewards, but that doc is old. Read the
  deployed state before quoting it.
