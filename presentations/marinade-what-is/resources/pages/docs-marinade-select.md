> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/protocol-overview/marinade-select.md).

# Marinade Select

Marinade Select is a curated set of trusted Solana validators offering secure, decentralized, and capital-efficient staking.

## What Is Marinade Select?

Marinade Select is a premium staking set powered by Marinade. It includes a vetted group of community-recognized validators that meet strict criteria for decentralization, performance, and compliance.

Unlike Marinade’s open [**Stake Auction Marketplace (SAM)**](/marinade-protocol/protocol-overview/stake-auction-market.md), Marinade Select is invite-only and excludes:

* Superminority validators (those with outsized influence on network consensus)
* Validators on community or Marinade blacklists
* Participants engaging in harmful MEV practices (e.g., sandwich attacks)

***

## Why Stake with Marinade Select?

Marinade Select delivers:

* **High-Quality Validators:** Each validator is vetted for decentralization, performance, and transparency.
* **Protected Staking Rewards (PSR):** Validators cover penalties and rebalancing costs to safeguard user returns.
* **Smart Rebalancing:** Stake is actively managed to optimize efficiency and avoid unnecessary costs.
* **Institutional Readiness:** Fully compliant validator set suitable for regulated entities and large-scale stakers.

### Validator Bonds

All validators in the Select set are required to maintain a **bond** denominated in SOL. This bond:

* Covers **performance penalties and rebalancing costs** if a validator leaves the set.
* Helps align validator incentives with staker outcomes.
* Is automatically **delegated** to the validator to earn yield.

**Bond Requirements:**

* Coverage Ratio: 1 SOL per 2,000 SOL staked
* Source: SOL (locked and delegated through Marinade’s infrastructure)

***

## How It Works

<table data-header-hidden><thead><tr><th width="189.77777099609375"></th><th></th></tr></thead><tbody><tr><td><strong>Component</strong></td><td><strong>Details</strong></td></tr><tr><td><strong>Select Set</strong></td><td>A curated list of verified validators. Participation requires identity verification, bonding, and ongoing performance standards.</td></tr><tr><td><strong>Validator Bond</strong></td><td>Validators post a bond (~1 SOL per 2,000 SOL staked) used to protect staker returns and cover rebalancing costs.</td></tr><tr><td><strong>New Stake Flow</strong></td><td>New deposits are distributed evenly across the Select set or allocated to underweighted validators based on individual user positions.</td></tr><tr><td><strong>Unstaking</strong></td><td>Selective unstaking from a subset of validators minimizes capital inefficiencies. Remaining stake is gradually rebalanced over time.</td></tr><tr><td><strong>Rebalancing</strong></td><td>Rebalancing occurs in epochs and ensures users maintain proportional exposure across the set without impacting APY.</td></tr></tbody></table>

## Stake Distribution & Rebalancing

Marinade Select employs **smart stake flow management** to preserve APY and user experience:

#### New Stake

* Automatically allocated evenly or fills gaps across validators with lower relative TVL.
* Ensures balanced exposure and fairness across the Select set.

#### Unstaking

* SOL is withdrawn from a limited number of validators to reduce operational overhead.
* Remaining stake is rebalanced over time to maintain user allocation consistency.

This dynamic system avoids fragmentation and improves long-term capital efficiency.

***

## Validator Expectations

To remain in Marinade Select, validators must:

* Maintain **high performance and uptime**
* Operate in compliance with **Marinade’s security and operational standards**
* Respond promptly to events such as incoming stake or low bond balance alerts

Non-compliance can lead to removal from the set and loss of bond funds.

### Resources

* **Monitor Stake Distribution:** [select.marinade.finance](https://select.marinade.finance/)
* **Validator Bond CLI:** [npm package](https://www.npmjs.com/package/@marinade.finance/validator-bonds-cli-institutional)
* **CLI Source Code:** [GitHub Repository](https://github.com/marinade-finance/validator-bonds/tree/main/packages/validator-bonds-cli-institutional)

***

## Frequently Asked Questions

**Q: Can I join Marinade Select if I’m already in the Stake Auction Marketplace?**

Yes, but you’ll need to complete a separate vetting process, pass KYC, and post a validator bond specific to Marinade Select.

**Q: What happens if I want to exit Marinade Select?**

You’ll need to notify the Marinade team. Once your validator is removed from the Select set, you can initiate the bond withdrawal process.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/protocol-overview/marinade-select.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
