> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/protocol-overview/stake-auction-market/stake-distribution-and-decentralization.md).

# Stake Distribution and Decentralization

How Marinade allocates stake each epoch, how it reduces stake when needed, and the constraints that protect network decentralization.

{% hint style="info" %}
**TL;DR:** Marinade ranks validators by `max_yield` and allocates stake top-down each epoch, subject to a 15% per-validator cap, 30% ASO cap, and 40% country cap. About 1% of TVL rebalances per epoch under normal conditions, with faster movement when validators lose eligibility or exit.
{% endhint %}

## Overview

Marinade's stake distribution operates through a unified pipeline that ranks validators by `max_yield` and allocates the entire TVL each epoch, subject to eligibility and decentralization constraints. This page covers how stake is allocated to winners, how stake is reduced from validators no longer at the top of the list, and the constraints that prevent stake concentration.

## How Stake Is Allocated

Stake is allocated top-down by `max_yield`, starting with the highest-ranked eligible validator.

For each validator, three constraint checks must pass before stake is allocated.

* **Per-validator cap:** A validator can hold at most 15% of Marinade's TVL (MIP-19, live as of epoch 946).
* **ASO and country concentration:** Allocation to a validator must not push the ASO (Autonomous System Organization, i.e. the data center or hosting provider) above 30% of Solana's total network stake, or the country above 40% of Solana's total network stake.
* **Bond balance:** The validator's bond must hold enough SOL to cover one epoch of downtime (PSR) and at least one epoch of effective yield, including the bid.

If two or more validators tie on `max_yield` at the auction floor, the remaining stake is split equally among them. Constraint checks run in parallel during the split to ensure fair distribution.

The process continues down the ranked list until all available stake is distributed or remaining validators fail the constraint checks.

### How Stake Is Reduced

Marinade reduces stake from validators by assigning each one a redelegation priority. Stake is removed in priority order until the redelegation budget for the epoch is exhausted.

The priority tiers, from removed first to removed last:

* **Ineligible validators:** Validators failing any eligibility check lose stake before any other category.
* **Partially uncovered stake:** Validators whose current Marinade stake is not fully covered by their bond. The deeper the shortfall, the higher the priority for removal.
* **Overstaked validators:** Validators whose SAM target (the stake they would win in this epoch's auction) is lower than their current SAM active stake. The excess is redelegated to other validators. The further the overstake exceeds target, the higher the priority for removal.

Under normal conditions, roughly **1% of Marinade's total TVL is rebalanced per epoch**. This baseline keeps stake redistribution gradual and predictable. The exact rebalance budget is configured in the auction pipeline and may be adjusted over time.

When validators lose eligibility (due to insufficient bond funding, auction exits, blacklisting, or other failures), redelegation can temporarily accelerate significantly beyond this baseline. These spikes represent the largest opportunities for eligible validators to receive new stake. See [Dynamic Bids](/marinade-protocol/protocol-overview/stake-auction-market/dynamic-bids.md) for how to position for these windows.

### Where to See Allocation and Redelegation

Each epoch's auction outputs show the actual allocations and redelegations performed.

* **Auction outputs:** [ds-sam-pipeline auctions folder](https://github.com/marinade-finance/ds-sam-pipeline/tree/main/auctions). Each epoch folder contains the inputs and outputs of the allocation, including per-validator stake targets and current active stake.
* **PSR dashboard:** The [PSR dashboard](https://psr.marinade.finance/) shows current per-validator stake and bond status. Refreshes every few hours.

### What Validators Can Control

A validator's position in both allocation and redelegation depends on three operational factors.

* **Bid competitiveness:** A higher `max_yield` (through CPMPE, the cost per 1,000 SOL of delegated stake per epoch, dynamic commission, or both) ranks the validator higher in the allocation order and reduces the chance of being overstaked. See [Dynamic Bids](/marinade-protocol/protocol-overview/stake-auction-market/dynamic-bids.md).
* **Bond funding:** A bond fully covering current stake keeps the validator out of the "partially uncovered stake" priority tier. Insufficient funding triggers the [Bond Risk Reduction Mechanism](/marinade-protocol/protocol-overview/stake-auction-market/bond-risk-reduction-mechanism.md) on top of the redelegation priority.
* **Eligibility:** Maintaining uptime, supported node version, and effective inflation commission below 7% prevents the validator from falling into the "ineligible" tier. See [Eligibility Criteria](/marinade-protocol/protocol-overview/stake-auction-market/eligibility-criteria.md).

Decentralization constraints (the 15% per-validator cap, 30% ASO cap, and 40% country cap) are not directly controllable, but they affect the maximum stake a validator can ever receive. Validators near these caps may want to factor that into bid and bond planning.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/protocol-overview/stake-auction-market/stake-distribution-and-decentralization.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
