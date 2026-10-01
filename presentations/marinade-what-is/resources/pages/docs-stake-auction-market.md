> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/protocol-overview/stake-auction-market.md).

# Stake Auction Market (SAM)

Marinade distributes 100% of its TVL through the Stake Auction Marketplace, where validators compete by bidding to offer the highest yield to stakers.

## Overview

Marinade's entire TVL is distributed through the Stake Auction Marketplace (SAM). Every epoch, eligible validators are ranked by the yield they offer to stakers, and stake is rebalanced to the highest-yielding validators subject to eligibility and decentralization constraints.

For SOL stakers, Marinade's delegation flows through SAM automatically. Validators bid each epoch to win delegated stake, and those bids translate directly into higher yield for stakers.

For validators looking to receive Marinade stake, this section covers how the auction works and what to set up to participate. New validators should start with the [SAM Onboarding Guide](/marinade-protocol/protocol-overview/stake-auction-market/sam-onboarding-guide.md). For tools, dashboards, repositories, and reference data, see [SAM Resources](/marinade-protocol/protocol-overview/stake-auction-market/sam-resources.md).

{% hint style="info" %}
A funded PSR (Protected Staking Rewards) bond is a prerequisite for SAM participation. The bond is separate from SAM itself and acts as collateral to protect staker yield. See [Protected Staking Rewards](https://docs.marinade.finance/marinade-protocol/protocol-overview/protected-staking-rewards).
{% endhint %}

## How SAM Works

Validators are scored each epoch based on `max_yield`, the maximum yield they offer to stakers at a given stake level (e.g. 8% APY on 100k SOL). `max_yield` includes the validator's commission and any bid placed through SAM. In source code and the auction pipeline outputs, `max_yield` is referred to as `totalPmpe`.

Marinade ranks all eligible validators by `max_yield` and allocates stake top-down until all available stake is distributed.

## **SAM Lifecycle**

The end-to-end flow from validator setup to settlement, in two phases.

#### **One-time setup:**

1. Validator funds the bond
2. Validator configures the bid (CPMPE and/or dynamic commission)

#### **Recurring each epoch:**

3. Auction runs against current bid configuration ↻
4. Stake allocated to top bidders by `max_yield`
5. Bond charged at settlement for the previous epoch's stake
6. Next epoch begins → returns to step 3

The bond is funded once but consulted every epoch. As long as the bid stays competitive and the bond stays funded, validators continue to receive stake and incur settlements without further action.

### Bidding Methods

Validators share rewards with stakers through a static bid, a dynamic commission bid, or both combined. Both are configured through the validator bonds CLI without changing the public commission rate that applies to external stakers.

* **Static bid (CPMPE, cost per 1,000 SOL of delegated stake per epoch):** A fixed cost per 1,000 SOL delegated per epoch, paid from the validator's bond.
* **Dynamic commission bid:** A percentage of inflation, MEV (Maximal Extractable Value), or block rewards shared with stakers, set in basis points.

See [Dynamic Bids](/marinade-protocol/protocol-overview/stake-auction-market/dynamic-bids.md) for the full mechanics, common configurations, and CLI examples.

### Last Price Auction

SAM uses a last-price auction model. After ranking validators by `max_yield`, the `realized_yield` for the epoch is set to the `max_yield` of the last validator to receive stake (the lowest yield on the winning list). Validators with `max_yield` above `realized_yield` are not charged their full bid; they are charged only enough to deliver the realized yield to stakers.

The two bidding methods are charged independently:

* **Static bids (CPMPE):** Charged from the bond based on the realized yield and the amount of delegated stake. The full CPMPE is only charged when the validator is at the bottom of the winning list.
* [**Dynamic commission bids**](/marinade-protocol/protocol-overview/stake-auction-market/dynamic-bids.md)**:** Charged separately from the bond, based on the actual rewards earned by the validator that epoch and the configured commission split. Marinade uses the lower value (more favorable to stakers) between the on-chain commission and the configured bond commission.

This dual mechanism prevents overpayment on static bids and supports transparent reward sharing through dynamic commissions.

#### **Example: max\_yield vs. realized\_yield**

<table><thead><tr><th width="140">Validator ID</th><th>max_yield (APY)</th><th>stake_received (SOL)</th><th>realized_yield (APY)</th></tr></thead><tbody><tr><td>1</td><td>10.6%</td><td>95 000</td><td>8.12%</td></tr><tr><td>2</td><td>9.58%</td><td>200 000*</td><td>8.12%</td></tr><tr><td>3</td><td>9.4%</td><td>80 000</td><td>8.12%</td></tr><tr><td>…</td><td>…</td><td>…</td><td>…</td></tr><tr><td>166</td><td>8.12%</td><td>15 000**</td><td>8.12%</td></tr><tr><td>167</td><td>8.12%</td><td>15 000**</td><td>8.12%</td></tr><tr><td>168</td><td>8.10%</td><td>0</td><td>0%</td></tr></tbody></table>

Marinade distributes stake to 168 validators. Validator 1 (with `max_yield` 10.6%) does not pay their full bid: their bond is only charged enough to deliver 8.12% to stakers. The same applies to every validator above the floor. Validator 167, sitting exactly at 8.12%, pays their full bid since they are at the floor. Validator 168 falls below the realized yield and receives no stake.

The takeaway: validators can set their true `max_yield` without overpaying. The auction charges only what is needed to clear the floor.

### Penalties at a Glance

Three mechanisms can charge a validator's bond beyond the regular auction bid. Each addresses a different situation. They are independent and can apply in the same epoch.

| Mechanism                                                                                                                       | Trigger                                                               | Charge                                                                     | How to Avoid                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [**Bid Reduction Penalty**](/marinade-protocol/protocol-overview/stake-auction-market/bid-reduction-penalty.md)                 | Validator lowers `bidPmpe` below the previous 3 epochs' effective bid | Bond is charged to make up the yield gap on existing stake                 | Withdraw the bond to exit cleanly, then rejoin with a lower bid. Do not lower `bidPmpe` directly |
| [**Activating Stake Fee**](/marinade-protocol/protocol-overview/stake-auction-market/activating-stake-fee.md)                   | New stake activates on the validator after a winning auction          | Bond is charged on activating stake, scaled by overbid above clearing rate | Set `maxStakeWanted` to control incoming stake before bidding                                    |
| [**Bond Risk Reduction Mechanism**](/marinade-protocol/protocol-overview/stake-auction-market/bond-risk-reduction-mechanism.md) | Bond covers fewer than 5 epochs of obligations on existing stake      | Stake is partially undelegated and a fee is charged from the bond          | Maintain bond coverage at or above the 13-epoch target                                           |

Two other actions can affect stake but are not fee-based: validators may lose eligibility (see [Eligibility Criteria](/marinade-protocol/protocol-overview/stake-auction-market/eligibility-criteria.md)) or be blacklisted (see [Blacklist Policy](/marinade-protocol/protocol-overview/stake-auction-market/blacklist-policy.md)). Both result in stake being redelegated without charging the bond.

## Explore the SAM Documentation

* [**SAM Onboarding Guide**](/marinade-protocol/protocol-overview/stake-auction-market/sam-onboarding-guide.md)**:** Step-by-step setup for new validators: install CLI, create bond, fund it, configure bid, and verify.
* [**Eligibility Criteria**](/marinade-protocol/protocol-overview/stake-auction-market/eligibility-criteria.md)**:** Requirements to receive stake from Marinade, and how to exit SAM cleanly.
* [**Stake Distribution and Decentralization Constraints**](/marinade-protocol/protocol-overview/stake-auction-market/stake-distribution-and-decentralization.md)**:** How stake is allocated, unstaking priority, and network safety limits.
* [**Blacklist Policy**](/marinade-protocol/protocol-overview/stake-auction-market/blacklist-policy.md)**:** Grounds for blacklisting and removal process.
* [**Dynamic Bids**](/marinade-protocol/protocol-overview/stake-auction-market/dynamic-bids.md)**:** How dynamic commission bids work and how to configure them in the validator bonds CLI.
* [**`maxStakeWanted` Parameter**](/marinade-protocol/protocol-overview/stake-auction-market/maxstakewanted-parameter.md)**:** Cap the amount of Marinade stake a validator wants to receive.
* [**Stake Matching**](/marinade-protocol/protocol-overview/stake-auction-market/stake-matching.md)**:** Up to 30% matched stake for validators attracting external delegation.
* [**Bonds Settlements**](/marinade-protocol/protocol-overview/stake-auction-market/bonds-settlements.md)**:** How and when bids are settled each epoch.
* [**Bid Reduction Penalty**](/marinade-protocol/protocol-overview/stake-auction-market/bid-reduction-penalty.md)**:** Penalty mechanics that protect against bid manipulation.
* [**Activating Stake Fee**](/marinade-protocol/protocol-overview/stake-auction-market/activating-stake-fee.md)**:** One-time fee charged when new stake activates, scaled by how far above clearing the validator bid.
* [**Bond Risk Reduction Mechanism**](/marinade-protocol/protocol-overview/stake-auction-market/bond-risk-reduction-mechanism.md)**:** Covers the cost of redelegating stake when a validator's bond is underfunded relative to their allocation.
* [**Bond Notifications**](/marinade-protocol/protocol-overview/stake-auction-market/bond-notifications.md)**:** How validators are notified of bond-related events and changes.
* [**SAM Resources**](/marinade-protocol/protocol-overview/stake-auction-market/sam-resources.md)**:** Dashboards, repositories, APIs, and technical reference for SAM participants.

{% hint style="info" %}
The SAM per-validator cap is **15% of Marinade's TVL**, live as of epoch 946 ([MIP-19](https://forum.marinade.finance/t/mip-19-improving-sam-auction-stake-priority-bond-risk-reduction-mechanism-higher-validator-caps/1969)).
{% endhint %}

### Operational Notes

A few facts worth knowing as a SAM participant.

* **Scoring cadence:** The delegation strategy scoring runs once per epoch. At the end of each epoch, Marinade's bot performs actions to move stake distribution toward the desired state.
* **SFDP self-stake credit:** A validator's PSR bond counts toward the self-stake requirement of the [Solana Foundation Delegation Program](https://solana.org/delegation-criteria#self-stake). Any SOL deposited in the bond counts toward total self-stake.
* **Data sources:** Marinade uses on-chain Solana data for all validator metrics, plus ipwhois for geolocation and data center identification.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/protocol-overview/stake-auction-market.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
