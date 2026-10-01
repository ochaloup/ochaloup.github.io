> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/protocol-overview/marinade-liquid/bot-operations.md).

# Bot operations

The Marinade Liquid stake pool is driven by an off-chain **crank** that calls the program's permissionless instructions. It handles updating the mSOL price, applying the delegation strategy, and matching staking with unstaking orders.

## What the Crank Does

| Operation                                                        | When                                                     |
| ---------------------------------------------------------------- | -------------------------------------------------------- |
| Update the mSOL price from the pool's stake accounts             | At each epoch boundary, once rewards have landed         |
| Stake queued deposits and unstake to fill delayed unstake orders | Continuously through the epoch                           |
| Delegate, split, merge and rebalance the pool's stake accounts   | At the epoch boundary, following the delegation strategy |

Validator selection for the pool is driven by Marinade's **Stake Auction Marketplace**, not by a fixed validator list.

***

## Can Anyone Run It?

The program instructions the crank calls are **permissionless**, so the pool can always be kept operational even if Marinade's own crank is down.

{% hint style="info" %}
One caveat since liquid-staking-program v2.1.0: `merge_stakes` no longer lets the caller choose the destination account. Merges now target a canonical per-validator PDA, which the crank creates ahead of merging if it does not yet exist. Any third-party cranker has to follow the same order.
{% endhint %}

***

## Source

<table><thead><tr><th width="342.4000244140625">Component</th><th>Repository</th></tr></thead><tbody><tr><td>On-chain program</td><td><a href="https://github.com/marinade-finance/liquid-staking-program">liquid-staking-program</a></td></tr><tr><td>Delegation strategy (SAM evaluation)</td><td><a href="https://github.com/marinade-finance/ds-sam">ds-sam</a> and <a href="https://github.com/marinade-finance/ds-sam-pipeline">ds-sam-pipeline</a></td></tr><tr><td>Validator scoring and stake allocation API</td><td><a href="https://github.com/marinade-finance/delegation-strategy-2">delegation-strategy-2</a></td></tr></tbody></table>

The crank binary Marinade operates is internal, but every instruction it calls is in the public program above and every delegation input is reproducible from the strategy repositories.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/protocol-overview/marinade-liquid/bot-operations.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
