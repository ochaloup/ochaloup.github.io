> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/partnerships/marinade-referral-program.md).

# Marinade Referral Program

Earn rewards by supporting Marinade’s mission to decentralize Solana. Marinade shares fees with both the referring partner and the staker, creating a win-win incentive.

{% hint style="danger" %}
**The Marinade Referral Program is paused.** It has been dormant since **8 May 2026**. While it is paused, partners **do not earn referral fees on any Marinade product**, whether mSOL, Marinade Native or Marinade Select, and referred users receive **no APY boost**. This applies to **every partner, including those holding a referral agreement signed before the pause**. No partner fees are being paid to anyone. There is no referral dashboard and no referral page in the app.

The program is **paused, not retired**. A relaunch is expected, but **relaunch terms are not defined**, so nothing described below is a commitment.
{% endhint %}

### What Is Open Right Now

If you are a partner looking to work with Marinade today, these pathways are live and are handled case by case by the Partnerships team:

* **Marinade Recipes.** Partner-funded incentive economics, where your users stake SOL and receive rewards in a token you choose. Marinade provides distribution and staking rails rather than a revenue share.
* **DAT and ETF exclusive relationships.** Commercial terms are per deal and sales-mediated. There is no published rate card.
* **Custodian integrations.** Routing institutional flow into Marinade Native through Fireblocks, BitGo, Anchorage, Copper or Komainu. The technical integration pathway is supported; any commercial terms are negotiated case by case by Partnerships and Legal. **Marinade Select is not currently available to stake to**, so it is not a destination for new flow; existing Select positions are unaffected.

To start a conversation, use the [**Marinade Partnerships form**](https://tally.so/r/wzLj1m).

{% hint style="warning" %}
**Marinade will never ask you to arrange a partnership or a referral code through a direct message on X, Telegram or Discord.** The Partnerships form linked above is the only official intake route. Anyone offering you a Marinade referral code or a revenue share over DM is impersonating Marinade.
{% endhint %}

***

### Reference: How The Program Worked Before The Pause

Everything in this section is **historical**. It is kept so that existing partners can understand past arrangements and so that relaunch design has a starting point. **None of it is in force, and relaunch terms may differ.**

#### Getting A Referral Code

Codes were **not self-serve**. A partner was approved and onboarded manually by the Partnerships team, which also served as the control preventing end users from referring themselves. There was no on-chain self-referral check.

#### Attribution

Marinade ran **two architecturally distinct referral systems**.

<table><thead><tr><th>System</th><th>Attribution model</th><th width="126.800048828125">Partial referrals</th><th>Binding</th></tr></thead><tbody><tr><td><strong>Campaign referral</strong> (MNDE seasons)</td><td>Per deposit. A wallet's stake could be attributed across several campaigns at once.</td><td>Yes</td><td>Not permanent</td></tr><tr><td><strong>Custodian referral</strong> (white label and institutional)</td><td>Per wallet, first touch.</td><td>No</td><td><strong>Permanent.</strong> The first referrer to onboard a wallet was locked in for all subsequent Native deposits, with no mechanism to switch.</td></tr></tbody></table>

For Marinade Native, a visitor arrived with a `?r=<refcode>` URL parameter, which was stored in a 30-day cookie and passed through the SDK on the first stake. The code was an **arbitrary string** issued by Partnerships, not a Solana public key and not a transaction memo. Attribution happened at transaction-build time, through the referral API.

For mSOL, an on-chain wrapper program recorded per-partner metrics against a `ReferralState` account while forwarding deposits and instant unstakes to the core liquid staking program by CPI.

<table><thead><tr><th width="267.20001220703125">Role</th><th>Address</th></tr></thead><tbody><tr><td>mSOL referral wrapper program</td><td><code>MR2LqxoSbw831bNy68utpu5n4YqBH3AzDmddkgk9LQv</code></td></tr><tr><td>Core liquid staking program</td><td><code>MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD</code></td></tr></tbody></table>

Both programs remain deployed. **No partner rewards accrue through them while the program is paused.**

#### Reward Split And Payout

* **Split:** 50/50 between referrer and referred user. Marinade allocated roughly **20% of its take rate** on the referred user to the referral pool, then split that pool equally.
* **Advertised user boost:** the pre-pause Referral Program Terms advertised an additional **+0.125% APY to the referred user**. This was a referred-user boost, not a rate paid to both sides, and it is **not in force**.
* **Payout method:** rewards were delivered as **additional SOL staked into the referrer's Marinade Native position**. They were not an epoch airdrop, not a SOL transfer and not mSOL.
* **Operations:** distribution and analytics were run **manually by Partnerships and Ops using spreadsheet tracking**. There was **never a referral dashboard**.
* **Terms page:** the Referral Program Terms were published at `marinade.finance/referral-terms`. **That page no longer exists**, confirmed 6 August 2026.

***

### For Developers

The referral SDK surface still exists in the [marinade-ts-sdk](https://github.com/marinade-finance/marinade-ts-sdk), and the referral services remain deployed so the program can be brought back. **Integrating the SDK today does not earn referral fees**, because no partner fees are paid while the program is paused. Build against it only if you are preparing for a relaunch, and confirm terms with Partnerships before relying on any revenue from it.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/partnerships/marinade-referral-program.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
