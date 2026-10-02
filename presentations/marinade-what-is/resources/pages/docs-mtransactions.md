> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/protocol-overview/mtransactions.md).

# mTransactions

mTransactions is an exploration of a bandwidth marketplace for transactions on the Solana blockchain


**Note:** mTransactions is currently paused and unavailable. The documentation below is kept for reference purposes only.


The feature was released earlier as an **open beta** to explore new transaction capabilities within the Marinade ecosystem. At this time, the service has been **temporarily paused and is not active**.

## **What are mTransactions**

mTransaction is an open-source RPC-like service that connects transaction senders and validators with stake on their nodes. It takes advantage of the [QUIC and QoS updates](https://medium.com/chorus-one/how-will-solana-improve-its-stability-6d4b0ba41866) that were added to Solana in 2022 and 2023.

Participating users are able to send transactions to the mTransaction service, which will redirect them to one of the participating validators. This validator will use his staked node to forward the transaction to the leader through a QUIC connection.&#x20;

### Github repository

<https://github.com/marinade-finance/mtransaction>
mTransactions repository



---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/protocol-overview/mtransactions.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
