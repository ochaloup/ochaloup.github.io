> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/protocol-overview/marinade-instant-unstake.md).

# Marinade Instant Unstake

Learn how Instant Unstake works, when to use it, and how it differs from delayed unstaking.

Instant Unstake lets you exit your staking position immediately instead of waiting for the usual one-epoch unlock on Solana.\
Instead of scheduling your stake to deactivate and coming back later to claim, Instant Unstake finds liquidity right away so you can receive SOL in a single transaction.

It works for both:

* Native staking (Marinade Native positions and other native stake accounts in your wallet)
* Liquid staking (mSOL)

If you do not want to accept the Instant Unstake quote, you can always choose [**Delayed Unstake**](/marinade-protocol/protocol-overview/marinade-liquid/what-is-msol.md#delayed-unstake) instead.

***

## Instant Unstake vs Delayed Unstake

When you exit a Marinade position, you generally have two choices:

* Instant Unstake – Get SOL back immediately in a single transaction.
  * For native staking (Marinade Native positions and other native stake accounts in your wallet), this uses a marketplace of liquidity providers who take over your stake and send SOL back.
  * For liquid staking (mSOL), this is executed as a swap from mSOL to SOL via DEX at the current market rate.
* Delayed Unstake - Use the standard Solana unlock.
  * Your position is scheduled to deactivate at the next epoch boundary for both Native and Liquid.
    * After one epoch, your SOL becomes claimable in the app, and you must come back to claim it.
    * This avoids market price impact. Delayed unstake is free for Marinade Native, Marinade Select, and Custom Reward Tokens. Marinade Liquid (mSOL) delayed unstake carries a 0.2% fee. (see the FAQ for up-to date [fee details](/marinade-protocol/faq.md)).

If you do not like the Instant Unstake quote (the estimated SOL you’ll receive), you can simply switch to Delayed Unstake and use the one-epoch flow instead.

***

## How Instant Unstake Works

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FXiiSuPZZTio7TvsVJYft%2Fimage.png?alt=media&amp;token=cfb86d27-a515-47e4-8348-5352789a1364" alt="" width="435"><figcaption></figcaption></figure>

* Start an unstake from the Marinade app and choose **Instant**.
* The app requests a **real-time quote** to give you SOL now:
  * For **native stake**, your request goes to a **marketplace of liquidity providers**.
  * For **mSOL**, your route is built via **Jupiter** across one or more DEXes.
* Marinade shows you the **best quote received**.
* You **review the estimated SOL** you will receive and approve the transaction in your wallet if you’re happy with it.
* Once the transaction confirms, you **receive SOL immediately**.

***

## Upcoming: Limit Order Style Instant Unstake (Planned)

Marinade is planning a “limit order style” Instant Unstake mode to give you more control over the quotes you accept.

The current design idea (subject to change):

* You specify a minimum acceptable rate or a target amount of SOL you want to receive.
* Your Instant Unstake request is only executed if liquidity providers can meet or beat that target.
* If no provider is willing to fill at your level:
  * The order may remain unfilled, and
  * You can either adjust your target or use Delayed Unstake instead.

This feature is planned and details (such as UI, supported assets, and exact behavior) may change. When it launches, this article will be updated with final steps and examples.

***

## Things To Keep In Mind

* You can always switch to Delayed Unstake if you do not like the Instant Unstake quote.
* Instant = SOL now, based on LP / DEX quotes and market conditions, with no extra Marinade protocol fee currently added.
* Delayed = SOL after one epoch, you must come back to claim. No Marinade fee for Native, Select, or Custom Reward Tokens. Marinade Liquid (mSOL) carries a 0.2% fee.
* Instant Unstake works for both native stake (via a liquidity provider marketplace) and mSOL (via Jupiter).


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/protocol-overview/marinade-instant-unstake.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
