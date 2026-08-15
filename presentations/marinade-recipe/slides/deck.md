<!-- .slide: data-background-image="images/brand-art/p-liquidity.jpg" class="cover art vcenter" -->

<span class="lockup"><img src="images/marinade-white.svg" alt="">Marinade</span>

# The Marinade Recipe

## Building staking infrastructure on <span class="accent">Solana</span>

<div class="logo-row">
<img src="images/solana-logo.svg" alt="Solana">
</div>

<span class="note">Ondra Chaloupka</span>

Note:
Title is the one submitted to the organizers. Locked, do not renegotiate it.
Conference name deliberately absent, the audience knows where they are.

---

## What we are going to cook through

<!-- Lucide "square-terminal" geometry, with its second-line underscore replaced by a
     filled block cursor. Inlined so currentColor picks up the theme. The frame is what
     makes it read as an object rather than two marks. -->
<svg class="slide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
<path d="m7 11 2-2-2-2"/>
<rect class="cursor" x="10.8" y="7.3" width="3.6" height="3.4" rx="0.3" fill="currentColor" stroke="none"/>
</svg>

<div class="agenda">
<div>
<span class="agenda-name">Liquid staking</span>
<span class="agenda-shout">The original Solana LST</span>
</div>
<div>
<span class="agenda-name">Native staking</span>
<span class="agenda-shout">Keep custody. No program ever holds your SOL.</span>
<!-- Parked: the three strategies crowd the agenda and land better inside the Native
     section, where the room has context. Reuse this block for a strategies slide there,
     and spend the $BONK line as a surprise rather than a bullet.
<ul class="agenda-sub">
<li><strong>Max Yield</strong> 100+ validators bidding for your stake</li>
<li><strong>Select</strong> Verified identity, zero tolerance for malicious MEV</li>
<li><strong>Recipes</strong> Stake SOL, get paid in <span class="accent">$BONK</span></li>
</ul>
-->
</div>
<div>
<span class="agenda-name">Instant unstake</span>
<span class="agenda-shout">Skip the two day wait</span>
</div>
</div>

Note:
Three products, nothing more. The Native strategies are parked in a comment in this
file and belong in the Native section, where the room has context for them.
Do not read the shout-outs out loud, they are there to be scanned.

---

## Who talks to you

<div class="bio">
<img class="bio-avatar" src="images/helmet.jpg" alt="">
<div>
<p class="bio-name">Ondra Chaloupka <span class="bio-handle"><a href="https://x.com/_chalda">@_chalda</a></span></p>
<ul>
<li><strong>Backend developer</strong> at <a href="https://marinade.finance">Marinade</a>
<img class="bio-icon" src="images/marinade-white.svg" alt="">
<img class="bio-icon" src="images/solana-logo.svg" alt=""></li>
<li>Before that, <a href="https://jbossts.blogspot.com/2018/01/narayana-periodic-recovery-of-xa.html">Java engineer</a> at Red Hat
<img class="bio-icon" src="images/logos/redhat.svg" alt=""></li>
<li>Came for distributed systems, <a href="https://blog.chalda.cz/">stayed for Solana</a></li>
<li>Contributor to Realms, and author of its <a href="https://docs.realms.today/developer-resources/spl-governance">SPL Governance deep dive</a>
<img class="bio-icon" src="images/logos/realms.png" alt=""></li>
</ul>
</div>
</div>

Note:
The distributed systems line is deliberately past tense. It is the honest version,
it explains how I got here rather than claiming an active practice.

---

## What Marinade actually runs

<div class="columns">
<div class="card">
<h3>A market, not a pool</h3>
<p>Validators bid for delegated SOL. A higher stake earns them more, so they share part of it back. Stakers capture yield that plain delegation does not pay.</p>
</div>
<div class="card">
<h3>Judged every epoch</h3>
<p>We score validator behaviour continuously, find the honest performers, and move stake to them. For as long as Solana keeps running.</p>
</div>
</div>

<p class="note">Stakers pay no fee. Validators pay, because validators are the ones buying something.</p>

Note:
Technical framing, not a pitch. The point is that we operate a market and a
scoring pipeline, not that we are great.
[TODO] Optional aside: we also supply validator data to the Foundation.
Confirm the program name before saying it, see README.

---

<!-- .slide: data-background-image="images/brand-art/p-rewards.jpg" class="cover art vcenter statement" -->

# A product

Note:
Big separator. The three product sections follow.

---

<!-- .slide: data-stage="stake" -->

## What one click actually starts

<div class="flow">
<div>Wallet</div>
<div>Transaction API</div>
<div>Stake account</div>
<div>Validator</div>
</div>

<span class="note">[TODO] Confirm which pieces are public before naming services.</span>

Note:
Keep it at four boxes. The detail arrives later, this is the map.

---

<!-- .slide: data-stage="stake" -->

## Two shapes of staking

<div class="columns">
<div class="card">
<h3>Marinade Native</h3>
<p>Self-custodial. The stake account stays in the user's wallet. Marinade only decides delegation.</p>
</div>
<div class="card">
<h3>Marinade Liquid</h3>
<p>Deposit SOL, receive mSOL. A liquid token usable across DeFi while it earns.</p>
</div>
</div>

<p class="note">Different custody, same delegation brain underneath.</p>

Note:
The last line is the transition into SAM.

---

<!-- .slide: class="vcenter statement art" data-stage="auction" data-background-image="images/brand-art/p-rewards.jpg" -->

<span class="label">Section</span>

## Where does the stake go?

---

<!-- .slide: data-stage="auction" -->

## Stake Auction Marketplace

<div class="steps">
<div><div class="step-num">1</div><h3>Bid</h3>Validators commit to a share of rewards.</div>
<div><div class="step-num">2</div><h3>Clear</h3>The auction runs once per epoch.</div>
<div><div class="step-num">3</div><h3>Delegate</h3>Stake moves to the winners.</div>
<div><div class="step-num">4</div><h3>Settle</h3>Bids are paid out from bonds.</div>
</div>

Note:
Expand the acronym out loud on first use. Stake Auction Marketplace, SAM from here on.

---

<!-- .slide: data-stage="auction" -->

## Last price, not your price

<span class="note">[TODO] Deep dive 1. One diagram. Reuse the auction slides from the
January 2026 DS SAM deck, they already explain this well.</span>

Note:
Chosen deep dive. Budget three to four minutes. Watch the non-technical half of the room.

---

<!-- .slide: class="vcenter statement art" data-stage="bond" data-background-image="images/brand-art/p-security.jpg" -->

<span class="label">Section</span>

## What if the validator misbehaves?

---

<!-- .slide: data-stage="bond" -->

## The bond makes the promise real

<div class="columns">
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

<!-- .slide: data-stage="settle" -->

## One epoch, one settlement

<span class="note">[TODO] Deep dive 2. Merkle trees, generated per epoch, claimed on-chain.
Compress the settlement pipeline and snapshot parsing into a single diagram.</span>

Note:
Chosen deep dive. This is where the off-chain half of the stack first becomes visible.

---

<!-- .slide: class="vcenter statement" data-stage="exit" -->

<span class="label">Section</span>

## Getting out

---

<!-- .slide: data-stage="exit" -->

## Instant Unstake

<div class="flow">
<div>User requests exit</div>
<div>RFQ auction</div>
<div>Liquidity provider takes the stake</div>
<div>SOL back in the wallet</div>
</div>

<p class="note">A second auction, and no conversion to a liquid token.</p>

Note:
Nice symmetry with SAM. Keep it short, the audience already understands auctions by now.

---

<!-- .slide: class="vcenter statement art" data-stage="all" data-background-image="images/brand-art/p-manage.jpg" -->

<span class="label">Section</span>

## The half nobody puts in a pitch deck

---

<!-- .slide: data-stage="all" -->

## The epoch is the heartbeat

<div class="timeline">
<div><span class="when">Epoch start</span>[TODO]</div>
<div><span class="when">Mid epoch</span>[TODO]</div>
<div><span class="when">Epoch end</span>[TODO]</div>
<div><span class="when">Next epoch</span>[TODO]</div>
</div>

<span class="note">[TODO] Confirm publicly sayable detail before filling this in.</span>

Note:
This is the differentiating slide. Almost no staking talk shows the cadence.

---

<!-- .slide: class="compact" data-stage="all" -->

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

<div class="grid-3">
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

<!-- .slide: data-background-image="images/brand-art/p-manage.jpg" class="cover art vcenter" -->

<span class="lockup"><img src="images/marinade-white.svg" alt="">Marinade</span>

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
