> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/protocol-overview/stake-auction-market/eligibility-criteria.md).

# Eligibility Criteria

Requirements a validator must meet to receive stake from SAM, and how to exit cleanly.

{% hint style="info" %}
**TL;DR:** Validators must meet uptime, commission, version, and bond requirements to receive Marinade stake. The commission requirement in practice is that the total yield offered to stakers matches the full network rewards base, which is stricter than the 7% headline. Losing eligibility stops new allocations and gradually unstakes existing stake. Exit cleanly by withdrawing the bond, not by lowering the bid.
{% endhint %}

## Overview

To receive stake through the Stake Auction Marketplace, a validator must meet the requirements on this page. Eligibility is checked every epoch by the auction pipeline. Once a validator no longer qualifies, they stop receiving new stake and their existing Marinade-delegated stake is redelegated to other eligible validators.

***

## Requirements to Receive Stake

Each item below must be satisfied for a validator to be eligible.

* **Not blacklisted:** The validator is not on the SAM blacklist. See [Blacklist Policy](/marinade-protocol/protocol-overview/stake-auction-market/blacklist-policy.md) for full criteria.
* **Supported node version:** The validator runs a node version matching the semver expression in `validatorsClientVersionSemverExpr`. The live expression is in [`auction-config.json`](https://github.com/marinade-finance/ds-sam-pipeline/blob/main/auction-config.json) and is updated as the network moves forward.
* **Yield offered to stakers:** The total yield the validator offers to Marinade stakers must clear the eligibility floor described in The Commission Requirement below. This is the requirement validators most often misjudge.
* **Uptime:** In each of the last 3 epochs, the validator's vote credits must be at least **80% of the network's stake-weighted average vote credits for that epoch**. This is a relative bar, not an absolute 80% uptime figure: the threshold moves with network performance.
* **Funded PSR bond:** The validator has created and funded its [PSR (Protected Staking Rewards) bond](https://marinade.finance/blog/psr-and-delegation-strategy-updates/). Two things are checked. First, an absolute minimum bond balance (`minBondBalanceSol`): below 80% of it the validator's SAM stake cap drops to zero, between 80% and 100% the cap is clipped to existing stake so no new stake arrives, and at or above it there is no clipping. Second, a proportional requirement: the bond must cover one epoch of downtime (roughly 1 SOL per 10,000 SOL of stake), one epoch of the effective bid at the stake received, and several further epochs of bid reserve. See [Bond Risk Reduction Mechanism](/marinade-protocol/protocol-overview/stake-auction-market/bond-risk-reduction-mechanism.md).
* **Decentralization constraints:** Allocation is also subject to per-validator caps and ASO (Autonomous System Organization, the data center or hosting provider) and country concentration limits. These are not strict eligibility gates but can prevent a validator from receiving additional stake. See [Stake Distribution and Decentralization Constraints](/marinade-protocol/protocol-overview/stake-auction-market/stake-distribution-and-decentralization.md).

***

## **The Commission Requirement**

The auction applies **two** commission-related floors and takes whichever is higher.

<table><thead><tr><th width="168">Floor</th><th>Rule</th><th>Config keys</th></tr></thead><tbody><tr><td>Effective inflation commission</td><td>Yield offered must be at least the network inflation base less the maximum effective commission, currently <strong>7%</strong></td><td><code>validatorsMaxEffectiveCommissionDec</code></td></tr><tr><td>Full rewards base</td><td>Yield offered must be at least the <strong>network inflation base plus the MEV base plus the block rewards base</strong>, plus a configurable fee allowance</td><td><code>minEligibleFeePmpe</code></td></tr></tbody></table>

Under the configuration in force today the second floor is strictly higher than the first, so **the second floor is the one that binds**. In practice that means a validator must deliver to Marinade stakers the equivalent of the full network rewards base across inflation, MEV **and** block rewards. A validator that keeps 7% of inflation and shares nothing of its block rewards does not qualify, even though it satisfies the 7% rule.

The yield offered is the sum of four things: on-chain inflation passed through, on-chain or bond-declared MEV passed through, block rewards shared through the bond, and any static bid (CPMPE) paid from the bond.

{% hint style="warning" %}
**Block rewards count.** If `--block-commission` is never set on the bond, the auction treats the validator as keeping 100% of block rewards, so that stream contributes nothing to the total offered. Because block rewards are part of the floor, leaving it unset makes the bar harder to clear. See Dynamic Bids.
{% endhint %}

### **Offsetting a Higher On-Chain Commission**

A validator whose on-chain commissions are above zero can still qualify by topping up stakers' yield from the bond, either with a static bid or by declaring lower commissions on the bond.

The gap to close is the difference between what the validator passes through on-chain and the full network rewards base. Concretely, for a validator with an on-chain inflation commission of `c`, zero MEV commission, and no block commission configured, the gap per 1,000 SOL per epoch is:

```
gap = c x inflation_base_pmpe + block_base_pmpe
```

That gap can be closed with a static bid of at least `gap` in CPMPE, or by declaring the corresponding commissions on the bond so the auction charges the difference at settlement, or by a combination.

The per-epoch values of `inflation_base_pmpe`, `mev_base_pmpe` and `block_base_pmpe` are published in each epoch's auction inputs and outputs in the [ds-sam-pipeline auctions folder](https://github.com/marinade-finance/ds-sam-pipeline/tree/main/auctions). Use those rather than a remembered figure: they move every epoch.

{% hint style="info" %}
Static bids deplete bond reserves over time. Validators choosing to offset a higher on-chain commission this way should monitor their bond balance and top up as needed.
{% endhint %}

***

## **Where to Check Eligibility**

Three sources help validators verify their status and diagnose issues.

* **Marinade validator page:** A validator's own profile at [app.marinade.finance/network/validators/](https://app.marinade.finance/network/validators/) shows current Marinade-delegated stake, bond status, and other relevant validator information. It does not show SAM eligibility status directly. Use the PSR dashboard for that.
* **PSR dashboard:** The [PSR dashboard](https://psr.marinade.finance/) shows eligibility status and surfaces specific reasons for exclusion (e.g. an ASO concentration constraint).
* **Auction pipeline outputs:** Each epoch's auction inputs and results are published in the [ds-sam-pipeline auctions folder](https://github.com/marinade-finance/ds-sam-pipeline/tree/main/auctions). The `samEligible` flag and the `revShare` breakdown per validator show exactly why a validator passed or failed in that epoch.

Validators should also be monitoring uptime and node health from their own infrastructure, as these are the most common eligibility issues.

### **What Happens After Losing Eligibility**

Loss of eligibility is treated as a clean unstake, no penalty is charged.

* **No new stake:** Once a validator fails any eligibility check, they are excluded from receiving new stake in upcoming auctions.
* **Existing stake redelegates first:** Ineligible validators sit at the top of the redelegation priority order, ahead of every other category, so their stake moves before anyone else's. There is no fixed timeline. Stake reduces gradually over multiple epochs as the per-epoch redelegation budget allows.
* **No penalty:** Losing eligibility does not trigger a Bid Reduction Penalty or other charge against the bond. Entering the blacklist is different and does carry a bond charge, see Blacklist Policy.
* **Bids still apply during unstake:** While stake is being redelegated, the validator continues to be charged bids on whatever Marinade stake remains active that epoch.
* **Recovery:** Once a validator becomes eligible again, they re-enter the next auction cycle automatically. There is no separate re-application step.

***

## **How to Exit SAM**

If a validator receives stake from SAM, the correct way to exit fully is to request a withdrawal from the bond. This allows Marinade to redelegate stake away from the validator without charging a penalty.

{% hint style="warning" %}
A validator who receives stake from SAM and lowers the CPMPE instead of withdrawing the bond will trigger a bond settlement for the expected yield that will be missed. The CLI blocks this by default: `configure-bond` refuses to decrease `--cpmpe` unless `--force` is passed. See Bid Reduction Penalty.
{% endhint %}

Setting `maxStakeWanted` to zero does **not** stop incoming stake. In the auction, a value of zero or unset means **no cap at all**, which is the opposite of what the number suggests. To reduce, rather than stop, the stake a validator holds, set `maxStakeWanted` to the level wanted and the auction will target down to it over the following epochs. To stop receiving stake from Marinade entirely, withdraw the bond. See [`maxStakeWanted` Parameter](/marinade-protocol/protocol-overview/stake-auction-market/maxstakewanted-parameter.md).

Stake reduces gradually over multiple epochs after a withdrawal request. There is no fixed timeline.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/protocol-overview/stake-auction-market/eligibility-criteria.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
