> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/developers/stake-to-marinade-via-fireblocks.md).

# Stake to Marinade via Fireblocks

In order to stake with Marinade native or mSOL via Fireblocks, you will need:&#x20;

* A Fireblocks Vault account that supports the Solana asset. See [Creating a Solana Vault](https://docs.marinade.finance/developers/stake-to-marinade-via-fireblocks#creating-a-solana-vault)
* A Transaction Authorization Policy (TAP) on Fireblocks that authorizes the "Raw" transaction type. See [Setting up the Transaction Authorization Policy](https://docs.marinade.finance/developers/stake-to-marinade-via-fireblocks#setting-up-the-transaction-authorization-policy)

### Stake SOL on Marinade with WalletConnect

1. Go to <https://app.marinade.finance/>
2. Click on the "Connect wallet" button on the top-right
3. Select "WalletConnect"
4. Scan the QR code using your Fireblocks Mobile App
5. Select the vault that you want to stake from. The vault has to support the Solana asset.&#x20;
6. Choose a Default fee between "Medium" and "Fast"
7. The connection to Marinade's dApp is now initiated and the SOL balance in your Fireblocks vault should reflect on Marinade's dApp
8. Select "Marinade Native" or "mSOL", depending on the product you want to use.&#x20;
9. Input the amount of SOL that you want to stake with Marinade and click on "Stake"
10. Confirm the transaction using your Fireblocks Mobile App.&#x20;
11. Wait for the transaction to go through the blockchain and get confirmed.&#x20;
12. Your SOL should now be successfully staked on Marinade.

<https://www.youtube.com/watch?v=XjwZzhgpcjM>
Stake SOL with Marinade using Fireblocks


If you want to unstake, follow the same process as above and just select "Unstake" on one of your active positions on Marinade.&#x20;

### Setting up the Transaction Authorization Policy

* Go to Fireblocks settings&#x20;

<div data-full-width="false"><figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2Fn7bFNTHWjaCRIsCPtLsu%2FCapture%20d%E2%80%99e%CC%81cran%202025-02-03%20a%CC%80%2013.02.57.png?alt=media&amp;token=efdb89a2-72c0-4530-8fd7-2ab4d322ea82" alt="" width="375"><figcaption></figcaption></figure></div>

* Go to "Transaction Policy"

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FX70NXVN5lZ2tMV5aiRDz%2FCapture%20d%E2%80%99e%CC%81cran%202025-02-03%20a%CC%80%2013.05.56.png?alt=media&amp;token=8bd8dcc3-7cfe-4773-86ba-f752385fcfe1" alt="" width="375"><figcaption></figcaption></figure>

* Click on "Edit policy"

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2Fk4B3GadDd9CGCZMfFqM7%2FCapture%20d%E2%80%99e%CC%81cran%202025-02-03%20a%CC%80%2013.07.57.png?alt=media&amp;token=3a1f0aca-0034-4b6f-a8a2-dd45229f06ce" alt="" width="375"><figcaption></figcaption></figure>

* Click on the "+" icon to add a new transaction policy

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FjkblpGn6Cjq2tGg11BSd%2FCapture%20d%E2%80%99e%CC%81cran%202025-02-03%20a%CC%80%2013.10.24.png?alt=media&amp;token=c38e9c96-4486-4c6f-b8ef-23fa7fb94933" alt="" width="375"><figcaption></figcaption></figure>

* Create a transaction policy for the "Raw" transaction type. Input the desired authorized sources, initiators and signers and select "Allow" (if the transaction does not need to be approved by a designated signer) or "Approved by" (if you want to set a designated signer that will approve the transactions). Click on "Add rule" once you are satisfied with the set up.&#x20;

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FrhFP0OtDZIH0lHv3O0xt%2FCapture%20d%E2%80%99e%CC%81cran%202025-02-03%20a%CC%80%2013.13.32.png?alt=media&amp;token=1aa45c5a-8c79-4fdd-81b7-19f01afbfd37" alt="" width="375"><figcaption></figcaption></figure>

* Click on "Publish changes", and then "Publish policy" on the modal that follows

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FxZmMlj9Ojkht8HlMvZZ5%2FCapture%20d%E2%80%99e%CC%81cran%202025-02-03%20a%CC%80%2013.19.35.png?alt=media&amp;token=9a27748c-2c07-4401-88db-708b77fc43a5" alt=""><figcaption></figcaption></figure>

* Open your Fireblocks Mobile App and click on "View" to see the Policy Change Request

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FDo1puKoNUaefOMcatLA6%2FScreenshot_20250203-132105.png?alt=media&amp;token=cd866709-3382-4e80-ae97-4d102dd99bf7" alt="" width="188"><figcaption></figcaption></figure>

* You will be prompted to approve the the Policy Change Request on your Fireblocks console.

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FgJM6toLyfRVwAwhB8ytQ%2FScreenshot_20250203-132115.png?alt=media&amp;token=19f2642f-ea8b-42ea-a1d8-9432886f5112" alt="" width="188"><figcaption></figcaption></figure>

* Go to your Fireblocks console, open the Transaction policy page and click on "Review policy changes"

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FbJX3HD5EclA57Gc3LtQC%2FCapture%20d%E2%80%99e%CC%81cran%202025-02-03%20a%CC%80%2013.22.29.png?alt=media&amp;token=fac42def-b127-47e7-be17-908944b09ca3" alt=""><figcaption></figcaption></figure>

* Click on "Approve changes"

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2Fpol9YpNGLwH6SX1gJ9IN%2FCapture%20d%E2%80%99e%CC%81cran%202025-02-03%20a%CC%80%2013.23.40.png?alt=media&amp;token=44489c76-fcae-4b0c-a2b5-dda8bd7525f5" alt="" width="375"><figcaption></figcaption></figure>

* Open your Fireblocks Mobile App and click on "View"

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FgWdBzSgfnzJjWX1RT0VR%2FScreenshot_20250203-132422.png?alt=media&amp;token=58199923-7f24-447d-b37a-9762695d000e" alt="" width="188"><figcaption></figcaption></figure>

* Click on "Approve" and confirm the action with your PIN and fingerprint.&#x20;

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2F92duo7oXQBsSTTfBe2Zr%2FScreenshot_20250203-132431.png?alt=media&amp;token=f92588af-df1f-4f45-8f91-b4690cab2197" alt="" width="188"><figcaption></figcaption></figure>

* Your Transaction Authorization Policy is now updated. You can now stake your SOL with Marinade using WalletConnect.&#x20;

### Creating a Solana vault

* Go to the Fireblocks console and in the left menu, click on "Accounts"
* Click on "Create Vault Account"

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FAPrvaUhN05mwh7jc9ZyS%2FCapture%20d%E2%80%99e%CC%81cran%202025-02-03%20a%CC%80%2013.42.54.png?alt=media&amp;token=b07d4a42-442d-49be-96b2-54181b1e57e9" alt="" width="563"><figcaption></figcaption></figure>

* Name your Vault and proceed with the creation

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2Fb5kvC0JMaAB3ibfPwaRU%2FCapture%20d%E2%80%99e%CC%81cran%202025-02-03%20a%CC%80%2013.44.47.png?alt=media&amp;token=e050a337-5ad5-431e-b701-61db02e89f7c" alt="" width="375"><figcaption></figcaption></figure>

* Click on "Create wallet"

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FDbXm8OLuLe7hFataVlqu%2FCapture%20d%E2%80%99e%CC%81cran%202025-02-03%20a%CC%80%2013.46.27.png?alt=media&amp;token=ae65291c-ed1f-4c75-a11d-18840302493d" alt="" width="375"><figcaption></figcaption></figure>

* Input "SOL" and select the SOL token. Click on "Create Wallet"

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FzZ3gYCMt1x3Ieb1A8YZj%2FCapture%20d%E2%80%99e%CC%81cran%202025-02-03%20a%CC%80%2013.47.14.png?alt=media&amp;token=c864270d-9839-4c56-8f24-1b1fc9d4a24a" alt="" width="375"><figcaption></figcaption></figure>

* Your vault now has a Solana address that can be used to deposit funds. Find it by clicking on the "Show deposit addresses" button.

<figure><img src="https://2385969780-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FHvhBFBu5z7MIlkYpgMXs%2Fuploads%2FH4ew5tToDZ1AvXolWNxW%2FCapture%20d%E2%80%99e%CC%81cran%202025-02-03%20a%CC%80%2013.48.13.png?alt=media&amp;token=7edd6fdb-86d1-45d5-bdbf-8e36efe886e0" alt="" width="563"><figcaption></figcaption></figure>

* Fund the newly created wallet by sending SOL to that deposit address. Once the SOL is received, you can stake with Marinade using WalletConnect. Make sure your Transaction Authorization Policy is set up.&#x20;


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/developers/stake-to-marinade-via-fireblocks.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
