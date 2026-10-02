> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/developers/marinade-ts-js-sdk.md).

# Marinade Ts/Js SDK

This is a marinade typescript and anchor based SDK to interact with Marinade from any Front-End App

## Which SDK Do I Need

<table><thead><tr><th>Product</th><th width="243.20001220703125">Package</th><th>Repository</th></tr></thead><tbody><tr><td><strong>mSOL liquid staking</strong>, instant unstake, liquidity pool</td><td><code>@marinade.finance/marinade-ts-sdk</code></td><td><a href="https://github.com/marinade-finance/marinade-ts-sdk">marinade-ts-sdk</a></td></tr><tr><td><strong>Marinade Native</strong></td><td><code>@marinade.finance/native-staking-sdk</code></td><td><a href="https://github.com/marinade-finance/native-staking">native-staking</a></td></tr><tr><td><strong>Marinade Select</strong>, existing positions only</td><td><code>@marinade.finance/native-staking-sdk</code></td><td><a href="https://github.com/marinade-finance/native-staking">native-staking</a></td></tr><tr><td><strong>Validator bonds</strong>, SAM bidding, PSR</td><td><code>@marinade.finance/validator-bonds-cli</code></td><td><a href="https://github.com/marinade-finance/validator-bonds">validator-bonds</a></td></tr></tbody></table>


**Marinade Select is not currently available to stake to.** The SDK still covers Select for integrations serving existing positions, but do not build a new Select staking flow against it. Build against Marinade Native instead, or talk to the team.


***

## Install

```bash
npm install @marinade.finance/marinade-ts-sdk
```

```bash
yarn add @marinade.finance/marinade-ts-sdk
```

Check the package page for the current version rather than pinning one from this doc.

***

## Quickstart

```typescript
import { Marinade, MarinadeConfig } from '@marinade.finance/marinade-ts-sdk'
import { Connection } from '@solana/web3.js'

const config = new MarinadeConfig({
  connection: new Connection('https://api.mainnet-beta.solana.com'),
  publicKey: wallet.publicKey,
})
const marinade = new Marinade(config)

// Stake SOL, receive mSOL
const { transaction } = await marinade.deposit(amountLamports)
```

The SDK also exposes `liquidUnstake`, `orderUnstake`, `addLiquidity` and `removeLiquidity`, plus protocol state through `marinade.getMarinadeState()`.

For the same operations from a terminal, use [marinade-ts-cli](https://github.com/marinade-finance/marinade-ts-cli).

***

## Integration Example

An Anchor CPI integration example is available:

<https://github.com/marinade-finance/liquid-staking-referral-example-app>
Integration example


<https://github.com/marinade-finance/marinade-ts-sdk>
Marinade SDK



That example wraps deposits through the **referral program, which is currently paused**. No referral fees accrue to anyone while it is paused, including under agreements signed before the pause, and the partner boost is not in force. Use the repository as a reference for calling Marinade by CPI, but do not build a revenue-sharing integration on it without talking to the team first. For a plain integration, call the SDK directly as shown above.


***


If you have questions or troubles, please join our [Discord](https://discord.com/invite/yTdH8YkYKg). Marinade contributors will be there to help you.



---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/developers/marinade-ts-js-sdk.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
