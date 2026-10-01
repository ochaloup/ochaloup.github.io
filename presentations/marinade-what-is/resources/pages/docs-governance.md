> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/governance.md).

# MNDE Governance

Marinade is governed by people that lock MNDE and obtain veMNDE.

## DAO Constitution

Marinade is owned by MNDE holders that lock their tokens in [Realms](https://app.realms.today/dao/MNDE) to obtain veMNDE. In a previous vote, MNDE holders ratified this [Constitution](https://forum.marinade.finance/t/marinade-dao-constitution/468) that highlights the goals of Marinade as a DAO.

**1. The Marinade DAO builds a censorship-resistant layer of Solana**

The DAO builds the risk-management infrastructure to provide improved security and capital efficiency for the Solana network and the users through SOL liquid staking. Marinade governance will support development connected to the censorship resistance and liveness topic. It will support the ecosystem to build on top of Marinade but will not pursue building its second-layer DeFi primitives such as lending protocols, stablecoin, DEX, options, etc.

**2. Separation of powers**

To allow flexibility and predictability, the critical system parts are owned by the Marinade governance, and the operational control and funding are granted to the core team.

* Marinade Governance (MNDE token holders + ecosystem council): main program upgrade, MNDE treasury
* Marinade Core Team (team council): main program params, DAO program, fees

**3. Fees usage**

The primary usage of fees is to fund the team operations and further protocol development. The excess of fees accumulated is governed and decided by the DAO.

**4. MNDE distribution goals**

The incentives should be aligned with the objectives of the DAO. Starting with the fair launch, the Marinade governance plans to keep continuity in its objective for the DAO ownership to be well-spread in the ecosystem to benefit all the actors powered by secure Solana.

**5. Amendments to this constitution by majority vote**

Any change may be made to this constitution only by a two-thirds majority and at least 1% of all tokens participating.

***

## DAO Structure

As planned by the constitution above, Marinade has split the powers and responsibilities in the following way:

**MNDE holders** - *All MNDE holders that locked their MNDE to obtain governance power*

* Ownership of Marinade's treasury
* Ownership of the upgrade authority and admin parameters for Marinade Native, validator bonds, Recipes, gauges and the rest of the contract surface

The **main mSOL liquid staking program** is the exception. Its upgrade authority still sits on the Solana ecosystem multisig rather than with the DAO. See Multisig governance.

**Marinade Council** - *A set of 5 contributors elected internally to drive operations, holding a 3-of-5 multisig on Realms.*

* Power to update the contract parameters (see this)
* Use the protocol fees to conduct operations
* Access to Marinade's operational wallet (containing earmarked budgets voted on by the DAO)

The same five contributors also form the **Emergency Pause Council**, which holds pause authority on the main mSOL program and on validator bonds under a separate 3-of-5 threshold.

The five seats are verifiable: the DAO's council mint `6MGwpuJ5YE1c8jJaF8FKurQdDJeYRf1adX76dovkXxRs` has a supply of exactly 5, at zero decimals, so five council tokens exist and five seats are filled.

{% hint style="info" %}
Marinade considers that all governance participants agree to follow this [Code of Conduct](https://forum.marinade.finance/t/marinade-dao-code-of-conduct/470), ratified by the DAO.
{% endhint %}

***

## Lock MNDE for veMNDE

In order to participate in Marinade's governance and benefit from MNDE's utility, you will need to lock it in [Realms](https://app.realms.today/dao/MNDE) to obtain veMNDE. Unlocking your tokens to get back your MNDE will start a 30-day unlock process.

When locking your MNDE, **make sure to choose the following settings:**

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FktJ5vMNymXRrDTX6oOT7%2Fimage.png?alt=media&#x26;token=dfba016b-beb8-49c7-b9cc-0991105b838c" alt="" width="326"><figcaption><p>Make sure to set the lockup time and the number of days before confirming the transactions.</p></figcaption></figure>

{% hint style="danger" %}
Realms offer two options, "Deposit" and "Lock tokens". Make sure to only use "Lock tokens" as depositing tokens will not give you any voting power in Marinade governance.
{% endhint %}

{% hint style="info" %}
**Your voting power tracks your remaining lock time.** It is calculated from how long your lock still has to run, up to a 30-day maximum. That means it **decays gradually while you are unlocking** rather than disappearing the moment you start. **You can still vote during the 30-day unlock period**, with progressively less weight as the period runs down.
{% endhint %}

{% hint style="warning" %}
If you owned Marinade NFTs containing locked MNDE, a migration tool is available on the [MNDE migration page](https://old.marinade.finance/mnde/).
{% endhint %}

Once your wallet has locked MNDE tokens in Realms, you can use your veMNDE power to vote on proposals from [Marinade's governance page](https://app.marinade.finance/governance/) or directly in [Realms](https://v2.realms.today/dao/899YG3yk4F66ZgbNWLHriZHTXSKk9e1kvsKEquW7L6Mo/proposals).

***

### Realms setup

Marinade's Realms is configured with the following parameters:

| Role                           | Address                                        |
| ------------------------------ | ---------------------------------------------- |
| Realm (pubkey)                 | `899YG3yk4F66ZgbNWLHriZHTXSKk9e1kvsKEquW7L6Mo` |
| Authority                      | `FsrqQfLGdFVtySSSsyZJUzVBA9bvGZSKyhp7nsJCqgJe` |
| Owner (SPL governance program) | `GovMaiHfpVPw8BAM1mbdzgmSZYDw2tdP32J2fapoQoYs` |
| Community mint (MNDE)          | `MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey`  |
| Council mint                   | `6MGwpuJ5YE1c8jJaF8FKurQdDJeYRf1adX76dovkXxRs` |
| Voter Stake Registry program   | `VoteMBhDCqGLRgYpp9o7DGyq81KNmwjXQRAHStjtJsS`  |
| VSR registrar                  | `5zgEgPbWKsAAnLPjSM56ZsbLPfVM6nUzh3u45tCnm97D` |

All subgovernances and their parameters can be consulted on [this page](https://app.realms.today/dao/MNDE/params).

***

### FAQ

#### Where are governance items discussed and how do I find out about them?

Governance topics will always be discussed on [Marinade Forum](https://forum.marinade.finance/) to be thoroughly analysed. Once the discussion has been finalized, it can be submitted for a vote.

There will also be announcements on Marinade's [Discord](https://discord.gg/yTdH8YkYKg) when a proposal is active and can be voted on. Our Discord is also an excellent place to talk about ongoing governance proposals.

#### Where can I trade MNDE?

MNDE tokens can be acquired or sold on any DEX in the Solana ecosystem. We recommend using [Jupiter aggregator](https://jup.ag/) to find the best prices.

#### Where do I lock MNDE?

MNDE can be locked for veMNDE on [Realms](https://v2.realms.today/dao/899YG3yk4F66ZgbNWLHriZHTXSKk9e1kvsKEquW7L6Mo/my-governance).

#### What is veMNDE?

veMNDE is the representation of your governance power in Marinade DAO. Locking MNDE in Realms results in your wallet having veMNDE power.

veMNDE is not a fungible SPL token you can trade or see in your wallet.

#### Can I vote while my MNDE is unlocking?

**Yes.** Voting power is derived from your remaining lock time, so it decreases steadily across the 30-day unlock rather than dropping to zero when you start. Halfway through the period you still hold roughly half the weight of a full lock.

#### What should I do with my Chef NFTs?

Marinade Chef NFTs have been deprecated. A migration tool will burn your NFT and let you either withdraw your MNDE or transfer the locked MNDE to Realms. Visit the [MNDE migration page](https://old.marinade.finance/mnde/) to complete the migration.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/governance.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
