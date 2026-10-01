> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/legal/risks.md).

# Risks

Key risks associated with using the Marinade website and Services, including smart contract, validator, market, and third-party protocol risk.

## Overview

Using the Services involves significant risk. The summary below highlights the main categories. It is not exhaustive.

{% hint style="warning" %}
Staking and using the Services can result in the loss of some or all funds. The full risk disclosures are set out in the [Terms of Use](https://marinade.finance/terms-of-use), which are the authoritative and binding version.
{% endhint %}

#### Protocol and Smart Contract Risk

* **Smart contract risk:** The Protocol relies on smart contracts that may contain vulnerabilities, exploits, or failures.
* **Network risk:** Solana network congestion, outages, or consensus issues can delay or disrupt transactions.
* **Validator risk:** Validators may underperform, go offline, or be subject to penalties or slashing that reduce rewards or principal.
* **MEV and front-running:** On-chain activity may be exposed to MEV, front-running, or slippage.

#### Asset and Market Risk

* **Price volatility:** Digital asset values can be highly volatile and may decline significantly.
* **De-peg risk:** The market value of a wrapped asset such as mSOL may diverge from the underlying staked SOL. Price, redemption parity, and liquidity are not guaranteed.
* **Liquidity constraints:** Unstaking timing and amounts received vary with network conditions and available liquidity.
* **No guaranteed yield:** All yields and APY figures shown are estimates only and may be lower, or result in loss of principal.

#### Third-Party and Vault Risk

* **Third-party protocols:** Some Services, including the Vault, may route assets to third-party protocols not controlled or custodied by Marinade.
* **Oracle and data feed risk:** The Services may rely on oracles and external data feeds that can be delayed, inaccurate, or manipulated.

#### Regulatory and Jurisdictional Risk

* **Regulatory uncertainty:** The regulatory status of digital assets and staking is unsettled and subject to change.
* **Jurisdictional availability:** The Services may not be available in certain jurisdictions. Users are responsible for ensuring their use complies with applicable local law.

#### User Responsibility

* **Non-custodial:** Marinade does not hold or control user funds or private keys. Wallet and key security is the user's responsibility.
* **No professional advice:** Nothing in the Services constitutes financial, investment, legal, or tax advice.
* **Tax:** Users are responsible for determining and meeting any tax obligations arising from their use of the Protocol.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/legal/risks.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
