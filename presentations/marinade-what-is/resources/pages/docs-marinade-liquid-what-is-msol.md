> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/protocol-overview/marinade-liquid/what-is-msol.md).

# What is mSOL?

mSOL represents your staked SOL in the Marinade stake pool. Here's what that means and how it unlocks your liquidity.

## What Is mSOL?

mSOL is a liquid staking token that you receive when you stake SOL on the Marinade protocol. These mSOL tokens **represent your staked SOL tokens in Marinade's stake pool.**

They act as a receipt, allowing you to exchange them later on for your staked SOL and the earned rewards. Meanwhile, you can use mSOL in DeFi while the token's price accrues in value vs. the price of your SOL.

mSOL is a rewards-accruing liquid staking token. This means that after each Solana epoch (currently about 2 days), its value is recalculated based on the staking rewards earned by the Marinade Stake Pool. The price of mSOL is calculated as follows:

> Price of mSOL = total\_staked / tokens\_minted

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FYRYWBuzqrl4rqFss0iME%2Fv3.png?alt=media&#x26;token=75668b5d-eb91-4d0c-8452-3faeebf58372" alt=""><figcaption></figcaption></figure>

As the protocol cannot mint new mSOL without SOL being exchanged for them, only the *total staked* amount is going up (for any new mSOL minted, the same amount of SOL, at the current price of mSOL, has to be staked and also joins the *total staked* amount).

This means that the price of mSOL is going up each epoch relative to SOL as long as staking rewards are distributed for the SOL staked in the protocol. If you keep mSOL for a year, its value against SOL will have gained roughly Marinade's APY over that period. For the current rate, see the app or [**stats.marinade.finance**](https://stats.marinade.finance).

Your mSOL **balance never changes**. There is nothing to claim. Rewards reach you through the exchange rate, so the same mSOL converts to more SOL over time.

### Deposit an Existing Stake Account

[**Deposit\_Stake\_Account**](https://github.com/marinade-finance/liquid-staking-program/blob/main/programs/marinade-finance/src/stake_system/deposit_stake_account.rs)

When you choose 'Deposit stake account', these operations happen under the hood:

1. Marinade finds the delegated-active-credit-observed stake accounts, delegated to any validator.
2. Marinade takes control of the delegated and fully active stake account by becoming staking and withdrawing authority.
3. Marinade takes this amount and accordingly increases the amount of stake orders falling under:
   1. current epoch (epoch\_stake\_orders)
   2. total staked (total\_stake\_orders)
4. Marinade mints mSOL for the user according to the mSOL/SOL ratio.


In order to be able to deposit your stake account, it needs to contain at least 1 SOL.


***

## How Do I Unstake mSOL?

You can exit your mSOL position in two ways.

<table><thead><tr><th width="160.800048828125">Option</th><th>What it costs</th><th>How long it takes</th></tr></thead><tbody><tr><td><strong>Instant Unstake</strong></td><td>No Marinade fee. It is a DEX swap, so you pay the route's fees, spread and price impact</td><td>Immediate</td></tr><tr><td><strong>Delayed Unstake</strong></td><td><strong>0.2%</strong> protocol fee</td><td>About 1 epoch</td></tr></tbody></table>

### Instant Unstake (Swap via Jupiter)

Instant Unstake for liquid staking is effectively a swap:

* In the app, choosing the **instant** option routes your mSOL to SOL through a DeFi swap (via Jupiter).
* You are trading mSOL for SOL at the current market rate.
* The UI shows the **estimated SOL you will receive**, including any DEX fees and price impact.

Marinade does not charge an unstake fee on this path. The difference between the quote and mSOL's true price is market cost, not a protocol fee. This option is best when you want your SOL back immediately and are comfortable with the current market rate for mSOL to SOL. Because it's a swap, very large trades can move the price and result in some slippage.

### Delayed Unstake

[Delayed\_Unstake](https://github.com/marinade-finance/liquid-staking-program/blob/de348a2779ef1659db7b42a190279ae8da16c125/programs/marinade-finance/src/state/order_unstake.rs#L66)

Delayed Unstake carries a **0.2% protocol fee**, taken proportionally from the amount you unstake.

When you choose 'Delayed Unstake', these operations happen under the hood:

1. You are given a claim ticket indicating the amount and due time of your unstake.
2. mSOL is burnt and removed from the supply.
3. The unstake operation is launched and performed by the bot.
4. In due time, you will be able to claim your SOL and destroy the claim ticket in exchange.

This mechanism is required to perform larger unstake operations, when the amount is bigger than the current balance of the liquidity pool or if you do not mind waiting for the unstaking period.

**Example of Delayed Unstake at Epoch N:**

![There are 3 moments in an epoch for Marinade. The beginning of an epoch, the epoch itself, and the last hours before the end of an epoch. These 3 moments have an impact on the Delayed Unstake function.](https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FZDyhrJtyszzrkaZRY3nL%2FDelayedUnstake.png?alt=media\&token=7bcadef4-d3c7-4433-8313-08eb5f5fcb7b)

Here are the **three** situations that can happen when you use 'Delayed Unstake' during epoch N.

* **You start unstaking during Z**, which is the beginning of epoch n (a few minutes into epoch n).

You will receive your SOL at the beginning of epoch n+1. The amount of SOL you receive is computed as `SOL = [mSOL to burn]*[mSOL price]` when the unstaking starts, but the **mSOL price may not be updated** as the Marinade bot needs to be run to update the price at the beginning of each epoch. *We suggest waiting a few hours into the epoch before using 'Delayed Unstake' and starting it before the last 4 hours of the epoch.*

* **You start unstaking during A**.

You will receive SOL at the beginning of epoch n+1. The amount computed is `[mSOL to burn]*[mSOL price]` when the unstaking starts.

* **You start unstaking during B**, the last 4 hours of epoch n.

You will receive SOL at the beginning of epoch n+2. The amount computed is `[mSOL to burn]*[mSOL price]` when the unstaking starts.


An epoch currently lasts about 2 days on the Solana blockchain, and the exact length varies with slot times. You can follow the progress of the current epoch directly in the [Marinade app](https://app.marinade.finance/).


***

## Do I Need to Claim My Rewards?

No. Your staking rewards are already inside the value of your mSOL, and they compound automatically. There is no claim button and no deadline.

You realize those rewards in SOL when you unstake. If you choose **Delayed Unstake**, you must return to the Marinade app and click **Claim** on the position once the countdown ends. If you choose **Instant Unstake**, the SOL arrives in your wallet in the same transaction.

***

## Is mSOL Safe?

As long as the Marinade protocol earns staking rewards and you hold mSOL, your SOL stake is growing. So how does Marinade ensure that the protocol is safe?

Marinade has undergone a series of audits to ensure the code cannot be exploited. Many of the elements of Marinade are open source, and the mSOL smart contract is under the control of a 13-party community multisig that requires six signers to make a change. Smart contract risks always exist in DeFi, but mSOL's tokenomics and the Marinade protocol are designed with security first and foremost. You can learn more about this on this page:

***

## What Can I Do with mSOL?

mSOL tokens already have dozens of use cases in our growing ecosystem. They allow you to access DeFi protocols while enjoying your staking rewards and helping the network. To help you get started, here is a non-exhaustive list of DeFi options where you can use mSOL:

* **Borrow against it on Marinade** - mSOL is the collateral asset Marinade Borrow is built around, so you can borrow against it directly with no unstaking or conversion needed.
* **Borrowing/Lending elsewhere** - mSOL can be used as collateral or borrowed on multiple other platforms.
* **Liquidity provision** - You will find many liquidity pools using mSOL in DeFi. They can be divided into two categories:
  * mSOL/SOL pools - These pools are a way to use your mSOL in DeFi while avoiding impermanent loss.
  * mSOL/XXX pools - These pools will be subject to impermanent loss but will allow you to provide liquidity on a large number of pairs.
* **Trade on DEXs** - mSOL is available on most decentralized exchanges and can be traded for other crypto tokens. Remember, by trading your mSOL, you also trade your accumulated staking rewards.
* **Trade on CEXs** - mSOL is also available to trade on centralized exchanges such as Coinbase, Kraken, or Gate. You can move the mSOL to your crypto wallet from these exchanges and fully utilize it in Solana DeFi.

Liquid staking tokens like mSOL could theoretically replace SOL throughout the Solana DeFi ecosystem. Any protocol currently using SOL could integrate mSOL using Marinade's permissionless SDK. By doing so, the network would become more secure and decentralized and our users would all earn their staking rewards while enjoying DeFi as they currently do.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/protocol-overview/marinade-liquid/what-is-msol.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
