<!-- .slide: data-background="images/brand-backgrounds/deep-teal-solid.png" class="cover vcenter" -->

<img class="watermark" src="images/marinade-white.svg" alt="">

# Staking is the easy part

## Everything that happens after you click stake

<div class="logo-row">
<img src="images/marinade-white.svg" alt="Marinade">
<img src="images/solana-logo.svg" alt="Solana">
</div>

<span class="note">Ondra Chaloupka · Solana Summit Serbia · Belgrade, 26 August 2026</span>

Note:
Title is a placeholder. Submitted title is "The Marinade Recipe: Building Staking
Infrastructure on Solana". Decide once the content is settled, see ../README.md.

---

<!-- .slide: class="vcenter statement" -->

<span class="label">Warm-up</span>

## Who deployed the first liquid staking program on Solana mainnet?

<div class="grid-3" style="margin-top:56px">
<div class="card">Jito</div>
<div class="card">Lido</div>
<div class="card">Marinade</div>
</div>

Note:
Show of hands. One beat only, do not let this run long. Answer on the next slide.

---

<!-- .slide: class="vcenter statement" -->

<span class="label">Answer</span>

## Marinade. 2021, out of the Solana x Serum DeFi hackathon.

<span class="note">The first non-custodial liquid staking token on Solana.</span>

Note:
Hackathon origin lands well here, this summit runs its own Demo Day.
Do not turn this into a company history slide. Move on.

---

<!-- .slide: class="vcenter statement" -->

<span class="label">The point</span>

## Staking one SOL is a click.<br>Deciding where it goes is a system.

Note:
This is the thesis. Everything after this slide defends it.

---

## What one click actually starts

<div class="flow" style="margin-top:72px">
<div>Wallet</div>
<div>Transaction API</div>
<div>Stake account</div>
<div>Validator</div>
</div>

<span class="note">[TODO] Confirm which pieces are public before naming services.</span>

Note:
Keep it at four boxes. The detail arrives later, this is the map.

---

## Two shapes of staking

<div class="columns" style="margin-top:56px">
<div class="card">
<h3>Marinade Native</h3>
<p>Self-custodial. The stake account stays in the user's wallet. Marinade only decides delegation.</p>
</div>
<div class="card">
<h3>Marinade Liquid</h3>
<p>Deposit SOL, receive mSOL. A liquid token usable across DeFi while it earns.</p>
</div>
</div>

<p class="note" style="margin-top:48px">Different custody, same delegation brain underneath.</p>

Note:
The last line is the transition into SAM.

---

<!-- .slide: class="vcenter statement" -->

<span class="label">Section</span>

## Where does the stake go?

---

## Stake Auction Marketplace

<div class="steps" style="margin-top:64px">
<div><div class="step-num">1</div><h3>Bid</h3>Validators commit to a share of rewards.</div>
<div><div class="step-num">2</div><h3>Clear</h3>The auction runs once per epoch.</div>
<div><div class="step-num">3</div><h3>Delegate</h3>Stake moves to the winners.</div>
<div><div class="step-num">4</div><h3>Settle</h3>Bids are paid out from bonds.</div>
</div>

Note:
Expand the acronym out loud on first use. Stake Auction Marketplace, SAM from here on.

---

## Last price, not your price

<span class="note">[TODO] Deep dive 1. One diagram. Reuse the auction slides from the
January 2026 DS SAM deck, they already explain this well.</span>

Note:
Chosen deep dive. Budget three to four minutes. Watch the non-technical half of the room.

---

<!-- .slide: class="vcenter statement" -->

<span class="label">Section</span>

## What if the validator misbehaves?

---

## The bond makes the promise real

<div class="columns" style="margin-top:56px">
<div class="card">
<h3>Validator Bonds</h3>
<p>On-chain escrow. Collateral you can read from an account, not a promise in a term sheet.</p>
</div>
<div class="card">
<h3>Protected Staking Rewards</h3>
<p>If the validator underperforms or raises fees, the bond absorbs the loss.</p>
</div>
</div>

Note:
Expand PSR on first use. This is the accountability half of the story.

---

## One epoch, one settlement

<span class="note">[TODO] Deep dive 2. Merkle trees, generated per epoch, claimed on-chain.
Compress the settlement pipeline and snapshot parsing into a single diagram.</span>

Note:
Chosen deep dive. This is where the off-chain half of the stack first becomes visible.

---

<!-- .slide: class="vcenter statement" -->

<span class="label">Section</span>

## Getting out

---

## Instant Unstake

<div class="flow" style="margin-top:72px">
<div>User requests exit</div>
<div>RFQ auction</div>
<div>Liquidity provider takes the stake</div>
<div>SOL back in the wallet</div>
</div>

<p class="note" style="margin-top:48px">A second auction, and no conversion to a liquid token.</p>

Note:
Nice symmetry with SAM. Keep it short, the audience already understands auctions by now.

---

<!-- .slide: class="vcenter statement" -->

<span class="label">Section</span>

## The half nobody puts in a pitch deck

---

## The epoch is the heartbeat

<div class="timeline" style="margin-top:64px">
<div><span class="when">Epoch start</span>[TODO]</div>
<div><span class="when">Mid epoch</span>[TODO]</div>
<div><span class="when">Epoch end</span>[TODO]</div>
<div><span class="when">Next epoch</span>[TODO]</div>
</div>

<span class="note">[TODO] Confirm publicly sayable detail before filling this in.</span>

Note:
This is the differentiating slide. Almost no staking talk shows the cadence.

---

<!-- .slide: class="compact" -->

## What runs between the clicks

<span class="note">[TODO] Service categories only, no internal counts or infrastructure
specifics until cleared. See the confidentiality section in ../README.md.</span>

Note:
Resist listing everything. Three or four categories, not a catalogue.

---

<!-- .slide: class="vcenter statement" -->

<span class="label">Section</span>

## What I would take away

---

## Three things that transfer

<div class="grid-3" style="margin-top:56px">
<div class="card">
<h3>Decide off-chain, enforce on-chain</h3>
<p>An auction over hundreds of validators does not belong in a program. The proof of it does.</p>
</div>
<div class="card">
<h3>Pick a heartbeat</h3>
<p>The epoch schedules almost every service in the stack. One clock, fewer surprises.</p>
</div>
<div class="card">
<h3>Turn promises into numbers</h3>
<p>A bond is an account you can read. That makes the rules enforceable.</p>
</div>
</div>

---

<!-- .slide: data-background="images/brand-backgrounds/deep-teal-solid.png" class="cover vcenter" -->

<img class="watermark" src="images/marinade-white.svg" alt="">

# Thank you

<div class="columns" style="margin-top:32px">
<div>

[github.com/marinade-finance](https://github.com/marinade-finance)<br>
[docs.marinade.finance](https://docs.marinade.finance)

</div>
<div>

<span class="note">[TODO] QR code to the repo list.</span>

</div>
</div>

Note:
Pay off the title here. The click was the easy part.
