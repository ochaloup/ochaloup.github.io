> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/protocol-overview/marinade-borrow.md).

# Marinade Borrow

Borrow against mSOL collateral that keeps earning staking rewards while your loan is open.

{% hint style="info" %}
**TL;DR:** Marinade Borrow lets you borrow against your staked SOL without giving up staking rewards. You choose how much to borrow, Marinade puts together the collateral as mSOL, and a routing engine places your position on whichever lending venue has the best rates (currently Kamino or Jupiter Lend). Your collateral keeps earning the whole time.
{% endhint %}

**Borrow is live and available to everyone.** There is no waitlist, beta access, or approval step. If you have SOL, mSOL, or an existing staking position, you can open a position today.

## How It Works

Most borrow products on Solana start the same way: deposit collateral, then borrow against it. Marinade Borrow flips this. You tell Marinade **how much you want to borrow**, and it assembles the collateral from assets you already hold, in this order:

1. **External staking positions** (SOL staked outside Marinade)
2. **Idle mSOL** in your wallet
3. **Idle SOL** in your wallet
4. **Your existing Marinade stake**, whether Native or mSOL

This waterfall also sets your **max borrow**, which reflects the total collateral you have across all four sources. You see exactly what Marinade plans to use on the **What backs your loan** screen before you confirm. **Nothing moves until you approve the transaction.**

You choose what to borrow, **SOL** or **USDC**, and each shows its own borrow APY. Opening a position takes **two or three wallet signatures** depending on whether idle SOL has to be converted, so expect more than one prompt.

{% hint style="warning" %}
**Keep more than 0.04 SOL available in your wallet.** Every Borrow action, opening, borrowing, repaying and withdrawing, is blocked when your available SOL is too low, and the app holds back **0.04 SOL** for network fees. Closing a position takes several transactions rather than one, so leave headroom above that figure. This is higher than the roughly 0.03 SOL needed for an ordinary stake or unstake.
{% endhint %}

***

## Your Collateral Becomes mSOL

This is the most important thing to understand before you borrow. Whatever Marinade sources as collateral gets converted to **mSOL**, Marinade's liquid staking token. Only the **minimum reasonable amount** needed to back your loan is converted. If you take a small loan against a large Native position, most of it stays exactly where it was, as native stake in your own accounts.

The upside of the mSOL form is that it **earns staking rewards continuously**, so your collateral keeps working while it backs your loan. That yield is what makes a positive net APY possible.

The tradeoff: the converted portion carries **smart contract exposure** on Marinade's liquid staking contracts and sits in the lending venue's contracts for the life of the position. If you stake through Marinade Native to keep contract exposure minimal, weigh this before borrowing. The app shows you exactly what will be converted before you confirm.

#### Why More Collateral May Be Used Than You Expect

Solana stake accounts cannot be split into arbitrarily small pieces: **each side of a split must be at least 1 SOL**. When Marinade splits a stake account for collateral, both the portion it takes and the portion left behind have to clear that minimum. Two things can follow:

* **Your loan needs less than 1 SOL from the account.** Marinade takes a full 1 SOL as collateral, slightly more than the loan strictly requires.
* **Taking exactly what is needed would leave less than 1 SOL behind.** Marinade uses the entire stake account as collateral instead, which can be a larger jump. The app tells you when this applies.

In both cases the extra stays yours, keeps earning as mSOL, and comes back to you once the loan is repaid.

***

## Where Your Position Lives

Marinade Borrow isn't a new lending market. A routing engine places your position on an established Solana venue, currently **Kamino** or **Jupiter Lend**, with more protocols coming. These are vetted, audited lending systems with substantial deposited assets.

**The venue, not Marinade, sets the market parameters:** maximum loan-to-value, liquidation threshold, and the variable borrow rate. The app always shows the exact parameters of the market your position sits in, and those are the numbers that count.

To find an open position, go to **Portfolio** and stay on the **Positions** tab. Your loan appears under **Borrow positions**, a separate table below Earn positions, showing the market, net value, collateral, debt, net APY, LTV and earned. The **Manage** dropdown on that row holds **Borrow**, **Repay**, **Withdraw** and **Deposit**.

You can also start a loan from a position you already hold: on **Portfolio**, open the **...** menu on a Marinade Native, Marinade Select or mSOL row and choose **Borrow**.

***

## Borrowing Pairs and Risk

Your collateral is always mSOL. The other side of the pair matters:

**SOL against mSOL** is a **price-bound pair**. mSOL's value comes from SOL and the two move together, so a broad market crash moves your collateral and your debt in lockstep. The main thing that raises your LTV over time is interest slowly accruing on your debt, which is why these markets can safely support much higher loan-to-value ratios than you'd see elsewhere in DeFi.

**Stablecoins against mSOL** work differently. Your collateral is priced in SOL terms and your debt in dollars, so **a drop in SOL's price raises your LTV directly**. These markets carry real price risk and come with more conservative parameters. Watch these positions the way you would on any lending protocol.

***

## The Numbers on Your Position Screen

<table data-search="false"><thead><tr><th width="148">Term</th><th>What it means</th></tr></thead><tbody><tr><td><strong>Collateral</strong></td><td>The mSOL backing your loan, at current value. Moves with the mSOL/SOL rate and grows with staking rewards.</td></tr><tr><td><strong>Debt</strong></td><td>What you owe: the amount borrowed plus interest accrued since.</td></tr><tr><td><strong>LTV</strong></td><td>Debt divided by collateral, right now. Moves as interest accrues, rewards accumulate, and prices shift.</td></tr><tr><td><strong>Liquidation LTV</strong></td><td>The threshold where liquidation becomes possible. Set by the venue and differs by market. Keep your LTV below it.</td></tr><tr><td><strong>LTV health</strong></td><td>A plain-language label showing how close you are to liquidation. A Marinade convenience label, not a protocol parameter.</td></tr><tr><td><strong>Supply APY</strong></td><td>The yield your collateral earns as mSOL. This is Marinade's staking APY.</td></tr><tr><td><strong>Borrow APY</strong></td><td>The variable interest rate on your debt, set by the lending venue based on supply and demand.</td></tr><tr><td><strong>Net APY</strong></td><td>(Supply APY x Collateral - Borrow APY x Debt) / Collateral. Can be positive even when the borrow rate exceeds the supply rate, if you have plenty of collateral relative to debt. A live rate, not a guarantee.</td></tr></tbody></table>

To see the **liquidation price** and the **liquidation LTV** while opening a loan, tap the pencil next to Loan-to-value. That panel also lets you drag your LTV between the minimum and maximum for the loan.

***

## How Liquidation Works

If your LTV crosses the liquidation threshold, the venue's liquidation mechanism can repay part of your debt by selling part of your collateral, **usually with a penalty**. You keep the rest of the position, but you lose value, and it is not reversible.

In a price-bound SOL market, LTV drifts up slowly through interest, so this is something you manage on the **timescale of weeks and months**, not minutes. In a stablecoin market, **price moves can get you there fast**.

Two ways to stay clear of the threshold, both in the **Manage** dropdown on your Borrow position row:

* **Repay** part of the debt (lowers the numerator)
* **Deposit** more collateral (raises the denominator)

Both are available at any time. Act before the threshold, not at it. **Borrow less than the maximum** when you open: opening at the maximum LTV leaves no room for interest to accrue before you are at risk, and the app warns you when margin is thin.

***

## Managing and Closing Your Position

You can repay part or all of your debt **whenever you want**. There are no fixed terms and no repayment schedule; interest simply accrues while the debt is open.

{% hint style="warning" %}
**Repaying does not return your collateral.** Repaying reduces your debt only. Once the debt is fully repaid, choose **Withdraw** from the same Manage dropdown to get your collateral back in your wallet as **mSOL**. Fully repaying and then withdrawing is what closes the position.
{% endhint %}

Collateral always comes back as mSOL, even if you started from a Native position or from idle SOL. You can hold it, use it elsewhere in DeFi, or unstake it back to SOL through Marinade, either instantly or through the standard unstaking cooldown. Returning to Marinade Native is a separate two-step job: unstake the mSOL, then stake the SOL again with Native, and expect about one epoch of reduced earning across the switch.

***

## FAQ

**Q: Do I need access or an invite?**

A: No. Borrow is generally available to all users, with no waitlist and no beta flag.

**Q: What do I need to start?**

A: A Solana wallet with SOL, mSOL, or an existing staking position, plus more than 0.04 SOL available for network fees. Marinade Borrow calculates your max borrow from what it finds.

**Q: I hold mSOL. Do I need to unstake first?**

A: No. You can borrow directly against mSOL with no conversion steps, since mSOL is the asset Borrow is built around.

**Q: Does borrowing stop my staking rewards?**

A: No. Your collateral is mSOL, which earns Marinade's staking APY the entire time your loan is open. That's the point of the design.

**Q: Can I keep my Marinade Native position and still borrow?**

A: Yes, for the most part. Only the portion needed to back your loan gets converted to mSOL, sized to the loan you take. The rest stays native. The **What backs your loan** screen shows exactly which holdings will be used before you commit.

**Q: My Marinade Native position is smaller since I borrowed. Where did the rest go?**

A: It became your collateral. On **Portfolio**, look at both **Earn positions** and **Borrow positions**: the converted mSOL sits under the Borrow position, and the two together account for what you had. Nothing left your wallet.

**Q: My wallet asked me to sign three times. Is that normal?**

A: Yes. Opening a position takes two or three signatures: converting stake to mSOL, converting idle SOL to mSOL if any is used, and the deposit-and-borrow itself. The confirmation screen lists which steps apply to your loan.

**Q: Who sets the interest rate?**

A: The lending venue your position sits on. Borrow APY is variable and follows supply and demand in that market. Marinade shows it to you but doesn't control it.

**Q: Which protocol will my loan end up on?**

A: The routing engine picks the venue with the best rates at the time you open the position, currently Kamino or Jupiter Lend. The app shows you where your position lives.

**Q: Why is my LTV allowed to be so high in the SOL market?**

A: Because mSOL and SOL are price-bound. The pair doesn't have the volatility risk that forces conservative ratios in ordinary lending markets. The remaining risk is interest accrual, which moves slowly and predictably.

**Q: What happens if I do nothing?**

A: Interest keeps accruing and your LTV drifts upward, while staking rewards on your collateral partially offset it. Left alone long enough, any position with debt can eventually reach the liquidation threshold. Check in periodically, or set a comfortable buffer from the start.

**Q: Can I get liquidated even if the market doesn't move?**

A: Yes, eventually, through interest accrual alone if you never repay or add collateral. This is slow in price-bound markets, but it's not zero.

**Q: What are the risks?**

A: Smart contract risk on Marinade's liquid staking contracts and the lending venue's contracts. Liquidation risk if your LTV crosses the threshold. Variable rate risk, since borrow APY can rise. And in stablecoin markets, price risk on SOL.

**Q: What does Marinade charge?**

A: **Marinade's fee is 0%.** What you pay is the venue's borrow APY on your debt, plus Solana network fees, plus anything else shown at transaction time. No hidden charges beyond what's displayed before you confirm.

**Q: My wallet says the transaction may fail when I try to repay.**

A: Most often the wallet does not have enough available SOL. Repaying takes several transactions and the app holds back 0.04 SOL for network fees, so top up above that and try again.

**Q: Where do I see the exact parameters for my position?**

A: On your position screen in the app. Every number that matters, including your LTV, the liquidation threshold, and both APYs, is shown live for the specific market your position sits in.

***

Read the full article in the [Marinade Learn tab](https://app.marinade.finance/learn/marinade-borrow/).


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/protocol-overview/marinade-borrow.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
