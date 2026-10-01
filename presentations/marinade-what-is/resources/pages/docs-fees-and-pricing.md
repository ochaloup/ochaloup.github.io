> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/protocol-overview/fees-and-pricing.md).

# Fees and Pricing

A single reference for every fee across Marinade products: what each fee is, how it is calculated, whether it is fixed or variable, and which costs come from third parties rather than from Marinade.

## Overview

This page is the single reference for every fee and cost across Marinade's products. It covers what each fee is, how it is calculated, whether it is fixed or variable, and which costs come from third parties rather than from Marinade.

**Marinade charges no deposit fee on any product, and takes no performance fee on staking rewards.** On-chain, the stake pool's `reward_fee` parameter is set to **0**. Costs occur only when you exit a position, plus one performance fee on the USDC Earn Vault.

## Fees at a Glance

<table><thead><tr><th width="115.199951171875">Product</th><th width="83.60003662109375">Deposit</th><th width="112.800048828125">Delayed Unstake</th><th width="149">Instant Unstake</th><th>Ongoing Fee</th></tr></thead><tbody><tr><td>Marinade Native</td><td>None</td><td><strong>0.003 SOL flat</strong></td><td>Dynamic, typically 0.10% to 0.40%, set by the market</td><td>None</td></tr><tr><td>Marinade Select</td><td>None</td><td><strong>0.003 SOL flat</strong></td><td>Dynamic, typically 0.10% to 0.40%, set by the market</td><td>None</td></tr><tr><td>Marinade Recipes (Customized Rewards)</td><td>None</td><td><strong>0.003 SOL flat</strong></td><td>Dynamic, typically 0.10% to 0.40%, set by the market</td><td>None</td></tr><tr><td>Marinade Liquid (mSOL)</td><td>None</td><td>0.2% (20 bps)</td><td>No Marinade fee on the swap route; the Marinade liquidity pool route charges 0.03% to 1.5%</td><td>None</td></tr><tr><td>USDC Earn Vault</td><td>None</td><td>Not applicable, withdrawals are instant and free</td><td>Not applicable</td><td>5% on net interest</td></tr></tbody></table>

Delayed Unstake on the staking products completes after **1 epoch, currently about 2 days**. Instant exits settle immediately, and USDC Earn Vault withdrawals are always instant.

{% hint style="info" %}
**The Native, Select and Recipes Delayed Unstake fee is flat, not proportional.** It is 0.003 SOL whether you unstake 1 SOL or 100 SOL, so it is negligible on a large position and material on a very small one. The standard Solana signature fee of 0.000005 SOL applies on top.
{% endhint %}

***

## The Full Fee Schedule

| Fee                                  | Applies To                                         | Amount                                                                                                                                                                                                          | How It Is Charged                                                                                                                                                                 |
| ------------------------------------ | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Deposit fee                          | All products                                       | **None**                                                                                                                                                                                                        | No fee on entry to any Marinade product                                                                                                                                           |
| Reward or performance fee on staking | Native, Select, Recipes, mSOL                      | **None**                                                                                                                                                                                                        | The stake pool's on-chain `reward_fee` is 0                                                                                                                                       |
| Delayed Unstake                      | Marinade Native, Marinade Select, Marinade Recipes | **0.003 SOL, flat**                                                                                                                                                                                             | Charged in the unstake transaction, independent of position size. No minimum position size                                                                                        |
| Delayed Unstake                      | Marinade Liquid (mSOL)                             | **0.2% (20 bps)**                                                                                                                                                                                               | Deducted from the unstaked amount before the ticket is credited. The Receive amount shown in the app already reflects it                                                          |
| Withdraw stake account               | Marinade Liquid (mSOL)                             | **0.2% (20 bps)**                                                                                                                                                                                               | Applies when you take a stake account out of the mSOL pool instead of receiving SOL                                                                                               |
| Instant Unstake                      | Marinade Native, Marinade Select, Marinade Recipes | **Dynamic, typically 0.10% to 0.40%**                                                                                                                                                                           | Set by market makers quoting liquidity. The quote shown in the app is the full execution price. Available on positions of 1 SOL or more, on a stake account at least 2 epochs old |
| Instant Unstake                      | Marinade Liquid (mSOL)                             | **No Marinade fee on the swap route.** The Marinade liquidity pool route charges **0.03% to 1.5%**, rising as the pool is drawn down, with 50% of that fee going to the treasury and 50% to liquidity providers | The app routes to whichever venue returns the most SOL and shows the resulting quote before you confirm                                                                           |
| Performance fee                      | USDC Earn Vault                                    | **5% of net interest**                                                                                                                                                                                          | Taken from interest only, never from the deposit. Already reflected in the displayed net APY                                                                                      |
| Deactivating your own stake account  | Direct stake                                       | **No Marinade fee**                                                                                                                                                                                             | Only the standard Solana network transaction fee applies                                                                                                                          |

***

## How Marinade Earns

Marinade does not charge stakers a performance fee on staking rewards. Protocol revenue comes from the Stake Auction Marketplace, where validators bid for stake, and from exit fees, rather than from a cut of the yield delivered to stakers.

How that validator-side revenue is collected varies by product:

* **Native and Liquid (mSOL):** Validators bid for stake allocation through the Stake Auction Market (SAM). SAM runs a last-price auction, so a winning validator is charged only enough to deliver the realized yield to stakers.
* **Select:** Validators pay protocol fees through a bilateral agreement booked against the Select bond: 20 bps to Marinade plus up to 10 bps to the validator, on TVL annually.
* **Marinade Recipes (Customized Rewards):** A single Marinade-run validator handles delegation. Rewards are converted and delivered to the staker's wallet in the chosen reward token.

For Marinade Native specifically, this validator-side path is the only one structurally possible. Stakers keep withdraw authority over their own stake accounts, so a protocol cut on staker yield could not be taken even if Marinade wanted to.

The USDC Earn Vault works differently. It is a lending vault, so Marinade takes a 5% performance fee on the net interest earned. There are no deposit or withdrawal fees, and withdrawals are instant.

#### Other Costs to Keep in Mind

Some costs apply when using Marinade but are set by the network or by third parties, not by Marinade:

* **Solana network fees:** Standard per-transaction fees paid to the Solana network. For Marinade Native, Marinade covers the rebalancing fees each epoch.
* **Market liquidity spreads:** On an Instant Unstake, any market-maker spread or price impact is a market cost, not a Marinade fee. The full execution price is shown before the action is confirmed.
* **Third-party fees:** DEX, wallet, or exchange fees can apply when routing through other venues. These are independent of Marinade.

#### Unstaking a Directly Staked Position

Direct staking is not a Marinade product. It refers to SOL staked directly to a validator outside Marinade. Holders of such a position can exit it through Marinade if they choose: the same market-set pricing as Marinade Native applies on an instant exit, and a delayed exit carries no Marinade fee beyond the standard Solana network transaction fee.

***

## Revenue Allocation

Under [**MIP-22**](https://forum.marinade.finance/t/mip-22-mnde-liquidity-and-staking-rewards/1993), **10% of protocol revenue is allocated to programmatic open-market MNDE buybacks**. The MNDE bought is distributed to eligible MNDE stakers in Marinade Realms through the MNDE Staking Rewards Program. The distribution mechanism is not live yet, so nothing is claimable today. To be eligible, a wallet must hold staked MNDE at the distribution snapshot and have cast at least one governance vote in the trailing 12 months. MIP-22 also seeded the MNDE-mSOL pool with 10M MNDE from the DAO treasury. You can follow the buybacks on chain: the MNDE bought so far accumulates in `BBaQsiRo744NAYaqL3nKRfgeJayoqVicEQsEnLpfsJ6x`, viewable on [Solscan](https://solscan.io/account/BBaQsiRo744NAYaqL3nKRfgeJayoqVicEQsEnLpfsJ6x).

This is a different program from the earlier MIP-11 and MIP-13 buybacks, which [MIP-17](https://forum.marinade.finance/t/mip-17-refocusing-from-buybacks-to-building-liquidity/1960) paused in favour of protocol-owned liquidity. Those earlier buybacks did not distribute to stakers.

Live figures are published here:

* [Marinade DAO Revenue dashboard](https://app.hex.tech/0195d1d1-bfc7-7001-8243-11ff2c293f01/app/Marinade-DAO-Revenue-030vg9JLITAA3GSoN8ee4y/latest)
* [Marinade DAO on Realms](https://v2.realms.today/dao/899YG3yk4F66ZgbNWLHriZHTXSKk9e1kvsKEquW7L6Mo)


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/protocol-overview/fees-and-pricing.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
