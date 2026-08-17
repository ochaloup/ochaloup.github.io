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

<!-- .slide: data-stage="stake" -->

## A stake account cannot move sideways

<div class="cycle">
<svg viewBox="0 0 1000 460" aria-hidden="true">
<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#308D8A"/></marker></defs>
<g fill="none" stroke="#308D8A" stroke-width="2" marker-end="url(#ah)">
<path d="M623.1 51.4 A360 190 0 0 1 838.4 165.0"/>
<path d="M838.4 295.0 A360 190 0 0 1 623.1 408.6"/>
<path d="M376.9 408.6 A360 190 0 0 1 161.6 295.0"/>
<path d="M161.6 165.0 A360 190 0 0 1 376.9 51.4"/>
</g>
</svg>
<div class="cycle-node" style="left:500px;top:40px"><h3>Active</h3><span>earning</span></div>
<div class="cycle-node" style="left:860px;top:230px"><h3>Deactivating</h3><span>still earning</span></div>
<div class="cycle-node cost" style="left:500px;top:420px"><h3>Inactive</h3><span>earning nothing</span></div>
<div class="cycle-node cost" style="left:140px;top:230px"><h3>Activating</h3><span>earning nothing</span></div>
<span class="cycle-edge" style="left:790px;top:78px">deactivate</span>
<span class="cycle-edge" style="left:790px;top:390px">epoch</span>
<span class="cycle-edge" style="left:215px;top:390px">delegate</span>
<span class="cycle-edge" style="left:215px;top:78px">epoch</span>
</div>

<p class="slide-foot">There is no arrow across the middle. Solana never enabled redelegation.</p>

Note:
Names are Solana's own: Active, Deactivating, Inactive, Activating.
THE CORRECTION WORTH KNOWING: Deactivating still earns. The stake stays effective
for that epoch. Inactive and Activating are the ones that pay nothing, and from a
rewards point of view they are the same thing. That is the yellow half of the ring.
Also: Inactive to Activating can happen in the SAME epoch. You do not wait an extra
epoch to re-delegate. So the cost is not four epochs, it is the yellow arc.
THIS IS THE SLIDE FOR THE HARD PART. A validator goes down, or quietly raises its
commission against our stakers. The obvious move is to pull the stake now. There is
no sideways. The account has to go all the way round, and half that circle pays the
staker nothing.
So every rebalance is a trade: yield lost going round, against yield lost by staying
put. React to every wobble and you cost the stakers more than the wobbles do. That
is why the auction emits priorities rather than a bare target, and why the program
caps how much can move per epoch.
Leaves the question: fine, so who is even worth moving to?

---

<!-- .slide: data-stage="bond" class="center-text" -->

<img class="figure" src="images/bond-chips.png" alt="">

<p class="punch">Validators back their word with their own SOL.</p>

Note:
One line under the picture, and it is deliberately on the validator's side. An
earlier version read "their bad days come out of the deposit", which framed
validators as the problem. They are not. They are partners who choose to put
collateral up so that we can promise stakers a floor without asking anyone to
trust us.
SAY OUT LOUD, do not slide it: this is also the setup for the auction. Solana has
no way for a validator to pay a staker a share of its priority fees, so how do we
get you more than the protocol pays?
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

<div class="ladder" aria-hidden="true">
<svg viewBox="0 0 400 300">
<rect x="8" y="30" width="22" height="250"/><rect x="40" y="48" width="22" height="232"/><rect x="72" y="66" width="22" height="214"/><rect x="104" y="82" width="22" height="198"/><rect x="136" y="100" width="22" height="180"/><rect x="168" y="118" width="22" height="162"/><rect x="200" y="134" width="22" height="146"/><rect x="232" y="152" width="22" height="128"/><rect x="264" y="170" width="22" height="110"/><rect x="296" y="186" width="22" height="94"/><rect x="328" y="204" width="22" height="76"/><rect x="360" y="220" width="22" height="60"/>
<line x1="0" y1="152" x2="400" y2="152"/>
</svg>
</div>

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

<div class="split-media">
<!-- Callback to the "You staked. Now what?" slide. Same duck, now doing the paperwork. -->
<img class="figure" src="images/settle-payout.webp" alt="">
<ol class="beats">
<li><strong>Measure</strong> End of epoch, read what happened.</li>
<li><strong>Calculate</strong> What each validator owes.</li>
<li><strong>Settle</strong> Written on chain, out of the bonds.</li>
<li><strong>Claim</strong> Bids and covered losses reach the stakers.</li>
</ol>
</div>

<p class="slide-foot">Until SIMD-0123 is live, Solana has no native way to pass priority fees to stakers.</p>

Note:
Deliberately light. No six-stage pipeline diagram, no merkle-tree detail unless
somebody asks. The point is the shape, and WHAT MOVES: the auction bids a validator
promised, and the rewards PSR covers when it underperformed. Both come out of the
same bond and end up with the staker.
Claiming is permissionless, but that is a footnote, not the headline. Say it only
if somebody asks who runs the payout.
If asked how: snapshot the chain state, a distribution CLI computes the settlement,
merkle trees go on chain, claims are made against them.
Leaves the question, and it opens the next section: all of this is an ON-CHAIN
PROGRAM holding your SOL. What if you do not want a program at all?

---

<!-- .slide: data-background-image="images/brand-art/p-security.jpg" class="cover art vcenter statement" -->

# Native staking

Note:
Section break. The question the Liquid section left open: all of that is an
ON-CHAIN PROGRAM holding your SOL. What if you do not want a program at all?

---

<!-- .slide: data-rail="native" data-stage="stake" -->

## Not everyone wants a program holding their SOL

<div class="grid-3">
<div class="card">
<h3>No contract risk</h3>
<p>The SOL never leaves your own stake account.</p>
</div>
<div class="card">
<h3>No token</h3>
<p>Nothing to hold, swap, or explain to an auditor.</p>
</div>
<div class="card">
<h3>Just the delegation</h3>
<p>Someone to pick the validators. Nothing else.</p>
</div>
</div>

<p class="slide-foot">Launched July 2023. Rewards land straight in your account each epoch, so it compounds without anyone doing anything.</p>

Note:
The why, and it is a real one. Some people are simply not comfortable with a
program custodying funds, and plenty of stakers do not want a liquid token at all.
They want the delegation managed and nothing more.
Institutions have the same requirement for a different reason: no token means
nothing to account for, and no program means a much shorter audit conversation.
Worth saying: you can always reclaim the stake authority and withdraw with the
Solana CLI, without us. That is documented publicly in the how-to-native-staking
repository.
Leaves the question: so how do you manage my stake without ever holding it?

---

<!-- .slide: data-rail="native" data-stage="stake" -->

## Solana splits the keys

```rust
pub enum StakeStateV2 {
    Uninitialized,
    Initialized(Meta),
    Stake(Meta, Stake, StakeFlags), // a delegated account
    RewardsPool,
}
```

```rust
pub struct Authorized {   // lives in Meta
    pub staker: Pubkey,     // may delegate
    pub withdrawer: Pubkey, // may take the money
}
```

<p class="slide-foot">Custody sits in Meta. Where the SOL sits is in Stake. Marinade only ever holds one field of the first.</p>

Note:
The account itself is an enum, and the variant is the state. A delegated one is
Stake(Meta, Stake, StakeFlags), and that is the whole object: Meta is custody,
Stake is delegation. The comments are mine, the fields are Solana's.
THE POINT IS STILL CUSTODY. The staker authority can delegate, split, merge and
deactivate. It cannot move a single lamport out. The withdrawer can, and the user
keeps the withdrawer, always. So "no smart contract risk" is mechanical here, not
marketing: no program holds the balance, only an authority points at it.
NOT ON THE SLIDE, said only if it helps: the other half is
Stake { delegation: Delegation, credits_observed }, and Delegation carries
voter_pubkey, stake, activation_epoch and deactivation_epoch. Good CALLBACK if the
ring slide survives the cut: the ring is not a status field anybody maintains, it is
those two epoch numbers against the current epoch.
Leaves the question: fine, but who exactly holds that staker key?

---

<!-- .slide: data-rail="native" data-stage="stake" -->

## Not a hot wallet

<div class="columns">
<div class="card">
<h3>Only the owner can rotate it</h3>
<p>If our key leaked, every user would have to re-assign it themselves, on every stake account they own.</p>
</div>
<div class="card">
<h3>So it is a PDA</h3>
<p>An address with no private key. Nothing to lose, nothing to leak.</p>
</div>
</div>

<p class="slide-foot">And the DAO can change who operates it, without touching a single user's stake account.</p>

Note:
This is the nicest security argument in the deck and it is not the obvious one.
The obvious answer is "a hot wallet cannot steal, so it is fine". The real problem
is recovery: only the OWNER can assign or revoke the staking authority, so a leaked
key cannot be rotated by us. Every single user would have to act, individually, for
every account. That is unfixable at our end, so the key must not exist.
Hence a proxy program with a PDA. No private key exists to be lost.
Leaves the question: delegating works. What about getting out?

---

<!-- .slide: data-rail="native" data-stage="exit" -->

## Getting out is the hard part

<div class="steps">
<div><div class="step-num">1</div><h3>Pick</h3>Which accounts add up to what you asked for.</div>
<div><div class="step-num">2</div><h3>Move</h3>To the exit authority. Now they are leaving.</div>
<div><div class="step-num">3</div><h3>Deactivate</h3>Across many transactions, in the background.</div>
<div><div class="step-num">4</div><h3>Merge</h3>One account. One withdrawal.</div>
</div>

<p class="slide-foot">Your stake sits on a hundred validators. That does not fit in one transaction.</p>

Note:
THE ENGINEERING SLIDE OF THIS SECTION. Delegating is easy. Un-delegating is where
the work is.
The problem: good decentralisation means your SOL is spread across a hundred
validators, so it is a hundred stake accounts. Ask to withdraw a specific amount and
we have to find which subset adds up to it, deactivate each one, and none of that
fits in a single transaction. So it becomes a background pipeline that builds
transactions asynchronously.
THE DESIGN DETAIL: there are two stake authorities. One for accounts we keep
delegating, and a separate EXIT authority. Moving an account under the exit
authority is what marks it as on its way out of the Marinade system. The authority
IS the state, so there is no status field anywhere to fall out of sync.
Contrast with the Liquid section on purpose: there we kept our own mirror of state
and an outsider could break it. Here the on-chain object carries the state itself.
Leaves the question, and it opens the last section: you still wait an epoch for the
withdrawal. What if I want the SOL right now?

---

<!-- .slide: data-background-image="images/brand-art/p-liquidity.jpg" class="cover art vcenter statement" -->

# Instant unstake

Note:
Section break. The question Native left open: even after all that machinery, Solana
still makes you wait out the cooldown. What if you want the SOL now?

---

<!-- .slide: data-rail="instant" data-stage="exit" -->

## Somebody buys your stake account

<div class="flow">
<div>You hand over the stake account</div>
<div>They hand over SOL</div>
</div>

<p class="slide-foot">One transaction. Both sides settle, or neither does. No liquid token, no cooldown, and it works on any stake account, even ones Marinade never touched.</p>

Note:
The mechanism is simpler than people expect: an atomic swap. Your stake account
goes to a buyer, their SOL comes to you, in the same transaction. Both legs or
nothing, so there is no partial fill and no counterparty risk.
Solana still makes somebody wait the cooldown. That somebody is now the buyer, and
the price they quote is what they charge for waiting.
Worth saying: it auto-detects natively staked SOL across any validator, so you can
exit a stake account that was never delegated through us.
Leaves the question: fine, but why would anybody buy it, and what does that cost me?

---

<!-- .slide: data-rail="instant" data-stage="exit" -->

## Somebody has to want it

<div class="grid-3">
<div class="card">
<h3>Now</h3>
<p>SOL in your wallet, in one transaction.</p>
</div>
<div class="card">
<h3>Less</h3>
<p>A little under what the account holds.</p>
</div>
<div class="card">
<h3>Why</h3>
<p>That gap is what the waiting is worth to somebody else.</p>
</div>
</div>

<p class="slide-foot">Marinade charges you nothing to unstake. The discount is the price, and you see it before you sign.</p>

Note:
THE PRICE SLIDE. The previous slide was the mechanism, this one is what it costs you.
You are not paid face value. You take a discount, and that discount is the price of
not waiting.
Say plainly that we charge the unstaker no fee. What you give up goes to whoever
agrees to sit through the cooldown in your place.
ON STAGE ONLY, deliberately not written here: two beats on how a buyer commits to
the trade. The source repositories are private, so nothing about them goes in this
public repo. They are in the private talk note, marinade-staking-stack--
instant-unstake-mechanics--INVESTIGATION.
Leaves the question: hold on, so who is actually doing the waiting?

---

<!-- .slide: class="statement vcenter" -->
<!-- No rail and no picture: the line is the whole slide. -->

<span class="label">The honest version</span>

## Everyone waits.
## The only question is who.

<p class="slide-foot">The cooldown is not optional. Instant means somebody took your staked position and is waiting in your place.</p>

Note:
THE LINE OF THE SECTION, and it works for both exits. Solana's cooldown cannot be
skipped by anyone, so "instant" never means the wait went away. It means it moved.
In the liquidity pool it moves to the third parties who fund the pool. Here it moves
to the buyer. Either way somebody is standing in your queue and charging you for it.
Do NOT put an epoch length on the slide. Saying "about two days" out loud is fine.
Then close: three products, and every one of them is a different answer to something
Solana makes hard.

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
