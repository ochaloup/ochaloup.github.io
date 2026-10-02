> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/developers/bug-bounty.md).

# Bug Bounty

Marinade is dedicated to improve the security of its users. For this reason, we are holding a bug bounty program to help strengthen our protocol even more.

## Overview

Marinade runs a public bug bounty on **Immunefi** for its on-chain programs. Report a vulnerability at [immunefi.com/bug-bounty/marinade](https://immunefi.com/bug-bounty/marinade/). Immunefi handles triage, tracks your report, and is how rewards are paid.

Findings that are **not** in Marinade's smart contracts, such as the web app, the documentation site, dashboards or infrastructure, are not covered by the Immunefi bounty. See Everything Else below for where to send those.

***

## Why A Bug Bounty

Bug bounties are a common way of guaranteeing and improving the security of a protocol. If anyone discovers a bug or a loophole in our protocol, they can report it to our team and claim the associated bounty instead of abusing it.

By offering this option, we allow developers and researchers who find an exploit to be rewarded for it without causing any damage to the protocol or to the funds of our users.

Marinade's programs have been through multiple independent audits, listed on the [Audits](/marinade-protocol/security/audits.md) page. We believe we need to set an example in the Solana ecosystem and **always aim for more security**. This bug bounty is another way of raising our security level and a step towards this commitment.

***

## Rewards By Threat Level

Bounties are distributed according to the impact of the vulnerability, assessed using the [Immunefi Vulnerability Severity Classification System](https://immunefi.com/severity-updated/). This is a simplified 5-level scale, with separate scales for websites/apps and smart contracts/blockchains, encompassing everything from consequence of exploitation to privilege required to likelihood of a successful exploit.

**Smart contract and blockchain bounties**

| Threat level | Reward            |
| ------------ | ----------------- |
| **Critical** | Up to USD 250,000 |
| **High**     | Up to USD 15,000  |

Critical vulnerabilities are further capped at **10% of economic damage**, with the main consideration being the funds affected in addition to PR and brand considerations, at the discretion of the team.

However, there is a **minimum payout of USD 50,000** for Critical bug reports.


Payouts are handled by the **Marinade Finance** team directly and are denominated in USD. However, payouts are done in **mSOL** and **MNDE**.


***

### Scope Of The Bounty Program

#### Assets In Scope

The Immunefi program currently covers **one** program: [liquid-staking-program](https://github.com/marinade-finance/liquid-staking-program).


**Other on-chain programs are not yet in the formal Immunefi scope.** Native Staking Proxy, Validator Bonds and Directed Stake are live mainnet programs but are not listed as Immunefi assets. A finding in one of those does not qualify for an Immunefi-tier reward; report it the same way as a non-smart-contract finding, through Everything Else below.


#### Impacts In Scope

Only the following impacts are accepted within this bug bounty program. All other impacts are not considered as in-scope, even if they affect something in the assets in scope table.

**Critical**

* Direct theft of any user funds, whether at-rest or in-motion, other than unclaimed yield
* Permanent freezing of funds
* Protocol insolvency

**High**

* Theft of unclaimed yield
* Permanent freezing of unclaimed yield
* Temporary freezing of funds, excluding DOS attacks

#### Prioritized Vulnerabilities

We are especially interested in receiving and rewarding vulnerabilities of the following types.

* Re-entrancy
* Logic errors (including authentification errors)
* Trusting trust/dependency vulnerabilities (including composability vulnerabilities)
* Oracle failure/manipulation
* Novel governance attacks
* Economic/financial attacks (including flash loan attacks)
* Congestion and scalability (including running out of gas, block stuffing and susceptibility to frontrunning)
* Consensus failures
* Cryptography problems (including signature malleability, susceptibility to replay attacks, weak randomness, weak encryption)
* Susceptibility to block timestamp manipulation
* Missing access controls / unprotected internal or debugging interfaces

#### Out Of Scope & Rules

The following vulnerabilities are **excluded** from the rewards for this bug bounty program:

* Attacks that the reporter has already exploited themselves, leading to damage
* Attacks requiring access to leaked keys/credentials
* Attacks requiring access to privileged addresses (governance, strategist)
* Incorrect data supplied by third party oracles (not to exclude oracle manipulation/flash loan attacks)
* Basic economic governance attacks (e.g. 51% attack)
* Lack of liquidity
* Best practice critiques
* Sybil attacks

The following activities are **prohibited** by this bug bounty program:

* Any testing with mainnet or public testnet contracts; all testing should be done on private testnets
* Any testing with pricing oracles or third party smart contracts
* Attempting phishing or other social engineering attacks against our employees and/or customers
* Any testing with third party systems and applications (e.g. browser extensions) as well as websites (e.g. SSO providers, advertising networks)
* Any denial of service attacks
* Automated testing of services that generates significant amounts of traffic
* Public disclosure of an unpatched vulnerability in an embargoed bounty

***

### How To Claim A Bounty

Submit through the Immunefi program: [immunefi.com/bug-bounty/marinade](https://immunefi.com/bug-bounty/marinade/).

A report we can act on quickly has:

* The affected asset, with the exact program ID, account or instruction
* Clear reproduction steps
* The impact, meaning what an attacker gains
* Any proof of concept, logs or screenshots

If you cannot demonstrate the impact, the report is not yet ready to send.

***

### Everything Else

Issues in the web app, documentation site, dashboards or other infrastructure are **not covered by the Immunefi bounty**, which is scoped to smart contracts. The same applies to Native Staking Proxy, Validator Bonds and Directed Stake, which are not yet Immunefi assets. We still want to hear about all of these. Start a chat in the [Help Center](https://help.marinade.finance), or open a support ticket in our Discord using the invite on [Official Links](/official-links.md).

We review these ourselves, assess real-world impact, and may reward a genuine high-impact finding at our discretion. Those sit outside the published tiers and are handled case by case.

**Please send verified findings only.** Raw scanner output and AI-generated reports with no demonstrated impact are closed without a detailed response.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/developers/bug-bounty.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
