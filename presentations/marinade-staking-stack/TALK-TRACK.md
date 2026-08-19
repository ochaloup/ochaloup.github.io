# Talk track, slide by slide

**Generated file. Do not edit.** The speaker notes in `slides/deck.md` are the source of
truth; this is a readable projection of them for rehearsal. Regenerate with:

```
python3 tools/talk-track.py > TALK-TRACK.md
```

While presenting, press `s` in the deck for the same notes beside the slide, with a timer.
Currently 23 slides, 4153 words of notes.

## The question chain

The deck's organising principle is that every slide raises the question the next one answers.
This table is extracted from the notes, so a blank cell is a seam worth looking at.

| # | Slide | Leaves the room asking |
|---|---|---|
| 0 | Inside Marinade's staking stack | — |
| 1 | What we are going to cook through | — |
| 2 | Who talks to you | — |
| 3 | Who is Marinade | fine, but before any of the products, what is staking even doing? |
| 4 | What is staking | so how does the chain decide who builds a block? |
| 5 | Stake decides who builds | fine, so what does Marinade actually build on top of that? |
| 6 | You all know what liquid staking is | fine, but somebody has to decide where all that stake goes. |
| 7 | You staked. | so what is actually happening while I do nothing? |
| 8 | Somebody has to choose the validators | so who actually turns all this, and how often? |
| 9 | A stake account cannot move sideways | fine, so who is even worth moving to? |
| 10 | Bonds. Validators back their word with their own SOL.  (picture only) | so how DO you get me more? |
| 11 | Validators bid for your stake | a bid is a promise. How does a promise become money in my wallet? |
| 12 | From promise to payment | all of this is an ON-CHAIN PROGRAM holding your SOL. What if you do not want a program at all? |
| 13 | Not everyone wants a program holding their SOL | so how do you manage my stake without ever holding it? |
| 14 | Solana splits the keys | so who, or what, is actually holding that staker key? |
| 15 | Not a hot wallet | the key is safe, then. So what does Marinade actually do with that authority? |
| 16 | Three ways to run it | three policies, one custody model. So what happens the day I want out? |
| 17 | Getting out is the hard part | you still wait an epoch for the withdrawal. What if I want the SOL right now? |
| 18 | Somebody buys your stake account | fine, but why would anybody buy it, and what does that cost me? |
| 19 | Somebody has to want it | Then hand off to the closing: three products, and every one of them is a different answer to something Solana makes hard. |
| 20 | Marinade knows how this works | nothing. This is the answer. Then the closing slide. |
| 21 | Stake it till you make it | — |
| 22 | MEV arrives as a bundle | — |

## Slide by slide

### 0 · Inside Marinade's staking stack

*`class=cover art vcenter`*

- **I am here to talk about staking on Solana, and to walk you through the engineering Marinade puts behind it. All you need to do is press a single button. Everything else is what I want to show you.** THE OPENING, first twenty seconds, and it is worth having word for word because the first sentence is the only one nobody talks over. "I am here to talk about staking on Solana, and to walk you through the engineering Marinade puts behind it. All you need to do is press a single button. Everything else is what I want to show you." Then set the shape of the talk in one breath: "Who picks the validators, what keeps them honest, and how you get out again." NOT "the best staking experience", and not any superlative. The brand guide bans them, and other staking providers are in this room, so a claim of best invites an argument in your first ten seconds. The one-button line makes the same point and cannot be challenged.
- THEN BUY PERMISSION FOR THE BASICS, one line, because the room is mixed and both halves need to hear it: "Some of you run validators, some of you have never staked anything. I will start from zero and then get technical fast." Then go to the agenda. Do not open by thanking the organisers, do not apologise for the slot length, and do not introduce yourself first: the hook comes before the name. The programme still carries the submitted title, "The Marinade Recipe: Building Staking Infrastructure on Solana". The deck drops it: "Recipes" is a live Marinade product and the collision would cost the first minute. The subtitle now says "an introductory tour", which is also the promise the opening line makes. Conference name deliberately absent.

### 1 · What we are going to cook through

*`class=anchor-top`*

- Three products, nothing more. The Native strategies are parked in a comment in this file and belong in the Native section, where the room has context for them. Do not read the shout-outs out loud, they are there to be scanned.

### 2 · Who talks to you

- The distributed systems line is deliberately past tense. It is the honest version, it explains how I got here rather than claiming an active practice.

### 3 · Who is Marinade

*`class=with-art anchor-top`*

- Short. This is credibility, not a pitch, so do not sell.
- THE HISTORY: spring 2021, out of two hackathon projects that merged. First liquid staking token on Solana. That is the sentence that buys the rest of the talk: we have been running this through five years of Solana changing underneath us.
- THE DAO: MNDE launched October 2021 and on-chain governance followed in 2022. Token holders lock MNDE to vote, and the forum is public. Say "a DAO and a team", not "a company", because both are true and the DAO is the part people do not expect.
- THE POSITIONING, in Marinade's own words from docs.marinade.finance: "a stake automation platform that helps you maximize SOL staking rewards while supporting the decentralization and performance of the Solana network." Do NOT call it a staking protocol, that is off-brand.
- [VERIFY BEFORE THE TALK] the foot line says grants rather than venture capital. That comes from Marinade's own education article, written 2022 and updated 2024. Confirm it still holds, or drop the line: it is the one claim on this slide that could have aged.
- Leaves the question: fine, but before any of the products, what is staking even doing?

### 4 · What is staking

- KEEP IT SIMPLE, this is the one slide for the half of the room that does not run a node. Three sentences, then the diagram.
- WHY LOCK ANYTHING AT ALL: proof of stake needs money as the signal. Stake says the network's security and its uptime matter to whoever locked it, and the protocol pays for that signal. That is the whole bargain.
- DELIBERATELY NOT "skin in the game", and this is worth knowing rather than glossing over: on Solana there is no protocol slashing today, so a badly chosen validator costs rewards, not principal. Nothing gets burned. Solana's terminology page does define stake as forfeitable if malicious behaviour can be proven, so the intent is there, but do not tell a room of engineers that the chain destroys stake today.
- VALIDATORS, not "somebody": they run the hardware, they vote on every block, and the stake delegated to them is what gives their vote weight.
- TWO KINDS OF REWARD, and the next slide draws both. Voting earns inflation, paid per epoch against vote credits. Building blocks earns the fees inside them. Keep them separate in the room's head, because who ends up with each one is the whole reason the auction exists later.
- Leaves the question: so how does the chain decide who builds a block?

### 5 · Stake decides who builds

- TWO LANES, and the split is the point of the slide. Walk the left side first, then take the top lane, then the bottom one. LEFT: stakers delegate, and each validator ends up carrying a different amount of stake, drawn as the little blocks inside it.
- TOP LANE, VOTING: every validator votes on every block, all the time, and that is not a turn-taking thing. The protocol tallies vote credits and pays inflation each epoch, the validator keeps a commission, and the rest lands with the stakers. That is the dashed arrow, and it is the part of the picture that is the audience's money.
- BOTTOM LANE, BUILDING: this is where stake decides something. Solana builds a leader schedule for the epoch and the number of slots a validator gets follows its stake. A slot is its turn to produce a block, so more stake means more turns.
- THE FEES FROM THOSE BLOCKS STAY WITH THE VALIDATOR. Say it plainly and let it sit there unresolved: base fee is 5,000 lamports a signature with half burned and half to the validator, priority fees all of it, and MEV on top, outside the protocol. [THE SEED FOR THE WHOLE TALK, do not resolve it here] there is no in-protocol way for a validator to hand a share of that back to the people whose stake earned it. Two sections from now, the auction and the bonds are exactly that missing path.
- Leaves the question: fine, so what does Marinade actually build on top of that?

### 6 · You all know what liquid staking is

*`class=art`, `data-stage=stake`*

- THIS SLIDE OPENS THE SECTION. There is no separate Liquid staking break any more: the label carries the product name and the painting carries the mood. Answer the question the bio slide left open in the first sentence, out loud: what does this stack actually do, and we start with the product that came first. Fast, everybody knows this. What to say over the top: the protocol takes ownership of your SOL as a whole, and it is wired in that only you can ask your portion back. Meanwhile we manage that stake to collect staking rewards and other on-chain rewards, so the SOL you put in is worth more. And you are holding mSOL the whole time, free to use it in DeFi. The words that matter later are ON-CHAIN PROGRAM. Say them deliberately.
- Leaves the question: fine, but somebody has to decide where all that stake goes.

### 7 · You staked.

*`class=center-text`*

- The playful beat. You handed over your SOL, the token is in your wallet, and the money is supposed to start rolling in. Land the joke, let it breathe, then turn. The answer is not magic, it is machinery, and that is the next slide.
- Leaves the question: so what is actually happening while I do nothing?

### 8 · Somebody has to choose the validators

*`data-stage=stake`*

- THE MESSAGE: Marinade runs machinery that collects data off Solana, works out where the best yield and the better decentralisation actually are, and moves stake there. Not "a choice exists", but "we built the thing that makes the choice, continuously". What we collect: uptime, vote credits, commission, MEV, where they run. The validator manager is the authority that writes the answer on chain. One key, ValidatorSystem.manager_authority. It adds and removes validators, sets scores, and holds the emergency levers. The code sometimes names the parameter validator_manager_authority, but it is the same key.
- [TODO] Ondra wants a picture that says "this is not easy". The pantry painting is a placeholder for that, a lone cook managing an enormous store. Replace if a better meme turns up.
- NEVER name a competitor on a slide. The difference is worth two sentences ON STAGE only: most pools have a single staker key that names the validator set and can move any amount of stake at any time. We put scoring and a per-epoch movement cap in the program instead. Do NOT mention the auction yet. That is the next slide.
- Leaves the question: so who actually turns all this, and how often?

### 9 · A stake account cannot move sideways

*`data-stage=stake`*

- Names are Solana's own: Active, Deactivating, Inactive, Activating.
- THE CORRECTION WORTH KNOWING: Deactivating still earns. The stake stays effective for that epoch. Inactive and Activating are the ones that pay nothing, and from a rewards point of view they are the same thing. That is the yellow half of the ring. Also: Inactive to Activating can happen in the SAME epoch. You do not wait an extra epoch to re-delegate. So the cost is not four epochs, it is the yellow arc.
- THIS IS THE SLIDE FOR THE HARD PART. A validator goes down, or quietly raises its commission against our stakers. The obvious move is to pull the stake now. There is no sideways. The account has to go all the way round, and half that circle pays the staker nothing. So every rebalance is a trade: yield lost going round, against yield lost by staying put. React to every wobble and you cost the stakers more than the wobbles do. That is why the auction emits priorities rather than a bare target, and why the program caps how much can move per epoch.
- Leaves the question: fine, so who is even worth moving to?

### 10 · Bonds. Validators back their word with their own SOL.  (picture only)

*`data-stage=bond`, `class=center-text`*

- One line under the picture, and it is deliberately on the validator's side. An earlier version read "their bad days come out of the deposit", which framed validators as the problem. They are not. They are partners who choose to put collateral up so that we can promise stakers a floor without asking anyone to trust us.
- SAY OUT LOUD, do not slide it: this is also the setup for the auction. Solana has no way for a validator to pay a staker a share of its priority fees, so how do we get you more than the protocol pays? Say "slash" ONCE here, then correct it immediately: on Solana slashing means the protocol destroys staked principal. We cannot do that and do not. We take from a bond the validator posted, to cover rewards you did not get. Principal is never touched. Then drop back to "the bond covers the loss". We have to be good to validators too. The bond is not a punishment beating, it is the thing that lets us promise stakers a floor without asking anyone to trust us. The foot line is the setup. SIMD-0096 sent 100% of priority fees to validators. SIMD-0123 will let them share block rewards in protocol, passed governance March 2025, not live yet. Until then there is no native path, so we built one.
- Leaves the question: so how DO you get me more?

### 11 · Validators bid for your stake

*`data-stage=auction`*

- Deliberately NOT a mechanism deep-dive. The previous deck did last-price for a SAM-literate room; this one is not that room. The fairness point is the one sentence worth making: bidding aggressively does not punish you, because you are paid the clearing price, not your own number. That keeps the auction honest and stops a race to the bottom. The yield decomposition is real, it is the RevShare struct: totalPmpe = inflationPmpe + mevPmpe + bidPmpe. Say it, do not slide it.
- Leaves the question: a bid is a promise. How does a promise become money in my wallet?

### 12 · From promise to payment

*`data-stage=settle`*

- Deliberately light. No six-stage pipeline diagram, no merkle-tree detail unless somebody asks. The point is the shape, and WHAT MOVES: the auction bids a validator promised, and the rewards PSR covers when it underperformed. Both come out of the same bond and end up with the staker. Claiming is permissionless, but that is a footnote, not the headline. Say it only if somebody asks who runs the payout. If asked how: snapshot the chain state, a distribution CLI computes the settlement, merkle trees go on chain, claims are made against them.
- Leaves the question, and it opens the next section: all of this is an ON-CHAIN PROGRAM holding your SOL. What if you do not want a program at all?

### 13 · Not everyone wants a program holding their SOL

*`class=art`, `data-rail=native`, `data-stage=stake`*

- THIS SLIDE OPENS THE SECTION. There is no separate Native staking break any more: the stamp carries the section name, the painting carries the mood, and the rail switches to the native one here. Answer the question Liquid left open in the first sentence, out loud: all of that was an ON-CHAIN PROGRAM holding your SOL, so what if you do not want a program at all? The why, and it is a real one. Some people are simply not comfortable with a program custodying funds, and plenty of stakers do not want a liquid token at all. They want the delegation managed and nothing more. Institutions have the same requirement for a different reason: no token means nothing to account for, and no program means a much shorter audit conversation. Worth saying: you can always reclaim the stake authority and withdraw with the Solana CLI, without us. That is documented publicly in the how-to-native-staking repository.
- Leaves the question: so how do you manage my stake without ever holding it?

### 14 · Solana splits the keys

*`data-rail=native`, `data-stage=stake`, `class=code-sm`*

- Walk the three boxes in order, they are one object seen three ways. TOP: the account is an enum, and the variant IS the state. Uninitialized, holding only Meta, or fully delegated as Stake(Meta, Stake, StakeFlags).
- MIDDLE: what hangs off that. Meta is custody, and it carries the keys and the lockup. Stake is the delegation, and it carries the validator and the two epoch numbers. Every field of a stake account is on this slide.
- BOTTOM: the two fields the whole product rests on. The comments are mine, the fields are Solana's.
- THE POINT IS STILL CUSTODY. The staker authority can delegate, split, merge and deactivate. It cannot move a single lamport out. The withdrawer can, and the user keeps the withdrawer, always. So "no smart contract risk" is mechanical here, not marketing: no program holds the balance, only an authority points at it.
- CALLBACK, and it is the reason the middle box is worth the room: activation_epoch and deactivation_epoch are the ring from the Liquid section. The state is not a status field anybody maintains, it is two numbers compared against the current epoch.
- THE TERM, SPOKEN ONLY, deliberately not on the slide. People call this delegated proof-of-stake, and you can say it, but know the exposure before you do: solana.com/staking never uses that phrase. It says Proof of Stake, and describes delegation separately as assigning tokens to a validator to increase its voting weight. DPoS usually means an elected delegate set, EOS and Tron style, which Solana does not have. "Proof of stake, with delegation" is the safe phrasing, and the label on the slide says exactly that.
- THE GIFT FROM THAT PAGE, quote it if the room needs convincing, it is Solana's own sentence and not ours: "Delegating your tokens to a validator does NOT give the validator ownership or control over your tokens." That is this slide in one line, written by the people who built the chain.
- Leaves the question: so who, or what, is actually holding that staker key?

### 15 · Not a hot wallet

*`data-rail=native`, `data-stage=stake`*

- This is the nicest security argument in the deck and it is not the obvious one. The obvious answer is "a hot wallet cannot steal, so it is fine". The real problem is recovery: only the OWNER can assign or revoke the staking authority, so a leaked key cannot be rotated by us. Every single user would have to act, individually, for every account. That is unfixable at our end, so the key must not exist. Hence a proxy program with a PDA. No private key exists to be lost.
- Leaves the question: the key is safe, then. So what does Marinade actually do with that authority?

### 16 · Three ways to run it

*`data-rail=native`, `data-stage=stake`*

- What we do with the staker authority. Same custody model in all three, only the policy changes.
- MAX YIELD is the retail default: auto-delegation to the validators that won the auction, so it inherits everything from the Liquid section.
- SELECT is the institutional one: a curated set, identity-verified operators. This is the ETF and treasury conversation.
- RECIPES is the one to have fun with, and the honest way to introduce it is DCA.
- THE SENTENCE THAT EXPLAINS IT: your principal stays in SOL, and only the yield is converted, epoch after epoch, into a token you chose. So it is dollar cost averaging paid for by staking rewards rather than by your wallet. Marinade's own page calls it "DCA into token: automatically convert your staking rewards into the token you want, bit by bit." THREE FLAVOURS, all off the public page. Stablecoins for people who want yield without market swings, USDG being the one that is live. Utility tokens, MNDE and zBTC. And memecoins, which is where $FWOG and $NOBODY come in. Read that list off the slide and let it land: they are real payout rails on a real product page, and the room will not expect it after the institutional Select card.
- SAY THE CAVEAT, it costs one sentence and buys trust: you are taking price risk on the payout token, not on your stake. The SOL principal is untouched.
- DESCRIBE RECIPES BY ITS PAYOUT RAIL ONLY. Never by where the stake is delegated.
- Leaves the question: three policies, one custody model. So what happens the day I want out?

### 17 · Getting out is the hard part

*`data-rail=native`, `data-stage=exit`*

- THE ENGINEERING SLIDE OF THIS SECTION. Delegating is easy. Un-delegating is where the work is. The problem: good decentralisation means your SOL is spread across a hundred validators, so it is a hundred stake accounts. Ask to withdraw a specific amount and we have to find which subset adds up to it, deactivate each one, and none of that fits in a single transaction. So it becomes a background pipeline that builds transactions asynchronously.
- THE DESIGN DETAIL: there are two stake authorities. One for accounts we keep delegating, and a separate EXIT authority. Moving an account under the exit authority is what marks it as on its way out of the Marinade system. The authority IS the state, so there is no status field anywhere to fall out of sync. Contrast with the Liquid section on purpose: there we kept our own mirror of state and an outsider could break it. Here the on-chain object carries the state itself.
- Leaves the question, and it opens the last section: you still wait an epoch for the withdrawal. What if I want the SOL right now?

### 18 · Somebody buys your stake account

*`class=art`, `data-rail=instant`, `data-stage=exit`*

- THIS SLIDE OPENS THE SECTION. No separate Instant unstake break: the label carries the name, the gold-coin painting carries the mood. Answer what Native left open in the first sentence, out loud: even after all that machinery Solana still makes you wait out the cooldown, so what if you want the SOL now? The mechanism is simpler than people expect: an atomic swap. Your stake account goes to a buyer, their SOL comes to you, in the same transaction. Both legs or nothing, so there is no partial fill and no counterparty risk. Solana still makes somebody wait the cooldown. That somebody is now the buyer, and the price they quote is what they charge for waiting. Worth saying: it auto-detects natively staked SOL across any validator, so you can exit a stake account that was never delegated through us.
- Leaves the question: fine, but why would anybody buy it, and what does that cost me?

### 19 · Somebody has to want it

*`data-rail=instant`, `data-stage=exit`*

- WHY THIS SLIDE EXISTS: the previous slide showed the mechanism, and the room's next question is what it costs and why anybody would take the other side. Name the two sides out loud. You get SOL immediately, slightly less than the account holds. The buyer gets the account and inherits the cooldown, which they are willing to sit through. The difference between those two numbers is the whole price, and it is a price for time, nothing else. Then the reassurance: we do not charge you a fee for unstaking, and the number is on screen before you sign anything.
- ON STAGE ONLY, deliberately not written here: the technical layer, including what kind of auction this is and how a buyer commits to the trade. The source repositories are private, so nothing about them goes in this public repo. The full ninety second version, the auction vocabulary, and the line that pairs this auction with the validator auction are in the private talk note, marinade-staking-stack-- instant-unstake-mechanics--INVESTIGATION.
- Then hand off to the closing: three products, and every one of them is a different answer to something Solana makes hard.

### 20 · Marinade knows how this works

*`data-rail=all`, `data-stage=all`*

- THE SUMMARY, and the whole rail is lit for the first and only time: everything on it was covered. Point at it.
- THE MESSAGE, say it plainly and then stop: Marinade knows how this works. Not the biggest, not the best, nothing that invites an argument. Knowing how it works is the thing being offered.
- EARN IT WITH THE THREE CARDS, each one a callback to something they just watched, so the claim is evidence rather than a boast. Watching is the gears and the crank. Enforceable is the bond and the settlement. Getting out is the funnel and the buyer.
- THE PUNCH LINE IS DELIBERATELY SHORT, so it needs you to finish it: we build the machinery where Solana has a gap, and we delete it when the protocol catches up. It is the pattern the talk kept running into: priority fees the protocol cannot share, stake that cannot move sideways, a hundred accounts that do not fit in one transaction. Every one of those is scaffolding around a gap, and when SIMD-0123 lands or transaction limits rise, the scaffolding goes. Say that we would rather delete code than defend it.
- THE CLOSE, spoken and never printed: if you are deciding who manages your stake, pick the people who can explain it to you. That is the offer. A team that understands the ecosystem and works at this level of detail, rather than a promise of a bigger number. Do NOT turn this into a pitch. The room has just watched twenty minutes of evidence, so one sentence is enough and anything more sounds like doubt.
- Leaves the question: nothing. This is the answer. Then the closing slide.

### 21 · Stake it till you make it

*`class=cover art vcenter`*

- Closing line. It is a generic pun on "fake it till you make it", widely used and owned by nobody, so no attribution is needed. See the README naming section.

### 22 · MEV arrives as a bundle

- WHY THIS SLIDE IS AN APPENDIX: MEV is not on any main slide on purpose. It is a different subject, the room does not need it to follow the talk, and one bad explanation would cost two minutes. But somebody always asks, so have this ready.
- FRAME IT AS TOOLING, NOT AS EXTRACTION. In practice nobody sells this as MEV. It is sold as a faster, ordered lane onto the chain for the case where one transaction is not enough: you need several instructions to land together, in a set order, or not at all.
- WHAT A BUNDLE IS, quoting Jito's own docs: "Transactions in a bundle are guaranteed to execute in the order they are listed", a bundle "cannot cross slot boundaries", and "if any transaction in a bundle fails, none of the transactions in the bundle will be committed to the chain". Nothing guarantees a bundle lands: they compete.
- TIPS ARE NOT PRIORITY FEES. Solana's own docs separate them: a priority fee raises the chance the current leader processes your transaction, a tip pays the bundle network to take your bundle at all. Jito's docs: bundle tips "are then redistributed to the validators and their stakers".
- THE ON-CHAIN PART, and it is the bit worth showing an engineer. Two programs in jito-foundation/jito-programs, which is public: tip-payment collects, tip-distribution shares out. Per validator per epoch there is a TipDistributionAccount holding an optional merkle root, a validator_commission_bps capped by a config value, and an expiry after which unclaimed tips stop being claimable. Stakers claim against the merkle proof, one CLAIM_STATUS account each.
- THE PARALLEL WORTH DRAWING, because it is our own architecture: that is the same shape as the bonds settlement earlier in this talk. Measure off chain, publish a root, let anybody claim against it. Two teams reached for the same pattern because per-staker payouts do not fit in a program.
- [NAMING] this slide breaks the deck's own rule about never naming another protocol on screen. Deliberate, Ondra's call 2026-08-19: this is infrastructure the whole network uses rather than a competing product, and the question cannot be answered without the name. Sources: jito.wtf, docs.jito.wtf/lowlatencytxnsend, solana.com/docs/payments/production-readiness, and jito-foundation/jito-programs.
