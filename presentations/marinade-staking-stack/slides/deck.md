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
     then becomes the containing block, breaking the absolute pinning. -->
<div class="lockup lockup-sm"><img src="images/marinade-white.svg" alt="">Marinade</div>

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

<!-- .slide: data-background-image="images/brand-art/p-rewards.jpg" class="cover art vcenter statement" -->

# A product

Note:
Big separator. The three product sections follow.

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
