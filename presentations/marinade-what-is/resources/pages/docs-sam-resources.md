> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/protocol-overview/stake-auction-market/sam-resources.md).

# SAM Resources

Dashboards, repositories, APIs, and technical reference for SAM participants.


**TL;DR:** One-stop reference page. Dashboards, repositories, audits, key contract addresses, the parameters at a glance for production config, and the glossary of SAM terms.


## Overview

A single landing page for the tools, dashboards, repositories, and reference data validators and stakers use to interact with the Stake Auction Marketplace. Bookmark this page for quick navigation.

## Dashboards

Web interfaces for monitoring SAM and validator activity.

* [**PSR (Protected Staking Rewards) dashboard**](https://psr.marinade.finance/)**:** Real-time view of validator bond status, eligibility, simulated auction positioning, and protected events. Refreshes every few hours.
* [**Marinade validator dashboard**](https://app.marinade.finance/network/validators/)**:** Per-validator view of Marinade-delegated stake, bond status, and historical performance.
* [**Marinade stats**](https://stats.marinade.finance/)**:** Aggregate protocol statistics across SAM, Native, Liquid, and Select.

## CLI and SDKs

Tools for programmatic interaction with the validator bonds program and Marinade APIs.

* [**Validator bonds CLI (npm)**](https://www.npmjs.com/package/@marinade.finance/validator-bonds-cli)**:** Primary tool for creating, funding, configuring, and managing bonds. Supports Ledger hardware wallets.
* [**Validator bonds CLI (GitHub)**](https://github.com/marinade-finance/validator-bonds/tree/main/packages/validator-bonds-cli#validator-bonds-cli)**:** Full command reference and source.
* [**Validator bonds CLI Institutional**](https://www.npmjs.com/package/@marinade.finance/validator-bonds-cli-institutional)**:** Streamlined CLI for institutional users using token-based bond ownership.
* [**Marinade TS/JS SDK**](https://docs.marinade.finance/developers/marinade-ts-js-sdk)**:** TypeScript SDK for integrating with Marinade programmatically.
* [**Marinade Rust SDK**](https://docs.marinade.finance/developers/marinade-rust-sdk)**:** Rust SDK for integrating with Marinade programmatically.

## Repositories

Source code for the SAM pipeline and supporting infrastructure.

* [**validator-bonds**](https://github.com/marinade-finance/validator-bonds)**:** Monorepository for the on-chain bonds program, CLI, SDK, and supporting tools.
* [**ds-sam**](https://github.com/marinade-finance/ds-sam)**:** PSR and SAM scoring logic.
* [**ds-sam-pipeline**](https://github.com/marinade-finance/ds-sam-pipeline)**:** Pipeline orchestration for PSR and SAM scoring runs. Each epoch's auction inputs and outputs are committed under `auctions/<epoch>/`.
* [**psr-dashboard**](https://github.com/marinade-finance/psr-dashboard)**:** Source for the PSR dashboard.

## APIs

Data endpoints for monitoring and integration.

* [**Delegation Strategy API**](https://validators-api.marinade.finance/docs)**:** Public API for validator metadata, geolocation, scoring, and SAM-relevant performance data.
* [**Snapshots API**](https://snapshots-api.marinade.finance/docs)**:** Per-epoch snapshots of stake, MNDE Enhanced Stake support, and validator state.
* [**Marinade Stats API**](https://api.marinade.finance/docs)**:** Aggregate protocol statistics.
* [**Bonds API**](https://github.com/marinade-finance/validator-bonds#bonds-api)**:** Current state of bond accounts. Updated once per hour.

## Data Sources

Raw data published per epoch.

* [**ds-sam-pipeline auctions folder**](https://github.com/marinade-finance/ds-sam-pipeline/tree/main/auctions)**:** Per-epoch auction inputs (`inputs/`) and outputs. Includes the blacklist CSV, validator metadata, and final stake allocations.
* [**Google Cloud Storage bucket**](https://console.cloud.google.com/storage/browser/marinade-validator-bonds-mainnet/)**:** Settlement data, PSR reports, and historical pipeline outputs. Public access (Google login required).
* [**Discord #psr-feed channel**](https://discord.gg/marinade)**:** Per-epoch PSR results, validators with bond charges, and other operational notifications.

### Technical Reference

Addresses, identifiers, and operational parameters.

* **Validator Bonds program address:** `vBoNdEvzMrSai7is21XgVYik65mqtaKXuSdMBJ1xkW4`
* **Marinade Validator Bonds config account:** `vbMaRfmTCg92HWGzmd53APkMNpPnGVGZTUHwUJQkXAU`
* **Bonds Select config address:** `VbinSTyUEC8JXtzFteC4ruKSfs6dkQUUcY6wB1oJyjE`
* **Validator Bonds Stake Account Withdrawer authority:** `8CsAFqTh75jtiYGjTXxCUbWEurQcupNknuYTiaZPhzz3`
* **Native Staking Select Staker authority:** `STNi1NHDUi6Hvibvonawgze8fM83PFLeJhuGMEXyGps`
* **Geolocation provider:** ipwhois. Validator data center identification refreshed every 24 hours.
* **Pipeline scoring cadence:** Once per epoch. Stake rebalancing actions are dispatched at epoch boundary.
* **Solana epoch duration:** Approximately 2 days.

### Audits

Third-party security reviews.

* [**Validator bonds program audit (Neodyme)**](https://github.com/marinade-finance/validator-bonds/blob/main/resources/audit/v2.1.0-neodyme-audit-validator-bonds.pdf)**:** Audit report for the on-chain bonds program.
* [**Marinade audits index**](https://docs.marinade.finance/marinade-protocol/security/audits)**:** Full list of security audits across Marinade products.

### Parameters at a Glance

Operational parameters governing SAM auction mechanics, bond requirements, eligibility, and notifications. Values reflect production configuration at the time of writing.


**Source of truth:** Live values are maintained in the following sources. If the values below appear stale, check the source files directly.

* **Auction parameters:** [`ds-sam-pipeline/auction-config.json`](https://github.com/marinade-finance/ds-sam-pipeline/blob/main/auction-config.json)
* **Bond program parameters:** [`vbMaRfmTCg92HWGzmd53APkMNpPnGVGZTUHwUJQkXAU`](https://solscan.io/account/vbMaRfmTCg92HWGzmd53APkMNpPnGVGZTUHwUJQkXAU) (on-chain config account)
* **Pipeline scoring logic:** [`ds-sam`](https://github.com/marinade-finance/ds-sam) repository
  

#### **Auction and Decentralization**

<table><thead><tr><th>Parameter</th><th width="143">Value</th><th>Description</th></tr></thead><tbody><tr><td>Per-validator TVL cap</td><td>15%</td><td>Maximum portion of Marinade TVL any single validator can hold. Introduced in <a href="https://forum.marinade.finance/t/mip-19-improving-sam-auction-stake-priority-bond-risk-reduction-mechanism-higher-validator-caps/1969">MIP-19</a>, live from epoch 946. See Stake Distribution.</td></tr><tr><td>ASO concentration cap</td><td>30%</td><td>Maximum portion of Solana's total network stake that can be allocated to validators in a single ASO.</td></tr><tr><td>Country concentration cap</td><td>40%</td><td>Maximum portion of Solana's total network stake that can be allocated to validators in a single country.</td></tr><tr><td>Rebalance baseline</td><td>~1% per epoch</td><td>Approximate share of Marinade's total TVL rebalanced under normal conditions. Configurable in the pipeline; subject to adjustment.</td></tr><tr><td>Effective inflation commission limit</td><td>7%</td><td>Maximum effective commission to Marinade stakers before eligibility is lost. See Eligibility Criteria.</td></tr></tbody></table>

#### **Stake Matching**

<table><thead><tr><th>Parameter</th><th width="198">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>unprotectedDelegatedStakeDec</code></td><td>0.1 (10%)</td><td>Match rate on non-SFDP external stake.</td></tr><tr><td><code>unprotectedFoundationStakeDec</code></td><td>0.3 (30%)</td><td>Match rate on SFDP / Solana Foundation stake.</td></tr><tr><td><code>minUnprotectedStakeToDelegateSol</code></td><td>1,000 SOL</td><td>Minimum calculated match. Matches below this collapse to zero.</td></tr><tr><td>Per-validator matching cap</td><td>0.4% of Marinade TVL</td><td>Maximum matched stake per validator. Separate from the 15% per-validator direct SAM cap. See Stake Matching.</td></tr></tbody></table>

#### **maxStakeWanted**

<table><thead><tr><th width="176">Parameter</th><th width="124">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>minMaxStakeWanted</code></td><td>10,000 SOL</td><td>Floor on the effective cap. Setting <code>maxStakeWanted</code> below this has no effect. See <code>maxStakeWanted</code> Parameter.</td></tr></tbody></table>

#### **Bid Reduction Penalty**

<table><thead><tr><th width="210">Parameter</th><th width="102">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>historyEpochs</code></td><td>3</td><td>Lookback window in epochs used to compute the historical floor.</td></tr><tr><td><code>permittedBidDeviation</code></td><td>0.01 (1%)</td><td>Buffer below the floor in which bid reductions do not incur a penalty. See Bid Reduction Penalty.</td></tr></tbody></table>

#### **Bond Risk Reduction Mechanism**

<table><thead><tr><th width="231">Parameter</th><th width="204">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>minBondEpochs</code></td><td>4 future epochs</td><td>Minimum bond coverage required to avoid the fee (5 epochs total including the current epoch).</td></tr><tr><td><code>idealBondEpochs</code></td><td>12 future epochs</td><td>Target bond coverage to remain eligible for new stake (13 epochs total).</td></tr><tr><td><code>bondObligationSafetyMult</code></td><td>1.1</td><td>Safety multiplier (10% margin) applied to all bond obligation calculations.</td></tr><tr><td><code>minBondBalanceSol</code></td><td>7 SOL</td><td>Minimum bond balance before complete undelegation occurs.</td></tr><tr><td><code>bondRiskFeeMult</code></td><td>Governance-adjustable</td><td>Multiplier on the fee calculation. Subject to change by governance. See Bond Risk Reduction Mechanism.</td></tr></tbody></table>

#### **Bonds Settlements**

<table><thead><tr><th width="224">Parameter</th><th width="106">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>epochsToClaimSettlement</code></td><td>3 epochs</td><td>Claim window for validators to dispute or claim a settlement before it finalizes.</td></tr></tbody></table>

#### **Bond Notifications**

<table><thead><tr><th width="214">Parameter</th><th width="214">Value</th><th>Description</th></tr></thead><tbody><tr><td>Underfunding critical threshold</td><td>&#x3C; 2 epochs of coverage</td><td>Triggers a <strong>critical</strong> alert.</td></tr><tr><td>Underfunding warning threshold</td><td>&#x3C; 10 epochs of coverage</td><td>Triggers a <strong>warning</strong> alert.</td></tr><tr><td>Minimum deficit to notify</td><td>0.5 SOL</td><td>Deficits below this threshold do not trigger a notification.</td></tr><tr><td>Re-alert cadence</td><td>Max once per 24 hours</td><td>Notifications for persistent conditions only refire if the condition changes significantly. See Bond Notifications.</td></tr></tbody></table>

#### **Eligibility and Blacklist**

<table><thead><tr><th width="197">Parameter</th><th width="256">Value</th><th>Description</th></tr></thead><tbody><tr><td>Uptime threshold</td><td>80% of expected blocks produced</td><td>Validators below this threshold lose eligibility.</td></tr><tr><td>MEV sandwich attack threshold</td><td>30% of blocks produced</td><td>Validators above this threshold are blacklisted. See Blacklist Policy.</td></tr><tr><td>Bond minimum (for downtime)</td><td>1 SOL per 10,000 SOL of stake</td><td>Covers one epoch of PSR-style downtime.</td></tr></tbody></table>

#### **Timing and Cadence**

<table><thead><tr><th width="231">Parameter</th><th width="152">Value</th><th>Description</th></tr></thead><tbody><tr><td>Solana epoch duration</td><td>~2 days</td><td>Native time unit on Solana. All SAM mechanisms operate on per-epoch cycles.</td></tr><tr><td>ASO data refresh cadence</td><td>24 hours</td><td>Geolocation data is refreshed daily via the ipwhois provider.</td></tr><tr><td>Bonds API update cadence</td><td>1 hour</td><td>The Bonds API refreshes once per hour. Use the CLI for real-time bond state.</td></tr><tr><td>PSR dashboard refresh</td><td>Every few hours</td><td>Web dashboards refresh on a delay. Always cross-check with the CLI for real-time values.</td></tr><tr><td>Pipeline scoring cadence</td><td>Once per epoch</td><td>Stake rebalancing actions are dispatched at the epoch boundary.</td></tr></tbody></table>

### Glossary

Definitions for terms used across SAM documentation. Includes acronyms, units, code-name synonyms, and shorthand. Alphabetical.

#### **Units at a Glance**

A quick reference for the unit conventions used across the CLI, dashboards, and configuration files. Mixing these up is the most common cause of misconfiguration.

| Concept                                                                                 | Unit                           | Example                                                |
| --------------------------------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------ |
| Bond balance and settlement amounts                                                     | SOL                            | 25 SOL                                                 |
| Lamports (Solana base unit)                                                             | 1 SOL = 1,000,000,000 lamports | 25 SOL = 25,000,000,000 lamports                       |
| CPMPE (`--cpmpe`)                                                                       | lamports                       | 100,000,000 lamports = 0.1 SOL per 1,000 SOL per epoch |
| `--max-stake-wanted`                                                                    | lamports                       | 25,000 SOL = 25,000,000,000,000 lamports               |
| Dynamic commission (`--inflation-commission`, `--mev-commission`, `--block-commission`) | basis points (bps)             | 10,000 bps = 100%                                      |
| PMPE and CPMPE display on dashboards                                                    | SOL per 1,000 SOL per epoch    | 0.1                                                    |

#### **Terms**

* **Activating stake:** Stake that Marinade has just delegated to a validator in the current epoch but is not yet earning rewards. Appears as activating in one epoch's snapshot, then transitions to active in the next. Triggers the [Activating Stake Fee](/marinade-protocol/protocol-overview/stake-auction-market/activating-stake-fee.md).
* **Active stake (Marinade):** The portion of a validator's total stake that originated from Marinade and is currently earning rewards (not activating or deactivating). Bids in SAM are charged against active Marinade stake each epoch.
* **`auctionEffectiveBidPmpe`:** Source-code name for the Effective Bid. Used in auction outputs and pipeline data. See also `effBid`.
* **ASO (Autonomous System Organization):** The data center or hosting provider a validator runs on, identified by ASN. Marinade enforces a 30% cap on ASO concentration in [Stake Distribution](/marinade-protocol/protocol-overview/stake-auction-market/stake-distribution-and-decentralization.md). ASO data is refreshed every 24 hours via the ipwhois geolocation provider.
* **Activating Stake Fee:** One-time fee charged when new stake activates on a validator. Scaled by how far the validator bid above the auction clearing rate. See [Activating Stake Fee](/marinade-protocol/protocol-overview/stake-auction-market/activating-stake-fee.md).
* **Bid Reduction Penalty:** Penalty charged when a validator lowers their static bid (`bidPmpe`) after winning stake. Internal name `bidTooLowPenalty`. See [Bid Reduction Penalty](/marinade-protocol/protocol-overview/stake-auction-market/bid-reduction-penalty.md).
* **bidPmpe:** The validator's configured static bid in PMPE form. The CLI accepts this value in lamports as `--cpmpe`.
* **Bond:** On-chain account collateralizing a validator's participation in SAM. Funded in SOL. Covers obligations like PSR settlements, auction bid costs, and downtime protection. Managed via the [validator bonds CLI](https://github.com/marinade-finance/validator-bonds/tree/main/packages/validator-bonds-cli).
* **`bondGoodForNEpochs`:** Field exposed in SAM auction output indicating how many epochs of revenue the validator's bond can cover. Shifted so that zero marks the fee threshold for the [Bond Risk Reduction Mechanism](/marinade-protocol/protocol-overview/stake-auction-market/bond-risk-reduction-mechanism.md): positive means headroom, negative means a fee is due this epoch.
* **`bondObligationPmpe`:** Total per-1,000-SOL-per-epoch obligation a validator must pay from their bond. Includes static bid, block rewards, and inflation/MEV commission difference.
* **`bondObligationSafetyMult`:** Multiplier (1.1 in production) applied to all bond obligation calculations as a 10% safety margin before comparison against the actual bond balance.
* **Bond Risk Reduction Mechanism:** Mechanism that undelegates stake and charges a fee from the bond when bond coverage falls below the minimum threshold. See [Bond Risk Reduction Mechanism](/marinade-protocol/protocol-overview/stake-auction-market/bond-risk-reduction-mechanism.md).
* **bps (basis points):** Unit for dynamic commission parameters. 10,000 bps = 100%. A value of 0 bps = 0%. See [Dynamic Bids](/marinade-protocol/protocol-overview/stake-auction-market/dynamic-bids.md).
* **Claimable bond:** The portion of a validator's bond not committed to pending withdrawals. Only the claimable portion counts toward bond coverage calculations.
* **CPMPE (cost per 1,000 SOL of delegated stake per epoch):** A fixed lamport cost a validator commits to pay per 1,000 SOL of delegated stake, per epoch. Set in the CLI as `--cpmpe`. The static portion of a SAM bid.
* **Dynamic commission:** Commission parameters set in the validator bonds CLI (`--inflation-commission`, `--mev-commission`, `--block-commission`) in basis points. Determines how rewards are split between the validator and stakers. See [Dynamic Bids](/marinade-protocol/protocol-overview/stake-auction-market/dynamic-bids.md).
* **`effBid` / Effective Bid:** The realized yield for an epoch, in lamports per 1,000 SOL, set by the auction's last-price model. Typically lower than the validator's configured bid. Source-code name `auctionEffectiveBidPmpe`. See [Bonds Settlements](/marinade-protocol/protocol-overview/stake-auction-market/bonds-settlements.md).
* **`effParticipatingBidPmpe`:** The minimum bid required to remain in the winning set this epoch. Calculated from the auction-winning total pmpe minus the validator's post-commission on-chain rewards (`max(0, winningTotalPmpe - onchainDistributedPmpe)`). Does not depend on the validator's own static bid. Used as the floor in the [Bid Reduction Penalty](/marinade-protocol/protocol-overview/stake-auction-market/bid-reduction-penalty.md) calculation.
* **`expectedMaxEffBidPmpe`:** The maximum Effective Bid expected for a validator. Used by the [Bond Risk Reduction Mechanism](/marinade-protocol/protocol-overview/stake-auction-market/bond-risk-reduction-mechanism.md) to size required bond coverage. Can never exceed the validator's own bid.
* **External stake:** Stake delegated to a validator that did not originate from Marinade and does not come from the validator's own self-stake (retail, SFDP, other LSTs, etc.). See [Stake Matching](/marinade-protocol/protocol-overview/stake-auction-market/stake-matching.md).
* **`idealBondEpochs`:** Source-config parameter (12 in production) for the target bond coverage in future epochs. Combined with the current epoch this represents the recommended 13-epoch operational target.
* **Lamports:** Base unit of SOL. 1 SOL = 1,000,000,000 lamports. CLI flags such as `--cpmpe` and `--max-stake-wanted` take values in lamports.
* **Last-price auction:** The auction model used by SAM. Validators are ranked by `max_yield` and stake is allocated top-down. The Effective Bid for the epoch is set to the `max_yield` of the last validator on the winning list, and all winners are charged at that lower rate.
* **`max_yield`:** The maximum yield a validator offers to stakers at a given stake level. Combines the validator's commission and any bid placed through SAM. Used as the ranking metric in the auction. Source-code synonym: `totalPmpe`.
* **`maxStakeWanted`:** Per-validator cap on incoming Marinade stake, configured via the bonds CLI in lamports. Subject to a 10,000 SOL minimum floor (`minMaxStakeWanted`). See [`maxStakeWanted` Parameter](/marinade-protocol/protocol-overview/stake-auction-market/maxstakewanted-parameter.md).
* **MEV (Maximal Extractable Value):** Value extractable through transaction ordering, inclusion, or exclusion within blocks. One of three reward categories (inflation, MEV, block rewards) configurable in dynamic commission.
* **MIP (Marinade Improvement Proposal):** Governance proposals for protocol changes. Discussed and ratified on the [Marinade Forum](https://forum.marinade.finance/). Notable: [MIP-19](https://forum.marinade.finance/t/mip-19-improving-sam-auction-stake-priority-bond-risk-reduction-mechanism-higher-validator-caps/1969) introduced the 15% per-validator cap and the Bond Risk Reduction Mechanism.
* **`minBondEpochs`:** Source-config parameter (4 in production) for the minimum bond coverage in future epochs. Combined with the current epoch this represents the 5-epoch fee threshold.
* **`minMaxStakeWanted`:** Source-config parameter (10,000 SOL in production) setting the floor on the per-validator cap parameter. See [`maxStakeWanted` Parameter](/marinade-protocol/protocol-overview/stake-auction-market/maxstakewanted-parameter.md).
* **`onchainDistributedPmpe`:** The on-chain distributed PMPE for an epoch, used in Bond Risk Reduction Mechanism calculations.
* **On-chain commission:** The validator's commission settings recorded directly on the Solana blockchain (separate from Marinade's bond-level commission). Acts as a floor: dynamic commission can share more with stakers than the on-chain commission implies, but cannot share less.
* **Overstaked:** A validator whose SAM target (the stake they would win in this epoch's auction) is lower than their current SAM active stake. The excess is redelegated to other validators.
* **PMPE (per 1,000 SOL per epoch):** Unit for yield and bid measurements. Smaller values when expressed in lamports; larger values when expressed in SOL.
* **PSR (Protected Staking Rewards):** Marinade's framework for protecting staker rewards via validator-funded bonds. The bond covers obligations like downtime, sandwich attacks, and other PSR-triggering events. See [PSR documentation](https://docs.marinade.finance/marinade-protocol/protocol-overview/protected-staking-rewards).
* **realized\_yield:** The yield actually delivered to stakers each epoch, equal to the Effective Bid (or `auctionEffectiveBidPmpe`). All validators on the winning list deliver this rate, regardless of their configured `max_yield`.
* **SAM (Stake Auction Marketplace):** Marinade's auction-based delegation system. Validators bid for Marinade stake; the auction allocates stake based on `max_yield` rankings subject to eligibility and decentralization constraints.
* **SFDP (Solana Foundation Delegation Program):** Solana Foundation program that delegates stake to qualifying validators. Counts as external stake for [Stake Matching](/marinade-protocol/protocol-overview/stake-auction-market/stake-matching.md). PSR bond counts toward the SFDP self-stake requirement.
* **Slashable bond:** The portion of a validator's bond exposed to penalties from PSR-triggering events (downtime, sandwich attacks). Required for direct SAM stake. Not required for matched stake.
* **Solana epoch:** The native time unit on Solana, approximately 2 days in duration. All SAM mechanisms operate on per-epoch cycles.
* **Static bid:** The CPMPE component of a validator's auction bid. Fixed cost per 1,000 SOL of stake per epoch. Configured in lamports via `--cpmpe`.
* **`totalPmpe`:** Source-code name for `max_yield`. Used in auction outputs and pipeline data.
* **Unprotected stake:** Source-code term for matched stake. The two refer to the same thing: stake matched by Marinade as additional delegation without slashable bond coverage. Field name `unprotectedStakeSol`. See Stake Matching.
* **`unprotectedDelegatedStakeDec` / `unprotectedFoundationStakeDec`:** Configuration parameters for [Stake Matching](/marinade-protocol/protocol-overview/stake-auction-market/stake-matching.md). 0.1 (10%) and 0.3 (30%) respectively in production. Set the match rate on non-SFDP and SFDP stake.

### Useful Reads

Background and educational content for SAM participants.

* [**Marinade blog: Dynamic Commission introduction**](https://marinade.finance/blog/more-control-better-yields-introducing-dynamic-commission-for-validators)**:** Background on how dynamic commission bidding was rolled out.
* [**Marinade blog: PSR and Delegation Strategy updates**](https://marinade.finance/blog/psr-and-delegation-strategy-updates/)**:** Original PSR launch context and delegation strategy reasoning.
* [**Solana Foundation Delegation Program (SFDP) self-stake criteria**](https://solana.org/delegation-criteria#self-stake)**:** SFDP requirements that PSR bond contributes toward.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/protocol-overview/stake-auction-market/sam-resources.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
