> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/security/multisig-governance.md).

# Multisig governance

Marinade's on-chain authority is not a single multisig. It is split across four layers, and each layer authorizes different actions on different programs. Knowing which layer controls what is the poin

## Quick Reference

<table><thead><tr><th width="62">Layer</th><th width="231">Body</th><th>Threshold</th><th>What It Authorizes</th></tr></thead><tbody><tr><td>1</td><td><strong>Ecosystem multisig</strong></td><td>6 of 13</td><td>Upgrade authority for the main mSOL liquid staking program, and nothing else</td></tr><tr><td>2</td><td><strong>MNDE Realm (the DAO)</strong></td><td>MNDE-locked vote, 2% quorum</td><td>Upgrade authority and admin parameters for Native, Select, Validator Bonds, Recipes, gauges, referrals and the rest of the contract surface</td></tr><tr><td>3</td><td><strong>Marinade Council</strong></td><td>3 of 5</td><td>Day-to-day operations: protocol fee adjustments within DAO-set bounds, contract parameters, gauges, Foundation operations</td></tr><tr><td>4</td><td><strong>Emergency Pause Council</strong></td><td>3 of 5</td><td>Pause authority on the mSOL program and Validator Bonds. It can pause, it cannot upgrade</td></tr></tbody></table>

***

## What Is a Multisig?

A multisig is a wallet whose authority is shared across multiple independent keyholders. One signature is not enough: a threshold number of holders, on different keys and often on different continents, must each sign before a decision executes.

This **distributes governance power among multiple wallet holders** so that no single party, Marinade included, can change a program on their own.

***

## Layer 1: Ecosystem Multisig (6 of 13)

This multisig is the **upgrade authority for the main mSOL liquid staking program only**. It does not control Marinade Native, Marinade Select, Validator Bonds, Recipes, gauges or referrals, it cannot pause the protocol, and it cannot move treasury funds.

It is composed of 13 signing slots, distributed among some of the most reputable parties in the Solana ecosystem:

* [Jupiter](https://jup.ag/)
* [Mango](https://mango.markets/)
* [Marinade team](https://marinade.finance/) (3 slots)
* [Miton C](https://mitonc.com/)
* [Orca](https://orca.so/)
* [Phantom](https://phantom.app/)
* [Raydium](https://raydium.io/)
* [Solend](https://solend.fi/)
* [Solflare](https://solflare.com/)
* [Staking Facilities](https://stakingfacilities.com/)
* [Triton.one](https://www.triton.one/)

**6 of 13 signatures** are required to upgrade the program. The majority of signers are external, so Marinade alone cannot reach the threshold. The multisig runs on a frozen, non-upgradeable Serum multisig program.

The threshold is readable on chain and does not have to be taken on trust. The multisig account `magrsHFQxkkioAy45VWnZnFBBdKVdy2ZiRoRGYT9Wed` holds **13 owner slots and a threshold of 6**, and its program-derived signer, `551FBXSXdhcRDDkdcb3ThDRg84Mwe5Zs6YjJ1EEoyzBp`, is exactly the upgrade authority recorded against the mSOL program. See the address table below.


The multisig was **6 of 11** at mainnet launch in August 2021 and after the November 2022 signer rotation. It was later expanded to **6 of 13**. If you find the 6-of-11 figure in older Marinade writing, it is a historical state, not the current one.


***

## Layer 2: MNDE Realm, the DAO

Everything that is not the mSOL program sits under **MNDE-locked DAO governance**, run on SPL Governance through Realms with the Voter Stake Registry plugin. This is a live governance system, not a future plan.

Contracts under MNDE Realm authority include the Marinade Native staking proxy, the Marinade Select institutional proxy, Validator Bonds, Recipes, Tokadapt, validator and liquidity gauges, the liquid staking referral program, directed stake, the Incentives Distribution Program, the Voter Stake Registry and the Atomic Swap contract.

**Quorum**: 2% of MNDE supply.

The DAO also owns the **protocol treasury**. Treasury spend and revenue allocation are DAO votes, executed by the Council. The protocol treasury is distinct from Marinade Labs' operational treasury and the two should never be conflated.

***

## Layer 3: Marinade Council (3 of 5)

The Council holds **operational authority**: the day-to-day management that does not warrant a full DAO vote. It is composed of 5 internal Marinade roles and operates through Realms, with proposals publicly visible.

The Council can adjust protocol fees within DAO-set bounds, execute DAO-authorized budget, tune parameters on the secondary contracts where the DAO has delegated parameter control, set delegation strategy parameters, and add or remove liquidity incentive gauges. Validator gauges remain permissionless on Realms.

The Council **cannot** upgrade contracts, and it cannot commit beyond the DAO-authorized budget without a vote.


Older documentation described a "Treasury multisig" at 4 of 7 and a separate "Operational multisig" of 5. Both have been superseded by the Marinade Council at **3 of 5**.


***

## Layer 4: Emergency Pause Council (3 of 5)

The same five people as the Marinade Council, acting under a different authority: **pause only**, on the mSOL program and the Validator Bonds program. It is used for an active exploit, critical validator misbehaviour, or a network-level event needing a protocol-level response.

It cannot upgrade or modify anything. Resuming a paused program is a separate authorization.

***

## Addresses

| Role                                                                     | Address                                        |
| ------------------------------------------------------------------------ | ---------------------------------------------- |
| Ecosystem multisig account (13 signer slots, threshold 6)                | `magrsHFQxkkioAy45VWnZnFBBdKVdy2ZiRoRGYT9Wed`  |
| Ecosystem multisig signer, the mSOL program's on-chain upgrade authority | `551FBXSXdhcRDDkdcb3ThDRg84Mwe5Zs6YjJ1EEoyzBp` |
| Serum multisig program the above runs on                                 | `msigmtwzgXJHj2ext4XJjCDmpbcMuufFb5cHuwg6Xdt`  |
| mSOL liquid staking program                                              | `MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD`  |
| mSOL State account                                                       | `8szGkuLTAux9XMgZ2vtY39jVSowEcpBfFfD8hXSEqdGC` |
| MNDE Realm (DAO)                                                         | `899YG3yk4F66ZgbNWLHriZHTXSKk9e1kvsKEquW7L6Mo` |
| Emergency pause authority                                                | `AjGjLWx7vbzgPNxPSQUPjLNjeavQCHVS9VoJNWpnyP6n` |
| Marinade Native staking proxy                                            | `mnspJQyF1KdDEs5c6YJPocYdY1esBgVQFufM2dY9oDk`  |
| Validator Bonds program                                                  | `vBoNdEvzMrSai7is21XgVYik65mqtaKXuSdMBJ1xkW4`  |

The Native proxy and Validator Bonds are upgraded by a **different** authority from the mSOL program, which is the layer separation described above, visible on chain.

***

## Operational Parameters

The Council can change the operational parameters of the protocol and of the mSOL-SOL liquidity pool. These include:

* `liquidity-target` and `liquidity-sol-cap` for the mSOL-SOL liquidity pool
* `min-fee` and `max-fee`, the bounds of the Instant Unstake fee curve
* `min-deposit`, the minimum SOL amount that can be staked
* `min-stake`, the minimum SOL amount for stake and unstake actions executed by the bot and for depositing a stake account
* `min-withdraw`, the minimum SOL amount that can be withdrawn
* `slots-for-stake-delta`, the number of slots before the end of the epoch at which the bot starts to stake and unstake
* `staking-sol-cap`, the maximum SOL amount that can be staked in the protocol
* `rewards-fee`, the protocol fee on staking rewards


**These values change.** This page deliberately does not print them, because a printed value goes stale the moment the Council adjusts it. The authoritative source is the on-chain **State account** `8szGkuLTAux9XMgZ2vtY39jVSowEcpBfFfD8hXSEqdGC`, readable with any Solana RPC client or block explorer.

Two points worth knowing as of this writing, both read from the State account on 18 September 2026: the **staking SOL cap is unset**, so there is no maximum stakeable amount, and the **protocol `rewards-fee` is 0**. The program caps `rewards-fee` at 10%, so it can never be set above that.


For what Instant Unstake actually costs you today, see the Instant Unstake page rather than the parameter names above.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/security/multisig-governance.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
