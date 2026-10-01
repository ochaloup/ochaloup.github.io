> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/security/audits.md).

# Audits

You'll find here the list of our audits and code review reports.

## 2026

**Neodyme: Canonical Stake and Deposit Fee Upgrade**

Neodyme audited two changes to Marinade's on-chain liquid staking program in May 2026: the introduction of canonical stake accounts and the addition of deposit fee functionality. The review covered both implementation security and overall design, and found no issues at any severity level. Because the changes were scoped additions to the existing program, the threat model and economic analysis from the 2023 audit remain valid.

{% file src="/files/k5E0jKTthOF8F1LkwaIb" %}

## 2024

**Neodyme: Marinade Validator Bonds**

Neodyme audited Marinade's on-chain Validator Bond program during March and April of 2024. The scope of this audit was focused on technical security, with further considerations about operational security.

The auditors found that Marinade’s Validator Bond program comprised a clean design and above-standard code quality, relying on the industry-standard Anchor framework.&#x20;

{% file src="/files/PkTwuRDK02agZbDh3WZ0" %}

## 2023

### Audit reports

In November 2023, Marinade upgraded its smart contract to include several improvements (see [this article](https://marinade.finance/blog/marinade-is-preparing-smart-contract-upgrade/)). To ensure that the code remains as solid as it has always been, two audits were conducted on the upgraded version of the smart contract. They are available below:

* Neodyme: <https://marinade.finance/docs/Neodyme_2023.pdf>
* Sec3: <https://marinade.finance/docs/Sec3_2023.pdf>

## 2021

### Audit reports

* [**Kudelski Security**](https://kudelskisecurity.com/) **-** To become the next unit of account on the Solana network, Marinade had to ensure the protocol was as safe as Solana itself. Therefore, we were audited by Kudelski Security, a reputable audit firm that Solana Labs chose to audit Solana.\
  Read the audit: <https://marinade.finance/docs/KudelskiSecurity.pdf>
* [**Ackee Blockchain**](https://ackeeblockchain.com/) **-** Ackee Blockchain specializes in audits and security assessments and has worked on the security of major blockchains such as Ethereum, Tezos, and Celo. Their audit has allowed us to improve our protocol's security standard further.\
  Read the audit: <https://marinade.finance/docs/AckeeBlockchain.pdf>

### Code review reports

* [**Neodyme**](https://neodyme.io/) **-** Neodyme is an audit firm specializing in security that recently published a full article on Solana smart contract security. Their blockchain expertise and familiarity with Solana made them a perfect fit to audit our protocol. \
  Read the code review: <https://marinade.finance/docs/Neodyme.pdf>


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/security/audits.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
