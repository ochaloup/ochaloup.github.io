# Competitors: Jito, Helius, Sanctum

Product-level comparison, with the on-chain program identified for each. Web-sourced, retrieved
2026-08-12, links at the bottom. Treat the numbers as needing a re-check on the day.

## The headline finding

**Almost nobody writes their own stake pool program. Marinade is the outlier.**

| | On-chain pool program | Validators | Who picks them |
|---|---|---|---|
| **Marinade Liquid** | Own program, Anchor | 100+ | Off-chain auction, SAM |
| **Jito, jitoSOL** | **Stock SPL stake pool**, unforked | ~400 | **On-chain program**, Steward |
| **Helius, hSOL** | Sanctum's SPL deployment | **1** | Nobody, it is their own validator |

Jito is explicit that not forking is a deliberate safety decision. From their docs, jitoSOL runs
on the standard SPL program at `SPoo1Ku8WFXoNDMHPsrGSTSG1Y47rzgn41SLUNakuHy`, and using it
"provides minimal risk compared to deploying or writing our own stake pool implementation". The
same program backs bSOL, laineSOL and Marginfi's LST.

That reframes the earlier "Marinade vs SPL" note. The real question is not *whose pool program is
better*, it is **what each protocol chose to build instead of a pool program.**

## Where each one put its effort

### Marinade: a market

Custom program, and the differentiator is economic. SAM is an auction: validators **bid** for
delegated stake, clearing every epoch, and the bid is shared back with stakers. Plus PSR, where
the validator's bond covers lost rewards. The extra yield comes from **competition between
validators**.

Marinade also built the liquidity pool *inside* the staking program, which is why instant unstake
exists at a scarcity-priced fee.

### Jito: on-chain automation, and MEV

Stock pool, and the effort went into **StakeNet / Steward**, an Anchor program that holds the
staking authority for the SPL pool and does validator selection **on chain**:

- Reads the on-chain Validator History program.
- Every **10 epochs**, scores 1,000+ validators, picks the top **400**, and gives each an
  **equal** share, 1/400th of the pool.
- Runs as a state machine across the 10-epoch cycle.
- Cranking is **permissionless**, anyone can drive it.
- Scoring parameters are set by the Jito DAO.

The extra yield comes from **MEV**, captured by the Jito-Solana client and flowed into the pool.

**This is the most interesting contrast in the whole deck, and it is a direct challenge to one of
the draft takeaways.** The old "what I would tell a builder" list says *put the decision logic
off-chain, put the enforcement on-chain*, on the grounds that a per-epoch auction over hundreds
of validators does not belong in a program. Jito put its selection logic **on chain** and made
the crank permissionless. Two serious teams, opposite answers.

Do not present the takeaway as settled wisdom. Present the trade:

| | Marinade, off-chain | Jito, on-chain |
|---|---|---|
| Cadence | Every epoch | Every 10 epochs |
| Allocation | By bid and score, unequal | Equal, top 400 |
| Verifiability | Merkle-settled results | Logic itself is readable and permissionlessly crankable |
| Flexibility | Change the algorithm without a deploy | Needs a program upgrade or DAO parameters |
| Cost | Off-chain compute is free and unbounded | Bounded by compute limits, hence 10 epochs |

The honest reading: **frequency and expressiveness pushed Marinade off chain, verifiability and
decentralisation pulled Jito on chain.** An auction clearing every epoch over hundreds of
validators is not something you can run inside a program. Scoring on a 10-epoch cadence with an
equal split is. The architecture follows from the product, not from taste.

### Helius: no selection at all

hSOL is a **single-validator** LST. All stake goes to the Helius validator at 0% commission.
Pool address `3wK2g8ZdzAH8FJ7PKr2RcvGh7V9VYson5hrVsJM5Lmws`, running Sanctum's SPL deployment,
listed as `SanctumSpl`.

There is no validator selection problem, because there is one validator, theirs. 0% fees on
issuance and 0% on MEV.

The product insight worth naming: **Helius can afford 0% because the LST is not the business.**
They sell RPC infrastructure. The validator and the LST are customer acquisition. Marinade has no
other business, so the protocol economics have to close on their own. Different constraint, so
different product.

## Where exit liquidity comes from: three answers

This extends the same question from the SPL note, and it is now a genuinely good slide because
there are three distinct architectures.

| | Mechanism | Capital | Price when scarce |
|---|---|---|---|
| **Marinade** | Liquidity pool **inside** the staking program, LP token, SOL and mSOL legs | Rented from LPs | Rises on a linear curve, 0.3% to 3%, hard cap 10% |
| **SPL / Jito** | Reserve stake account only | Owned by the pool | Flat fee, or `WithdrawSol` simply fails |
| **Sanctum / Helius** | **Externalised** to the shared Infinity AMM | Pooled across many LSTs | AMM pricing, shared across all Sanctum LSTs |

Sanctum's model is the clever one to call out: individual validator LSTs are tiny and would each
have terrible exit liquidity on their own, so Sanctum lets any validator mint a branded
single-validator LST and routes them all through **one shared exit pool**. It solves the
liquidity fragmentation that would otherwise make a single-validator LST useless.

So: Marinade owns its liquidity pool, Jito has none and relies on the reserve plus deep secondary
markets, Sanctum shares one pool across everybody.

## Suggested framing for the talk

Do not do a competitor scorecard. It looks defensive, and with other staking providers in the
room at a Solana summit it reads badly. Instead use them to make an architectural point:

> Every LST solves the same three problems: which validators, where does extra yield come from,
> and how do you get out early. Marinade answers with an auction, a bond, and an internal
> liquidity pool. Jito answers with an on-chain scoring program, MEV, and the reserve. Helius
> answers with one validator, zero fees, and somebody else's AMM. All three are coherent. The
> architecture follows from the answer.

That is generous to competitors, technically substantive, and still lands why Marinade's stack
looks the way it does.

## Verify before presenting

- The 400-validator count and the 10-epoch cadence are "currently configured" values set by Jito
  DAO parameters. Re-check.
- Whether Sanctum's `SanctumSpl` is a straight redeployment of SPL stake pool or a modified fork.
  I did not verify the source.
- Marinade's own validator count and TVL, for any side-by-side number.
- hSOL fee claims are from Helius marketing pages, not from code.

## Sources

- [Jito, deployed programs](https://www.jito.network/docs/jitosol/jitosol-liquid-staking/security/deployed-programs/)
- [Jito technical FAQs, why not fork SPL](https://www.jito.network/docs/jitosol/faqs/technical-faqs/)
- [Jito, SPL stake pool internals](https://docs.stakenet.jito.network/advanced/spl-stake-pool-internals.html)
- [Jito StakeNet introduction](https://docs.stakenet.jito.network/)
- [Jito Steward program overview](https://www.jito.network/docs/stakenet/jito-steward/program-overview/)
- [Jito Steward, managing validator states](https://docs.stakenet.jito.network/advanced/managing-validator-states.html)
- [stakenet source, programs/steward](https://github.com/jito-foundation/stakenet/tree/master/programs/steward)
- [Helius, all you need to know about hSOL](https://www.helius.dev/blog/what-is-hsol)
- [Helius, LSTs on Solana](https://www.helius.dev/blog/lsts-on-solana)
- [hSOL stake pool statistics, Solana Compass](https://solanacompass.com/stake-pools/3wK2g8ZdzAH8FJ7PKr2RcvGh7V9VYson5hrVsJM5Lmws)
- [jitoSOL stake pool statistics, Solana Compass](https://solanacompass.com/stake-pools/Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb)
- [sanctum-lst-list](https://github.com/igneous-labs/sanctum-lst-list/blob/master/sanctum-lst-list.toml)
