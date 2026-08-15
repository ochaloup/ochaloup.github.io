# Native staking: the hard part is getting out

Research note for the Native Staking section. Read from `marinade-finance/native-staking`, which
is a public repo, so this material is safe to present. Quotes marked as such come from its
README.

## The one-line version

Delegating is easy. Un-delegating is where the engineering is, and every bit of that machinery
exists because a Solana transaction is capped at 1232 bytes.

## Why exit is hard, in Marinade's own words

> "Marinade splits the stake between over 100 validators to spread the risk and to support well
> performing validators. It would be therefore inconvenient for our users to revoke the stake
> authority, de-activate and withdraw for each of the stake accounts one by one."

That is the whole problem in one sentence. Good decentralisation means your stake is spread over
100+ validators, which means 100+ stake accounts. Exiting by hand means 100+ revokes, 100+
deactivations, 100+ withdrawals. The product promise is one button, so all of that has to be
absorbed by the backend.

The user-facing flow is four steps:

1. User asks for an amount of SOL.
2. Marinade deactivates stake accounts summing to that amount.
3. At the start of the next epoch, Marinade merges the deactivated accounts into one.
4. User withdraws in a **single** transaction.

There is a flat 0.001 SOL fee, and the README is refreshingly blunt about why: Marinade pays for
the deactivations and the merging, so without a fee the service is a free drain.

## The design detail worth a slide: the authority is the state

The product runs **two stake authorities**, quoting the README:

> 1. A stake authority used for stake accounts that Marinade should continue delegating.
> 2. A stake authority used for stake accounts that we should de-activate and merge on behalf of
>    users, so they can withdraw SOL.

The state of a stake account in the exit process is encoded in *which authority holds it*.
Moving an account between the two authorities is the state transition. There is no separate
status field on chain to get out of sync, because the authority already is the status.

This pairs neatly with the delinquent stake story from the Liquid section. There the program kept
its own mirror of on-chain state and an outsider could desynchronise it. Here the on-chain object
carries the state directly and there is nothing to desynchronise. Two products, two answers to
the same question, and the contrast is a good talk beat.

An on-chain program does exist, `marinade-native-proxy`, but its job is narrow: it proxies the
Solana Stake Program to manage **staker authorities only**. It never holds funds. That is what
keeps the "no smart contract risk" claim honest.

## The root cause: 1232 bytes

`bot/src/utils/transaction.rs`:

```rust
const MAX_TX_SIZE: usize = 1232;
```

The bot does not compute how many instructions fit. It **greedily bin-packs**: merge the next
instruction into a buffer, serialise the whole thing, check the byte length, and if it no longer
fits, close that transaction and start a new buffer.

```rust
Ok((_, length)) if length <= MAX_TX_SIZE => {
    debug!("Temporary tx size: {length} bytes - waiting for more parts");
    return Ok((extended_buffer, None));
}
Ok((_, length)) => debug!("Extended buffer is too large: {length} bytes - splitting the buffer"),
```

It also already uses Address Lookup Tables, the existing Solana mitigation for account count.
Even with ALTs, the packer is still necessary.

**This is the slide.** One constant, and a bin-packing loop underneath a product feature. Show
the constant, then show what grew on top of it.

## What grew on top of it

Because one user action cannot be one transaction, it becomes a distributed workflow. All of
this is machinery for a problem that is, at heart, "the request does not fit in the envelope".

**Two message queues**, RabbitMQ, and three processes:

| Stage | Does |
|---|---|
| `schedule` | Creates `order`s on a fixed schedule |
| `consume-orders` | Turns `order`s into declarative `instruction`s |
| `consume-instructions` | Stitches `instruction`s into transactions |

> "The whole process is split into asynchronously performed stages to enable granular scaling."

**Orders are scheduled by slot inside the epoch**, which is the epoch-as-heartbeat point:

| Slot | Order |
|---|---|
| 100 | Collect rewards metrics |
| 2,000 | Merge stake accounts |
| 10,000 | Claim extra balance |
| 300,000 | Re-balance stake accounts |
| on demand | Exit |

**A database schema that is pure distributed-systems vocabulary**, from
`migrations/0001-baseline.sql`:

- `revoke_orders` — the user's request, with a `fulfilled` flag
- `revokes` — individual on-chain results, grouped by `bundle_id`. The column comment says it
  plainly: *"groups the ixs one order is split into"*. **The bundle exists only because of the
  1232-byte limit.** One order fans out into bundles, bundles fan out into transactions.
  `BUNDLES_PER_ACTION_MESSAGE = 8` in `processors/exit.rs`.
- `transactions_redo_log` — a redo log with a `processed` flag
- `transaction_processing_log` — a chain-scanner cursor, so the API can resume after a restart
- `dead_letter_revoke_orders` — a dead letter queue, with `reason` and `burn_amount`

**A compensating transaction.** The revoke flow mints a Token-2022 receipt on chain, then writes
a DB record. If the mint lands and the DB write fails, the code fires a compensating burn with
exponential backoff, `BURN_RETRY_SAFETY_NET = 5`, and the comment admits it may still need manual
handling in the worst case. That is a saga with a compensating action, and an honest one.

Redo log, dead letter queue, resume cursor, saga compensation, two queues, three stages. This is
a textbook distributed system, and it is sitting behind a withdraw button. **It is also a very
good reason to keep "distributed systems" on the bio slide,** since the talk then demonstrates it
rather than claiming it.

## The payoff: this can mostly be deleted

Solana is raising transaction size and account-count limits. When that lands, a revoke that
currently fans out into bundles across many transactions starts fitting into far fewer, and most
of the queueing, bundling, and recovery machinery loses its reason to exist.

The framing you wanted, and it is a strong closing note for the section:

> Here is a hard limit the chain imposes. Here is the machinery we had to build around it. Here
> is us watching the ecosystem closely enough to delete that machinery the moment the platform
> makes it unnecessary.

Being current is the point, not the queue design.

## One more thing worth mentioning: Jito MEV

From the README:

> "Normally, MEV rewards are transferred directly to the stake accounts, and therefore are not
> considered delegated... We take care of this issue and when there are significant rewards
> accumulated, we split the stake account and stake the MEV rewards on our users' behalf."

MEV lands as undelegated lamports sitting inside a stake account, earning nothing. That is the
"Claim extra balance" order at slot 10,000. A small, concrete, easy-to-explain example of the
unglamorous work that actually produces yield. Good filler if the section needs another beat.

## Sources

| What | Where |
|---|---|
| Product explanation, exit flow, two authorities, fee rationale, Jito MEV | `native-staking/README.md` |
| Transaction size limit and the bin-packing loop | `native-staking/bot/src/utils/transaction.rs` |
| Bundle fan-out constant | `native-staking/bot/src/processors/exit.rs` |
| Revoke flow, compensating burn, retry policy | `native-staking/bot/src/api/handlers/prepare_for_revoke.rs` |
| Orders, revokes, redo log, dead letter queue, cursor | `native-staking/migrations/0001-baseline.sql` |
| Proxy program scope | `native-staking/programs/marinade-native-proxy/` |
| Public API docs | https://native-staking.marinade.finance/docs |

## Still to check before the talk

- **Which Solana change exactly?** The claim "limits are being raised" needs a concrete pointer,
  a SIMD number or a release note, or it sounds like wishful thinking. Worth finding before the
  talk, and it would make a strong, current reference.
- **How many stake accounts does a typical exit touch?** A real number turns the abstract limit
  into something the room feels. Needs a publishable source.
- The 0.001 SOL fee and the 100+ validator figure are from the public README, so both are safe.
