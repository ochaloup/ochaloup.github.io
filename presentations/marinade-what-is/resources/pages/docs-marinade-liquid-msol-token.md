> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/protocol-overview/marinade-liquid/msol-token.md).

# mSOL Token

mSOL is the liquid staking token representing a stake position in the Marinade stake pool. The supply of this token is controlled by Marinade using burning and minting operations in accordance with the overall state of the program.

This token constantly increases in price after each epoch, as long as there are staking rewards distributed. The rewards are accumulated on `total_staked`.

Price of mSOL = `total_staked / tokens_minted`

mSOL token address: mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So&#x20;

mSOL price: <https://www.coingecko.com/en/coins/marinade-staked-sol>

mSOL stats: <https://stats.marinade.finance/>

## mSOL price

It is important to note that mSOL has a [true price](https://stats.marinade.finance/d/sqUQd1Onk/marinade-kpi-dashboard?orgId=1\&refresh=1m), guaranteed in our protocol, but can have a different price on DEXs and exchanges when the mSOL/XXX pair becomes unbalanced.&#x20;

This situation is often quickly fixed by arbitrage. Nonetheless, we invite our users to compare the price of mSOL on Marinade to the one on DEXs in your trades and choose the most profitable for you.&#x20;

### Oracles

Our mSOL price is powered by [Pyth](https://pyth.network/) and [Switchboard](https://switchboard.xyz/). We also recently announced our partnership with [Chainlink](https://www.chainlinkecosystem.com/ecosystem/marinade/) to bring even more security and trust to our protocol.&#x20;

### APY calculation

Marinade is using a 30-day simple moving average of the 14-day APY to display its final APY.

This means that every day, Marinade looks at the mSOL price and compares it to the price mSOL had 14 days before. A 30-day average of those measurements is then used to display a final APY, projected over a year.&#x20;

## How to use Marinade state to get mSOL data

### Calculate the true mSOL/SOL price

First, you need to read Marinade state, an example is available [at this link](https://github.com/marinade-finance/liquid-staking-referral-program/blob/main/programs/marinade-referral/src/instructions/liquid_unstake.rs#L42).

* After reading Marinade state, you'll have `marinade_state.msol_price: u64`, and that is mSOL price in SOL multiplied by 0x1\_0000\_0000 (shifted), so to obtain mSOL/SOL as f64 you should do: `let msol_price_f64: f64 = marinade_state.msol_price as f64 / 0x1_0000_0000 as f64`, and then you get the true mSOL/SOL price.

### How much SOL an amount of mSOL represents

You start with the previous example and some amount of mSOL-lamports, then:

`let SOL_lamports = (mSOL_lamports as u128 * marinade_state.msol_price as u128 / 0x1_0000_0000 as u128) as u64`

{% hint style="info" %}
mSOL uses 9 decimals, as SOL.
{% endhint %}

### How much mSOL an amount of SOL represents

`let mSOL_lamports = (mSOL_lamports as u128 * 0x1_0000_0000 as u128 / marinade_state.msol_price as u128) as u64`

### Derive mSOL/USDC price

If you have access to SOL/USDC price from an oracle, the best way to avoid losses due to price inaccuracies is to derive mSOL/USDC from SOL/USDC and Marinade true price

`let mSOL_usdc = (SOL_usdc as u128 * marinade_state.msol_price as u128 / 0x1_0000_0000 as u128) as u64`

### Notes

msol\_price is computed and stored at this link (<https://github.com/marinade-finance/liquid-staking-program/blob/main/programs/marinade-finance/src/state/update.rs#L247>) after each epoch ends, when SOL staking rewards are added to the pool.&#x20;

You can also use the fns `marinade_state.calc_lamports_from_msol_amount()` and `marinade_state.calc_msol_from_lamports()` for better precision when computing mSOL from SOL and vice versa.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/protocol-overview/marinade-liquid/msol-token.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
