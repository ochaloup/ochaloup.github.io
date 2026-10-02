> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/developers/stake-to-marinade-via-spl-governance.md).

# Stake to Marinade via SPL governance

SPL-governance is an open-sourced Solana-based program that provides core building blocks for DAOs to use [on-chain governance](https://github.com/solana-labs/solana-program-library/tree/master/governance).

In extension to the backend program Solana is also engaging contributors to build on the affiliated frontend, named [Realms](https://realms.today).&#x20;

### How to set up a Realm&#x20;

If a DAO wants to go on-chain with their governance, they can easily do this by creating their own realm directly in the governance-ui on[ Realms Today](https://realms.today/). Once this is done, the realm can be set up to fit the DAOs needs by holding appropriate treasuries or the authority over the DAOs programs. As soon as it is created, the community can vote on each an every action regarding the treasuries or programs linked to the DAO by using proposals.

### How to stake to mSOL via a Realm

If the DAO has a SOL treasury a “Stake with Marinade” proposal can be created. To access this option, click on 'View' in the Treasury tab.&#x20;

![Access the 'Treasury' view from this page](https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FCKDlzzDunwjvrQBkKax1%2F1.png?alt=media\&token=355ac18e-84c0-43bd-849d-9f8036444e1a)

!['Stake with Marinade' option when clicking on SOL treasury](https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FFwV8SvJGvPadiT4SrnrR%2F1.1.png?alt=media\&token=76961dc2-7f78-4b45-b66e-82d64afde527)

If your DAO does not yet have an existing mSOL account, one will automatically be created for you and attached to your DAO wallet, prior to the proposal creation. In other case, you can select the according account from the dropdown menu.


If you don't see a mSOL account on your treasury, a workaround to create it is to send a very small amount of mSOL to the treasury wallet. This will automatically create a mSOL account.&#x20;


You can now fill the “Stake with Marinade” form with all the required info:

!['Stake with Marinade' form](https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FlnEVnZC5YZoqtW6w3mMA%2F3.png?alt=media\&token=bda10fff-8631-4df4-9b5e-40e0345519c4)

A proposal will be created to be voted on, with the following instructions:&#x20;

![Instructions for the proposal](https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FeyCsWs3qCEAjVMbRRxro%2F4.png?alt=media\&token=0601ddae-d2a0-42e2-8b13-2adcca7177a4)

As soon as the vote passes and the instructions are executed, SOL is converted to mSOL, which is transferred to the specified treasury account:

![Converted mSOL is sent to the mSOL treasury](https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2F5CdFh3JojbqsBAnHTz3y%2F5.png?alt=media\&token=003dc415-b637-44bb-985b-525f15543c25)


If you encounter any blocker, please visit Marinade's [Discord](https://discord.com/invite/6EtUf4Euu6) and ask for assistance.&#x20;



---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/developers/stake-to-marinade-via-spl-governance.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
