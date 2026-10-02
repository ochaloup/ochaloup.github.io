> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/protocol-overview/stake-auction-market/stake-matching.md).

# Stake Matching

Marinade matches a portion of a validator's external stake with additional delegation, with no Protected Staking Rewards (PSR) slashable bond required on the matched portion.


**TL;DR:** Marinade matches 10% of a validator's non-SFDP external stake and 30% of SFDP stake as additional delegation, with no slashable bond required on the matched portion. Bids still apply on matched stake, and matches below 1,000 SOL collapse to zero.


## Overview

To support a broader set of validators and make participation in SAM more accessible, Marinade matches a portion of validator-attracted external stake with additional delegation. The matched portion does not require PSR (Protected Staking Rewards) slashable bond coverage, lowering the capital barrier for validators who already have stake from other sources.

Bids are still charged on matched stake, and the validator's bond must have enough SOL to cover those bids. Matching is designed to broaden validator participation across the network, not to maximize matched stake for any individual validator.


In Marinade's source code, matched stake is referred to as **unprotected stake** (`unprotectedStakeSol`). The two terms refer to the same thing. Docs use "stake matching"; the field name in auction outputs and config uses "unprotected."


## What Counts as External Stake

The matching base is the validator's **total activated stake minus their own self-stake and minus SFDP/foundation stake**. Everything left over is treated as the non-SFDP external base, and SFDP stake is matched separately at a higher rate.

* **Counts toward the non-SFDP base:** Direct retail stake, stake from other liquid staking protocols (jpool, blaze, and so on), and any other third-party delegation.
* **Counts toward the SFDP base:** SFDP (Solana Foundation Delegation Program) delegation, matched at the higher rate.
* **Excluded entirely:** The validator's own self-stake. PSR bond counts as self-stake for this calculation.


**Marinade's own delegation is not excluded from the base.** In `ds-sam`, the non-SFDP base is computed as `totalActivatedStake - selfStake - foundationStake`. Marinade-delegated stake (Liquid, Native, Select, and earlier matched stake) is not subtracted, so it sits inside the 10% base. Check this against the current pipeline before relying on it for planning.


External stake is measured from the same epoch snapshot used for all other stake calculations in the auction.

### How Matching Works

Matching is deterministic and automatic. Validators do not need to configure or opt into it. The matched amount is calculated from two fixed rates applied to two different stake categories.

* **10% of the non-SFDP base** (retail, other LSTs, third-party delegation): Configured in `auction-config.json` as `unprotectedDelegatedStakeDec: 0.1`.
* **30% of SFDP/foundation stake**: Configured as `unprotectedFoundationStakeDec: 0.3`.

The formula:

```
matched_cap = 0.1 x (total_activated_stake - self_stake - SFDP_stake)
            + 0.3 x SFDP_stake
```

A validator with only third-party external stake gets exactly 10% matched. A validator with only SFDP stake gets exactly 30% matched. A mixed stake composition gets a weighted sum.

The result is then clipped by the per-validator matching cap, and only afterwards tested against the 1,000 SOL floor.


**1,000 SOL minimum, applied after the cap.** The 0.4% per-validator cap is applied first. If the **capped** value is below 1,000 SOL, it collapses to zero and no matched stake is allocated. This is the `minUnprotectedStakeToDelegateSol` parameter in the auction config. A validator with very small external stake will receive no matching.


#### **Caps and Constraints**

* **Per-validator matching cap:** Up to 0.4% of Marinade's total TVL in SOL can be matched per validator (`maxUnprotectedStakePerValidatorDec: 0.004`). Multiply 0.004 by the current TVL to get the live figure. Current TVL is published on [Marinade stats](https://stats.marinade.finance/) and by the [stats API](https://api.marinade.finance/docs).
* **Separate from the 15% MIP-19 cap:** The 0.4% matching cap is independent of the 15% per-validator cap on direct SAM stake ([MIP-19](https://forum.marinade.finance/t/mip-19-improving-sam-auction-stake-priority-bond-risk-reduction-mechanism-higher-validator-caps/1969)). A validator at the 15% MIP-19 cap can still receive matched stake up to the 0.4% matching cap.
* **Bond-limited in practice:** Although no slashable bond is required, the amount actually delegated is `min(matching cap, bond balance / (idealBidReservePmpe / 1000))`. A thin bond reduces matched stake even when the matching cap is far higher, because the bond must still cover bids on the matched portion.
* **Auction requirement:** Validators must still win stake through the auction to receive matched stake. Matched stake is added on top of direct SAM stake won, not in place of it.
* **No PSR slashable bond required:** Matched stake does not require the slashable portion of the bond that direct SAM stake requires. Bids are still charged on matched stake (see below).

### Bids Still Apply to Matched Stake

The bid configured by the validator (CPMPE, cost per 1,000 SOL of delegated stake per epoch, and dynamic commission) is charged on the full delegated stake, including the matched portion.

What "no bond required" specifically means: the slashable bond reserve that protects against PSR-triggering events (downtime, sandwich attacks) is not required for the matched portion. The protection model for matched stake instead relies on the validator's existing accountability to the source of the external stake. PSR does not provide 100% coverage by design.

Matched stake is also excluded from the exposed-stake base used by the Bond Risk Reduction Mechanism, so it does not push a validator toward the bond risk fee. The bid reserve it requires is accounted for separately as `minUnprotectedReserve` and `idealUnprotectedReserve`.

#### Worked Example

The examples below use the pre-cap matching formula. Apply the 0.4% per-validator cap and the 1,000 SOL floor afterwards.

**Example 1: Pure Third-Party Stake**

A validator has 50,000 SOL of non-SFDP external stake, no SFDP, and wins 15,000 SOL of direct SAM stake at auction.

```
matched_cap = 0.1 x 50,000 + 0.3 x 0 = 5,000 SOL
```

Total Marinade-delegated stake: 15,000 + 5,000 = 20,000 SOL. The bond is charged the bid on all 20,000 SOL. The slashable bond requirement covers only the 15,000 SOL of direct SAM stake.

**Example 2: Pure SFDP Stake**

A validator has 50,000 SOL of SFDP stake, no other external stake, and wins 15,000 SOL of direct SAM stake.

```
matched_cap = 0.1 x 0 + 0.3 x 50,000 = 15,000 SOL
```

Total Marinade-delegated stake: 15,000 + 15,000 = 30,000 SOL. SFDP stake gets a higher match rate, so the same external balance yields three times the match in this case.

**Example 3: Mixed External Stake**

A validator has 30,000 SOL of non-SFDP external stake plus 20,000 SOL of SFDP stake, and wins 15,000 SOL of direct SAM stake.

```
matched_cap = 0.1 x 30,000 + 0.3 x 20,000
            = 3,000 + 6,000
            = 9,000 SOL
```

Total Marinade-delegated stake: 15,000 + 9,000 = 24,000 SOL.

**Example 4: Below the Minimum**

A validator has 5,000 SOL of non-SFDP external stake and wins 2,000 SOL of direct SAM stake.

```
matched_cap = 0.1 x 5,000 = 500 SOL
```

500 SOL is below the 1,000 SOL minimum, so the match collapses to zero. The validator receives only the 2,000 SOL of direct SAM stake. No matching is added.

***

## Where to See Matched Stake

Matched stake is published in the per-epoch auction outputs.

* **Auction outputs:** Each epoch's `auctions/<epoch>/outputs/results.json` in the [ds-sam-pipeline repository](https://github.com/marinade-finance/ds-sam-pipeline/tree/main/auctions) records matched stake and its cap per validator alongside direct SAM stake. The relevant fields use the internal "unprotected stake" naming.
* **SAM scores API:** `https://scoring.marinade.finance/api/v1/scores/sam?epoch=X` exposes `values.unprotectedStakeSol` and `unprotectedStakeCapSol` per validator for the given epoch.
* **PSR dashboard and validator dashboard:** These show total Marinade-delegated stake without separating direct from matched. Use the auction outputs or the scores API for the breakdown.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/protocol-overview/stake-auction-market/stake-matching.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
