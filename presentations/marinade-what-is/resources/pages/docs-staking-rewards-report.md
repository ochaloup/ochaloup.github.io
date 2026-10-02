> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/protocol-overview/staking-rewards-report.md).

# Staking Rewards Report

Learn how to use the Staking Rewards Report to view and export your Marinade native staking rewards by epoch, and understand what the data represents.

## Overview

The Staking Rewards Report is a self-service tool that provides a summary of staking rewards earned through Marinade's **native staking**.

It is designed to help users better understand rewards earned over time by presenting staking activity in a structured, historical view.

The report is intended for **reference and transparency**, and reflects indexed staking reward data rather than wallet balance changes.


**Not covered: Marinade Recipes / Customized Rewards.** Although Recipes use native staking, the report only tracks rewards paid in SOL. If your position pays out in another token (USDG, USDC, cbBTC, etc.), those payouts are airdropped to your wallet each epoch and no report is generated for them. Track them in your wallet's transaction history or on a Solana explorer such as [Solscan](https://solscan.io). See Marinade Recipes for details.


***

## What the Staking Rewards Report Shows

The report displays staking-related rewards and activity from Marinade native staking in a filterable view.

You can customize the report using the following options:

#### **Type**

<div align="center"><figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FxcVE63PWzNSC3US4ahGD%2Fimage.png?alt=media&#x26;token=11f9d88a-1a5c-437b-a45f-d4e61d811b34" alt=""><figcaption></figcaption></figure></div>

* Inflation Reward
* MEV Reward
* Marinade Settlement
* Deposit
* Withdrawal

#### **Date Range**

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FR0x8AITAUDYGUGhteJVh%2Fimage.png?alt=media&#x26;token=429c0e45-fd0a-4206-a17c-7205c2434bdf" alt=""><figcaption></figcaption></figure>

* Current month, Last month
* This year, Last year
* All time, Custom range

#### **Group By**

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2F8E9jxQ3hISC3jSWpQgJu%2Fimage.png?alt=media&#x26;token=a70a4160-8fb4-4ca0-9b0d-3553d527a0e5" alt=""><figcaption></figcaption></figure>

* Day, Week, Month
* Epoch, Year

All values shown represent **earned rewards**, displayed in both **SOL** and **USD** (where applicable), and are aggregated based on the selected grouping.

***

## What's Included vs. Excluded

#### **Included**

* SOL-denominated rewards earned from Marinade **native staking** (**Max Yield** with SOL rewards, and **Select**)
* Earned reward amounts displayed in **SOL** and **USD**
* Aggregated staking reward records based on the selected grouping

#### **Not Included**

* Wallet transfers unrelated to staking
* Liquid staking (mSOL) rewards
* The amount of SOL staked for each reward entry
* Validator-level performance or commission breakdowns
* Intraday or real-time reward accrual
* Marinade Recipes (Customized Rewards) payouts, meaning rewards paid in a non-SOL token such as USDG, USDC, or cbBTC. These are airdropped to your wallet each epoch; no report is generated for them.

***

## How to Request Your Staking Rewards Report

#### Step 1: Connect Your Wallet

1. Go to [**https://app.marinade.finance/**](https://app.marinade.finance/) and connect your wallet.
2. Open the **Portfolio** tab.

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FzG0JtphjCE1YFweG2dky%2Fimage.png?alt=media&#x26;token=5a40f3fe-41ba-4a50-a656-8f6fb69cc537" alt=""><figcaption></figcaption></figure>

Under **Positions**, you should see any staking positions associated with the connected wallet. This may include stake accounts not created directly through Marinade.

If no positions are found, you may see:

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2F0p8NM45FY5zDVvCf44QU%2Fimage.png?alt=media&#x26;token=c627453e-ffdb-487d-a3f1-7530632b5957" alt=""><figcaption></figcaption></figure>

> *"It looks like you don't have any positions yet. You can start staking with Marinade and earn rewards!"*

**Notes:**

* Only positions associated with the **connected wallet** can be displayed
* Assets deposited into DeFi protocols or not held directly in the wallet may not appear
* This applies to other liquid staking tokens (LSTs) as well

#### Step 2: Request Your Rewards Data

1. Open the **Rewards** tab.
2. If this is your first time using the tool, you'll see an option to **Request data**.
3. Click **Request data**.

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FgREU8CptXIz5N7ZQv7sb%2Fimage.png?alt=media&#x26;token=191c18dd-a330-4da4-b3e2-039e7447d373" alt=""><figcaption></figcaption></figure>

You'll be prompted to optionally enter an email address with the message:

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FCbxWgrx7Q9N2ieaxtv5w%2Fimage.png?alt=media&#x26;token=15da8902-be7d-4a71-b605-4e750e5634e3" alt=""><figcaption></figcaption></figure>

> *"Data are usually generated within 24 hours. Enter your email, and we'll notify you as soon as it's ready."*

Providing an email is optional but recommended.


**Security note:** We only send notifications from **@marinade.finance**.


4. Click **Confirm**.\
   Your request will typically complete within **24 hours**.

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FvSX3gWVscs829Rdi3oFM%2Fimage.png?alt=media&#x26;token=82d139d3-28c7-455a-967d-83ecc7d5f211" alt=""><figcaption></figcaption></figure>

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FLDBQXfWJc0pRMQO0Dxd7%2Fimage.png?alt=media&#x26;token=62236138-58c1-4709-96f3-0f9187a88ee3" alt=""><figcaption></figcaption></figure>

#### Step 3: View Your Report

Once ready:

* You'll receive an email notification if you provided an address, or
* You can reconnect your wallet and return to the **Rewards** tab

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FFDKEXJfnZhtkLkdcxTRz%2Fimage.png?alt=media&#x26;token=7fb5faca-14c4-4ab3-92a7-b3b54d8171e9" alt=""><figcaption></figcaption></figure>

From there, you can:

* View and sort rewards
* Group data by your preferred timeframe
* Export the report if needed

If you see **"No rewards found"**, it means no eligible records were found for the connected wallet.

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FnvfoDBKQRiXSPVxtOwNr%2Fimage.png?alt=media&#x26;token=46ba911e-5f8a-40ba-ba86-171f72299287" alt=""><figcaption></figcaption></figure>

**Currently supported:** Marinade Native staking with SOL rewards (**Max Yield**) and **Marinade Select** only.\
**Not supported:** Marinade Recipes / Customized Rewards (non-SOL reward tokens) and Marinade Liquid (mSOL).

***

## Data Refresh & Updates

The Staking Rewards Report does not automatically refresh every epoch.

The report shows the most recently indexed data, along with a timestamp indicating when it was last updated. To fetch the latest data, click **"Request latest data"** in the report.

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FS0EGrRNC3QRt0Y0b3yO1%2Fimage.png?alt=media&#x26;token=39e24e9a-4958-4a39-aef1-3f1e696225d7" alt=""><figcaption></figcaption></figure>

After requesting a refresh:

* Staking activity is re-indexed
* The process typically takes **up to 24 hours**
* **Request latest data** is greyed out for about **4 hours** after a request, so you cannot queue another refresh straight away
* Your existing report stays on screen while the new one is prepared, so you can keep using the previous figures until the refresh lands
* Updated data will appear once indexing completes

Providing an email allows us to notify you when the report is ready.

***

## Understanding Small or Zero Rewards

Seeing very small, infrequent, or zero rewards for a given period is usually expected.

Common reasons include:

* Your stake was activated partway through an epoch
* Rewards are still pending finalization or indexing
* Rewards are aggregated by epoch rather than continuously
* Solana staking rewards accrue per epoch (about **2 days**), so when grouping by **Day**, some days will show no rewards at all
* Small reward amounts may round down when displayed
* Displayed USD values are estimates based on historical pricing and may differ slightly due to rounding

***

## Exporting Your Report

The Staking Rewards Report can be exported for offline review.

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FvTnUVzC3ZlgspEbanh6E%2Fimage.png?alt=media&#x26;token=96f7f233-52bc-48b4-94ba-d350ddba676b" alt=""><figcaption></figcaption></figure>

#### **Export Format**

* CSV
* PDF
* XLSX

#### **Export Scope**

* **Selected data** reflects current filters and grouping
* **Raw data** exports the underlying ungrouped dataset

Exports are provided for convenience and reference.

***

## Getting Help

If something looks incorrect or unclear, please contact [Marinade Support](https://help.marinade.finance/en/).

To help us assist you faster, include:

* Your wallet address
* Approximate staking timeframe and amount
* Your email address
* Any relevant transaction links (if available)

***

<sub>*This report is provided for informational purposes only. Users are responsible for determining how staking rewards should be reported for tax purposes under their local laws. Marinade is not responsible for tax outcomes resulting from the use of this report.*</sub>


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/protocol-overview/staking-rewards-report.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
