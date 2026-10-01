> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/protocol-overview/protected-staking-rewards.md).

# Protected Staking Rewards

Marinade introduces Protected Staking Rewards to provide stakers protection from any unforseen performance losses in the validator delegation set.

## Overview

Marinade's validator protection system has three distinct components:

* **Protected Staking Rewards (PSR):** The overarching framework ensuring stakers are compensated when validators underperform.
* **Bonds:** Collateral posted by validators. SOL deposited into a bond account stays delegated to that validator and covers any compensation owed to stakers.
* **Stake Auction Market (SAM):** A separate system that determines how Marinade allocates stake across validators based on bids. SAM participation requires a bond, but SAM and PSR serve different purposes: SAM is about stake allocation, PSR is about protecting staker yield.

***

Marinade introduced Protected Staking Rewards to its delegation strategy in April 2024. PSR serves as performance protection for Marinade stakers by covering the balance of any unexpected underperformance of a validator in the stake pool. This is done through an on-chain bond created by Marinade and each validator in the pool.

By implementing PSR, Marinade can fulfill its mission to decentralize Solana as best as possible by staking to more validators in the cluster without affecting the performance for stakers.

## **How Protected Staking Rewards Work**

PSR uses an on-chain program to cover staker losses caused by two specific validator events: **LowCredits** (extended downtime causing missed rewards) and **CommissionIncrease** (a validator raising their commission mid-epoch). When either occurs, the validator's bond is used to compensate stakers for the shortfall.

Note: Solana does not have a slashing mechanism yet. PSR is a bond-funded compensation system, not a penalty. Validators retain full control of their bond and it remains delegated to them at all times.

### **PSR Coverage Allocation**

{% hint style="warning" %}
**Updated by MIP-23, effective epoch 1040.** Coverage used to split between validators and the DAO. It no longer does: validators now cover the full downtime charge on their own.
{% endhint %}

* **Validator's Responsibility:** Validators cover **100% of the rewards lost across the full 0% to 99% uptime range**, from their own bond.
* **Marinade's Coverage:** None. The DAO's reserve no longer absorbs any part of a downtime shortfall.
* **1% Grace Period:** The first 1 percentage point of downtime, and the first 1 percentage point of a mid-epoch commission increase, carry no charge at all. This is a threshold, not a deductible: an event under the 1% line is not charged anything, rather than having 1 point subtracted from a larger charge.

Before epoch 1040, the DAO covered the lower half of the loss (0% to 50% uptime) and validators covered the upper half (50% to 99% uptime). That DAO share is now gone; see [MIP-23](https://forum.marinade.finance/t/mip-23-full-validator-coverage-of-psr-downtime/1998) for the proposal and rationale.

{% hint style="info" %}
**Example: PSR Coverage**

* **Scenario 1**: Validator's uptime is 99.5% during an epoch.
  * **Validator's Responsibility**: No action is required as the downtime is within the 1% grace period.
  * **Marinade's Coverage**: None.
* **Scenario 2**: Validator's uptime is 90% during an epoch.
  * **Validator's Responsibility**: The validator's bond covers the full 10% loss.
  * **Marinade's Coverage**: None.
* **Scenario 3**: Validator's uptime is 40% during an epoch.
  * **Validator's Responsibility**: The validator's bond covers the full 60% loss.
  * **Marinade's Coverage**: None.
    {% endhint %}

### **Setup for Validators**

Validators can set up and fund their bond by following the CLI instructions on GitHub: [Funding Bond Account](https://github.com/marinade-finance/validator-bonds/tree/main/packages/validator-bonds-cli#funding-bond-account).

**Audit**: The bond program was audited by Neodyme and can be viewed here: [Audit Report](https://docs.marinade.finance/marinade-protocol/security/audits#audit-reports-1).

{% hint style="info" %}

#### **Track PSR Events**

Each epoch, Marinade posts the results of PSR in Discord. You can see which validators fell below the performance threshold and will have SOL removed from their bond. Visit Discord and view the [**#psr-feed**](https://discord.com/invite/yTdH8YkYKg) channel for details.

View each validator's current bond amount and validator stake here: [PSR Dashboard](https://psr.marinade.finance/).
{% endhint %}

### **Validator FAQ for PSR Bonds**

**Q: I am a validator. Can I receive stake from Marinade?**

Yes! You can refer to our Stake Auction Market to see how we delegate to validators.

**Q: How much SOL do I have to supply for my bond?**

The more SOL that is supplied, the more stake you will be eligible for from Marinade.

**Q: What happens if my validator bond is not funded?**

If your validator bond is not funded, your validator will lose eligibility for Marinade stake. Stake will be redistributed away from your validator over subsequent epochs.

Under normal conditions, roughly **0.7% of total TVL** is redistributed per epoch, so unstaking from unfunded validators happens gradually. However, if multiple validators lose eligibility at once due to expired bonds, auction exits, or other eligibility failures, redelegation can temporarily accelerate well beyond this baseline, redistributing stake much faster than usual.

To avoid losing stake, ensure your bond remains funded at all times.

**Q: Are funded bonds required for enhanced stake?**

Yes, validators must set up a bond to participate in the Stake Auction Marketplace (SAM) and be eligible for SAM stake allocations.

**Q: Is there a deadline to create and fund a bond?**

You can fund the bond anytime, but as of Epoch 608 you will not be eligible for Marinade stake if you have not yet supplied a bond.

Full detailed instructions can be viewed on [GitHub](https://github.com/marinade-finance/validator-bonds/tree/main/packages/validator-bonds-cli#funding-bond-account).

**Q: Will the stake account in my bond be redelegated to other validators?**

No, the stake accounts in your bond will always stay delegated to your validator and can be considered self-staked.

**Q: Does the PSR bond count for the self-stake requirement of the Solana Foundation Delegation Program?**

Yes, the SOL in your bond counts towards the self-stake requirement of the [Solana Foundation Delegation Program](https://solana.org/delegation-criteria#self-stake) (SFDP).


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/protocol-overview/protected-staking-rewards.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
