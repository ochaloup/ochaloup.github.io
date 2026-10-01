> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/protocol-overview/stake-auction-market/bonds-settlements.md).

# Bonds Settlements

How Marinade settles validator bids each epoch, with formula, worked example, and where to view settlements.

{% hint style="info" %}
**TL;DR:** Each epoch, Marinade charges the validator's bond for static bids (CPMPE x active stake) and dynamic commission differences. Settlements run automatically at the start of each epoch for the epoch that just closed.
{% endhint %}

## Overview

A settlement is the on-chain transaction Marinade creates each epoch to transfer SOL from a validator's bond to stakers, covering the validator's bid for the previous epoch's delegated stake. Settlements run automatically at the start of each epoch for the epoch that just closed.

### What Gets Charged

Each epoch a validator receives Marinade stake, their bond is charged for two distinct components.

* **Static bid (CPMPE, cost per 1,000 SOL of delegated stake per epoch):** A per-1,000-SOL charge based on the active Marinade stake delegated to you and the auction's realized yield for the epoch.
* **Dynamic commission bid:** A charge based on the actual rewards earned that epoch and the difference between the validator's on-chain commission and the configured bond commission.

These charges are calculated independently and applied together in the settlement transaction.

***

## Settlement Types

Bids are only one of the reasons a bond is charged. Every settlement carries a **reason** and a **funder**. The full set of reasons, as defined in the validator-bonds program, is below.

| Reason                                     | Trigger                                                                                      | Funder                      | Recipient                                  |
| ------------------------------------------ | -------------------------------------------------------------------------------------------- | --------------------------- | ------------------------------------------ |
| `Bidding`                                  | Validator won auction stake and owes the bid for the epoch                                   | Validator bond              | mSOL stakers                               |
| `PriorityFee`                              | Activating stake pool share calculated by the SAM pipeline                                   | Validator bond              | Activating mSOL stakers                    |
| `BidTooLowPenalty`                         | Validator lowered the total offer below the winning level while still holding Marinade stake | Validator bond              | Stakers, plus a Marinade and DAO fee split |
| `BlacklistPenalty`                         | Validator blacklisted for sandwich attacks or slow slots                                     | Validator bond              | Stakers                                    |
| `BondRiskFee`                              | Bond underfunded relative to the exposed stake, forcing undelegation                         | Validator bond              | Stakers                                    |
| `InstitutionalPayout`                      | Select and institutional native stakers fell below the PSR-percentile APY floor              | Validator bond              | Institutional and Select stakers           |
| `ProtectedEvent` / `DowntimeRevenueImpact` | Validator produced fewer vote credits than expected                                          | Validator bond, full amount | Stakers                                    |
| `ProtectedEvent` / `CommissionSamIncrease` | Validator raised commission above the level declared to SAM                                  | Validator bond              | Stakers                                    |

{% hint style="info" %}
**Downtime coverage.** `DowntimeRevenueImpact` carries a 1% grace (`grace_downtime_bps: 100`), read as a threshold: a loss under that line is not charged at all. As of [MIP-23](https://forum.marinade.finance/t/mip-23-full-validator-coverage-of-psr-downtime/1998), effective epoch 1040, the validator bond covers the full downtime charge across the whole uptime range beyond the grace period, and the DAO no longer funds any part of it. Before epoch 1040, the bond covered only the upper half of the loss and a second, DAO-funded settlement covered the rest. `min_settlement_lamports` is 0.1 SOL. See Protected Staking Rewards.
{% endhint %}

Two further protected-event kinds, `CommissionIncrease` and `LowCredits`, exist in the program for parsing historical data only. They predate SAM and are no longer emitted.

***

## Bonds Calculation Formula

The bid charged each epoch combines the static bid component and the dynamic commission component.

**Bid Charged** = **Static Bid** + **Dynamic Commission Bid**

```
Bid Charged = (Active stake from Marinade at end of epoch x Effective Bid) / 1000
            + (Total Rewards Earned from Marinade Stakers x Commission Rate)
```

Where:

* **Active stake from Marinade:** The total Marinade-delegated stake on the validator at the end of the epoch.
* **Effective Bid:** The realized yield for the epoch in lamports per 1,000 SOL, derived from the auction. This is typically lower than the configured CPMPE since the last-price auction sets the realized yield to the lowest yield on the winning list. See Stake Auction Market for details on how realized yield is set. In source code, Effective Bid appears as `effBid` or `auctionEffectiveBidPmpe`.
* **Commission Rate:** Calculated separately for inflation rewards, MEV (Maximal Extractable Value) rewards, and block rewards. Based on the difference between the on-chain commission and the configured commission in the bond. Marinade uses the lower value between the two (more favorable to stakers) as the rate stakers actually receive.

See Dynamic Bids for full mechanics of the commission portion.

### Worked Example

Consider a validator with the following configuration in an epoch:

* **Active Marinade stake:** 100,000 SOL
* **Configured CPMPE:** 0.10 SOL per 1,000 SOL per epoch
* **Realized yield (effective bid):** 0.08 SOL per 1,000 SOL (auction floor)
* **On-chain inflation commission:** 5% (validator keeps 5% on-chain)
* **Configured bond inflation commission:** 3% (validator commits to keeping only 3%)
* **Total inflation rewards earned from Marinade stake:** 50 SOL
* **MEV and block rewards:** 0 (omitted for clarity)

#### **Static bid charge**

```
Static Bid = (100,000 x 0.08) / 1,000 = 8 SOL
```

The validator is charged 8 SOL even though their configured CPMPE was 0.10. The auction settled at 0.08, so the validator is only charged enough to deliver the realized yield.

#### **Dynamic commission charge**

On-chain, the validator's 5% commission keeps 2.5 SOL out of 50 SOL of inflation rewards on Marinade stake (stakers receive 47.5 SOL on-chain). The bond commission of 3% means the validator commits to keeping only 1.5 SOL. The difference of 2% is charged from the bond and delivered to stakers via settlement:

```
Commission diff = (5% - 3%) x 50 SOL = 1 SOL
```

#### **Total settlement charge**

```
Total = 8 SOL (static) + 1 SOL (dynamic) = 9 SOL
```

The validator's bond is debited 9 SOL at the start of the next epoch.

***

## Where to View Settlements

Settlement history is published in several places.

* **PSR (Protected Staking Rewards) Feed Discord channel:** The [#psr-feed channel in Marinade Discord](https://discord.com/invite/yTdH8YkYKg) posts a per-epoch summary of all settlements, including totals by reason (Bidding, BondRiskFee, and so on) and per-validator amounts. Quickest way to see what was charged.
* **Bonds API:** `https://validator-bonds-api.marinade.finance/bonds/bidding` returns the current state of every bidding bond, including `funded_amount`, `effective_amount`, `remainining_settlement_claim_amount` and the epoch the snapshot was taken for. Use `/bonds/institutional` for Select bonds.
* **Auction scores API:** `https://scoring.marinade.finance/api/v1/scores/sam?epoch=X` returns the auction outcome including per-validator allocations and bids. Replace `X` with the target epoch.
* **Pipeline outputs:** Each epoch's full auction output is committed in the [ds-sam-pipeline auctions folder](https://github.com/marinade-finance/ds-sam-pipeline/tree/main/auctions) under `<epoch>/outputs/results.json`.
* **Settlement data on Google Cloud:** Raw settlement JSON is published to the [marinade-validator-bonds-mainnet GCS bucket](https://console.cloud.google.com/storage/browser/marinade-validator-bonds-mainnet/) (Google login required).
* **PSR dashboard:** The [PSR dashboard](https://psr.marinade.finance/) shows the validator's bond balance and recent activity. Refreshes every few hours, so use the auction scores API or pipeline outputs for the freshest data.

## Settlement Lifecycle

Settlements have a fixed lifecycle from creation to expiry.

* **Created at the start of the next epoch:** A settlement for epoch X is created at the start of epoch X+1, once the snapshot at the end of epoch X is processed. This is when the bond is debited.
* **Active for 3 epochs:** During this window, stakers can claim their portion of the settlement. The 3-epoch claim window is defined in the on-chain Validator Bonds config (`epochsToClaimSettlement`, currently **3** on the SAM bidding config `vbMaRfmTCg92HWGzmd53APkMNpPnGVGZTUHwUJQkXAU`). Claiming opens after `slotsToStartSettlementClaiming`, currently **200,000 slots**, which is roughly 17 to 22 hours depending on slot times.

{% hint style="info" %}
**Select and institutional settlements run on a different config.** The institutional config `VbinSTyUEC8JXtzFteC4ruKSfs6dkQUUcY6wB1oJyjE` carries `epochsToClaimSettlement` of **4**, not 3, and a bond withdrawal lockup of **1 epoch** rather than 3. If you operate both a SAM bond and a Select bond, do not carry timings from one to the other. Both were read on chain on 18 September 2026.
{% endhint %}

* **Unclaimed funds return to the bond:** Any SOL in the settlement that is not claimed by stakers within the active window is returned to the validator's bond when the settlement expires. \* \*\*Extra SOL handling:\*\* A settlement may contain slightly more SOL from the bond than the strict charge requires. This allows Marinade to enforce the on-chain minimum of 1 SOL per stake account (\`minimumStakeLamports\`) during distribution. The unused remainder returns to the bond on expiry.

To stay informed when settlements affect the bond, set up [Validator Bond Notifications](/marinade-protocol/protocol-overview/stake-auction-market/bond-notifications.md).

***

## Related Mechanisms

The bond is the source for several distinct charges, each with its own trigger and formula. They can apply in the same epoch.

* [**Activating Stake Fee**](/marinade-protocol/protocol-overview/stake-auction-market/activating-stake-fee.md)**:** Charged once when new stake activates, scaled by how far the validator bid above the clearing rate. **Currently paused:** the fee multiplier `activatingStakePmpeMult` is set to 0, so no activating fee is charged.
* [**Bid Reduction Penalty**](/marinade-protocol/protocol-overview/stake-auction-market/bid-reduction-penalty.md)**:** Charged when a validator lowers their bid or raises their commissions after winning stake.
* [**Bond Risk Reduction Mechanism**](/marinade-protocol/protocol-overview/stake-auction-market/bond-risk-reduction-mechanism.md)**:** Charged when a validator's bond is underfunded relative to the active stake they hold.
* [**Blacklist Policy**](/marinade-protocol/protocol-overview/stake-auction-market/blacklist-policy.md)**:** Charged when a validator is blacklisted for sandwich attacks or slow slots.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/protocol-overview/stake-auction-market/bonds-settlements.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
