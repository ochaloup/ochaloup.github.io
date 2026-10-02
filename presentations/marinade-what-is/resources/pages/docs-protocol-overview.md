> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/protocol-overview.md).

# Protocol Overview

Marinade Finance was built to bring to life a vision. A non-custodial liquid staking solution on Solana, decentralizing the network.

## What Can You Do on Marinade?

Marinade offers flexible staking options and tools to manage your SOL across different formats:

### [Marinade Native](/marinade-protocol/protocol-overview/marinade-native.md)

Stake SOL or deposit a stake account directly into Marinade while retaining full control. Your stake stays entirely on-chain in stake accounts your own wallet owns, and is automatically delegated through Marinade's **Stake Auction Marketplace**, which matches stake with high-performing validators in a permissionless, market-driven process.

You can also migrate your existing native staked accounts into Marinade to benefit from automated delegation and performance optimization.

### [Marinade Select](/marinade-protocol/protocol-overview/marinade-select.md)

A premium staking set powered by Marinade. It includes a vetted group of community-recognized validators that meet strict criteria for performance, compliance, and decentralization.


**Marinade Select is not currently available to stake to.** Staking new SOL to Select is not offered in the app at the moment. Existing Select positions are unaffected: they keep earning and can still be unstaked at any time. To stake new SOL today, use **Marinade Native**.


### [Marinade Liquid](/marinade-protocol/protocol-overview/marinade-liquid.md)

Stake SOL or deposit a stake account to receive mSOL, a liquid staking token that can be used throughout the Solana DeFi ecosystem.

You can also swap other liquid staking tokens into mSOL, or convert mSOL and other staking positions back to SOL through immediate or delayed unstaking.

### [Marinade Recipes](/marinade-protocol/protocol-overview/marinade-recipes.md)

Stake SOL the Marinade Native way, but have your staking rewards paid out in a token of your choice instead of SOL. Your stake accounts stay in your own wallet.

### [USDC Earn Vault](/marinade-protocol/protocol-overview/usdc-earn-vault.md)

Deposit USDC into a curated lending vault and earn on stablecoins, with no lockup and instant withdrawal.

### [Marinade Borrow](/marinade-protocol/protocol-overview/marinade-borrow.md)

Borrow against your mSOL without unstaking or converting it first.

### [Instant Unstake](/marinade-protocol/protocol-overview/marinade-instant-unstake.md)

Exit a staking position in a single transaction instead of waiting out the unlock period, at a market-set rate. Instant Unstake needs a position of 1 SOL or more.

***

### What's So Special About Marinade Native?

Marinade Native provides a secure, non-custodial staking experience with:

* Full ownership of your SOL at all times. Your wallet keeps the **withdraw authority**, so only you can move the SOL out
* No Marinade contract ever holds your SOL. Marinade takes only the **stake authority**, which can delegate, split and merge your stake accounts but can never withdraw from them
* Automatic validator delegation and rebalancing
* Redelegate existing stake accounts without unstaking
* Unstake anytime, with two exits. **Instant Unstake** returns SOL in a single transaction at a market-set rate and needs a position of 1 SOL or more. **Delayed Unstake** works at any size and becomes claimable after one epoch, or after the following epoch if you start it in the last 4 hours of the current one
* Community-led governance through the Marinade DAO


Marinade Native is **non-custodial**, not contract-free. Delegation is routed through Marinade's Native Staking Proxy program, which holds the stake authority through PDAs. See Marinade Native: API & SDK for the program and authority addresses.


There is no deposit fee and no ongoing management fee on Marinade Native. Exiting a position does carry a cost: see [Fees and Pricing](/marinade-protocol/protocol-overview/fees-and-pricing.md).

***

### What's So Special About Marinade Liquid?

Staking with Marinade for mSOL offers several unique advantages:

* Stake SOL and receive mSOL, which grows in value with rewards
* Use mSOL in DeFi for collateral, trading, or yield strategies, including Marinade Borrow
* Convert existing stake accounts into mSOL
* Trade mSOL on secondary markets at market rates
* **No performance fee on staking rewards.** Marinade takes 0% of the rewards the pool earns

Delayed unstaking of mSOL carries a **0.2%** protocol fee. See [Fees and Pricing](/marinade-protocol/protocol-overview/fees-and-pricing.md).


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/protocol-overview.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
