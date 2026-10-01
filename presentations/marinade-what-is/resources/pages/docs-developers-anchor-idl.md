> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/developers/anchor-idl.md).

# Anchor IDL

Marinade's programs publish their Anchor IDL on chain. Fetch one with the Anchor CLI. No Anchor workspace is needed, this reads an account.

```bash
anchor init idl
cd idl
anchor --provider.cluster mainnet \ 
       idl fetch MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD -o marinade-idl.json
```

***

## Available IDLs

Every program below serves a live on-chain IDL on mainnet-beta. Substitute the program ID into the command above.

| Program                  | Program ID                                    | On-chain IDL account                           |
| ------------------------ | --------------------------------------------- | ---------------------------------------------- |
| **Liquid Staking**       | `MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD` | `9jWC3EixD3D7ChMrrSRw3opnGHQ8YxZGJqGkzcup3tAn` |
| **Native Staking Proxy** | `mnspJQyF1KdDEs5c6YJPocYdY1esBgVQFufM2dY9oDk` | `7ByYxYesMj598eFug4AcFqYyFnC9m6SVEjyibGhmvSQq` |
| **Validator Bonds**      | `vBoNdEvzMrSai7is21XgVYik65mqtaKXuSdMBJ1xkW4` | `Du3XrzTNqhLt9gpui9LUogrLqCDrVC2HrtiNXHSJM58y` |
| **Directed Stake**       | `dstK1PDHNoKN9MdmftRzsEbXP5T1FTBiQBm1Ee3meVd` | `4vePs1gTLB2jT8cSLsMEswiAzGR2zJaLu1BfXacS3HLp` |

{% hint style="info" %}
The IDL account column is informational. You do not need it for `anchor idl fetch`, which derives the address from the program ID.
{% endhint %}

***

### Next Steps

* Full address list: [Contracts & Tokens Addresses](/developers/contract-addresses.md)
* A typed client instead of raw IDL: [Marinade Ts/Js SDK](/developers/marinade-ts-js-sdk.md)


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/developers/anchor-idl.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
