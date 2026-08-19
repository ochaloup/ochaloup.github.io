# Punchlines

Lines to say out loud, or to have ready when asked. Not slide copy. Most are deliberately not on
any slide, because a sentence lands harder when the screen is not already saying it.

Grouped by when you would use them. Everything here is backed by something in `research/`.

## The ones to actually land

The three worth memorising.

> **Your money stays safe and liquid. It just stops getting smarter.**

What happens to Marinade Liquid if Marinade disappears tomorrow. Anyone can turn the cranks, so
the mSOL price keeps updating and you can still unstake. What stops is the scoring. Use it the
moment somebody challenges the word "permissionless".

> **A promise becomes an account you can read.**

Why bonds exist. It is the whole argument for on-chain collateral in eight words.

## On being permissionless

> The mechanism is permissionless. The policy is not.

> Anyone can turn the crank. Only we decide where the stake goes.

> If we vanished, the contract would keep running. It would just keep making the same decision
> forever.

> Anyone can turn the crank. In practice we are the ones who do, because we are the ones who
> care, and because nobody pays you to turn it.

The honest version, and it is stronger than implying a decentralised keeper economy. Permissionless
means nobody can lock you out or hold the system to ransom. It does not mean a crowd of
independent operators is competing to run it. Jito is in exactly the same position: their keeper
keypair "signs and pays for all transactions", with no reward mechanism anywhere.

## On the auction

> Everyone who wins is paid the same clearing rate, not their own bid. So bidding honestly never
> costs you anything.

The fairness point, and the reason the auction does not become a race to the bottom.

> Every stake pool has somebody who decides where your stake goes. The interesting question is
> what that somebody is. A person, a program, or a market.

The comparison slide in one sentence. Also the polite way to talk about competitors.

> A validator with more stake earns more. So it is worth giving a slice of that back to get the
> stake in the first place. That slice is your extra yield.

## On rebalancing, and the limits of our own power

> A validator goes down, or quietly raises its commission against our stakers. The obvious move
> is to pull the stake right now. We cannot. Solana never enabled redelegation, so stake cannot
> move sideways. It has to come out, sit idle earning nothing, and start again somewhere else.

The hard engineering, in the form to say out loud. Then the consequence:

> So every rebalance is a trade. The yield lost while the stake is idle, against the yield lost
> by leaving it where it is. Reacting to every wobble would cost the stakers more than the
> wobble does.

> You cannot move stake sideways on Solana. Redelegation was never enabled. To move stake from
> one validator to another you take it out, wait, and put it back.

Why rebalancing is deliberate rather than constant, and why the auction has to decide what is
*worth* moving rather than just where things should end up.

> So can we do whatever we like with your stake? Not in one epoch. The program caps how much can
> move, as a percentage of everything under management, and it resets every epoch.

The answer to the obvious follow-up after admitting the policy is Marinade's. The cap is
`max_stake_moved_per_epoch`, enforced on chain.

> The policy is ours. The program bounds how fast we can apply it.

> Jito built the same cap. Different architecture, theirs on chain and ours off it, same rate
> limit for the same reason. Neither of us chose that constraint. Solana did.

> We watch every validator on Solana, every epoch, and we move the stake toward the ones worth
> being on. That is the product. The token is just how you hold it.

The message of the "somebody has to choose" slide. The machinery is the thing, not the choice.

> That staker key cannot steal your principal. It can destroy your yield.

The honest risk statement for a stock SPL pool. The staker cannot withdraw, because withdrawals
burn pool tokens, but nothing in the program caps how much stake it churns. Everything sitting in
warm-up and cool-down earns nothing.

**Caveat, and say it if pushed:** all of that assumes the program itself is correct. Every claim
of the form "the authority cannot do X" is really "the authority cannot do X, given the program
has no bug". Marinade's own delinquent-stake story is proof that on-chain code meets situations
its authors did not foresee. Do not oversell program guarantees as absolutes.

> Everyone can rebalance. Nobody can steal. The question is whether anything limits how fast, and
> in a plain SPL pool the answer is no.

Verified: Steward has `scoring_unstake_cap_bps` 750, `instant_unstake_cap_bps` 1000,
`stake_deposit_unstake_cap_bps` 1000, with the stated purpose of preventing "yield drag from
excessive unstaking". Marinade has `max_stake_moved_per_epoch`. Generous to a competitor, and it
proves the point about chain limits without arguing it.

## On bonds and PSR

> We slash the validator. And I should say what I mean, because on Solana slashing means the
> protocol destroys your stake. We cannot do that and we do not. We take from a bond the
> validator posted, to cover the rewards you did not get. Your principal is never touched.

Say it once, exactly like this, then drop back to "the bond covers the loss". Naming your own
imprecision before the room does converts an objection into credibility.

> Staking rewards are paid for voting. A validator that is down is not voting. So it is not that
> we punish downtime, it is that there were never any rewards to pay you.

## On native staking

> Solana splits the right to move your stake from the right to take it. We only ever hold the
> first one.

The entire "no smart contract risk" claim, mechanically true, no marketing.

> Delegating is easy. Un-delegating is where the engineering is.

The thesis of the whole Native section.

> Your stake is spread over a hundred validators. That is good for the network and miserable for
> you the day you want to leave.

> All of that machinery exists because a Solana transaction is 1232 bytes.

Say the number. It is the moment the room realises how much of engineering is arithmetic about
limits.

> In the worst case you can reclaim your SOL directly through the Solana client, without us.

## On the appendix war stories

> Nothing was stolen. The state machine did exactly its job. It refused to do something it had no
> rule for, and that is precisely why the money got stuck.

The delinquent stake story. The distinction between protecting correctness and protecting
liveness is the actual lesson.

> Solana shipped an instruction that let anybody deactivate our stake accounts. Not maliciously.
> They were being helpful.

> The migration refuses to declare itself finished unless both passes agree to the lamport.

Worth showing the `require_eq!(delinquent_balance_left, 0)` line next to this.

> We are big enough that being tidy is our responsibility, not a nice-to-have.

The canonical stake story, on why account count matters to the network.

## When somebody pushes back

> Fair. Let me be precise about that.

Then be precise. Works better than defending the simplification.

> We are not the only ones who solved this. We are the ones who solved it first, and then had to
> live with the consequences for five years.

On being the OG protocol, without claiming superiority.

> That is off-chain, and yes, that means you are trusting us on that part.

Never dodge this. The deck's credibility rests on the honest version being said out loud.

## Held back deliberately

Good lines that do **not** go in, recorded so they are not reinvented:

- *"Marinade turns the wait into a price. SPL leaves it as a wait."* Accurate, but assumes the
  listener knows what a pool reserve is and the difference between `WithdrawSol` and
  `WithdrawStake`. It failed on a Marinade engineer, so it will fail on the room. Superseded by
  "Everyone waits two days".
- *"Everyone waits two days. The only question is who."* **Cut 2026-08-18.** It was a favourite here
  and it had its own slide for a while, and Ondra was right to kill both. It states a fact the room
  has already worked out by that point, and it does not tell anyone anything they can act on. A line
  that only sounds good is decoration. The economics it was gesturing at now live on the price slide,
  where they are concrete: you get SOL now, the buyer gets the wait, and the gap between the two is
  the price.
- Anything framing the talk as a thesis about Solana's limitations. The gap-machinery-protocol
  pattern is real and appears in both sections, but it stays spoken connective tissue, never a
  slide and never the headline.
