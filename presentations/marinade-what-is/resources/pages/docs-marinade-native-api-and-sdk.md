> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/protocol-overview/marinade-native/marinade-native-api-and-sdk.md).

# Marinade Native: API & SDK

## Technical Overview

Marinade Native leverages Solana's [stake account structure](https://docs.solana.com/staking/stake-accounts). As explained in Solana's documentation, stake accounts have two different authorities that can belong to separate addresses: the stake authority and the withdraw authority.

> The *stake authority* is used to sign transactions for the following operations:
>
> * Delegating stake
> * Deactivating the stake delegation
> * Splitting the stake account, creating a new stake account with a portion of the funds in the first account
> * Merging two stake accounts into one
> * Setting a new stake authority
>
> The *withdraw authority* signs transactions for the following:
>
> * Withdrawing un-delegated stake into a wallet address
> * Setting a new withdraw authority
> * Setting a new stake authority

Marinade Native was designed to receive the *stake authority* of the user's stake account without touching the withdraw authority that stays assigned to the user's wallet.

The stake authority that Marinade uses is a PDA of the **Native Staking Proxy program**. The program allows a Marinade bot to call delegation instructions on behalf of this PDA. This way, Marinade's Council multisig (4/7) can revoke the bot's access and create a new one if needed.

### How Does the Unstake Work?

Staking on Solana is subject to a cooldown period. When a stake account is delegated, the stake account has to be deactivated first. Then, at the beginning of the next epoch (epochs currently run about 2 days), the user holding the withdraw authority can withdraw funds from the stake account.

Users of this product always maintain ultimate power over the stake accounts and can revoke the stake authority previously granted to Marinade using most wallets.

However, Marinade splits the stake between over 100 validators to spread the risk and support well-performing validators. Therefore, it would be inconvenient for our users to revoke the stake authority, deactivate and withdraw each of the stake accounts one by one.

Marinade has thought of this, and users can use the dApp to help them with the withdrawal. Marinade will prepare the stake accounts for withdraw on your behalf.

* Users ask for the amount of SOL they want to withdraw.
* We deactivate stake accounts amounting to how much users want to withdraw.
* We merge deactivated stake accounts at the beginning of the next epoch, so there is a single deactivated stake account.
* Users can withdraw funds in a single transaction.

To avoid some draining attacks (as Marinade pays for deactivation, and timely merging of all the stake accounts), a **flat fee of 0.003 SOL** is applied for this service. It does not scale with the amount being unstaked, and it applies equally to Marinade Native, Marinade Select and Native positions paid in a Recipe reward token.


This can be integrated easily through the SDK.


### **Does Marinade Native Support Locked-Up Stake Accounts?**

Yes.

When users give Marinade stake authority over stake accounts with different lockup periods and users then want to withdraw some part of the stake, Marinade prioritizes the unlocked stake accounts and then stake accounts with the shortest lockup periods.

***

## Marinade Native On-Chain Addresses

| Role                                         | Address                                       |
| -------------------------------------------- | --------------------------------------------- |
| Native Staking Proxy program                 | `mnspJQyF1KdDEs5c6YJPocYdY1esBgVQFufM2dY9oDk` |
| Stake authority, Marinade Native (Max Yield) | `stWirqFCf2Uts1JBL1Jsd3r6VBWhgnpdPxCTe1MFjrq` |
| Exit authority, Marinade Native (Max Yield)  | `ex9CfkBZZd6Nv9XdnoDmmB45ymbu4arXVk7g5pWnt3N` |
| Stake authority, Marinade Select             | `STNi1NHDUi6Hvibvonawgze8fM83PFLeJhuGMEXyGps` |

The stake authority manages the delegation of all stake accounts for its product flavour. The exit authority prepares and merges the stake accounts of users who requested an unstake.

These authorities are PDAs derived from the proxy program, so no private key exists for them, and they are controlled and can be changed by Marinade's Council.


**Do not enumerate Marinade Native positions by a single stake authority.** Marinade Native spans several staker authorities: Max Yield, Marinade Select, and one authority per Marinade Recipe (the `stR...` set, which grows as new recipes launch). Filtering stake accounts on `stWirqFCf2Uts1JBL1Jsd3r6VBWhgnpdPxCTe1MFjrq` alone silently misses every Select and Recipe position. Fetch the current authority set rather than hardcoding it.


***

## Marinade Native API

Base URL: `https://native-staking.marinade.finance`

<table><thead><tr><th width="77.5999755859375">Method</th><th>Endpoint</th><th>Purpose</th></tr></thead><tbody><tr><td><code>GET</code></td><td><code>/v2/{stake_authority}/apy</code></td><td>APY history for a stake authority</td></tr><tr><td><code>GET</code></td><td><code>/v2/{stake_authority}/tvl</code></td><td>TVL for a stake authority and withdraw authority</td></tr><tr><td><code>GET</code></td><td><code>/v2/{stake_authority}/user-rewards</code></td><td>Rewards earned by a user's stake accounts</td></tr><tr><td><code>GET</code></td><td><code>/v2/{stake_authority}/pending-revokes</code></td><td>Stake accounts pending a stake-authority revoke</td></tr><tr><td><code>POST</code></td><td><code>/v2/{stake_authority}/prepare-for-revoke</code></td><td>Prepare stake accounts for a revoke</td></tr><tr><td><code>POST</code></td><td><code>/v2/{stake_authority}/rebalance-hint</code></td><td>Tell the delegation backend that new stake has arrived</td></tr></tbody></table>

`{stake_authority}` is one of the addresses in the table above. The `rebalance-hint` call is an off-chain advisory and is not required for correctness: the periodic scanner picks up new stake accounts at the next epoch boundary regardless.


The `/v1/` routes are gone. Use `/v2/` only.


<https://native-staking.marinade.finance/docs>
Marinade Native API reference


***

## Marinade Native SDK

<https://www.npmjs.com/package/@marinade.finance/native-staking-sdk>
Marinade Native SDK



---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/protocol-overview/marinade-native/marinade-native-api-and-sdk.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
