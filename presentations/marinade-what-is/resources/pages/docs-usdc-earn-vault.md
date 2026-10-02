> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/protocol-overview/usdc-earn-vault.md).

# USDC Earn Vault

Learn how to deposit USDC, earn yield automatically, and withdraw anytime with no lockup. This guide covers how the USDC Vault works, fees, and risks

## Earn Yield on USDC with Marinade

Marinade lets you put your USDC to work. The USDC Vault is a lending strategy built on Kamino that delivers risk-adjusted yield on your stablecoins: no lockup required and no need to leave the Marinade app.

***

## What Is the USDC Vault?

The USDC Vault is a yield-generating vault powered by Kamino's on-chain lending markets. When you deposit USDC, your funds are supplied to liquid lending pools where borrowers pay interest. The vault curator (RockawayX) continuously reallocates capital across lending pools to optimize for steady, risk-adjusted returns.

#### **Vault highlights:**

* **Current APY**: variable, shown live in the app. The figure displayed is a **14-day average**, so it will not reflect a same-day move in lending rates.
* **Withdrawals**: no lockup and no unbonding period, subject to available lending liquidity
* **Vault curator**: [RockawayX](https://rockawayx.com/)
* **Lending base**: Kamino
* [**Audited**](https://kamino.com/docs/security/audits#kamino-earn-vaults) and **verified**

### **On-chain addresses**

<table><thead><tr><th width="195.5999755859375">Role</th><th>Address</th></tr></thead><tbody><tr><td>USDC Vault (Kamino Earn vault)</td><td><code>2TNCzzYJt3uHmpFpqeeJkza4pQUK9xoLa79DJH9AdgGA</code></td></tr><tr><td>Kamino vault program</td><td><code>KvauGMspG5k6rtzrqqn7WNn3oZdyKqLKwK2XWQ8FLjd</code></td></tr><tr><td>Deposit asset (USDC mint)</td><td><code>EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v</code></td></tr></tbody></table>

***

## How It Works

1. **Deposit USDC:** You deposit USDC into the Marinade vault.
2. **Supplied to Kamino:** Your USDC is supplied to Kamino's on-chain lending markets through smart contracts.
3. **Rewards are generated:** Borrowers post collateral and pay interest. Yield is generated from lending demand and market utilization. APY fluctuates based on market conditions.
4. **Strategy is actively managed:** RockawayX, the external vault curator, reallocates capital across lending pools in response to market conditions to maintain consistent yield.
5. **Earn automatically:** Vault interest accrues continuously in USDC with no action required. Any additional incentive rewards appear as pending and must be claimed manually.

***

## How to Deposit USDC

**Step 1: Visit the Marinade App**

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FaIv2o2qltm0zZbI8ecVj%2Fimage.png?alt=media&#x26;token=c27d3ad9-8566-4fa1-9419-2769630191f0" alt="" width="563"><figcaption></figcaption></figure>

* Go to [app.marinade.finance](https://app.marinade.finance/) and connect your wallet.

**Step 2: Navigate to USDC Vault**

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FUimdfadsuX5ElYOA1VTs%2Fimage.png?alt=media&#x26;token=ed124c56-ee93-4f08-8a9d-c01da3ddc6b5" alt="" width="563"><figcaption></figcaption></figure>

* From the main menu, select **Earn**, then choose **USDC Vault** from the available strategies.

**Step 3: Enter Your Deposit Amount**

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FNR0ie1KJq82RuoOGdVdM%2Fimage.png?alt=media&#x26;token=e87dd79b-4b95-4fb8-98d4-faca284f0789" alt="" width="477"><figcaption></figcaption></figure>

* Enter the amount of USDC you want to deposit.
  * Minimum deposit: 0.01 USDC


Keep a small amount of SOL in your wallet to cover transaction fees, even though you are depositing USDC.


**Step 4: Confirm the Transaction**

* Click **Stake**, then approve the transaction in your wallet. Your USDC will begin earning yield immediately.

**Step 5: Monitor Your Position**

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2F0EnWUy3ohuzUVDtYbp4x%2Fimage.png?alt=media&#x26;token=b92fcc19-51e4-4379-ae8f-448febab24b8" alt="" width="485"><figcaption></figcaption></figure>

* Once deposited, you can view your position under **My position** in the Earn section, and as a row under Earn positions on **Portfolio**. Vault interest accrues automatically and is reflected in your growing USDC balance.
  * If any incentive rewards are available, they appear as pending and can be claimed from the same page.

***

## How to Withdraw

There is no cooldown and no unbonding period. A withdrawal is a single transaction.

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FpXDK3Wn1k5grGQjMTZMG%2Fimage.png?alt=media&#x26;token=60ea45b7-b43a-4dac-8b89-9b2d348dbf25" alt="" width="441"><figcaption></figcaption></figure>

1. Go to [app.marinade.finance](https://app.marinade.finance/) and connect the wallet you deposited from.
2. Open **Portfolio** and find your **USDC vault** position under Earn positions.
3. Open the **...** menu on that row and choose **Withdraw**. The row's own button is **Deposit**, so Withdraw sits in the menu beside it. There is no Unstake control for this product.
4. Enter the amount you want to withdraw, or click **Max** for the full position.
5. Click **Withdraw** and approve the transaction in your wallet. The USDC arrives once it confirms.

Keep a small amount of SOL in your wallet for the network fee, even though you are withdrawing USDC.


**Claim bonus rewards before withdrawing in full.** Vault interest is already part of your balance and needs no claiming, but campaign bonus rewards are separate. On the **My position** tab, look for a line reading "You've earned ... in bonus rewards" with a **Claim all** button, and claim before you withdraw everything.


**If a withdrawal does not go through.** Your USDC is supplied to Kamino's lending markets, so withdrawals depend on liquidity being available there. This is rare, but during periods of very high utilization a withdrawal can be constrained. Try a smaller amount, or try again shortly. The app lists this as **Liquidity risk** under **Strategy overview**.

Because the vault is a Kamino Earn vault, your position is also visible and withdrawable directly on Kamino at any time, at the vault address in the table above.

***

## How Rewards Work

Yield is generated from the interest paid by borrowers in Kamino's lending markets. The APY you see is a **14-day average** of the annualized rate, based on real-time lending demand and market utilization, so it lags a sudden move in rates.

There are two types of rewards:

* **Vault interest:** Accrues automatically to your USDC balance as interest compounds. No claiming required, and it is already included in whatever you withdraw.
* **Incentive rewards:** Additional rewards that may be available on top of vault interest. These appear as pending in the Earn page and must be claimed manually.
* **APY is variable.** The rate fluctuates based on borrowing demand and pool utilization. It is not fixed or guaranteed.

***

## Fees

Marinade does not charge a deposit or withdrawal fee for the USDC Vault.

<table><thead><tr><th width="250">Fee</th><th>Rate</th></tr></thead><tbody><tr><td>Deposit</td><td>0%</td></tr><tr><td>Withdrawal</td><td>0%</td></tr><tr><td>Management fee</td><td>0%</td></tr><tr><td>Performance fee</td><td><strong>5%</strong> of net interest earned</td></tr></tbody></table>

The performance fee is taken only on the net interest generated by your position. If your position generates $1,000 in interest, a $50 fee is taken and you keep $950. It is already reflected in the displayed net APY. Both the 5% performance fee and the 0% management fee are parameters of the on-chain vault account and can be read directly from it.

***

## Risks and Disclaimers

The USDC Vault is a non-custodial, on-chain vault. It is not a savings account and carries the following risks:

* **Strategy risk:** Yield is variable and depends on lending demand, collateral conditions, and the vault curator's allocation decisions. Returns are not guaranteed.
* **USDC depeg risk:** USDC is designed to track 1 USD, but the peg is not guaranteed in extreme market conditions.
* **Smart contract risk:** Funds are deployed through Kamino's smart contracts, which have been audited but may contain vulnerabilities.
* **Liquidity risk:** Withdrawals rely on available liquidity in underlying lending markets and may be constrained during periods of high utilization.

This vault deploys capital on-chain and is not a bank deposit or savings account. Only deposit what you are comfortable with.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/protocol-overview/usdc-earn-vault.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
