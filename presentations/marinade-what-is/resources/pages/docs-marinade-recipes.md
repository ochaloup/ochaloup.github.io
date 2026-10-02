> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/protocol-overview/marinade-recipes.md).

# Marinade Recipes

Stake SOL and receive your rewards in a token of your choice instead of more SOL. Principal stays in SOL. Also called Customized Rewards.


Marinade Recipes are also referred to as **Customized Rewards**. Both names describe the same feature. This page uses "Recipes."



**TL;DR:** Marinade Recipes lets you stake SOL and receive your staking rewards in a token of your choice, from stablecoins like USDG and USDC to BTC, ETH, gold, MNDE, and tokenized equities, instead of more SOL. Your SOL principal stays in SOL the whole time; only the yield is converted, and payouts arrive automatically each epoch.


## Overview

Marinade Recipes lets you stake SOL and receive your rewards in a different token instead of more SOL. Your SOL principal stays in SOL the whole time. Only the staking yield is converted, each epoch, into the payout token you picked.

The idea is simple: keep your SOL exposure on the principal, but skip the loop of unstaking, swapping, and restaking each epoch just to convert rewards into the token you actually want.

Recipes launched with a single payout token and now support a range of them across several categories, with more planned.

## How It Works


**Open a token account for your payout token, and keep it open.** Payouts are SPL token airdrops, so your wallet must have an account for the payout token before rewards can arrive. Marinade does not open this account for you. Create it before or shortly after staking, then leave it open. If it is closed, payouts pause. Up to 2 weeks of missed payouts are recovered automatically once you reopen it, and anything older than 2 weeks is permanently lost.


A Recipe is a separate native staking path. It sits next to Marinade Liquid and Marinade Native and works like this:

* **Your SOL stays in SOL:** Your deposit goes into native Solana stake accounts managed by Marinade's program and is delegated to validators. The principal is never swapped. You keep full price exposure to SOL.
* **Only the yield is converted:** Each epoch, the program collects staking rewards from the participating stake accounts, converts them on-chain into your chosen payout token, and distributes the result proportionally to stakers.
* **One payout token per position, changeable anytime:** Each position pays out in one token. You choose it when you stake, and you can change it later without unstaking. To receive more than one token at once, hold separate positions.
* **Payouts arrive each epoch:** The payout token is delivered to your wallet (or a redirect wallet you choose) around the start of each new Solana epoch. A Solana epoch currently runs about **2 days**, and that length drifts with block times. See the FAQ below.

Recipes don't use SAM (Marinade Max Yield) or Marinade Select. SAM and Select decide how stake is allocated across validators. A Recipe decides how that stake's rewards are converted and routed back to you. It's a different delegation path with its own infrastructure.


Your SOL sits in standard native stake accounts. You keep full withdrawal authority, and no Marinade contract ever holds your SOL.


## Available Recipes

You pick your payout token when you stake. The currently available Recipes are below. For current APY and to get started, see the [Marinade Recipes product page](https://marinade.finance/features/marinade-recipes).

<table><thead><tr><th width="111.4000244140625">Payout Token</th><th width="175">Reward Asset</th><th width="211">Category</th><th>Issuer / Backing</th></tr></thead><tbody><tr><td>USDG</td><td>Global Dollar</td><td>USD stablecoin</td><td>Paxos, via the Global Dollar Network</td></tr><tr><td>USDC</td><td>USD Coin</td><td>USD stablecoin</td><td>Circle</td></tr><tr><td>USDT</td><td>Tether</td><td>USD stablecoin</td><td>Tether</td></tr><tr><td>EURC</td><td>Euro Coin</td><td>EUR stablecoin</td><td>Circle</td></tr><tr><td>BTC</td><td>cbBTC</td><td>Bitcoin</td><td>Coinbase</td></tr><tr><td>ETH</td><td>WETH</td><td>Ether</td><td>Wormhole-bridged</td></tr><tr><td>GOLD</td><td>Tether Gold (XAU₮)</td><td>Tokenized gold</td><td>Tether</td></tr><tr><td>MNDE</td><td>MNDE</td><td>Marinade governance token</td><td>Marinade</td></tr><tr><td>SPY</td><td>SPYx</td><td>Tokenized S&#x26;P 500 ETF</td><td>Backed (xStocks)</td></tr><tr><td>NVDA</td><td>NVDAx</td><td>Tokenized Nvidia stock</td><td>Backed (xStocks)</td></tr><tr><td>SPCX</td><td>SPCX</td><td>Tokenized SpaceX stock</td><td>SpaceX - Backpack Securities</td></tr></tbody></table>

More Recipes are planned. Updates go out on the product page and through official Marinade channels.


Payout tokens are issued by third parties, and each carries its issuer's own trust model. Some of them (for example USDG and the tokenized equities) can be paused or frozen by their issuer, which would pause reward delivery and exits in that token until the pause is lifted. Tokenized equities such as SPYx and NVDAx are issued by Backed and are generally available only to non-U.S. persons. None of this affects your SOL principal, which stays in native stake accounts you control. Confirm a payout token suits your needs before choosing it.


### **Fees**

Recipes follow the same fee model as Marinade Native:

* **Yield matches native staking:** A Recipe earns the same staking yield as Marinade Native and mSOL, paid in your chosen token instead of SOL (subject to any active launch incentives or boosts noted on the product page).
* **No performance fee:** Marinade takes no cut of the rewards a Recipe earns. There is no deposit fee either.
* **Unstake fees:** Instant Unstake is priced by the winning market-maker quote and carries no separate Marinade protocol fee. Delayed Unstake carries a **flat 0.003 SOL fee**, the same as Marinade Native and Marinade Select, and it does not scale with position size.

### **Unstaking**

Same two exit paths as Marinade Native:

* **Instant Unstake:** Available right away. Your stake account is sold into a marketplace of liquidity providers, and the amount you receive is set by the best quote. Marinade adds no separate protocol fee on top of that quote. The exact SOL you will receive is shown before you approve. It needs a position of **1 SOL or more**, on a stake account at least **2 epochs old**.
* **Delayed Unstake:** Standard Solana deactivation, with no minimum size. Stake is withdrawable after the cooldown, normally the start of the next epoch, for a **flat 0.003 SOL fee**. Starting in the last 4 hours of an epoch pushes the claim back by one further epoch.

Keep a small amount of SOL available in your wallet, around **0.03 SOL**, so you can pay the network fee on the unstake and on the later claim.

There's no separate "turn off rewards" switch. You exit by unstaking. Any rewards already earned stay in your wallet and are not affected.

See Marinade Instant Unstake for how both exit paths compare.

***

## Changing Your Reward Token

Every Marinade Native position has a reward token you can change at any time. You can switch from one reward token to another, or switch to or from SOL. Your SOL is never unstaked or returned to you during a switch.

To change it:

* Go to **Portfolio** and find your Marinade Native row under Earn positions.
* Open the **...** menu on that row and choose **Open detail**. That takes you to the Marinade Native page under Earn.
* Click the **asset dropdown** and choose the token you want.
* Confirm the change in your wallet.


Switching to or from SOL moves your stake between validators. This takes about one epoch, during which your stake does not earn rewards. If you switch very close to the end of an epoch, the change can miss that epoch's cutoff and take up to two epochs. Switching between two reward tokens (for example USDG to cbBTC) is seamless and does not interrupt your rewards.


How switching affects your stake:

* **Between reward tokens:** Switching from one token to another stays on the same validator with no interruption. Your stake keeps earning the whole time.
* **To or from SOL:** SOL rewards use Marinade's standard SOL staking across many validators, while a reward token uses a dedicated validator. Switching between them redelegates your stake, so your stake does not earn rewards for about one epoch (up to two if you switch right at the end of an epoch). To keep it to a single epoch, avoid switching in the final moments of an epoch.
* **Choosing SOL:** Setting your reward token to SOL returns the position to standard Marinade Native staking, so it is no longer a Customized Rewards position. You will not receive SOL airdropped to your wallet. Your SOL rewards auto-compound back into your staked position, so your stake grows rather than tokens arriving in your wallet.
* **Open the token's account:** For any payout token, your wallet needs that token's account open so payouts can land. This does not apply when you switch to SOL, since SOL compounds instead of being airdropped.

Good to know:

* **When it takes effect:** A reward-token change applies from the following epoch. Your current epoch rewards are paid in your previous token, and from the next epoch your rewards are converted to the new token and airdropped.
* **No switching fee:** Marinade does not charge a fee to switch. You pay only the standard Solana network transaction fee to submit the change, so keep around 0.03 SOL available.
* **No limit:** You can change your reward token as often as you like.
* **Native only:** Reward switching applies to Marinade Native positions. Marinade Select does not have it.

**Q: Does switching my reward token interrupt my rewards?**

A: It depends on the switch. Changing from one reward token to another is seamless and keeps earning without interruption. Switching to or from SOL redelegates your stake, so it does not earn rewards for about one epoch, or up to two epochs if you switch right at the end of an epoch.

**Q: When does my new reward token start?**

A: From the following epoch. Your current epoch rewards are paid in your previous token, and from the next epoch your staking rewards are converted to the new token and airdropped to your wallet.

**Q: Is there a fee to switch?**

A: Marinade does not charge a fee. You pay only the standard Solana network transaction fee to submit the change.

**Q: How often can I switch?**

A: As often as you like. There is no limit.

**Q: Does switching unstake my SOL?**

A: No. Your SOL stays staked and is never returned to you. Switching to or from SOL redelegates your stake, but it remains staked the whole time.

**Q: If I switch to SOL, will SOL be airdropped to my wallet?**

A: No. Switching to SOL returns your position to standard Marinade Native staking, and your SOL rewards auto-compound back into your stake rather than being paid to your wallet. Nothing is airdropped. To receive payouts in your wallet, choose a token other than SOL.

**Q: I cannot find an Edit rewards button.**

A: There isn't one. The reward token is set from the asset dropdown on the Marinade Native page under Earn. Reach it from **Portfolio**, the **...** menu on your Marinade Native row, then **Open detail**.

**Q: Which tokens can I switch to?**

A: SOL and any of the reward tokens available for Marinade Recipes (see the Available Recipes table).

**Q: Do I need a token account for the new reward token?**

A: Yes, for any payout token, so the airdrop can land. This does not apply if you switch to SOL, which compounds instead of being paid out.

***

## Security

Recipes use the same security model as Marinade Native:

* **Non-custodial:** Principal sits in native Solana stake accounts owned by the staker.
* **No Marinade contract holds your SOL:** Staking runs through the Native Staking Proxy program, which manages delegation, but you keep withdraw authority over your own stake accounts throughout. The reward pipeline only touches rewards after they have been earned. It never touches the staked SOL.
* **Bounded failure mode:** Worst realistic case is a delay in the swap or distribution step that pushes a payout to a later epoch. Principal is not at risk in the reward routing.

Full audit reports are on the Audits page.

***

## Frequently Asked Questions

**Q: Can I choose which token I'm paid in?**

A: Yes. You pick your payout token when you stake, and you can change it later without unstaking. Each position pays out in a single token, so to receive more than one token at once, hold separate positions.

**Q: When will I receive my first reward?**

A: Solana native staking requires your stake to be active for a full epoch before it earns rewards. If you deposit mid-epoch, your stake activates at the start of the next epoch, earns for that full epoch, and the first payout arrives around the start of the epoch after that.

**Q: The epoch just ended and I still haven't received my rewards. Is something wrong?**

A: No, this is normal. Rewards are processed in stages after each epoch ends: collect SOL rewards from stake accounts, swap to the payout token, then distribute. The whole pipeline runs on-chain and can take some hours, so there's a gap between the epoch boundary and the tokens hitting your wallet. If a full day has passed since the new epoch started and you still see nothing, check that your payout token account is still open (see the "payouts stopped" question below).

**Q: Can I have my rewards sent to a different wallet than the one I stake from?**

A: Yes, for every Recipe (Customized Reward). You can direct rewards to a wallet other than the one that holds your stake, which is useful for keeping staking and spending separate, routing rewards to an operations or treasury wallet, or sending them to a charity. You set the destination address when you stake, and your staked SOL stays under your control either way. Make sure the destination wallet keeps an open token account for the payout token.

**Q: Is my SOL ever swapped for the payout token?**

A: No. Only the staking rewards are converted. Your principal stays in SOL the entire time. A small amount of slippage applies when the rewards themselves are swapped each epoch.

**Q: My payouts stopped. What happened?**

A: The most common cause is a closed payout token account in your wallet (often from a "sweep empty accounts" feature). Reopen it by receiving any amount of that token; even a tiny swap on a DEX such as Jupiter or Titan is enough. Up to 2 weeks of missed rewards are recovered automatically once the account is active again. Anything older than 2 weeks is lost. For more detail, see the help center article ["Why Did My Recipe (Customized) Staking Rewards Stop?"](https://help.marinade.finance/en/articles/14317979-why-did-my-recipe-customized-staking-rewards-stop).

**Q: Do my Recipe rewards show up in Marinade's staking rewards report?**

A: No. Marinade's staking rewards report covers SOL staking rewards and does not track Recipe payouts. To review what you have received, look up your wallet's activity on a Solana explorer such as [Solscan](https://solscan.io).

**Q: How are Recipe rewards treated for tax?**

A: Marinade does not provide tax advice, does not issue tax forms such as 1099s, and is not responsible for determining or meeting your tax obligations. How staking rewards are taxed depends on your country and your personal circumstances, and working that out is your responsibility. You can pull your reward transactions from a Solana explorer such as Solscan to build your own records, and various third-party crypto tax tools can help compile them. Marinade does not endorse or recommend any specific tool, since how well one fits depends on your situation. Consult a qualified tax professional in your jurisdiction.

**Q: Which tokens are supported, and which are coming next?**

A: The currently available payout tokens are listed in Available Recipes above. More are in development. Updates go out on the [Marinade Recipes product page](https://marinade.finance/features/marinade-recipes) and through official Marinade channels.

**Q: Do I need to open a token account to receive my rewards?**

A: Yes. Payouts are delivered as SPL token airdrops, so your wallet needs an open account for your payout token before rewards can land. Marinade does not open it for you. You can create it by receiving or swapping for any amount of the token (for example, a tiny swap on Jupiter or Titan), or through your wallet's token management. Keep the account open. If it is closed, payouts pause until you reopen it, and up to 2 weeks of missed payouts are recovered automatically once it is active again. Anything older than 2 weeks is permanently lost.

**Q: Why doesn't Marinade open the token account for me?**

A: Opening a Solana token account requires a small, refundable SOL rent deposit (roughly 0.002 SOL) that is returned when the account is closed. When Marinade funded these accounts automatically, some users repeatedly opened and closed accounts across many wallets to reclaim that Marinade-funded rent, extracting more SOL than their rewards were worth. To keep the system fair, Marinade no longer funds token accounts. Because you fund your own account now, the rent is simply your own SOL, returned to you if you ever close the account.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/protocol-overview/marinade-recipes.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
