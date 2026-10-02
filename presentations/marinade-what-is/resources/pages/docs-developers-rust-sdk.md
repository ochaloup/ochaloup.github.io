> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/developers/marinade-rust-sdk.md).

# Marinade Rust SDK

There is no supported standalone Rust SDK. If you are building in Rust, use one of the two routes below.


`github.com/marinade-finance/marinade-sdk` exists but was **archived (read-only) on 2026-08-28** and has had no real commits in years. Do not build against it.


### Option 1: The Shared Rust Crates

Marinade maintains its Rust client code in [marinade-common-rs-cli](https://github.com/marinade-finance/marinade-common-rs-cli). The crate you want is **`marinade-client-rs`**, which provides instruction builders and RPC state queries for the Liquid Staking program. The same repository ships `dynsigner` and `marinade-common-cli` for CLI work.

These crates back Marinade's own Rust tooling, so they track the on-chain program, but they are published for internal use first. Expect the surface to move.

***

### Option 2: Generate A Client From The IDL

Every Marinade program publishes its Anchor IDL on chain. Fetch it and generate a client with your preferred Rust codegen. See [Anchor IDL](/developers/anchor-idl.md) for the fetch command and the list of programs.

This is the most stable route for an external integration, because the IDL is the contract.

***

### If TypeScript Is An Option

The TypeScript SDK is the supported, documented integration path and covers more of the protocol. See [Marinade Ts/Js SDK](/developers/marinade-ts-js-sdk.md).


If you have questions or troubles, please join our [Discord](https://discord.com/invite/yTdH8YkYKg). Marinade contributors will be there to help you.



---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/developers/marinade-rust-sdk.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
