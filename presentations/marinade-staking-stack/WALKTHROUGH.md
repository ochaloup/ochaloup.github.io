# Walkthrough: what each slide is for

**Hand written, not generated.** This is the opposite of `TALK-TRACK.md`, which is a projection of
the speaker notes. This file is the rehearsal plan: what each slide has to achieve, and the
sentence that carries the room to the next one.

Slide numbers match `slides/deck.md` order, 0 to 22.

Written for the **technical stage**, which the schedule confirmed. Consequence: the staking
introduction stays generic and short, and the time that buys goes to the mechanics later. The
cover says "introductory tour", so present that as scope, not as level: the whole stack end to
end, going wide and stopping at the interesting parts. Never apologise for the word.

```
GOAL   what the room leaves with
ASK    the question said out loud before the next slide
DEEP   the one extra thing this room earns
WATCH  a claim that has to be said precisely, only where it matters
```

---

## 0 · Cover

```
GOAL:  the promise. One button for you, everything behind it for me.
ASK:   none. Straight into the agenda.
```

The opening, worth having word for word because nobody talks over the first sentence:

> I am here to talk about staking on Solana, and to walk you through the engineering Marinade
> puts behind it. All you need to do is press a single button. Everything else is what I want to
> show you.

Then the shape in one breath: who picks the validators, what keeps them honest, and how you get
out again. No superlatives. No thanking the organisers first, no apology for the slot, no name
before the hook.

## 1 · Agenda

```
GOAL:  the shape of the talk. Three products, and the collateral underneath them.
ASK:   none, this is a map.
```

Do not read the shout-outs out loud. They are there to be scanned.

## 2 · Who talks to you

```
GOAL:  I work on this layer, not on the marketing of it.
ASK:   none.
DEEP:  distributed systems is the honest lead-in on this stage. The exit pipeline
       later is the evidence for it, so do not claim it twice.
```

## 3 · Who is Marinade

```
GOAL:  five years on one chain, a DAO, and a stake automation platform.
ASK:   before any of the products, what is staking even doing?
WATCH: the foot line says grants rather than venture capital. Confirm it still
       holds or drop the line.
```

Credibility, not a pitch. Say "a DAO and a team", not "a company". Both are true and the DAO is
the part people do not expect.

## 4 · What is staking

```
GOAL:  a blockchain pays for work, and on proof of stake the money is what buys
       you the right to do it. On Solana you can assign that right without
       giving up the coins.
ASK:   so which rewards are there, and who ends up with each one?
WATCH: two phrasings, below.
```

Budget 1:00 to 1:30. Five beats:

1. Blocks do not build themselves. Nodes run hardware, do the work, and the chain pays for it in
   protocol, automatically. Nobody invoices.
2. Proof of stake decides *who* gets to do that work by money. More stake, more of the work, more
   of the reward.
3. Solana lets the owner assign that weight to a validator without handing over the coins. The
   validator works with the stake. The SOL stays yours.
4. So the validator earns because of your stake. Which means it can pay part of that back to you,
   to attract more of it.
5. And that is the whole reason anything else in this talk exists.

Beat 4 is the one to slow down on. It is where the room understands that yield is a relationship,
not a rate. Beat 3 is backed on screen: the foot line is Solana's own sentence.

**WATCH, two things.**

- **"Delegated proof of stake."** solana.com/staking never uses that phrase, and DPoS normally
  means an elected delegate set, EOS and Tron style, which Solana does not have. Say **"proof of
  stake, with delegation"**. If you want the term, say *people call this delegated proof of
  stake*, do not assert it as Solana's label.
- **"Borrow" or "lend the funds."** It implies the validator receives the SOL, which is the exact
  misunderstanding this slide exists to kill. Use **assign**, or **lend your weight**. Weight, not
  money. Solana's sentence if the room needs it: *delegating your tokens to a validator does not
  give the validator ownership or control over your tokens.*

Do **not** put the Marinade-as-intermediary line here. It lands one slide later, where it answers
something the room can feel. Stop at beat 5, one clause, no detail.

## 5 · Stake decides who builds

```
GOAL:  two lanes, and they end in different pockets. Voting earns inflation and
       it reaches the staker. Building blocks earns fees and they stay with the
       validator.
ASK:   none. This one hands over instead of asking.
DEEP:  leader schedule drawn per epoch and stake weighted, so it is slots and not
       a lottery ticket. Base fee 5,000 lamports a signature, half burned half to
       the validator. Priority fees 100% validator since SIMD-0096. MEV on top,
       outside the protocol. Keep SIMD-0123 for the bond slide.
```

Walk the left side first, then the top lane, then the bottom one.

The handoff:

> The protocol gives you the raw material: an account, an epoch clock, rewards in two shapes, and
> no way to move stake quickly. Somebody has to manage all of that. For the staker it should still
> be one button. That is what Marinade does under the hood, and now we go through the details.

The fee gap stays open here, as one item in that list rather than the punchline. It gets spent on
the bond slide and paid off on the summary.

The one-button line is also the opening line. Saying it twice is deliberate, it closes the loop.
Make it shorter the second time: first it was a promise, here it is the reason the rest exists.

---

## 6 · You all know what liquid staking is

```
GOAL:  liquidity and yield at the same time, which is normally a choice.
       And one phrase planted for later: an ON-CHAIN PROGRAM holds the SOL.
ASK:   fine, but somebody has to decide where all that stake goes.
DEEP:  nothing is ever distributed. Rewards are auto-staked by Solana, so the
       crank books the growth and the mSOL price rises. No rebase, no claim,
       no airdrop. One token, one number going up.
```

Budget 40 to 50 seconds. This slide opens the section, so the first sentence out loud answers what
slide 5 left open: *that is what Marinade does under the hood, and the product that did it first is
liquid staking.* The title is a permission slip to go fast. Take it.

Four beats:

1. You all know this one. You hand your SOL to an on-chain program. Ownership goes to the
   protocol, and it is wired so that only you can ask your share back.
2. You get mSOL. It is not a receipt sitting still. The stake keeps earning, and because the
   rewards are auto-staked there is nothing to distribute, so the price of the token just goes up.
3. Meanwhile the token is yours to use. Lend it, LP it, post it as collateral, anywhere on Solana.
4. That is the whole trick. Liquidity or yield is normally a choice, and here it is not.

Beat 4 is the one worth having on this stage. Beats 1 to 3 describe the product, beat 4 says why it
was worth building.

**WATCH, three things.**

- **"Lock."** There is no lockup. You can leave any time, through the liquidity pool or a ticket.
  The word invites *for how long*, and the answer is nothing, which makes it look like an
  overclaim. Say **hand over**.
- **"Disponent"** does not exist in English in that sense. Say *the token is yours to use*, or
  *you are free to use it*.
- **Say the ownership transfer on purpose, not apologetically.** It is exactly what Native
  reverses. Slide 13 is stronger if the room clearly heard that here the program takes the SOL,
  because that is the thing being taken away later.

Say **on-chain program** deliberately and slightly slowly. It is the hinge for the whole Native
section six slides later.

The foot line repeats slide 3: first on Solana, 2021, two hackathon teams. One clause. Do not tell
the history twice.

If anyone pushes on "managed by Marinade", the honest split is that the mechanism is permissionless
and the policy is not. Do not volunteer it here, it belongs on slide 8.

## 7 · You staked. Now what?

```
GOAL:  let the question hang. The room has just been handed the money and
       nothing is happening.
ASK:   so what is actually happening while I do nothing?
```

15 seconds. Land it, let it breathe, then turn. Slides 6 and 7 both point at slide 8, so do not
answer either question here. The joke is the pause before the machinery, and explaining it is the
only way to kill it.

---

## 8 · Somebody has to choose the validators

```
GOAL:  we monitor the network, continuously. Watch, judge, move. Not "a choice
       exists" but "we built the thing that keeps making it".
ASK:   and the third one is the problem. How do you actually move stake?
DEEP:  what we collect: uptime, vote credits, commission, MEV, where they
       physically run. The decision is computed off chain and applied on chain.
       Do not name the auction yet.
```

Budget 45 to 60 seconds. Watch, judge, move, then the foot line as the reason it never stops: a
validator worth staking last epoch may not be worth it in this one. Then hand over on the third
card. Move is the one that looks trivial on the slide and is not.

**Deliberately not on stage: permissionless cranks.** Too much detail for a 20 minute talk, decided
2026-08-23. Kept here only as Q&A ammunition. The mechanism is permissionless and the policy is not:
`update_active`, `update_deactivated` and `merge_stakes` take no signer at all, `stake_reserve` and
`deactivate_stake` want a signer only as rent payer, and `add_validator`, `remove_validator`,
`set_validator_score`, `emergency_unstake`, `partial_unstake` are gated on the manager authority.
The line to use if anyone challenges the word permissionless: *your money stays safe and liquid, it
just stops getting smarter.*

**The competitor beat, optional, two sentences and no names:** most pools have a single key that
names the validator set and can move any amount of stake at any time, and we put the scoring and a
movement cap in the program instead. Then stop. The cap belongs on slide 9.

## 9 · A stake account cannot move sideways

```
GOAL:  moving stake is not bookkeeping, it is a cost. Half the circle pays the
       staker nothing, and there is no shortcut across the middle.
ASK:   so who is even worth moving to?
DEEP:  Solana never enabled redelegation. SPL still ships the instruction,
       marked deprecated. Marinade deleted its own redelegate crank.
WATCH: do not put a number of days on it. Say "an epoch out, an epoch back".
       Epoch time moves, and the deck's rule is no epoch length anywhere.
```

Budget 60 to 70 seconds. Four beats, and the order matters more here than on any other slide:

1. **Walk the ring once, fast.** The names are Solana's own, not ours. Active, Deactivating,
   Inactive, Activating.
2. **Then the two corrections**, because both are counterintuitive and both are on the slide.
   Deactivating still earns, the stake stays effective for that epoch. Inactive and Activating are
   the ones that pay nothing, and from a rewards point of view they are the same thing. That is why
   the yellow is half the ring and not one box.
3. **Then the missing arrow.** A validator goes down, or quietly raises its commission against your
   stakers. The obvious move is to pull the stake now. There is no now. The account has to go all
   the way round, and half of that circle pays you nothing.
4. **Then the consequence, which is the actual point of the slide.** Every rebalance is a trade.
   Yield lost going round, against yield lost by staying put. React to every wobble and you cost the
   stakers more than the wobbles do.

Beat 4 is what makes the slide worth its time. Without it this is a state diagram. With it, it is
the reason the system is deliberate rather than twitchy, and it retro-justifies slide 8: watching
constantly is cheap, acting is not.

**Do not explain the four states.** The room needs two facts, that half the circle earns nothing and
that there is no line across the middle. Anything more and you are teaching the stake program.

**The analogy, if the room looks lost.** Switching energy supplier. You cannot jump from one to the
other. You give notice, you sit out the notice period, and only then do you start with the new one.
The notice period is the cost.

**Held in reserve, for "so can you do whatever you like with my stake?"** No, not in one epoch. The
program caps how much of everything under management can move per epoch, and the counter resets each
epoch. Say it in plain words, leave the parameter name out of the room.

## 10 · Bonds. Validators back their word with their own SOL.

```
GOAL:  a validator puts its own SOL up to get Marinade stake. A promise
       becomes an account you can read.
ASK:   so how do you actually get me more than the protocol pays?
DEEP:  one bond, two jobs. It covers the stakers' lost rewards when the
       validator underperforms, and it is where a promised share is paid from.
       Public figures: 100% of rewards lost when uptime falls between 50% and
       99%, and commission raised mid-epoch, which their own page calls
       commission rugging.
WATCH: say "slash" once, with the correction attached, then drop it.
```

Budget 45 to 60 seconds. Nothing is on this slide but the picture and the line, so everything is
spoken. Note the speaker notes still mention a foot line as the setup and that foot line no longer
exists on the slide. Do not go looking for it on screen.

**Why this slide sits before the auction.** A validator has to fund a bond before it can bid. Order
follows mechanism, so the collateral comes first and the market second.

**Keep it on the validator's side.** They are not the problem. They choose to post collateral so
that stakers can be promised a floor without anyone being asked to trust Marinade. The poker picture
carries both halves by itself: money on the table before you play, and losses coming out of your own
pile rather than the house's.

**The slash correction, once:**

> We slash the validator. And I should say what I mean, because on Solana slashing means the
> protocol destroys your stake. We cannot do that and we do not. We take from a bond the validator
> posted, to cover the rewards you did not get. Your principal is never touched.

Then drop back to "the bond covers the loss" for the rest of the section.

**The spoken setup for the auction**, which is what makes the handoff work: Solana has no way for a
validator to hand you a share of its block rewards. SIMD-0096 sent 100% of priority fees to
validators, SIMD-0123 adds the sharing, it passed governance in March 2025 and it is not live. Until
then there is no native path, and the next slide is the one Marinade built.

---

## 11 · Validators bid for your stake

```
GOAL:  the stake goes to whoever pays most for it, and the price is set by the
       last winner, so every winner is paid the same rate.
ASK:   that is a promise. Nothing has moved. How does a promise become money in
       my wallet?
DEEP:  what you earn is three things: inflation, MEV, and the bid. The first two
       come from Solana. The third exists only because there is an auction.
WATCH: not a mechanism deep dive. The previous deck did last-price pricing for a
       room that already knew SAM. This is not that room.
```

Budget 60 to 70 seconds. Four beats, then one sentence that does the real work:

1. **Bid.** A validator offers to give back a share of the rewards it will earn from carrying your
   stake.
2. **Allocate.** Highest first, until the stake runs out.
3. **Clear.** The last winner in sets the price.
4. **And everyone who won is paid that rate, not their own bid.**

Then the sentence to land, because it is the only piece of mechanism design in the talk:

> So bidding honestly never costs you anything. That is what stops this becoming a race to the
> bottom.

**Then why a validator would do it at all**, in one line: more stake earns more, so giving up a
slice to win the stake pays for itself. That slice is the third source of yield, and it is the one
that does not exist anywhere else.

**This slide is also the answer to slide 9.** Who is worth moving to? The ones who pay enough to
cover the cost of moving. The connective clause is cheap if wanted: *and because moving costs, the
auction tells us in what order to move, not just where to end up.* One clause, then stop.

**Optional, for the record**: Marinade calls it the Stake Auction Marketplace. Nothing in the talk
depends on the name and the slide does not say it.

**Do not put the unit on stage.** The decomposition is real and it is three fields in a struct, but
per-mille-per-epoch needs explaining and buys nothing. Say inflation plus MEV plus bid, in words.

---

## 12 · From promise to payment

```
GOAL:  the loop closes. Every epoch, what was promised gets measured, written on
       chain, and reaches the staker. Same bond pays the bid and covers the
       losses.
ASK:   everything so far has been an on-chain program holding your SOL. What if
       you do not want a program at all?
DEEP:  what actually moves is two things on one rail. The share a validator
       promised in the auction, and the rewards the bond covers when it
       underperformed. One deposit, two payouts.
WATCH: no merkle trees, no pipeline, no distribution CLI unless asked. And leave
       "the claim is permissionless" out, same reason it was cut on slide 8.
```

Budget 50 to 60 seconds. The four beats on screen read themselves, so do not narrate them. Say them
once, quickly, then spend the time on what flows through them:

> The bid a validator promised, and the rewards it owes you when it underperformed. Both come out of
> the same bond, and both end up with the staker.

That sentence is the payoff for slides 10 and 11 together, and it is why the bond slide came before
the auction.

**The one thing worth adding**, because it is the actual claim of the slide: this runs every epoch
whether anyone is watching or not. It is not a payout somebody decides to make.

The Scrooge callback lands on its own. Same duck, first time dreaming about the money, now doing the
paperwork. Do not point at it.

**The handoff, and it is the most important one in the deck.** A section seam, so say it deliberately
and do not rush into the next slide:

> Everything I have shown you so far lives in an on-chain program, and that program holds your SOL.
> For most people that is fine. Some people do not want that at all.

Then the painting comes up and the stamp says Native staking. The phrase **on-chain program** has now
been planted three times, on slide 6, here, and in that sentence. That repetition is what makes the
Native section land without any setup of its own.

---

## 13 · Not everyone wants a program holding their SOL

```
GOAL:  the reversal. In liquid staking the program took the SOL. Here nothing
       does. Same delegation brain, opposite custody.
ASK:   so if you never hold my SOL, what exactly are you holding?
DEEP:  the escape hatch, and it is the strongest thing on this slide for this
       room. Worst case you reclaim the authority and withdraw with the Solana
       CLI, without Marinade. Publicly documented in how-to-native-staking.
WATCH: say "no program holds your SOL", not "no smart contract". A proxy program
       does exist, it just never touches funds. That is slide 15, do not pre-empt
       it and do not overclaim here.
```

Budget 50 to 60 seconds. Five beats, and beats 2 and 3 are the same feature sold to two completely
different people:

1. **The reversal**, said as the answer to the seam just opened. The stake account stays in your
   wallet. Marinade only ever manages the delegation.
2. **Retail why.** Some people are simply not comfortable with a program custodying their funds, and
   plenty of stakers do not want a liquid token at all. They want the delegation managed and nothing
   else.
3. **Institutional why, same requirement for a different reason.** No token means nothing to account
   for. No program holding funds means a much shorter audit conversation.
4. **It compounds by itself.** Rewards land straight in the account each epoch. Nobody claims
   anything, nobody restakes anything.
5. **The escape hatch.** In the worst case you take the authority back and withdraw with the Solana
   client, without us.

Beat 5 is the one to slow down on. It is the only falsifiable claim in the section, and this room
respects a claim it could go and check.

**On the institutional line, keep it generic.** Say custodians and ETP issuers. Have the names ready
if somebody asks, do not list them from the stage. A roll call turns a technical talk into a sales
deck for fifteen seconds, and the room feels it.

**The analogy, the cleanest one in the talk.** A power of attorney. You keep the account in your own
name, and you sign a limited mandate letting somebody move money between products for you. They
cannot take it out.

**Reserve, if asked how compounding really works.** Staking rewards land inside the stake account and
are already delegated, so they compound with no action. MEV is the exception: it arrives as
undelegated lamports sitting in the account earning nothing, which is why there is a job that splits
it off and stakes it. Only if asked.

---

## 14 · Solana splits the keys

```
GOAL:  custody is two fields, and Marinade only ever holds one of them. Not
       marketing, mechanics.
ASK:   so who, or what, is actually holding that staker key?
DEEP:  the callback. Those two epoch numbers in the middle block are the ring
       from the Liquid section. Nobody maintains a status field. The state is two
       numbers compared against the current epoch.
WATCH: do not read the code out. Three blocks, one sentence each.
```

Budget 60 to 70 seconds. Five beats. The three blocks are one object seen three ways, so name what
each one is for and move on:

1. **Top.** The account is an enum, and the variant is the state.
2. **Middle.** Everything that hangs off it. Every field of a stake account is on this slide. Meta is
   custody, Stake is the delegation.
3. **Bottom.** Two fields, and the whole product rests on them. One may delegate. One may take the
   money.
4. **The claim, said plainly.** The staker authority can delegate, split, merge and deactivate. It
   cannot move a single lamport out. The withdrawer can, and the user keeps the withdrawer. Always.
5. **The callback.** `activation_epoch` and `deactivation_epoch` in the middle block are the ring
   from earlier. That state is not something anyone maintains. It is arithmetic against the current
   epoch.

Beat 5 is the best thing on this slide for this room, and it costs one sentence. It also retro-earns
the middle block, which otherwise looks like showing off.

**The comments on the bottom block are ours, the fields are Solana's.** Worth saying. It is a
credibility detail: not paraphrasing the chain, pointing at it.

**Solana's own delegation sentence, once per talk.** If it was already spent on slide 4, do not use it
again. If it was saved, this is the better slide for it: *delegating your tokens to a validator does
not give the validator ownership or control over your tokens.*

**The analogy.** Two signatures on a bank mandate. One lets somebody manage the money, the other lets
somebody take it out. Solana keeps them separate at the account level, and Marinade is only ever on
the first one. Where it breaks: with a bank there would be lawyers. Here the limit is mechanical,
which is stronger and colder.

---

## 15 · Nobody at Marinade holds a keyring like this

```
GOAL:  the staking authority is a program address, so there is no key to leak.
ASK:   the key is safe. So what does Marinade actually do with that authority?
```

Easy to show, easy to get wrong to say. Two rules.

**Say the picture is the thing Marinade did not build, first.** That is a hot wallet, a keyring
somebody has to carry, and every key on it can leak. Say the line before the framing and the joke
inverts: the room thinks you are showing off your own vault.

**Then use the recovery argument, not the obvious one.** The obvious defence is that a staking
authority cannot steal anything, so a leaked key would be survivable. That is weak and this room will
find the hole. The real problem is that only the *owner* can revoke a staking authority, so a leaked
Marinade key could not be rotated by Marinade. Every user would have to act individually, on every
stake account they hold. Unfixable from our side, so the key must not exist. Hence a program address
with no private key.

## 16 · Three ways to run it

```
GOAL:  same custody in all three. Only the policy changes.
ASK:   three policies, one custody model. So what happens the day I want out?
DEEP:  Recipes is DCA. The principal stays in SOL and only the yield is
       converted, epoch after epoch, into a token you picked. Dollar cost
       averaging paid for by staking rewards instead of out of your wallet.
WATCH: describe Recipes by its payout rail only, never by where the stake is
       delegated. And say the price-risk caveat, it costs one sentence.
```

Budget 50 to 60 seconds. Five beats:

1. **Open with the constant, not the menu.** Same custody model in all three, only the policy
   changes. That sentence is what keeps the section from becoming a product list.
2. **Max Yield.** The retail default. Follows the auction winners, so everything from the Liquid
   section applies to it unchanged.
3. **Select.** Curated, identity-verified operators. This is the institutional conversation.
4. **Recipes**, framed as DCA. One sentence: your principal stays in SOL, only the yield gets
   converted, bit by bit, into a token you chose.
5. **Read the token list off the slide and let it land.** Stablecoins, utility tokens, and then
   `$FWOG` and `$NOBODY`.

Beat 5 is the deck's one tonal snap and it is earned, because it lands immediately after the most
institutional card on the slide. The room will not expect it. Do not apologise for it and do not
explain the joke: these are real payout rails on a real product page.

**Then the caveat, one sentence, and it buys trust:** the price risk is on the payout token, not on
the stake. The SOL principal is untouched.

**The analogy.** Choosing a savings account. Best rate, screened providers only, or paid out in a
different currency. Same money, same custody, three policies.

---

## 17 · Getting out is the hard part

```
GOAL:  delegating is easy, leaving is the engineering. Many accounts, many
       rounds, real time.
ASK:   and you still wait for that withdrawal. What if I want the SOL right now?
DEEP:  1232 bytes. Say the number, it is the best line in the section.
WATCH: the funnel does not animate in a pptx, so the slowness has to come from
       you. And do not reach for the "we kept our own mirror of state" contrast,
       that opens the war story that was cut.
```

Budget 70 to 80 seconds. Five beats:

1. **The thesis.** Delegating is easy. Un-delegating is where the engineering is.
2. **Why.** Good decentralisation means the stake sits on a hundred validators, so it is a hundred
   stake accounts.
3. **What a withdrawal actually is.** You ask for an amount. Something has to work out which accounts
   add up to it, deactivate each one, wait, and then merge what comes back so you can withdraw in a
   single transaction.
4. **The number.** And none of that fits in one transaction, because a Solana transaction is 1232
   bytes. That one limit is why there is a pipeline and a queue instead of a button.
5. **The design detail.** There are two authorities. Moving an account to the exit authority is what
   marks it as leaving, so the authority *is* the state. Nothing to fall out of sync, because there is
   no status field anywhere.

Beat 4 is the one this room came for. It is the moment where engineering turns out to be arithmetic
about limits, and it costs one number.

Beat 5 pairs with slide 14 and it is worth saying so, in half a sentence: on the stake account the
state was two epoch numbers rather than a status, and here the state is which authority holds the
account. **Same instinct twice: do not store what you can derive.** That makes the two slides one
argument.

**Because the animation is gone**, put the time in the words. The claim is that leaving takes many
rounds, so say *batch, wait, batch, wait* rather than describing a diagram that is standing still.

**The analogy.** Closing twenty small savings accounts. Each has its own notice period, you can only
file so much paperwork a day, and at the end you consolidate what comes back into one account.

---

## 18 · Somebody buys your stake account

```
GOAL:  the cooldown does not disappear, it changes hands. One transaction, both
       legs or neither.
ASK:   fine, but why would anybody buy it, and what does that cost me?
DEEP:  it works on any active stake account, even one Marinade never delegated.
       That is a genuine surprise and it is public.
WATCH: the public vocabulary is "buyer". The product page never says "auction",
       so neither do the slides. The mechanics beats stay spoken and live only in
       the private note under $K.
```

Budget 45 to 55 seconds. Five beats:

1. **The seam answer, first sentence out loud.** Even after all that machinery, Solana still makes you
   wait out the cooldown. So what if you want the SOL now?
2. **The mechanism, simpler than the room expects.** An atomic swap. Your stake account goes to a
   buyer, their SOL comes to you, in the same transaction.
3. **Both legs or neither.** No partial fill, no counterparty risk, nothing in flight.
4. **The cooldown did not go anywhere.** Somebody still sits through it. That somebody is now the
   buyer.
5. **And it works on any active stake account**, including ones never delegated through Marinade.

Beat 4 is load-bearing. It is the entire setup for the next slide, because once the room accepts that
somebody has to wait, the price stops looking like a fee and starts looking like payment for time.

Beat 5 is the one that gets a reaction from engineers. It says the product is a primitive over the
stake program rather than a feature bolted onto Marinade's own bookkeeping.

**The analogy.** Selling a fixed-term deposit certificate to somebody else instead of breaking it
early. The term does not change, the holder does.

---

## 19 · Somebody has to want it

```
GOAL:  the gap is payment for time, not a fee. Somebody is being paid to be
       patient.
ASK:   none. Hand off: three products, and every one of them is a different
       answer to something Solana makes hard.
DEEP:  the symmetry, spoken. This is the second market in the stack. Where the
       protocol gives no price, Marinade builds one.
WATCH: never call the gap a fee. Marinade charges nothing for unstaking, so the
       discount goes to whoever does the waiting.
```

Budget 45 to 55 seconds. Four beats, and the whole slide is naming who is on each side:

1. **You get** SOL now, slightly less than the account holds.
2. **They get** the account, and the wait that comes with it. They are willing to sit through it.
3. **The gap** between those two numbers is the whole price, and it is a price for time. Nothing else
   is in it.
4. **Then the reassurance.** Marinade takes no fee for unstaking, and the number is on screen before
   anything is signed.

Beat 4 is not decoration. Without it the room hears "a little under what the account holds" as a
hidden cut, and the trust built over eighteen slides pays for it.

**The symmetry is the best thing to add here**, and it sets up the summary for free: this is the
second market in the talk. Validators bid to get stake, buyers bid to take a stake account off your
hands. Both exist because the protocol offers no price for the thing people actually want. Keep the
wording generic, since the product page never says auction.

**The deeper mechanics stay spoken and unwritten.** The full ninety second version, the auction
vocabulary and the pairing line are in the private note under `$K`. Nothing about them belongs in this
repo, including this file.

**The analogy, and everybody in the room has done it.** Selling a ticket below face value because you
need the money before the event. The discount is the price of not waiting, and the buyer is being paid
to be patient.

---

## 20 · Marinade knows how this works

```
GOAL:  the claim is knowledge, not size. And it is earned by evidence the room
       just watched, not asserted.
ASK:   none. This is the answer.
DEEP:  name the three gaps. That is what turns the punch line from a slogan into
       an argument.
WATCH: do not pitch. No superlatives, nothing that invites an argument, and the
       close is one sentence that never appears on screen.
```

Budget 50 to 60 seconds. Four beats:

1. **Point at the rail.** It is lit end to end for the first and only time in the deck. Everything on
   it was covered. That costs no words, so use it and move on.
2. **Say the message plainly, then stop talking.** Marinade knows how this works. Not the biggest, not
   the best. Knowing how it works is the thing on offer.
3. **The three lines are callbacks, so name the evidence rather than repeating the claim.** Watching is
   the monitoring and the epoch clock. A promise you can read is the bond and the settlement. Getting
   out is the funnel and the buyer.
4. **Read the punch line, then finish it out loud.** The slide only says *the machinery is temporary,
   that is the point.* The room needs you to complete it.

**Finishing the punch line.** Name the three gaps, because they are three callbacks to three different
sections and the room will recognise every one:

- Priority fees the protocol cannot share back.
- Stake that cannot move sideways.
- A hundred accounts that do not fit in one transaction.

Then the point: every one of those is scaffolding around a gap in the chain. When SIMD-0123 activates
or the transaction limit rises, the scaffolding goes. **We would rather delete code than defend it.**

That is where the talk's connective idea finally surfaces, as a payoff rather than a thesis. Do not
explain that it has been running underneath all along. Let the room notice.

**The close, spoken once and never printed:**

> If you are deciding who manages your stake, pick the people who can explain it to you.

That is the entire ask of the talk. One sentence, then the closing slide. The room has just watched
twenty minutes of evidence, so anything more sounds like doubt.

---

## Still to write

Closing and the MEV appendix, 21 and 22.
