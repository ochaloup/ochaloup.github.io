> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/protocol-overview/marinade-liquid.md).

# Marinade Liquid

## What is Liquid Staking?

The idea behind liquid staking is to enable people to stake without losing access to the liquidity of their tokens. This takes place through tokenization and issuance of on-chain representations of staked assets - liquid staking tokens - that are a claim on the underlying staking positions.

When staking SOL to mSOL, you are not performing a swap between two different tokens as mSOL represents your original position. This process can be equated to wrapping a token or receiving a "proof-of-stake token" with the perk of being an SPL token, thus remaining liquid.&#x20;

Liquid staking your SOL to mSOL is, in essence, the same operation as staking your SOL tokens. Since mSOL price (against SOL) is only impacted by staking rewards and nothing else, mSOL is not a speculative yield (when going from SOL to mSOL) but rather a way to diversify your stake and spread it across multiple validators in the Marinade stake pool, instead of locking your tokens into a single validator.&#x20;

mSOL is only a token representing a staked position, which should not make it different from a staking operation regarding tax laws. Nonetheless, you should consult your local jurisdiction for tax clarity involving various cryptocurrencies.&#x20;

## Why is Liquid Staking important?

In our opinion, liquid staking shines in solving the protocol design problems of PoS networks:

### **Opportunity cost**

With a fully liquid staking token, users can freely participate in DeFi and generate another layer of rewards on top of staking yields. Users don’t have to choose between staking or depositing their liquidity into an AMM, lending protocol, etc. They can do both!

### **Unbonding period**

Since liquid staking tokens can be immediately swapped for their underlying staked assets, users don’t have to wait for the regular unbonding period to unstake their tokens.

### **Reliance on a single validator**

Diversifying across multiple validators minimizes exposure and serves as slashing insurance against the malperformance of individual validator nodes. With Marinade's liquid staking solution, you can delegate your SOL to a multitude of validators rather than just one.

### Liquid Stake SOL

[Liquid\_Stake\_Program](https://github.com/marinade-finance/liquid-staking-program/blob/de348a2779ef1659db7b42a190279ae8da16c125/programs/marinade-finance/src/state/deposit.rs#L27)

When you choose to 'Stake', these operations happen under the hood:

1. You deposit SOL in the reserve account.
2. Marinade takes this amount and accordingly increases the amount of stake orders falling under:
   1. current epoch (epoch\_stake\_orders)
   2. total staked (total\_stake\_orders)
3. Marinade mints mSOL for the user according to mSOL/SOL ratio.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/protocol-overview/marinade-liquid.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
