> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/protocol-overview/stake-auction-market/sam-onboarding-guide.md).

# SAM Onboarding Guide

Step-by-step onboarding for validators joining the Marinade Stake Auction Marketplace.

{% hint style="info" %}
**TL;DR:** Install the validator bonds CLI, create and fund a bond, configure a bid, and verify on-chain. Read all penalty pages before bidding. "I didn't know" is not grounds for refund.
{% endhint %}

## Overview

Any active validator can participate in the Stake Auction Marketplace. The full onboarding flow is: install the CLI, create a bond, fund it, configure the bid, simulate, and wait for the next auction. This page walks through each step.

{% hint style="info" %}
**Read this page in full before installing the CLI or funding a bond.** Participating in SAM has financial obligations and penalty mechanics that are easy to miss when skipping ahead. At minimum, read the Bid Reduction Penalty, Activating Stake Fee, Eligibility Criteria, `maxStakeWanted` Parameter and Bond Risk Reduction Mechanism pages before configuring a bid. "I didn't know about the penalty" is not grounds for refund or removal of charges from a validator's bond.
{% endhint %}

### Before Starting

A short list of things worth knowing before configuring anything.

* **Set `maxStakeWanted`:** When this is left unset or set to `0`, there is no cap at all, and a validator may receive significantly more stake than expected as Marinade's TVL grows. See `maxStakeWanted` Parameter.
* **Plan the bid before funding:** Lowering a bid after winning stake triggers the Bid Reduction Penalty. The clean way to leave the auction entirely is to withdraw the bond.
* **Confirm eligibility:** Uptime, commission, supported node version and bond requirements all apply, and the commission bar is stricter than the headline 7% figure suggests. See Eligibility Criteria.
* **External stake qualifies for matching:** Validators bringing external stake can have 10% of their non-SFDP external stake and 30% of their SFDP stake matched by Marinade. The matched portion does not require the slashable part of the bond, but bids are still charged on it and the bond must be able to cover those bids. See Stake Matching.

***

### **Step 1: Install the Validator Bonds CLI**

The CLI is the entry point for every action below: creating, funding, configuring, and managing the bond.

```bash
npm i -g @marinade.finance/validator-bonds-cli
```

Verify the version:

```bash
validator-bonds --version
```

Full installation and command reference: [validator-bonds-cli readme](https://github.com/marinade-finance/validator-bonds/tree/main/packages/validator-bonds-cli#validator-bonds-cli).

### **Step 2: Create a Bond**

The bond is an on-chain account linked to the validator's vote account. It serves as collateral for Protected Staking Rewards and is required to participate in SAM.

```bash
validator-bonds -um init-bond \
  --vote-account <vote-account-address> \
  --validator-identity ./validator-identity.json
```

This is the permissioned setup, where the validator identity signs the transaction. A permissionless setup is also supported. See the [bond creation guide](https://github.com/marinade-finance/validator-bonds/tree/main/packages/validator-bonds-cli#creating-a-bond) for both flows.

### **Step 3: Fund the Bond**

The bond must hold enough SOL to cover one epoch of downtime, one epoch of bids at the maximum stake target, and any settlement obligations.

```bash
validator-bonds -um fund-bond-sol <bond-or-vote-account-address> \
  --from <funding-keypair> \
  --amount <sol-amount>
```

`--amount` is in SOL, not lamports.

A few rules of thumb:

* **Absolute floor:** The auction enforces a minimum bond balance (`minBondBalanceSol`) independently of how much stake a validator holds. Below 80% of that floor the SAM stake cap drops to zero and the validator receives nothing. Between 80% and 100% of the floor, the cap is clipped to existing stake so no new stake arrives. At or above the floor there is no clipping. The value is configurable, so read it live from [`auction-config.json`](https://github.com/marinade-finance/ds-sam-pipeline/blob/main/auction-config.json) rather than memorising a number.
* **Eligibility minimum:** 1 SOL per 10,000 SOL of stake covers one epoch of downtime.
* **Comfortable starting point:** 1 SOL per 2,000 SOL of target stake gives headroom for bids and settlements alongside downtime coverage.

{% hint style="info" %}
SOL deposited in the bond stays delegated to the validator and earns rewards for the validator. Marinade also counts it as self-stake in its own stake matching calculation. Validators relying on the bond to satisfy the [SFDP (Solana Foundation Delegation Program) self-stake requirement](https://solana.org/delegation-criteria#self-stake) should confirm that treatment with the Foundation, since that requirement is theirs and not Marinade's.
{% endhint %}

### **Step 4: Configure the Bid**

Use a static bid (CPMPE, cost per 1,000 SOL of delegated stake per epoch) in lamports, a dynamic commission bid in basis points, or both. See [Configuring a Bond](https://github.com/marinade-finance/validator-bonds/tree/main/packages/validator-bonds-cli#configuring-a-bond) for all options.

```bash
validator-bonds -um configure-bond <bond-or-vote-account-address> \
  --authority <bond-authority-keypair> \
  --cpmpe <lamports-per-1000-sol-per-epoch> \
  --max-stake-wanted <max-sol-amount-in-lamports>
```

{% hint style="warning" %}
**The CLI will not lower a bid by accident.** `configure-bond` refuses to decrease `--cpmpe` unless `--force` is also passed. That guard exists because lowering a bid while holding Marinade stake triggers the Bid Reduction Penalty. Read that page before using `--force`.
{% endhint %}

Both `--cpmpe` and `--max-stake-wanted` take **lamports**, not SOL.

To see what other validators are bidding and what the current effective bid looks like, check the [ds-sam-pipeline auctions folder](https://github.com/marinade-finance/ds-sam-pipeline/tree/main/auctions). Each epoch folder contains the inputs and outputs of that auction.

### **Step 5: Simulate the Position**

Before committing to a bid, run a simulation on the [PSR (Protected Staking Rewards) dashboard](https://psr.marinade.finance/) to see how the bid would perform in the current auction. The simulation shows projected stake at different bid levels, helping with bond sizing and picking a competitive bid.

### **Step 6: Verify the Setup**

Confirm the bond and bid are visible on-chain before the next auction runs.

```bash
validator-bonds -um show-bond <bond-or-vote-account-address>
```

A validator's auction position can also be verified on the [Validator Dashboard](https://app.marinade.finance/network/validators/) once the next epoch begins.

{% hint style="info" %}
**The CLI is the source of truth.** `show-bond` reads on-chain data and reflects the bond's current state immediately after any transaction.

The [PSR dashboard](https://psr.marinade.finance/) and other web dashboards refresh every few hours and are intended for reference, not real-time verification. After funding or configuring a bond, give the dashboard time to catch up before assuming something is wrong. Always cross-check with the CLI first.
{% endhint %}

***

## What Happens Next

Auctions run every epoch. A Solana epoch is 432,000 slots, which at current block times is roughly **1.6 days**, not two. The exact length drifts with network block time, so read the live value from an RPC (`solana epoch-info`) rather than planning against a fixed number of hours.

Once the bond is funded and the bid is configured, the validator enters the next auction cycle automatically. If the bid is competitive enough to win stake, delegation activates over the following epochs.

To stay informed about bond status, set up [Validator Bond Notifications](/marinade-protocol/protocol-overview/stake-auction-market/bond-notifications.md) for alerts on bond underfunding, settlements, and other events.

**Next Steps**

* **Eligibility Criteria:** Confirm all requirements are met and learn how to exit SAM cleanly. See [Eligibility Criteria](/marinade-protocol/protocol-overview/stake-auction-market/eligibility-criteria.md).
* **Bonds Settlements:** Understand how bids are charged each epoch. See [Bonds Settlements](/marinade-protocol/protocol-overview/stake-auction-market/bonds-settlements.md).
* **Activating Stake Fee:** Understand the fee defined for newly activating stake, and check whether it is currently charged at all. See [Activating Stake Fee](/marinade-protocol/protocol-overview/stake-auction-market/activating-stake-fee.md).
* **Bid Reduction Penalty:** Read this before considering any bid changes. See [Bid Reduction Penalty](/marinade-protocol/protocol-overview/stake-auction-market/bid-reduction-penalty.md).
* **Bond Risk Reduction Mechanism:** Learn what happens when a bond becomes underfunded relative to its stake allocation. See [Bond Risk Reduction Mechanism](/marinade-protocol/protocol-overview/stake-auction-market/bond-risk-reduction-mechanism.md).


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/protocol-overview/stake-auction-market/sam-onboarding-guide.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
