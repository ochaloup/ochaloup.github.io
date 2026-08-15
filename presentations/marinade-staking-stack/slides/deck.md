<!-- .slide: data-background-image="images/brand-art/p-liquidity.jpg" class="cover art vcenter" -->

<div class="lockup"><img src="images/marinade-white.svg" alt="">Marinade</div>

# Inside Marinade's staking stack

## Building staking infrastructure on <span class="accent">Solana</span>

<div class="logo-row">
<img src="images/solana-logo.svg" alt="Solana">
</div>

<span class="note">Ondra Chaloupka</span>

Note:
The programme still carries the submitted title, "The Marinade Recipe: Building Staking
Infrastructure on Solana". The deck drops it: "Recipes" is a live Marinade product and
the collision would cost the first minute. The subtitle is unchanged, so the room can
still match this slide to the programme line. Conference name deliberately absent.

---

## What we are going to cook through

<!-- Lucide "square-terminal" geometry, with its second-line underscore replaced by a
     filled block cursor. Inlined so currentColor picks up the theme. The frame is what
     makes it read as an object rather than two marks. -->
<svg class="slide-icon wash" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
<path d="m7 11 2-2-2-2"/>
<rect class="cursor" x="10.8" y="7.3" width="3.6" height="3.4" rx="0.3" fill="currentColor" stroke="none"/>
</svg>

<!-- Must be a div, not a span: markdown wraps a bare span in a <p>, and that <p>
     then becomes the containing block, breaking the absolute pinning.
     Hat only, no wordmark: the cover already showed the full lockup. -->
<div class="brand-mark"><img src="images/marinade-white.svg" alt="Marinade"></div>

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
<li>Contributor to Realms, and author of its <a href="https://www.youtube.com/watch?v=2lzzbyWYIpc">SPL Governance deep dive</a>
<img class="bio-icon" src="images/logos/realms.png" alt=""></li>
</ul>
</div>
</div>

Note:
The distributed systems line is deliberately past tense. It is the honest version,
it explains how I got here rather than claiming an active practice.

---

<!-- .slide: data-background-image="images/brand-art/p-rewards.jpg" class="cover art vcenter statement" data-stage="stake" -->

# Liquid staking

Note:
Section break. The question left open by the bio slide is "so what does this stack
actually do", and the answer starts with the product that came first.

---

<!-- .slide: data-stage="stake" -->

## You all know what an LST is

<div class="grid-3">
<div class="card">
<h3>You hand over SOL</h3>
<p>The protocol takes it. Only you can ask for your share back.</p>
</div>
<div class="card">
<h3><svg class="inline-icon" viewBox="0 0 24 24" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>An on-chain program holds it</h3>
<p>Marinade delegates it, and keeps delegating it well.</p>
</div>
<div class="card">
<h3>You hold <span class="token">mSOL</span></h3>
<p>Liquidity you can use across DeFi.</p>
</div>
</div>

<p class="slide-foot">First liquid staking protocol on Solana. 2021, out of two hackathon teams.</p>

Note:
Fast, everybody knows this. What to say over the top: the protocol takes ownership
of your SOL as a whole, and it is wired in that only you can ask your portion back.
Meanwhile we manage that stake to collect staking rewards and other on-chain
rewards, so the SOL you put in is worth more. And you are holding mSOL the whole
time, free to use it in DeFi.
The words that matter later are ON-CHAIN PROGRAM. Say them deliberately.
Leaves the question: fine, but somebody has to decide where all that stake goes.

---

<!-- .slide: class="center-text" -->
<!-- No data-stage on purpose: the journey rail would clutter the joke. -->

## You staked.

<img class="figure" src="images/now-what.jpg" alt="">

<p class="punch">Now what?</p>

Note:
The playful beat. You handed over your SOL, the token is in your wallet, and the
money is supposed to start rolling in. Land the joke, let it breathe, then turn.
The answer is not magic, it is machinery, and that is the next slide.
Leaves the question: so what is actually happening while I do nothing?

---

<!-- .slide: data-stage="stake" -->

<div class="gears" aria-hidden="true">
<svg class="gear gear-a" style="width:430px;height:430px;top:40px;left:100px" viewBox="0 0 24 24"><path d="M11 10.27 7 3.34"/><path d="m11 13.73-4 6.93"/><path d="M12 22v-2"/><path d="M12 2v2"/><path d="M14 12h8"/><path d="m17 20.66-1-1.73"/><path d="m17 3.34-1 1.73"/><path d="M2 12h2"/><path d="m20.66 17-1.73-1"/><path d="m20.66 7-1.73 1"/><path d="m3.34 17 1.73-1"/><path d="m3.34 7 1.73 1"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="12" r="8"/></svg>
<svg class="gear gear-b" style="width:310px;height:310px;top:400px;left:420px" viewBox="0 0 24 24"><path d="M11 10.27 7 3.34"/><path d="m11 13.73-4 6.93"/><path d="M12 22v-2"/><path d="M12 2v2"/><path d="M14 12h8"/><path d="m17 20.66-1-1.73"/><path d="m17 3.34-1 1.73"/><path d="M2 12h2"/><path d="m20.66 17-1.73-1"/><path d="m20.66 7-1.73 1"/><path d="m3.34 17 1.73-1"/><path d="m3.34 7 1.73 1"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="12" r="8"/></svg>
<svg class="gear gear-c" style="width:230px;height:230px;top:120px;left:480px" viewBox="0 0 24 24"><path d="M11 10.27 7 3.34"/><path d="m11 13.73-4 6.93"/><path d="M12 22v-2"/><path d="M12 2v2"/><path d="M14 12h8"/><path d="m17 20.66-1-1.73"/><path d="m17 3.34-1 1.73"/><path d="M2 12h2"/><path d="m20.66 17-1.73-1"/><path d="m20.66 7-1.73 1"/><path d="m3.34 17 1.73-1"/><path d="m3.34 7 1.73 1"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="12" r="8"/></svg>
</div>

## Somebody has to choose the validators

<div class="grid-3">
<div class="card">
<h3>Watch</h3>
<p>Every validator on Solana, every epoch.</p>
</div>
<div class="card">
<h3>Judge</h3>
<p>Who pays best, who stays up, who keeps the network spread out.</p>
</div>
<div class="card">
<h3>Move</h3>
<p>Stake follows the answer.</p>
</div>
</div>

<p class="slide-foot">A validator worth staking last epoch may not be worth it in this one.</p>

Note:
THE MESSAGE: Marinade runs machinery that collects data off Solana, works out where
the best yield and the better decentralisation actually are, and moves stake there.
Not "a choice exists", but "we built the thing that makes the choice, continuously".
What we collect: uptime, vote credits, commission, MEV, where they run.
The validator manager is the authority that writes the answer on chain. One key,
ValidatorSystem.manager_authority. It adds and removes validators, sets scores, and
holds the emergency levers. The code sometimes names the parameter
validator_manager_authority, but it is the same key.
[TODO] Ondra wants a picture that says "this is not easy". The pantry painting is a
placeholder for that, a lone cook managing an enormous store. Replace if a better
meme turns up.
NEVER name a competitor on a slide. The difference is worth two sentences ON STAGE
only: most pools have a single staker key that names the validator set and can move
any amount of stake at any time. We put scoring and a per-epoch movement cap in the
program instead.
Do NOT mention the auction yet. That is the next slide.
Leaves the question: so who actually turns all this, and how often?

---

<!-- .slide: data-stage="stake" -->

## Anyone can turn the crank

<div class="steps">
<div><div class="step-num">1</div><h3>Update</h3>Book rewards. <span class="token">mSOL</span> gets worth more.</div>
<div><div class="step-num">2</div>
<div class="split">
<div><h3>Stake</h3>Reserve out to validators.</div>
<div><h3>Unstake</h3>Validators back to reserve.</div>
</div>
</div>
<div><div class="step-num">3</div><h3>Merge</h3>Fewer stake accounts.</div>
<div><div class="step-num">4</div><h3>Repeat</h3>Every epoch. Forever.</div>
</div>

<p class="slide-foot">Nobody needs permission for any of this. Only Marinade writes the scores.</p>

Note:
Precision matters here. update, merge and stake_reserve need no authority at all,
the signer on some of them is only a rent payer. add_validator, remove_validator
and set_validator_score are gated on manager_authority.
The line to say out loud: if Marinade disappeared tomorrow, the price would keep
updating and you could still unstake, because anyone can turn those cranks. What
would stop is the scores. Your money stays safe and liquid, it just stops getting
smarter.
THE HARD PART, and this is the bit to spend time on out loud rather than in
bullets. A validator goes down, or quietly raises its commission against our
stakers. The obvious move is to pull the stake immediately. We cannot. Solana never
enabled redelegation, so stake cannot move sideways. It has to be deactivated,
sit idle earning nothing for an epoch, land back in the reserve, and only then be
delegated somewhere else and warm up again.
So every rebalance is a trade: the yield lost while the stake is idle against the
yield lost by leaving it where it is. Reacting instantly to every wobble would cost
the stakers more than the wobble does. That is the engineering problem, and it is
why the auction emits priorities rather than just a target.
If asked "so you can do whatever you like with my stake?": no, not in one epoch.
max_stake_moved_per_epoch is a percentage of everything under control, enforced by
the program, reset each epoch. The policy is ours, the program bounds how fast we
can apply it. Caveat honestly if pushed: that assumes the program is correct.
Leaves the question: so who does get the stake, and on what basis?

---

<!-- .slide: data-stage="bond" -->

## Validators put up collateral

<div class="columns">
<div class="card">
<h3>Before any stake arrives</h3>
<p>To take Marinade stake, a validator funds a bond on chain.</p>
</div>
<div class="card">
<h3>Protected Staking Rewards</h3>
<p>Down means no votes. No votes means no rewards. The bond covers the gap.</p>
</div>
</div>

<p class="slide-foot">Solana has no way for a validator to pay you a share of its priority fees. So how do we get you more than the protocol pays?</p>

Note:
Say "slash" ONCE here, then correct it immediately: on Solana slashing means the
protocol destroys staked principal. We cannot do that and do not. We take from a
bond the validator posted, to cover rewards you did not get. Principal is never
touched. Then drop back to "the bond covers the loss".
We have to be good to validators too. The bond is not a punishment beating, it is
the thing that lets us promise stakers a floor without asking anyone to trust us.
The foot line is the setup. SIMD-0096 sent 100% of priority fees to validators.
SIMD-0123 will let them share block rewards in protocol, passed governance March
2025, not live yet. Until then there is no native path, so we built one.
Leaves the question: so how DO you get me more?

---

<!-- .slide: data-stage="auction" -->

## Validators bid for your stake

<div class="steps">
<div><div class="step-num">1</div><h3>Bid</h3>A validator offers a share of its rewards.</div>
<div><div class="step-num">2</div><h3>Allocate</h3>Highest first, until the stake runs out.</div>
<div><div class="step-num">3</div><h3>Clear</h3>The last winner in sets the price.</div>
</div>

<p class="slide-foot">Everyone who wins is paid that same clearing rate, not their own bid. Inflation and MEV come from Solana. This is the third thing you earn.</p>

Note:
Deliberately NOT a mechanism deep-dive. The previous deck did last-price for a
SAM-literate room; this one is not that room.
The fairness point is the one sentence worth making: bidding aggressively does not
punish you, because you are paid the clearing price, not your own number. That keeps
the auction honest and stops a race to the bottom.
The yield decomposition is real, it is the RevShare struct:
totalPmpe = inflationPmpe + mevPmpe + bidPmpe. Say it, do not slide it.
Leaves the question: a bid is a promise. How does a promise become money in my
wallet?

---

<!-- .slide: data-stage="settle" -->

## From promise to payment

<div class="steps">
<div><div class="step-num">1</div><h3>Measure</h3>End of epoch, read what actually happened.</div>
<div><div class="step-num">2</div><h3>Calculate</h3>What each validator owes, bids and PSR.</div>
<div><div class="step-num">3</div><h3>Settle</h3>Written on chain, out of the bonds.</div>
<div><div class="step-num">4</div><h3>Claim</h3>Permissionless. Nobody needs us to release it.</div>
</div>

<p class="slide-foot">Every epoch, for every validator, whether anyone is watching or not.</p>

Note:
Deliberately light. No six-stage pipeline diagram, no merkle-tree detail unless
somebody asks. The point is the shape: measured, calculated, settled on chain, and
claimable by anyone.
If asked how: snapshot the chain state, a distribution CLI computes the settlement,
merkle trees go on chain, claims are made against them.
Leaves the question, and it opens the next section: all of this is an ON-CHAIN
PROGRAM holding your SOL. What if you do not want a program at all?

---

<!-- .slide: data-background-image="images/brand-art/p-manage.jpg" class="cover art vcenter" -->

<div class="lockup"><img src="images/marinade-white.svg" alt="">Marinade</div>

# Stake it till you <span class="accent">make</span> it

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
Closing line. It is a generic pun on "fake it till you make it", widely used and
owned by nobody, so no attribution is needed. See the README naming section.
