> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/protocol-overview/marinade-native.md).

# Marinade Native

Marinade native is a tool to have your staked SOL managed and optimized automatically by Marinade's delegation strategy.

## What is Marinade Native?&#x20;

Marinade Native is an alternative to liquid staking that allows users to benefit from an automated delegation strategy while keeping their SOL in stake accounts their own wallet owns. It differs from liquid staking on the following points:

* Marinade Native **leverages native Solana stake accounts** rather than a staking pool. No Marinade contract ever holds your SOL
* When using Marinade Native, you **retain the withdraw authority** over your stake accounts and stay the only party that can withdraw your SOL at any time. Marinade holds only the stake authority, which can delegate, split and merge stake accounts but can never withdraw from them
* Marinade Native does not charge any deposit fee or ongoing management fee
* You **do not receive mSOL** when using Marinade Native. You are creating Solana stake accounts in your wallet and delegating the management of those to Marinade
* Since you are staking natively when using Marinade Native, **rewards are directly sent to each of your stake accounts at the end of every epoch** (about every 2 days)

{% hint style="info" %}
Marinade Native is **non-custodial**, not contract-free. Delegation is routed through Marinade's Native Staking Proxy program, which owns the stake authority through PDAs so that Marinade's Council can rotate the bot's access. The custody guarantee comes from the authority split, not from the absence of a program. See Marinade Native: API & SDK.
{% endhint %}

## How to use Marinade Native?

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2Fz30U2v7yNMmid4pXKJtN%2Fimage.png?alt=media&amp;token=ce312575-f401-4020-9b6b-2607b14e0613" alt=""><figcaption></figcaption></figure>

To use Marinade Native, click on "Stake" for your SOL and select the desired strategy options, then confirm the transaction.&#x20;

You can also redelegate existing stake accounts to Marinade Native by selecting them in Marinade's dApp, choosing "Native" and confirming the transaction.&#x20;

## Why Should I Use Marinade Native?

Marinade Native allows you to benefit from an optimized delegation strategy reaching top-performing validators. Your **staking position is automatically monitored and rebalanced for no management fee and delegated to the best validators on the network**, without having to monitor or manage it yourself. A position under 2 SOL moves as a whole block when rebalanced, since Solana requires a minimum of 1 SOL per stake account, which can delay that position's next reward by more than one epoch.

Marinade Native allows you to futureproof your staking position so it's always delegated to a wide range of top-performing validators, even if the best-performing validators change over time. It also considers any revenues from MEV (or any other sources), and will identify the validators extracting and redistributing the most value to their stakers for you.

It also **protects you from commission rugging** (validators stealing their delegators' rewards by changing their commission), the **validator(s) you chose going offline or running an outdated client**, etc.

Slashing is also bound to be added to Solana and having your staked SOL monitored and rebalanced to avoid bad-performing and/or nefarious validators will be one of the best ways to mitigate the slashing risks.

{% hint style="success" %}
Marinade Native can also be used with **locked SOL.** Make sure you optimize and automate it with Marinade Native until it gets unlocked!
{% endhint %}

### Is There a Minimum to Use Marinade Native?

You can use Marinade Native with as little as 1.0046 SOL. Nonetheless, Marinade will never create smaller stake accounts than 1 SOL, so your stake will not be split across a hundred validators but will stay delegated to a lower number of validators with stake accounts of 1 SOL each.

We recommend using Marinade Native with at least 100 SOL to get your stake fully distributed.

### Can I Unstake at Any Time?

Yes. When you exit your Marinade Native position you have two options:

#### Instant Unstake (Sell Your Native Stake Now)

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FBVnsmr9XETSoV6U7uJmM%2Fimage.png?alt=media&amp;token=4d3294b3-dd0e-44fe-a781-7e4adc99e968" alt="" width="522"><figcaption></figcaption></figure>

Instant Unstake lets you convert your natively staked SOL back to liquid SOL in a single transaction, without waiting for the usual 1 epoch cooldown.

When you choose this option in the app:

* Marinade detects eligible native stake accounts in your wallet (including Marinade Native positions).
* A market maker provides a quote, and the UI shows an **estimated amount of SOL** you would receive.
* You can review the quote and decide whether to accept it.

Two conditions apply. Instant Unstake needs a position of **1 SOL or more**, and the stake account has to be at least **2 epochs old**. Below 1 SOL, or on a stake account that is still too young, use Delayed Unstake instead, which has no minimum.

The received SOL amount is lower than the nominal stake balance. The difference is set by the market, not by Marinade, and varies with liquidity conditions. On native positions it is typically **0.10% to 0.40%**. If you're not comfortable with the quote, you can always switch to Delayed Unstake instead.

#### Delayed Unstake (Standard Unlock Period)

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FsYeHXmDmr9yXgwMajxFk%2Fimage.png?alt=media&amp;token=1374810e-ecaa-456a-9dbc-a2303bb34c8c" alt="" width="511"><figcaption></figcaption></figure>

If you prefer to avoid any quote or price impact, you can use Delayed Unstake:

* Marinade schedules your stake accounts to deactivate at the next epoch boundary.
* Your SOL (plus any rewards up to that point) becomes claimable after **1 epoch**.
* The app shows an estimated time for when your SOL will be ready to claim.

Delayed Unstake carries a **flat fee of 0.003 SOL**, whatever the size of the position. The fee covers Marinade deactivating and merging your stake accounts on your behalf, and it prevents draining attacks on that service. It is the same flat amount for Marinade Native, Marinade Select and Native positions paid in a Recipe reward token.

{% hint style="info" %}
Claiming is a separate Solana transaction. Keep a small SOL balance in your wallet so the claim does not fail on network fees.
{% endhint %}

## Is Marinade Native safe?&#x20;

By keeping your SOL in stake accounts your own wallet owns and leaving the withdraw authority with you, Marinade Native removes several risks.

Since Marinade Native never holds the authority to withdraw your SOL, **its only power is to delegate your stake to different validators in the cluster**.

Marinade Native relies on Marinade's delegation strategy, which is crafted to spread your stake among top-performing validators while accounting for network decentralization. There are also technical backstops, described in [Marinade Native: API & SDK](/marinade-protocol/protocol-overview/marinade-native/marinade-native-api-and-sdk.md), to ensure that Marinade Native will always do the best for your staking position.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/protocol-overview/marinade-native.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
