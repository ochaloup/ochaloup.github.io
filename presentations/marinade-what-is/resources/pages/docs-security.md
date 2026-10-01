> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/security.md).

# Security

Security has always been a primary concern for Marinade. We are doing everything we can to set a high standard for security in our protocol and in the Solana ecosystem.

Marinade's security and availability commitment: <https://public.marinade.finance/security-and-availability-commitment.pdf>

## On-chain contracts

A list of Marinade's on-chain smart contracts is available here:&#x20;

{% content-ref url="/pages/-MgSaldkFEKrc9TetKtH" %}
[Contracts & Tokens Addresses](/developers/contract-addresses.md)
{% endcontent-ref %}

{% hint style="info" %}
The **referral program is paused** and there is currently no referral interface, so ordinary staking goes to Marinade's own programs. No partner fees are paid while it is paused, including under agreements signed before the pause. If the program relaunches and you stake through a referral link, the contract you interact with will be the referral program rather than Marinade's main smart contract. Either way, verify the program you are signing against the published address list above before you approve a transaction.
{% endhint %}

***

## Risks

When you participate in DeFi, you always expose yourself to risks. An investor's job is to mitigate these risks and stay informed on them to make the best possible decisions. Let's see what different types of risk exist when you use Marinade and how we worked to mitigate them.

***

## Technical risks

### Blockchain risks

When you use Marinade.Finance, you use a protocol that relies on the Solana blockchain. If the Solana blockchain were to be attacked successfully, the funds on Marinade could be at risk.

**Marinade's recipe**: Solana was chosen for many reasons, one of which was that it has high security. Solana has been audited by [Kudelski Security](https://solana.com/solana-security-audit-2019.pdf) and is a blockchain that operates with a hybrid consensus mechanism, integrating [Tower BFT](https://medium.com/solana-labs/tower-bft-solanas-high-performance-implementation-of-pbft-464725911e79) and [Proof-of-History](https://medium.com/solana-labs/proof-of-history-a-clock-for-blockchain-cf47a61a9274). You can learn more about Solana through their [whitepaper](https://solana.com/solana-whitepaper.pdf).

### **Contract risks**

In DeFi, any protocol can potentially be attacked by hackers. They will look for loopholes and bugs that allow them to abuse the protocol for their gain.

**Marinade's recipe**: We emphasize security and have been conducting formal audits all along the way. We have successfully completed **6 audits and 1 code review**, the most recent by Neodyme in May 2026. We also opened a **bug bounty** with Immunefi. Click on the pages below to access them.

{% content-ref url="/pages/eRcscM4eAiImXPmN351v" %}
[Bug Bounty](/developers/bug-bounty.md)
{% endcontent-ref %}

{% content-ref url="/pages/2CZjncZ5uKIxadVCPGoY" %}
[Audits](/marinade-protocol/security/audits.md)
{% endcontent-ref %}

## Financial risks

### Trust risks

As you may know, DeFi can be a brutal environment, and some actors have already abused the trust of people using their services. We did not want this to be a possibility with our protocol.

**Marinade's recipe**: no single party can change Marinade on their own. Authority is split across four layers rather than held by one multisig:

* The **mSOL liquid staking program** can only be upgraded by an **ecosystem multisig that requires 6 signatures out of 13**, where the majority of signers are founders and teams from other Solana projects. Marinade alone cannot reach the threshold.
* **Everything else**, including Marinade Native, Marinade Select, Validator Bonds, Recipes, gauges and referrals, sits under **MNDE-locked DAO governance** on Realms.
* Day-to-day operations sit with the **Marinade Council, 3 of 5**, within bounds the DAO sets.
* Emergency **pause** authority sits with a separate **3-of-5 Emergency Pause Council**, which can pause but never upgrade.

Click the page below for the full breakdown, including the on-chain addresses for each layer.

{% content-ref url="/pages/exT8z4HG74Dll3vHgbwK" %}
[Multisig governance](/marinade-protocol/security/multisig-governance.md)
{% endcontent-ref %}

### Legal risks

When you use Marinade, you take full responsibility for your actions. It is your duty as an investor to check the current regulations in your country of residence and to act accordingly.

**Marinade's recipe**: All our legal content can be found on the page below. If you have any doubts, please get in touch with your financial authorities for confirmation.

{% content-ref url="/pages/JMLAmI4ZHC5RuIdvmZ7B" %}
[Legal](/marinade-protocol/legal.md)
{% endcontent-ref %}


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/security.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
