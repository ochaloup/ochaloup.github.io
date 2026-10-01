> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/glossary.md).

# Glossary

#### APY

Also known as Annual Percentage Yield, APY refers to the compounded returns you get on your assets over one year. In DeFi, the value of APY changes widely based on different factors and can change quickly.

It is different than APR, which means "Annual Percentage Rate" and represents the returns of an investment over one year without compounding.

#### Bond

Collateral posted on-chain by a validator. The SOL in a bond stays delegated to that validator and is charged when the validator owes stakers compensation under Protected Staking Rewards, or owes Marinade under a Stake Auction Market settlement. See Protected Staking Rewards.

#### Custodial / Non-custodial protocol

In a custodial protocol, the protocol controls the keys of the assets you own and stores these assets on your behalf.

In a non-custodial protocol, the protocol does not have access to the private keys of the assets its users deposit. Moreover, the protocol cannot block any users from withdrawing their funds at any point.

Marinade is non-custodial in both of its shapes:

* **Marinade Liquid:** your SOL is exchanged for mSOL, which gives you ownership of a share of the staking pool. You can convert back to SOL at any time.
* **Marinade Native, Select and Recipes:** your SOL stays in Solana stake accounts where **you remain the withdraw authority**. Marinade holds only the stake authority, which lets it delegate and rebalance but never move your principal.

#### Customized Rewards

See Marinade Recipes.

#### Delayed Unstake

The exit path that follows Solana's own unstaking flow: your stake is deactivated and your SOL becomes claimable after **1 epoch**. Starting one in the last 4 hours of an epoch pushes the claim back by one further epoch. It avoids market price impact and has **no minimum position size**, so it is the path for a position under 1 SOL. It costs a **flat 0.003 SOL** on Marinade Native, Marinade Select and Marinade Recipes, and **0.2%** on mSOL. See Fees and Pricing.

#### Delegators

Delegators are those who let their SOL count towards the stake of a selected validator, in exchange for a share of the rewards that validator earns. On Solana this is done by pointing a stake account at a validator's vote account. Marinade automates the choice of validator on your behalf.

#### Epoch

In the Solana network, an epoch has a variable time corresponding to the time a leader schedule is valid. An epoch lasts **about 2 days**, and it moves with slot times, so treat any fixed figure as approximate. You can follow the current and previous epochs on a Solana explorer or in the [Marinade app](https://app.marinade.finance).

#### Instant Unstake

The exit path that converts a staked position back to liquid SOL in one transaction, at a price quoted by market makers or a DEX. It settles immediately and costs more than Delayed Unstake. On native positions it needs **1 SOL or more**, on a stake account at least **2 epochs old**, and the spread is typically **0.10% to 0.40%**. See Fees and Pricing.

#### Liquidity

Liquidity refers to the total available circulating supply of a given asset in a protocol.

#### Liquidity Mining

Liquidity mining is a distribution method where the tokens of a newly created platform are distributed between users who provide liquidities to the protocol. It aims at distributing those tokens over time instead of going with sales round.

#### Liquidity Pool

A liquidity pool is a smart contract where a pair of tokens is locked and made available for swaps. Any pair of tokens can have liquidity pools created for them (mSOL/SOL, SOL/USDC, MNDE/SOL, etc.). This smart contract allows anyone to exchange one of the tokens of the pair for the other, in exchange for a small fee distributed to the liquidity providers, people who made their liquidity available in this smart contract.

Liquidity pools are one of the pillars of DeFi since they allow one to swap a token for another without the need for an order book and in a trustless manner.

#### Marinade Native

A staking path where Marinade's delegation strategy is applied to stake accounts that stay in your own name. The Native Staking Proxy program holds the stake authority so it can delegate and rebalance; you keep the withdraw authority. See Marinade Native.

#### Marinade Recipes

A native staking path where the staker's SOL principal stays in SOL and the staking rewards are converted each epoch into a chosen payout token, such as USDG, USDC, EURC, BTC, ETH, gold, MNDE, or tokenized equities. Also referred to as Customized Rewards.

#### Marinade Select

A native staking path delegating to a smaller, vetted validator set, aimed at institutional stakers and backed by validator bonds. It is not currently available to stake to; existing Select positions are unaffected. See Marinade Select.

#### Multisig Wallet

A multisig wallet is a crypto wallet with multiple layers of control to make transactions with the wallet. Such a wallet is defined by a set of smart contract rules that mandate numerous approvals from different users to transact from the wallet.

#### Protected Staking Rewards (PSR)

Marinade's performance protection for stakers. When a validator underperforms or raises commission mid-epoch, its bond is charged to compensate affected stakers. See Protected Staking Rewards.

#### Solana Staking Rate (SSR)

The network-wide benchmark rate for what SOL staking returns. As published by Marinade's APY API, the SSR is computed from **inflation and block rewards, and excludes MEV**, so it reads lower than rates that include MEV.

#### Stablecoin

A stablecoin is a cryptocurrency designed always to match the price of a fiat currency as closely as possible. Each stablecoin (USDT, USDC, DAI, etc.) has its backing mechanisms and needs to be considered individually. Stablecoins are primarily used to quickly swap between crypto and dollars without involving fiat transactions.

#### Stake account

In the Solana network, a stake account is created when a wallet stakes to a validator. This stake account is the "stake receipt" proving that their funds are staked to a specific validator.

Marinade offers the opportunity to easily transfer an existing stake account to Marinade. You will immediately receive mSOL without having to worry about unstaking your SOL.

#### Stake Auction Market (SAM)

Marinade's on-chain delegation strategy. Validators bid each epoch for the right to receive Marinade stake, and those bids raise the yield delivered to stakers. SAM uses a last-price auction, so a winning validator is charged only enough to deliver the realized yield. See Stake Auction Market.

#### Total Value Locked (TVL)

TVL is a metric representing the total amount of money in a protocol.

#### Validators

Validators are nodes that validate transactions by staking (locking) their SOL tokens to keep the Solana network secure. They receive compensation in terms of staking rewards to the proportion of the total tokens staked by them. To stake more SOL, they can be delegated SOL by users who wish to contribute to their node in exchange for a share of their rewards.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/glossary.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
