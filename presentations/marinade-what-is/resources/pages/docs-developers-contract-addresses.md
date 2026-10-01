> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/developers/contract-addresses.md).

# Contracts & Tokens Addresses

Here is a list of the smart contracts and tokens created by Marinade as well as details on their authorities

## Contracts

### Liquid-staking-program&#x20;

Source code: <https://github.com/marinade-finance/liquid-staking-program>\
Address: `MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD`\
Main state account: `8szGkuLTAux9XMgZ2vtY39jVSowEcpBfFfD8hXSEqdGC`\
Stake withdraw authority (PDA): `9eG63CdHjsfhHmobHgLtESGC8GabbmRcaSpHAZrtmhco`\
Upgrade authority: [Ecosystem multisig](/marinade-protocol/security/multisig-governance.md#main-multisig) (6/13) \
Admin authority: [Marinade council](https://app.realms.today/dao/MNDE/params) (4/7)

### SPL Governance Realms program (Marinade council)

Source code: <https://github.com/marinade-finance/solana-program-library>\
Address: `GovMaiHfpVPw8BAM1mbdzgmSZYDw2tdP32J2fapoQoYs`\
Upgrade authority: [Marinade council](https://app.realms.today/dao/MNDE/params) (4/7)\
Admin authority: [Marinade council](https://app.realms.today/dao/MNDE/params) (4/7)

Marinade's [DAO/Realm on-chain](https://app.realms.today/dao/899YG3yk4F66ZgbNWLHriZHTXSKk9e1kvsKEquW7L6Mo) is: `899YG3yk4F66ZgbNWLHriZHTXSKk9e1kvsKEquW7L6Mo`

### Tokadapt

Source code: <https://github.com/marinade-finance/tokadapt>\
Address: `tokdh9ZbWPxkFzqsKqeAwLDk6J6a8NBZtQanVuuENxa`\
Upgrade authority:  [Marinade council](https://app.realms.today/dao/MNDE/params) (4/7)\
Admin authority:  [Marinade council](https://app.realms.today/dao/MNDE/params) (4/7)

### Escrow-relocker (Tribeca plug-in)

Source code: Closed source\
Address: `tovt1VkTE2T4caWoeFP6a2xSFoew5mNpd7FWidyyMuk`\
Upgrade authority: [Marinade council](https://app.realms.today/dao/MNDE/params) (4/7)\
Admin authority: [Marinade council](https://app.realms.today/dao/MNDE/params) (4/7)&#x20;

### Validator gauges

Source code: Closed source\
Address: `va12L6Z9fa5aGJ7gxtJuQZ928nySAk5UetjcGPve3Nu`\
Upgrade authority: [Marinade council ](https://app.realms.today/dao/MNDE/params)(4/7)\
Admin authority: None

### Liquidity gauges

Source code: Closed source\
Address: `LigadctxNRkZied3WuhX525vUhDkuhXNK5DyeijeDnh`\
Upgrade authority: [Marinade council ](https://app.realms.today/dao/MNDE/params)(4/7)\
Admin authority: None

### Liquid staking referral program

Source code: <https://github.com/marinade-finance/liquid-staking-referral-program>\
Address: `MR2LqxoSbw831bNy68utpu5n4YqBH3AzDmddkgk9LQv`\
Upgrade authority: [Marinade council](https://app.realms.today/dao/MNDE/params) (4/7) \
Admin authority: [Marinade council](https://app.realms.today/dao/MNDE/params) (4/7)

### Directed Stake

Source code: Closed sourced\
Address: `dstK1PDHNoKN9MdmftRzsEbXP5T1FTBiQBm1Ee3meVd`\
Main state account: `DrooToPS3MLqgZwBiK2fkAPUTUgKNV3CGb2NqFRAL4Zf`\
Upgrade authority: [Marinade council](https://app.realms.today/dao/MNDE/params) (4/7)\
Admin authority: None

### SPL Gov plugin: Voter Stake Registry

Source code: <https://github.com/marinade-finance/voter-stake-registry>\
Address: `VoteMBhDCqGLRgYpp9o7DGyq81KNmwjXQRAHStjtJsS`\
Main account state: `5zgEgPbWKsAAnLPjSM56ZsbLPfVM6nUzh3u45tCnm97D`\
Upgrade authority: [Marinade council](https://app.realms.today/dao/MNDE/params) (4/7)\
Admin authority: [Marinade council](https://app.realms.today/dao/MNDE/params) (4/7)

{% hint style="info" %}
Marinade also has access to Goki, Quarry and Tribeca's smart contract multisigs as their original authors left Solana. If you're using one of those products, please reach out to us so we can transfer some of the keys to you.&#x20;
{% endhint %}

### Marinade Native Staking proxy

Address: `mnspJQyF1KdDEs5c6YJPocYdY1esBgVQFufM2dY9oDk`\
Staker root account: `4TNsDg9aHCyDt5axK8aDuhgrengnDBGzyHHzKGnTiGtW`\
Marinade Max Yield - Staker authority (marks stake account is under bot control): `stWirqFCf2Uts1JBL1Jsd3r6VBWhgnpdPxCTe1MFjrq`\
Marinade Select - Staker authority: `STNi1NHDUi6Hvibvonawgze8fM83PFLeJhuGMEXyGps`\
Exit authority (marks requested exit for the stake with this auth): `ex9CfkBZZd6Nv9XdnoDmmB45ymbu4arXVk7g5pWnt3N`\
Operator: `opNS8ENpEMWdXcJUgJCsJTDp7arTXayoBEeBUg6UezP`\
Upgrade authority: [Marinade Council](https://app.realms.today/dao/MNDE/params) (4/7)\
Admin authority: [Marinade Council](https://app.realms.today/dao/MNDE/params) (4/7)

## Tokens

### mSOL - mainnet-beta

**mSOL token**\
mSOL mint: `mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So`\
mSOL Auth( PDA): `3JLPCS1qM2zRw3Dp6V4hZnYHd4toMNPkNesXdX9tg6KM`

**Treasury**\
Reserve SOL account (PDA): `Du3Ysj1wKbxPKkuPPnvzQLQh8oMSVifs3jGZjJWXFmHN`\
Treasury mSOL account: `B1aLzaNMeFVAyQ6f3XbbUyKcH2YPHu2fqiEagmiF23VR`

**Liquidity-Pool** \
mSOL-SOL-LP mint: `LPmSozJJ8Jh69ut2WP3XmVohTjL4ipR18yiCzxrUmVj`\
Auth(PDA): `HZsepB79dnpvH6qfVgvMpS738EndHw3qSHo4Gv5WX1KA`\
mSOL leg account `7GgPYjS5Dza89wV6FpZ23kUJRG5vbQ1GM25ezspYFSoE`\
mSOL leg authority: `EyaSjUtSgo9aRD1f8LWXwdvkpDTmXAW54yoSHZRF14WL`\
SOL leg account `UefNb6z6yvArqe4cJHTXCqStRsKmWhGxnZzuHbikP5Q`

### MNDE - mainnet-beta

MNDE Token: `MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey`&#x20;

**Chef NFT collection**\
Mint authority: `5T4reQScZBDXbGRuf3WGWUVmPTCxsYCnG7HH1wUmYEhV`\
Update authority: `6vS14tTjSKdTKNgQtueTPKghT3XVxKBL55YzC5M5CPAp`

**Chef NFTs**\
Update authority: `6jG2QcwaJPFS8Y9SzgH2kfKPj6ERhLi9RVtH8kRahj4j`\
Owner program: `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`

### mSOL - devnet

Program ID: `MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD`

**mSOL token**\
mSOL mint: `mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So`\
mSOL auth(PDA): `3JLPCS1qM2zRw3Dp6V4hZnYHd4toMNPkNesXdX9tg6KM`

**Treasury**\
Reserve SOL account (PDA): `Du3Ysj1wKbxPKkuPPnvzQLQh8oMSVifs3jGZjJWXFmHN`\
Treasury mSOL account: `8ZUcztoAEhpAeC2ixWewJKQJsSUGYSGPVAjkhDJYf5Gd`

**Liquidity-Pool** \
mSOL-SOL-LP mint: `LPmSozJJ8Jh69ut2WP3XmVohTjL4ipR18yiCzxrUmVj`\
Auth (PDA): `HZsepB79dnpvH6qfVgvMpS738EndHw3qSHo4Gv5WX1KA`\
mSOL leg account: `7GgPYjS5Dza89wV6FpZ23kUJRG5vbQ1GM25ezspYFSoE`\
SOL leg account: `UefNb6z6yvArqe4cJHTXCqStRsKmWhGxnZzuHbikP5Q`

### MNDE - devnet

MNDE address: MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey&#x20;


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/developers/contract-addresses.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
