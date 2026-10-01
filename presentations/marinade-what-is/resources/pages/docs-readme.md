> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/readme.md).

# Welcome to Marinade

The best place to stake your SOL.

## **What is Marinade?**

Marinade is a stake automation platform that helps you maximize SOL staking rewards while supporting the decentralization and performance of the Solana network. It continuously monitors the validator landscape and delegates your stake across a carefully selected set of high-performance validators using an open, transparent strategy.

Users can stake their SOL either **natively** or through **liquid staking** for mSOL, a tokenized version of staked SOL. Both methods use the same validator delegation logic and receive rewards every epoch (approximately 2 days).

## Creation of Marinade

Marinade was born out of the [merger of two projects](https://medium.com/marinade-finance/stronger-together-c1654f0f4c80) trying to accomplish a similar goal: offer a liquid staking solution on Solana that participates to the decentralization of the network and its security.

The teams joined forces to work more efficiently towards making this idea a reality. Marinade formed around a set of values and a common objective and started building.&#x20;

## Goals

### Spread adoption

To onboard the next 1 billion people to crypto, we believe that the user experience must dramatically evolve and adapt to the needs of more users.

While early adopters don’t care about writing down seeds and pin codes for multiple wallets, storing it around their house, or burying it in the ground, we can’t imagine a world where this is still a standard after 5, 10, or 20 years.

That’s why we emphasize having our solution **well-designed, seamless, and a pleasure to use,** so that a friend can tell a friend that staking is as easy as clicking a button.

***

## What are the benefits of staking SOL?

Blockchains use consensus protocols to validate transactions in a secure and decentralized way. Solana relies on a proof-of-stake mechanism, where staking plays a key role in maintaining the network’s security and performance.

When you stake your SOL tokens to a validator, you contribute to the decentralization and efficiency of the Solana blockchain. In return, you receive rewards in SOL for each epoch, which lasts approximately 2 to 3 days, depending on the validator’s performance.

Staking is important for the health of the network. The more SOL that is staked to efficient validators, the more decentralized and secure the system becomes. However, with the growing number of DeFi use cases, a significant amount of SOL remains unstaked and is actively used in decentralized applications across the ecosystem.

### What can you do with Marinade?

* Stake and unstake SOL at any time
* Use mSOL in DeFi protocols to multiply yield strategies
* Redelegate existing stake without unstaking
* Convert staked SOL into mSOL to make it liquid
* Participate in Marinade DAO governance and shape the future of staking on Solana


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/readme.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
