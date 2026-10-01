<!-- .slide: data-background-image="images/brand-art/p-liquidity.jpg" class="cover art vcenter" -->

<div class="lockup"><img src="images/marinade-white.svg" alt="">Marinade</div>

# Marinade as building blocks

## Staking, DeFi, data and governance on <span class="accent">Solana</span>

<div class="logo-row">
<img src="images/solana-logo.svg" alt="Solana">
</div>

<span class="note">Ondra Chaloupka</span>

Note:
THE OPENING, word for word: "Marinade is five years of staking on Solana. Today I want to show it to you as parts you can build with."
Then the shape of the talk in one breath: where it came from, what it is made of, and where you could plug in.
The room knows Solana. Do not explain the chain, do not thank the organisers first.

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
Fifteen seconds. The Realms line matters later: the governance block ends on a Realms gap, and this is why I can speak to it.

---

<!-- .slide: -->

## Staking is Solana's base yield layer. Marinade routes it.

<div class="grid-4">
<div class="card">
<h3>Staking</h3>
<p>Marinade Liquid, Marinade Native, and an auction where validators compete for stake.</p>
</div>
<div class="card">
<h3>DeFi</h3>
<p>mSOL as collateral and liquidity, plus products built on staking rewards.</p>
</div>
<div class="card">
<h3>Data</h3>
<p>Public data on every validator, every epoch, through open APIs.</p>
</div>
<div class="card">
<h3>DAO</h3>
<p>MNDE holders govern the protocol on Realms.</p>
</div>
</div>

<p class="slide-foot">The four blocks of this talk. Each one has a place where you can build.</p>

Note:
THE MAP OF THE TALK, and the one sentence to remember: staking is Solana's base yield layer, and Marinade routes it.
mSOL is the liquid version of that stake. MNDE runs the DAO. And every validator decision is backed by data anybody can read.
Do not walk all four cards now. Name them, say "we come back to each", and move on.
DO NOT call Marinade "a staking protocol". It is a platform that puts SOL to work, self-custodial, no lockups.
Leaves the question: where did all this come from?

---

<!-- .slide: -->

## Five years on one chain

<div class="timeline">
<div><span class="when">2021</span>Hackathon prototype. First liquid staking on Solana mainnet. MNDE fair launch.</div>
<div><span class="when">2022</span>Onchain DAO governance. Through FTX with no treasury exposure.</div>
<div><span class="when">2023</span>Marinade Native. Governance moves to Realms.</div>
<div><span class="when">2024</span>Protected Staking Rewards. Stake Auction Marketplace.</div>
<div><span class="when">2025</span>Select, SOC 2 Type II, Instant Unstake, a Solana ETF.</div>
<div><span class="when">2026</span>USDC Vault. A first step to Marinade Borrow.</div>
</div>

<p class="slide-foot">Every product here was an answer to something stakers kept asking for.</p>

Note:
TELL IT AS A GROWTH STORY, not a list. Each year added a block because users hit a wall.
2021: Solana x Serum hackathon in March, 3rd place with a liquid staking prototype. Merged with the Smart Pool team in April. Mainnet on 2 August, the 100k SOL cap filled in two and a half days. MNDE fair launch on 7 October, no sale, no investors.
2022: onchain governance on Tribeca in April, with NFTs, next slide. November, FTX: Alameda, Serum and Saber were rotated off the multisig, and the treasury had no exposure.
2023: Marinade Native on 19 July. Your stake account stays in your wallet. Same month governance moved to Realms.
2024: Protected Staking Rewards (PSR) in April, the Stake Auction Marketplace (SAM) in August.
2025: Marinade Select in May, SOC 2 Type II in July, Instant Unstake with Anza in October, and the Canary Marinade Solana ETF in November, with Marinade as staking provider.
2026: USDC Vault in March, the first step to Marinade Borrow in May.
THE FOOT LINE is the bridge to the building blocks: none of these were planned in 2021.
Sources for every date are in the README history table.

---

<!-- .slide: -->

## A bootstrapped DAO

<img class="figure" src="images/octopus-voting.jpg" alt="Get MNDE, lock it and receive an NFT, vote with the NFTs, burn the NFT to get MNDE back">

<p class="punch">Funds raised: $0.</p>

<p class="slide-foot">Governed onchain by MNDE holders since 2022. The 2022 flow: lock MNDE, get an NFT, vote.</p>

Note:
ONE PICTURE, ONE POINT: Marinade was not built on a venture round. It is a DAO that bootstrapped itself.
The picture is the 2022 governance flow: get MNDE, lock it, receive a Chef NFT, the NFTs are your voting power, burn the NFT to get the MNDE back.
"Funds raised $0" is on the marinade.finance homepage today. Say it as a fact, not a boast.
Do not explain the NFT mechanics further. They are history, today it is Realms, and the DAO block comes back to that.

---

<!-- .slide: -->

## What Marinade brings to Solana

<div class="metrics">
<div><div class="metric">7.7M SOL</div><div class="metric-label">staked through Marinade</div></div>
<div><div class="metric">100+</div><div class="metric-label">validators receiving stake</div></div>
<div><div class="metric">150K+</div><div class="metric-label">holders</div></div>
</div>

<div class="grid-3" style="margin-top:72px">
<div class="card">
<h3>Spread stake</h3>
<p>Caps per validator, hosting provider and country keep the network decentralized.</p>
</div>
<div class="card">
<h3>Self-custody</h3>
<p>With Marinade Native the staker keeps the withdraw authority.</p>
</div>
<div class="card">
<h3>Open by default</h3>
<p>Programs, delegation strategy and auction logic are public on GitHub.</p>
</div>
</div>

Note:
NUMBERS FIRST, and refresh them the day before: DefiLlama API and the homepage. As of 1 Oct 2026: 7.70M SOL, of which Liquid 2.30M, Native 3.72M, Select 1.68M.
THE CAPS, if somebody asks: SAM limits any one validator to 15% of Marinade TVL, any hosting provider to 30%, any country to 40%.
Marinade's own words, from the docs: a stake automation platform that maximizes rewards "while supporting the decentralization and performance of the Solana network." Founded as a public good.
Do not promise APY, never.
Leaves the question: before the blocks, thirty seconds on what staking actually does.

---

<!-- .slide: data-stage="staking" -->

## Staking in one slide

<div class="grid-3">
<div class="card">
<h3>Security</h3>
<p>Stake weights votes and decides who builds blocks.</p>
</div>
<div class="card">
<h3>Rewards</h3>
<p>Inflation, priority fees and MEV tips, shared with stakers.</p>
</div>
<div class="card">
<h3>Two keys</h3>
<p>A stake account splits who delegates from who withdraws.</p>
</div>
</div>

<p class="slide-foot">Stake moves at epoch boundaries, roughly every two days. Solana does not slash stake today.</p>

Note:
KEEP IT SHORT. The room knows Solana, half of it has never thought about staking mechanics.
SECURITY: proof of stake. More stake means more vote weight and more leader slots.
REWARDS: inflation is paid every epoch. Priority fees go to the block producer in full, base fees half burned. MEV tips arrive on top.
TWO KEYS is the one to land, because Marinade Native is built on it: the stake authority delegates, the withdraw authority takes the money out. They can be different people.
DO NOT say Solana slashes. It does not today, a bad validator costs rewards, not principal.

---

<!-- .slide: data-background-image="images/brand-art/p-rewards.jpg" class="art" data-stage="staking" -->

<div class="label">Block 1, staking</div>

## Two ways in

<div class="columns">
<div class="card">
<h3>Marinade Liquid</h3>
<p>Deposit SOL into the program, hold <span class="token">mSOL</span>. Its price is total staked SOL over mSOL supply, so it grows every epoch.</p>
</div>
<div class="card">
<h3>Marinade Native</h3>
<p>The stake account stays in your wallet. Marinade gets only the stake authority, through a program address with no private key.</p>
</div>
</div>

<p class="slide-foot">Native runs three strategies: Max Yield, Select, and Recipes, which pays rewards in another token.</p>

Note:
TWO ENTRY POINTS, same delegation engine behind both.
LIQUID: the original Solana LST, since 2021. mSOL is a token, so it goes anywhere in DeFi. That is the next block.
NATIVE: no smart contract holds your SOL. You keep the withdraw authority, so you can leave without asking Marinade.
The stake authority sits on a PDA, a program address with no private key. Nothing to steal, nothing to leak.
STRATEGIES, one line each: Max Yield follows the auction winners. Select is a verified, institution-grade set. Recipes keeps the principal in SOL and pays the rewards in a token you pick.
Describe Recipes by its payout only.
Builder hooks: marinade-ts-sdk and native-staking-sdk on npm, Anchor IDLs on docs.marinade.finance/developers.

---

<!-- .slide: data-stage="staking" -->

## Validators compete for the stake

<div class="steps">
<div><span class="step-num">1</span><h3>Bond</h3>The validator funds an onchain bond.</div>
<div><span class="step-num">2</span><h3>Bid</h3>Each epoch it bids in the Stake Auction Marketplace (SAM).</div>
<div><span class="step-num">3</span><h3>Win</h3>Stake goes to the best yield, within the caps.</div>
<div><span class="step-num">4</span><h3>Protect</h3>Underperform, and the bond pays stakers back.</div>
</div>

<p class="slide-foot">Protected Staking Rewards (PSR) cover downtime and commission increases from the validator's own bond.</p>

Note:
THE ENGINE OF BOTH PRODUCTS. A market, not a committee, decides where stake goes.
BOND: Validator Bonds, real SOL locked onchain before the validator can play.
BID: validators say how much they share back with stakers. The auction clears once per epoch.
WIN: highest yield first, with the 15 / 30 / 40 percent caps from earlier.
PROTECT: if a validator goes down or raises commission mid-epoch, PSR pays stakers from that validator's bond. Source: docs, protected-staking-rewards. The coverage range changed with MIP-23, quote the docs, not the older product pages.
Builder hooks, all public: validator-bonds CLI and SDK on npm, the Bonds API, ds-sam on GitHub with every epoch's auction inputs and outputs.

---

<!-- .slide: data-stage="staking" -->

## Getting out without waiting

<div class="flow">
<div>You hand over the stake account</div>
<div>A market maker quotes a price</div>
<div>SOL arrives in the same transaction</div>
</div>

<p class="slide-foot">Instant Unstake, built with Anza. You see the price before you sign, and it works on any stake account.</p>

Note:
THE LAST STAKING PIECE. Solana makes you wait an epoch to unstake. Instant Unstake sells that wait to somebody who wants it.
It is a request for quote: market makers bid for your stake account, the swap is atomic, both legs or nothing.
Works on any natively staked SOL, even accounts Marinade never touched.
Launched 27 October 2025. Do not go deeper into the auction internals here.
Leaves the question: fine, that is staking. What gets built on top?

---

<!-- .slide: data-background-image="images/brand-art/s-slicing.jpg" class="art" data-stage="defi" -->

<div class="label">Block 2, DeFi</div>

## mSOL is a building block

<div class="grid-3">
<div class="card">
<h3>Collateral and liquidity</h3>
<p>Lending markets, pools and wallets across Solana take <span class="token">mSOL</span>.</p>
</div>
<div class="card">
<h3>Marinade Borrow</h3>
<p>Borrow against mSOL, routed to Kamino or Jupiter Lend.</p>
</div>
<div class="card">
<h3>Rewards, reshaped</h3>
<p>Recipes pays staking rewards in another token. USDC Vault puts stablecoins to work.</p>
</div>
</div>

<p class="slide-foot">Build here: integrate mSOL, compare venues with the APY API, track Recipes payouts.</p>

Note:
THE POINT: staking yield is the base, and everything else stacks on it.
COLLATERAL: mSOL is accepted across Solana DeFi, Kamino, Orca, Drift, Meteora, Jupiter and more, plus wallets and exchanges. Say "across Solana DeFi" rather than reading a list.
BORROW: borrow against mSOL, the router picks Kamino or Jupiter Lend. Check its status on the day, the blog calls it a first step.
RECIPES: principal stays in SOL, rewards paid in USDG, USDC, BTC and others. Public data at recipes-api.marinade.finance.
USDC VAULT: a Kamino Earn vault curated by RockawayX.
THE GAPS a builder could fill: a yield comparator across mSOL venues, a Recipes payout and tax ledger, a portfolio tracker that finds every Native position.
Do not mention the referral program. It has been paused since May 2026.

---

<!-- .slide: data-background-image="images/brand-art/s-ledger.jpg" class="art" data-stage="data" -->

<div class="label">Block 3, data</div>

## Public data on every validator

<div class="grid-3">
<div class="card">
<h3>Validators</h3>
<p>Uptime, commission, versions, MEV and scores, per epoch.</p>
</div>
<div class="card">
<h3>Auction and bonds</h3>
<p>Every bid, every winner, every bond and protected event.</p>
</div>
<div class="card">
<h3>Yield and stake</h3>
<p>mSOL price, APY per product and validator, TVL, holder snapshots.</p>
</div>
</div>

<p class="slide-foot">Open REST APIs with OpenAPI docs, no key needed. Start at docs.marinade.finance.</p>

Note:
THE BLOCK PEOPLE DO NOT EXPECT. Marinade has to judge every validator every epoch, so it collects the data, and it publishes it.
VALIDATORS: validators-api.marinade.finance, about thirty routes. Scores and their breakdowns at scoring.marinade.finance.
AUCTION AND BONDS: validator-bonds-api.marinade.finance, plus psr.marinade.finance as a dashboard.
YIELD AND STAKE: apy.marinade.finance, api.marinade.finance for mSOL price and TVL, snapshots-api.marinade.finance for holder and vote history.
All checked on 2 Oct 2026: they answer without auth and serve OpenAPI docs.
THE GAPS: validator comparison pages, embeddable widgets, Discord and Telegram bots, bond health alerts.

---

<!-- .slide: data-stage="data" -->

## Knowing the ecosystem

<div class="grid-3">
<div class="card">
<h3>Marking validators</h3>
<p>Commission rugs, sandwich MEV and vote fraud put a validator on the blacklist.</p>
</div>
<div class="card">
<h3>Working with Solana</h3>
<p>Stake accounts, epochs and fee changes are the ground Marinade builds on.</p>
</div>
<div class="card">
<h3>Open code</h3>
<p>Delegation strategy, auction and bonds are public, so anybody can check a decision.</p>
</div>
</div>

<p class="slide-foot">Infrastructure is the part of Marinade nobody sees, and the part everything else depends on.</p>

Note:
INFRASTRUCTURE, in one slide. Routing stake well means knowing the validators, and knowing the chain as it changes.
MARKING: the auction blacklist covers commission rugs, sandwich MEV and vote fraud. A validator that does this loses stake.
WORKING WITH SOLANA: Instant Unstake was built with Anza. Five years of protocol changes underneath, and the programs kept running.
OPEN CODE: github.com/marinade-finance, ds-sam, validator-bonds, liquid-staking-program, delegation-strategy-2.
A gap worth naming for Rust builders: there is no maintained Rust client crate. The Anchor IDLs are published, so a crate can be generated.

---

<!-- .slide: data-background-image="images/brand-art/p-manage.jpg" class="art" data-stage="dao" -->

<div class="label">Block 4, DAO</div>

## MNDE runs the DAO

<div class="grid-3">
<div class="card">
<h3>Lock and vote</h3>
<p>MNDE is locked into veMNDE and votes on Marinade Improvement Proposals (MIPs).</p>
</div>
<div class="card">
<h3>On Realms</h3>
<p>SPL Governance with the Voter Stake Registry, the shared stack of Solana DAOs.</p>
</div>
<div class="card">
<h3>Real decisions</h3>
<p>MIP-14 burned 30% of the MNDE supply. Votes also steer stake to validators.</p>
</div>
</div>

<p class="slide-foot">Realms has no well-maintained open-source UI today. That gap is open for anybody.</p>

Note:
GOVERNANCE AS A BUILDING BLOCK, and the one I know best.
LOCK AND VOTE: MNDE goes into the Voter Stake Registry and becomes veMNDE. Vote at app.marinade.finance/governance or on Realms.
ON REALMS: SPL Governance, the same program most Solana DAOs use. Anything you build here works for every Realm, not just Marinade.
REAL DECISIONS: MIP-14 burned 300M of the 1B MNDE. veMNDE votes also direct part of the stake to validators. Snapshots of those votes are in the snapshots API.
THE GAP: the open-source governance UI, now under Mythic-Project, has been idle since February 2026. Other gaps: a veMNDE voting-power viewer, an audited vote aggregator, proposal notifications for any Realm.

---

<!-- .slide: data-background-image="images/brand-art/s-hat.jpg" class="art" data-stage="all" -->

## Pick your block

<div class="grid-3">
<div class="card">
<h3>DeFi integration</h3>
<p>Take mSOL, route yield, track Recipes payouts.</p>
</div>
<div class="card">
<h3>Staking data and dashboards</h3>
<p>Validators, auction, bonds and APY, all open.</p>
</div>
<div class="card">
<h3>Governance UX</h3>
<p>A Realms UI people want to use.</p>
</div>
</div>

<p class="slide-foot">SDKs on npm, IDLs and APIs on docs.marinade.finance, code on github.com/marinade-finance.</p>

Note:
THE ASK, and the whole rail is lit: all four blocks are covered.
Say Ondra's line: staking is Solana's base yield layer, Marinade routes it. mSOL as the liquid version, MNDE to manage the DAO, and public data on every validator. Pick whichever part you want to improve.
One sentence per card, then stop. Point people to the docs and to me after the talk.

---

<!-- .slide: data-background-image="images/brand-art/p-liquidity.jpg" class="cover art vcenter" -->

<div class="lockup"><img src="images/marinade-white.svg" alt="">Marinade</div>

# Build on <span class="accent">top</span>

<div class="columns" style="margin-top:32px">
<div>

[docs.marinade.finance](https://docs.marinade.finance)<br>
[github.com/marinade-finance](https://github.com/marinade-finance)<br>
[app.realms.today/dao/MNDE](https://app.realms.today/dao/MNDE)

</div>
<div>

<img class="qr" src="images/qr-marinade.svg" alt="marinade.finance">

</div>
</div>

Note:
Closing. Leave it up during questions.
