# Products, shout-outs, and how Marinade positions itself

Source material for the agenda slide (slide 2) and the Marinade slide (slide 4). All quotes are
lifted from marinade.finance, retrieved 2026-08-12. Original pages are saved under
`resources/marinade-finance-pages/`.

## The full product list

Longer than the three you named. Three are the talk, the rest are context.

| Product | What it is | In the talk? |
|---|---|---|
| **Marinade Liquid** | mSOL, the original Solana LST | Yes, section 1 |
| **Marinade Native** | Self-custodial staking, no token, no program holding funds | Yes, section 2 |
| **Instant Unstake** | Exit a stake account immediately, atomic swap for SOL | Yes, section 3 |
| **Marinade Max Yield** | Native strategy. Auto-delegation to SAM winners, "100+ bidding validators" | Inside Native |
| **Marinade Select** | Native strategy. KYB-verified, MEV-free validators, institutional | Inside Native |
| **Marinade Recipes** | Native strategy. Stake SOL, get paid in a different token | Inside Native |
| **USDC Vault** | Deposit USDC, earn yield. Not staking. Not live yet, email capture only | Mention at most |
| **Marinade Borrow** | Stablecoin loans against staked SOL. Early access | Mention at most |
| **Staking Rewards Report** | Exportable rewards summary for audits and tax | Probably skip |

So the honest structure is **three products, and Native has three strategies underneath it.**
That is a cleaner agenda than a flat list of six.

## Shout-outs for the agenda slide, taken from the site

Straight quotes, so they are safe to use and sound like the brand.

- **Liquid Staking** — "The original Solana LST"
- **Native Staking** — "Keep full custody. No smart contract risk."
  (site phrasing: "Marinade Native avoids smart contract risk required by liquid staking tokens")
- **Instant Unstake** — "Skip the 2-day wait"
  (alternative, more playful: "Stuck with Native stake? Unstake from anywhere.")

### The degen one you asked for

**Marinade Recipes** is the degen product and it is not subtle. The page headline is
"Stake SOL, earn" followed by a rotating token list:

> $USDG · $ZBTC · $MNDE · $BONK · $FWOG · $NOBODY · $TRENCHER · $USDC

"Stake SOL, earn $BONK" is a real, on-brand, first-party line. $FWOG, $NOBODY and $TRENCHER are
memecoins, and Marinade ships them as payout rails. If the deck wants one genuinely playful beat
that is still factually a product, this is it. It also lands well right after the very
institutional Select material, as a deliberate tonal snap.

Note the earlier working doc said Recipes pays out "USDG today". That is now out of date. The
list is much longer, and much more degen.

## Slide 4, the Marinade slide

You asked for technical framing, not branding. The site gives a genuinely technical answer to
both of the questions that slide needs to answer.

### Why anyone gets more yield through Marinade

> "Validators bid for delegated SOL. Since a higher stake improves a validator's rewards and
> priority fees, they share part of that value back with the stakers. This mechanism allows
> Marinade users to capture additional yield that other staking setups do not provide."

Plus continuous rebalancing so stake keeps moving to the top performers. That is exactly your
framing: we sit between validators who want stake and stakers who want yield, and we run the
market that clears between them.

### The fee model, which is a good one-liner

> "Marinade does not charge users a management fee for any of its products... Instead,
> validators pay a small percentage of the staking rewards they earn by using Marinade's
> platform to access available SOL."

Stakers pay nothing. The validators pay, because they are the ones buying something.

### PSR, with real numbers

> "Validators that partner with Marinade sign an on-chain bond requiring them to cover 100% of
> rewards lost when uptime falls between 50% and 99%. Validators that raise their commission
> during an epoch are also required to cover the loss through their bond (known as commission
> rugging)."

"Commission rugging" is the site's own word. Usable, and it is fun.

### Institutional proof, if a credibility line is wanted

Custodians BitGo, Zodia Custody, Copper. Bitwise uses Marinade for its Solana ETP, ticker BSOL.
Named in Canary Capital ETF filings as staking infrastructure partner. Fireblocks and Anchorage
connect via Reown. Treasury manager VisionSys.

One sentence maximum. This is a technical talk, not a sales deck.

## The technical reason Native staking can exist at all

This is the best find of the session for the Native section, and it is Marinade's own words:

> "Solana wallets separate permissions for staking into two controls: 'withdraw authority'
> (which allows funds to be withdrawn) and 'stake authority' (which delegates tokens to a
> validator). With Marinade Native, the institution always keeps withdraw authority, so the SOL
> never leaves custody. Marinade's software only uses the staking authority to delegate to
> top-performing validators."

Your framing was "native staking came from a fear of on-chain program code". The mechanism that
makes it *possible* to answer that fear is Solana's split of stake authority from withdraw
authority. Marinade holds one and never the other.

That is a strong why-first opening for the Native section: **the product exists because Solana's
account model happens to let you delegate without custody.** No program holds the funds, so there
is no program to be afraid of. Then the cost of that choice is the whole off-chain backend, which
is your next beat.

There is also a clean black-swan line:

> "In a worst-case scenario, you can reclaim your SOL directly through the Solana client without
> relying on Marinade."

## Instant Unstake mechanics, from the product page

Enough to sketch the section. Deeper code research still pending.

- Works on **any** stake account, including ones never delegated through Marinade.
  "Select any active stake account, even if it wasn't delegated through Marinade."
- Auto-detects all natively staked SOL across any validator.
- The core mechanic, quoted:
  > "When you confirm an Instant Unstake, your stake account transfers to a buyer who provides
  > SOL in the same transaction. It's an atomic exchange, both sides execute simultaneously or
  > not at all."
- Skips the roughly two-day deactivation wait.
- No partial fills.
- No fee charged for unstaking.
- No liquid token involved.

So it is an **atomic OTC swap: your stake account for someone else's SOL, in one transaction.**
The auction you remembered is the price discovery that finds the buyer. Atomicity is what makes
it safe, and that is the part worth a diagram.

## Sources

| File | Page |
|---|---|
| `resources/marinade-finance-pages/liquid-staking.html` | marinade.finance/liquid-staking |
| `resources/marinade-finance-pages/native-staking.html` | marinade.finance/native-staking, includes the full FAQ quoted above |
| `resources/marinade-finance-pages/instant-unstake.html` | marinade.finance/features/instant-unstake |
| `resources/marinade-finance-pages/marinade-recipes.html` | marinade.finance/features/marinade-recipes |
| `resources/marinade-finance-pages/marinade-select.html` | marinade.finance/native-staking/marinade-select |
| `resources/marinade-finance-pages/marinade-max-yield.html` | marinade.finance/native-staking/marinade-max-yield |
| `resources/marinade-finance-pages/usdc-vault.html` | marinade.finance/usdc-vault |
| `resources/marinade-finance-pages/psr.html` | marinade.finance/how-it-works/psr |
| `resources/marinade-finance-pages/institutions.html` | marinade.finance/institutions |
| `resources/marinade-finance-hero.png` | Homepage hero, cover slide reference |

## Open question for you

The agenda slide currently plans three products. Do Select and Recipes get their own agenda
lines, or stay nested under Native? Nesting is more honest to the architecture. Listing them
flat makes the agenda look richer and lets the $BONK line appear early, which is a good hook.
