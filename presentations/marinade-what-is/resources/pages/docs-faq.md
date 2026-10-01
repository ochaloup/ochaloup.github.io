> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/faq.md).

# FAQ

You'll find the answers to most of your questions here! If something is not yet answered, reach out to us on our Discord.

## **What is Marinade?**

Marinade is a stake automation platform built on Solana. It continuously monitors the validator landscape and delegates your stake using a transparent, on-chain strategy called the [Stake Auction Market](/marinade-protocol/protocol-overview/stake-auction-market.md), designed to maximize staking rewards while supporting network decentralization.

Marinade offers two ways to stake:

* **Marinade Liquid.** Stake SOL and receive mSOL, a liquid token you can use across Solana DeFi while continuing to earn staking rewards.
* **Marinade Native.** Benefit from Marinade's delegation strategy with no smart contract interaction. You retain full custody of your SOL at all times.

***

## Is Marinade custodial?&#x20;

No, Marinade is a non-custodial protocol. When staking to Marinade and receiving mSOL, you trade the custody of your SOL to receive custody over your received mSOL. With Marinade Native, you retain custody over your SOL at all times.

Marinade is also permissionless, meaning that our bot or our smart contracts can be interacted with by anyone, even in the absence of the team.&#x20;

***

## **What is liquid staking?**

Liquid staking is an alternative to traditional staking (or native staking). It allows users to benefit from a protocol's staking rewards while receiving a receipt token (mSOL) for their staked SOL that can be used in DeFi, making their staked assets liquid. Liquid staking also allows an instant unstake of your staked assets.

***

## What is Marinade Native?

Marinade Native is a product released in July 2023 that allows users to benefit from Marinade's delegation strategy and have their stake automatically monitored and rebalanced, all while avoiding smart contract risk.&#x20;

In exchange, the user does not receive mSOL and cannot use DeFi to look for additional yield.&#x20;

***

## **How long does it take to stake and unstake?**

With Marinade, you can start staking SOL at any time from the UI. Your stake will begin earning yield from the first full epoch after it is activated.

You can also unstake from the UI at any time, using one of two options:

* [**Instant Unstake**](https://marinade.finance/features/instant-unstake)
  * For liquid staking (mSOL), the instant option is a swap via DEX from mSOL to SOL at the current market rate.
  * For native staking (including Marinade Native), the app shows a quote from a market maker for converting your staked SOL back to liquid SOL in one transaction.
  * In both cases you see an estimated receive amount before confirming, so you can decide whether you’re happy with the quote.
* **Delayed Unstake**
  * If you don’t want to take a market quote, you can use delayed unstake.
  * Your position is scheduled to unlock and your SOL becomes claimable after **1 epoch**.
  * This option avoids price impact and simply follows Solana’s native unstaking flow.

For an overview of any fees that apply to each path, see [**FAQ**](#what-fees-does-marinade-charge)**.**

***

## **Are staking rewards staked automatically?**

Staking rewards are compounded automatically into the staked SOL.

***

## Do I get MEV rewards by staking with Marinade?&#x20;

Yes, you do. Marinade stakes to validator nodes running the MEV-optimized Jito validator client. Marinade collects and restakes these MEV rewards on the user's behalf. For mSOL holders, MEV is added to the price each epoch once rewards are claimed and added to the stake pool. For Marinade Native users, the MEV rewards are added to the user's stake.&#x20;

***

## Has Marinade Been Audited?

Please refer to our [Audits](/marinade-protocol/security/audits.md)

***

## **Where Are my SOL Tokens?**

When you deposit your tokens, Marinade automatically spreads their delegation among the top-performing validators that actively participate to Solana decentralization (See [Stake Auction Market](/marinade-protocol/protocol-overview/stake-auction-market.md)). You will receive 'marinated SOL' (mSOL) tokens back in your wallet. mSOL can be unstaked to receive your SOL tokens back, plus rewards. mSOL increases in value every epoch relative to SOL.

If you use Marinade Native, your SOL tokens are in your wallet, in stake accounts, accumulating rewards.

***

## Where Can I See the Validators Marinade Delegates to?

You can find the full list of our current validators on [our website](https://marinade.finance/app/validators/?sorting=score\&direction=descending) or find Marinade's on-chain account [here](https://solscan.io/account/4bZ6o3eUUNXhKuqjdCnCoPAoLgWiuLYixKaxoa8PpiKk).

***

## How Long Does It Take for A Stake Account to Be Redelegated?&#x20;

Marinade allows you to directly deposit your stake account and receive mSOL in exchange. This means that if you are already staking with a single validator, you can easily jump on board.

But what happens if you are delegating to one of the top validators, excluded from our delegation strategy? Marinade will accept it and redelegate it shortly after (if your stake account is [eligible](/marinade-protocol/faq.md#can-i-deposit-my-stake-account-directly)).&#x20;

Stake accounts are redelegated at the end of epochs and it can take 1 to 2 epochs to redelegate those stake accounts to validators chosen by our Stake Auction Market.&#x20;

***

## How Can I Get mSOL?

There are different ways of obtaining mSOL:&#x20;

* **Stake SOL to Marinade's staking pool and get mSOL**. This is the simplest way and has no fees.&#x20;
* **Trade for mSOL on secondary markets** (centralized or decentralized exchanges like Coinbase, Raydium, Orca, etc.). Please keep in mind that in this case, you might be paying trading fees.&#x20;

***

## Where Can I Use mSOL?

mSOL can be used in many DeFi protocols, all without losing your staking rewards.&#x20;

For example, you can:&#x20;

* Add mSOL to a liquidity pool on a decentralized exchange
* Lend your mSOL or use it as collateral on borrowing/lending protocols
* Supply mSOL to yield farming protocols
* Trade with your mSOL on CEXs and DEXs
* Etc.

We are always on the lookout for new protocols where mSOL could be integrated.&#x20;

***

## How is mSOL's APY Calculated?

There are multiple ways to calculate the APY of a liquid staked token and they all have to rely on the projection of previous rewards over the next year. Nonetheless, Marinade tried its best to calculate and display the APY in the most honest and accurate way possible.&#x20;

Marinade calculates its displayed APY using a 30-day SMA of the 14-day APY.

This means that in order to calculate the APY, Marinade uses the smart contract price of mSOL and compares it to the price mSOL had 14 days before. It does so every day and displays a final APY based on the average of those measurements over 30 days, projected over a year. You can see this data in our [stats page](https://stats.marinade.finance/).

***

## **Can I Deposit My Stake Account Directly?**&#x20;

Yes, you can deposit any stake account directly to Marinade. If you can't deposit your stake account, it can be for the following reasons:&#x20;

* Your stake account is not activated yet. This takes up to two epochs and you will have to try at a later time.
* Your stake account contains less than 1 SOL. We have a limit to avoid bots and overload.&#x20;

***

## **Any Public Sale or IDO?**

Marinade is bootstrapped and self-funded with help from ecosystem grants provided by Solana and Serum. We're not taking in any private investors or VC funds and are not doing any private or public sales. We plan to build our DAO around Marinade users and protocols.&#x20;

***

## How Can I Use My MNDE?&#x20;

MNDE can be used to participate in Marinade governance by locking your MNDE on Realms.&#x20;

Once your MNDE is locked, you can vote on proposals. The MNDE can be withdrawn by committing to a 30-day unlock period to get back the underlying MNDE.

***

## Does Marinade Vouch for the Security of Protocols Using mSOL?

No. mSOL is a permissionless token that can be integrated anywhere and by anyone. If a project offers the possibility to use mSOL, this does not mean that the project is safe or audited by the Marinade team at all.&#x20;

We encourage you to always do your due diligence on your investment projects. If you have any doubts or questions, we will gladly discuss them with you on our Discord.&#x20;

***

## Can I Use Marinade With A Hardware Wallet?

Any hardware wallet supporting Solana and SPL tokens will also support mSOL. You can send your mSOL to the Solana address of your hardware wallet and manage your funds from it.

To interact with DeFi protocols, you will need to connect your hardware wallet to a compatible browser-extension wallet such as Phantom, Solflare, Backpack or Jupiter. Refer to your hardware wallet's official documentation for setup instructions.

***

## How To Check My Marinade Native Stake Accounts?&#x20;

Solana explorers sometimes have trouble displaying stake accounts handled by Marinade Native. If you would want to check that your stake accounts exist on-chain and still are under your custody, you can directly run the Solana CLI on your machine and use the command:&#x20;

```
solana stakes --withdraw-authority <pubkey>
```

Replace `pubkey` by your pubkey and you will get a list of all the stake accounts that belong to your wallet, including the ones created by Marinade Native.

***

## What Fees Does Marinade Charge?

### **Deposit Fee**

There is no deposit fee for any of the Marinade staking options.

### **Unstake Fee**

#### **Instant Unstake**

**For Marinade Native positions (and other regular native staking positions):**

* **Fee:** Dynamic, typically between 10 and 40 basis points (0.10–0.40%).
* **Applies to:** Marinade Native positions and other native staking positions exited via Instant Unstake.
* **Notes:** Pricing is determined by an open market and depends on how market makers quote liquidity. The quote shown in the UI reflects the full execution price, including any fee or spread.

**For Marinade Liquid (mSOL):**

* **Fee:** No protocol fee.
* **Notes:** This is effectively a swap, not a traditional unstake. Price impact may apply depending on swap size and available liquidity.

#### **Delayed Unstake (1-epoch delay)**

**For Marinade Native, Marinade Select, and Marinade Recipes (Customized Rewards):**

* **Fee:** None. Delayed unstake is free, with no minimum fee.
* **Notes:**
  * Delayed unstake works the same as classic native staking: wait through the cooldown and receive the full stake, with no Marinade fee taken.
  * Combined with zero deposit fees, there is no cost to enter or exit these products.

**For Marinade Liquid (mSOL):**

* **Fee:** 0.2% (20 basis points).
* **How it's charged:**
  * The fee is deducted from the unstaked amount before the ticket is credited.
  * The Receive amount shown in the UI already reflects the fee.
* **Minimum unstake amount:** 1.0043 SOL.
* **Notes:** Provides predictable exit pricing and shifts protocol revenue toward exit-based fees instead of continuously charging staking rewards.

**For Direct Stake (deactivating your own stake account):**

* **Fee:** No Marinade fee. Only the standard Solana network transaction fee applies.
* **Notes:** Direct Stake unstake is a deactivation of the user's own stake account, not a Marinade protocol unstake.

### Performance Fee

**Marinade Select:**

* **Fee:** Dynamic protocol commission designed to align APY with other Marinade products.
* **Validator commission:** 10 basis points (0.10%)
* **Notes:** Helps unify product yields while maintaining consistent validator economics

**Stake Auction Market (SAM):**

* **75% fee on bid flow** (validators pay to receive stake)
* **0% fee on staking rewards**

### **For USDC Vault:**

* **Fee:** No deposit or withdrawal fee. Withdrawals are instant (no 1-epoch delay).
* **Performance fee:** 5% on the net interest generated by your position. Already reflected in the displayed net APY.
* **Notes:** USDC Vault is a lending vault, not a staking product, so the 1-epoch delayed unstake flow does not apply. See [USDC Earn Vault](https://docs.marinade.finance/marinade-protocol/protocol-overview/usdc-earn-vault#fees) for full details.

***

### Revenue Sharing & Transparency

#### Revenue Allocation

Protocol revenue is allocated by the Marinade DAO in accordance with approved governance proposals.

Under [**MIP-22**](https://forum.marinade.finance/t/mip-22-mnde-liquidity-and-staking-rewards/1993), **10% of protocol revenue** funds programmatic open-market **MNDE buybacks**. The remainder supports:

* Liquidity provisioning
* Ecosystem development and operations
* Other initiatives approved by the DAO

#### Transparency

* [**Hextech Dashboard**](https://app.hex.tech/0195d1d1-bfc7-7001-8243-11ff2c293f01/app/Marinade-DAO-Revenue-030vg9JLITAA3GSoN8ee4y/latest) – DAO revenue, allocations, and historical activity
* [**Marinade Realms Treasury**](https://v2.realms.today/dao/marinade/treasury) – On-chain governance and treasury management

***

## What are Marinade Recipes, and what are Customized Rewards?

They are the same feature under two names. Marinade Recipes, also referred to as Customized Rewards, let a staker keep their SOL principal in SOL while receiving each epoch's staking rewards in a token of their choice, such as USDG, USDC, BTC, or MNDE. For the full list and details, see the [Marinade Recipes](/marinade-protocol/protocol-overview/marinade-recipes.md) page.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/faq.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
