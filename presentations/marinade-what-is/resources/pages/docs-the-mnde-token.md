> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/the-mnde-token.md).

# The MNDE token

Marinade’s MNDE token lets holders participate in the protocol's governance. This includes control of the DAO’s fees and treasury.

## MNDE Details

{% hint style="info" %}
**This page reflects the DAO-approved burn of 300M MNDE (**[**MIP-14**](https://forum.marinade.finance/t/mip-14-burn-5-50-of-mnde-total-supply/1909)**) and the treasury allocations that followed it.** Supply and treasury balances change as the DAO acts, so this page links to live sources rather than restating figures that will drift.
{% endhint %}

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FtYFruvSvZ9NzEKlEBNMt%2FMNDE.png?alt=media&#x26;token=0ae468be-f17c-4519-ad5d-7290db031c09" alt=""><figcaption></figcaption></figure>

#### **Supply Overview**

* **Original supply at issuance:** 1,000,000,000 MNDE
* **Current supply (post-burn):** approximately **699.99M MNDE**. For the exact figure, read the [mint account](https://solscan.io/token/MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey) on chain, which is authoritative. Small subsequent burns continue to reduce it.
* **Burned:** 300,000,000 MNDE (DAO vote [MIP-14](https://forum.marinade.finance/t/mip-14-burn-5-50-of-mnde-total-supply/1909) · [Realms vote](https://v2.realms.today/dao/899YG3yk4F66ZgbNWLHriZHTXSKk9e1kvsKEquW7L6Mo/proposal/EyeY8hrThBWw5MMtsAmNrnc7BoJGAtHsfsxVf17cG7E1))
* **Circulating supply:** See [stats](https://stats.marinade.finance/d/sqUQd1Onk/marinade-kpi-dashboard?orgId=1\&refresh=1m\&from=now-90d\&to=now\&timezone=utc)

#### **Issuance Details**

* **Issuance date:** 2021
* **Fully issued date:** None (distribution based on DAO votes)
* **Mint address:** `MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey`
* **Minting:** Disabled. The mint authority and the freeze authority are both set to null on chain, so no further MNDE can ever be minted and no account can be frozen.

Marinade was founded through Solana ecosystem grants at the Solana Hackathon in 2021 and launched its liquid staking protocol and mSOL liquid staking token on mainnet that August.\
The MNDE governance token was minted later the same year as a fair-launch token with no ICO (Initial Coin Offering). Marinade launched on-chain DAO governance in April 2022. Since then, all decisions related to the treasury have been voted on chain.

In July 2023, the DAO migrated its governance platform to Realms. This enables direct control of the treasury and protocol decisions by MNDE holders.

***

## How to participate in DAO governance with MNDE

To participate in DAO governance, holders must lock their MNDE. Lock it on [Marinade's governance page](https://app.marinade.finance/governance/), which is the recommended route; locking directly in Realms performs the same on-chain action. Locked MNDE is subject to a 30-day unlocking period which begins once the unlock is initiated.

**Your voting power is calculated from your remaining lock time**, up to a 30-day maximum. This has two consequences worth knowing:

* MNDE that is **deposited but not locked carries no voting power at all.** In Realms, use "Lock tokens", not "Deposit".
* Once you start unlocking, your voting power **decays gradually across the 30 days** rather than disappearing. **You can still vote while unlocking**, with steadily less weight as the period runs down.

See MNDE Governance for the full locking walkthrough and the Realms parameters.

***

## Protocol Revenue and MNDE Buybacks

Under **MIP-22**, which passed and is recorded as Completed on chain, **10% of protocol revenue funds open-market MNDE buybacks**. The bought-back MNDE is distributed to eligible MNDE stakers in Realms. You can follow the buybacks on chain: the MNDE bought so far accumulates in `BBaQsiRo744NAYaqL3nKRfgeJayoqVicEQsEnLpfsJ6x`, viewable on [Solscan](https://solscan.io/account/BBaQsiRo744NAYaqL3nKRfgeJayoqVicEQsEnLpfsJ6x).

**Buybacks are running.** They are not paused. What MIP-17 paused was the earlier MIP-11 and MIP-13 reward programs, which are a separate mechanism from the MIP-22 revenue buyback and should not be confused with it.

To be eligible for the distribution, MNDE must be **locked** in Realms, not merely deposited. See MNDE Governance.

***

## MNDE Incentives

Founded as a public good for Solana whose core mission is to contribute to a decentralized and performant Solana blockchain, Marinade’s main goal is to distribute MNDE to similar-minded ecosystem builders and enable them to control the parameters of protocol and treasury through governance.

While liquidity mining was prevalent in the early days of the token to grow distribution and liquidity, the DAO has since transitioned to a model where MNDE is distributed primarily via contributions to the protocol benefitting the TVL growth of the protocol.

Marinade’s core contributors do not receive time-based token unlocks, only TVL milestone unlocks. [Read more about Marinade’s MNDE and incentives](https://medium.com/marinade-finance/mnde-tokenomics-update-revisiting-incentives-at-marinade-3fc2d087d764?source=collection_home---6------14-----------------------).

***

## MNDE Allocations & Treasury Status

#### **Treasury Holdings**

Treasury balances move as the DAO votes and as programs pay out, so read them from chain rather than from this page.

| Treasury      | Address                                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------- |
| DAO Treasury  | [`B56RWQGf9RFw7t8gxPzrRvk5VRmB5DoF94aLoJ25YtvG`](https://solscan.io/account/B56RWQGf9RFw7t8gxPzrRvk5VRmB5DoF94aLoJ25YtvG) |
| Labs Treasury | [`J5BEceL5z1EQ7JBqEFu4BfPN4PYCeQaW3GXrzXFfCzhs`](https://solscan.io/account/J5BEceL5z1EQ7JBqEFu4BfPN4PYCeQaW3GXrzXFfCzhs) |

Note that the DAO Treasury holds MNDE across **more than one token account**, so a single account view will understate it. The [Marinade KPI dashboard](https://stats.marinade.finance/d/sqUQd1Onk/marinade-kpi-dashboard?orgId=1\&refresh=1m) and the DAO's [Realms treasury view](https://v2.realms.today/dao/899YG3yk4F66ZgbNWLHriZHTXSKk9e1kvsKEquW7L6Mo) both give the consolidated picture.

#### **Distributed / Spent Programs**

<table><thead><tr><th width="209.77777099609375">Program</th><th width="120.11114501953125">Allocation</th><th>Status</th></tr></thead><tbody><tr><td>Retroactive Rewards</td><td>7.26M</td><td>Distributed 2021 across Waves 0 to 3</td></tr><tr><td>Project Incentives</td><td>68.54M</td><td>Distributed 2021 to 2022 to DeFi pools and protocols</td></tr><tr><td><a href="https://forum.marinade.finance/t/proposal-launch-160m-mnde-open-doors-tvl-program/398/21">Open Door Program</a></td><td>2.57M</td><td>Distributed 2021 to 2022 total</td></tr><tr><td>Token Exchange / Treasury Grant / Swap</td><td>12.52M</td><td>Distributed 2022</td></tr><tr><td>Miscellaneous Distributions</td><td>16.30M</td><td>Distributed 2022 to early 2023</td></tr><tr><td>Liquidity Mining Gauges</td><td>27.60M</td><td>Distributed Jul 2022 to Aug 2023</td></tr><tr><td><a href="https://marinade.finance/blog/mnde-tokenomics-update-revisiting-incentives">Team / Advisors Milestone (8M SOL)</a></td><td>46.00M</td><td>Distributed Oct 2022 to Sep 2023</td></tr><tr><td><a href="https://forum.marinade.finance/t/mdao-proposal-install-a-marketing-and-promotions-budget-of-up-to-6m-mnde-for-the-next-12-months-july-22-june-23/232">Marketing Budget</a></td><td>6.00M</td><td>Spent 2022 to 2023</td></tr><tr><td><a href="https://forum.marinade.finance/t/proposal-unlock-mnde-from-the-treasury-to-finance-security-audits/562">Security Audits</a></td><td>2.00M</td><td>Distributed Nov 2023</td></tr><tr><td>Initial Contributors</td><td>75.00M</td><td>Distributed 2023 - Jan 2024</td></tr><tr><td><a href="https://marinade.finance/blog/let-marinade-earn-season-2-begin">Marinade Earn S1 + S2</a></td><td>12.24M</td><td>Distributed 2023 to 2024 and claimed (25M unlocked; clawbacks returned)</td></tr><tr><td><a href="https://forum.marinade.finance/t/dao-proposal-unlock-a-25m-mnde-budget-over-3-months-for-marinade-earn-season-3/1312">Marinade Earn S3</a></td><td>25.00M</td><td>Distributed 2024; unused rolled into S4</td></tr><tr><td><a href="https://forum.marinade.finance/t/dao-proposal-unlock-a-26m-mnde-budget-to-onboard-multiple-market-makers-for-mnde/1393">Market Makers</a></td><td>26.00M</td><td>Distributed Jun 2024</td></tr><tr><td><a href="https://forum.marinade.finance/t/mip-4-fund-research-and-development-for-advancements-to-solana-staking-protocol-marinade/1696">MIP.4 Research &#x26; Dev</a></td><td>10.50M</td><td>Distributed Jan 2025</td></tr><tr><td><a href="https://forum.marinade.finance/t/mip-6-boost-marinade-s-growth-awareness-with-21m-mnde-budget-for-2025-initiatives/1701">MIP.6 Growth &#x26; Awareness</a></td><td>21.00M</td><td>Distributed Jan 2025</td></tr><tr><td><a href="https://forum.marinade.finance/t/mip-14-burn-5-50-of-mnde-total-supply/1909">MIP.14 Supply Burn</a></td><td>300.00M</td><td>Burned 2025</td></tr></tbody></table>

#### **Active Programs (still in lab treasury)**

<table><thead><tr><th width="209">Program</th><th width="120.11114501953125">Allocation</th><th>Status</th></tr></thead><tbody><tr><td><a href="https://forum.marinade.finance/t/mip-7-marinade-earn-season-4/1709">MIP.7 Marinade Earn S4</a></td><td>~10.00M</td><td>Remaining active incentives (DAO)</td></tr><tr><td><a href="https://forum.marinade.finance/t/mip-12-migrate-campaign-accelerate-marinade-native-tvl-growth-with-25m-mnde-budget/1876">MIP.12 Migrate Campaign</a></td><td>25.00M</td><td>Approved and allocated Aug 2025, campaign ran for 3 months from Sep 2025</td></tr><tr><td><a href="https://forum.marinade.finance/t/mip-13-introduction-of-active-staking-rewards-program/1895">MIP.13 Active Staking Rewards</a></td><td>25.00M</td><td>Approved and allocated Aug 2025. <strong>Paused by MIP-17</strong>, together with MIP-11</td></tr><tr><td><a href="https://forum.marinade.finance/t/mip15-activate-the-protocol-fees-flow-to-the-marinade-foundation-and-grant-100m-mnde-to-marinade-labs-for-operations/1922/5">MIP.15 Marinade Operation Grant</a></td><td>100.00M</td><td>Active for Labs operations, 1-year cliff</td></tr><tr><td><a href="https://forum.marinade.finance/t/grant-request-allocate-46m-mnde-contributors-budget-for-16m-sol-tvl-milestone/560">Team / Advisors Milestone (16M SOL)</a></td><td>46.00M</td><td>Not vested; conditioned on 16M SOL TVL (Labs Treasury)</td></tr></tbody></table>

***

## Where to get the MNDE token

MNDE is available for trading on leading Solana DEXs. MNDE is also available on central exchanges like [Coinbase](https://www.coinbase.com/), [Crypto.com](https://crypto.com/price/mnde) and [Gate](https://www.gate.com/).

* Trade MNDE on [Meteora](https://app.meteora.ag/)
* Trade MNDE on [Raydium](https://raydium.io/swap/)
* Trade MNDE on [Orca](https://www.orca.so/)
* Route across all of them with [Jupiter](https://jup.ag/)
* View MNDE on [Coingecko](https://www.coingecko.com/en/coins/marinade)
* View MNDE on [CoinMarketCap](https://coinmarketcap.com/currencies/mnde/)

#### References:

* [Marinade Realms Governance](https://v2.realms.today/dao/899YG3yk4F66ZgbNWLHriZHTXSKk9e1kvsKEquW7L6Mo/proposals)
* [MNDE governance stats on Realms](https://v2.realms.today/dao/899YG3yk4F66ZgbNWLHriZHTXSKk9e1kvsKEquW7L6Mo/token-stats)
* [Marinade Forum](https://forum.marinade.finance/)
* [Marinade Stats](https://stats.marinade.finance/d/sqUQd1Onk/marinade-kpi-dashboard?orgId=1\&refresh=1m)


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/the-mnde-token.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
