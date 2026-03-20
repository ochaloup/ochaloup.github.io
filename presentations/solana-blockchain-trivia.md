# Solana Blockchain Developer Trivia

---

## Q1: Who deployed the first liquid staking program on Solana mainnet?

- Jito
- ✅ Marinade
- Lido
- A person named 0xPr0phet

---

## Q2: What are Solana programs called when deployed on-chain?

- Smart contracts
- Onchain contracts
- Smart programs
- ✅ Onchain programs

---

## Q3: What is "rent" on Solana?

- A recurring fee charged every transaction
- ✅ A minimum SOL balance that accounts must maintain to cover on-chain storage costs
- A tax redistributed to stakers each epoch
- A fee burned to reduce SOL supply

---

## Q4: What are Compute Units (CUs) used for on Solana?

- Measuring storage consumption per account
- ✅ Metering computational work per transaction
- Counting the number of cross-program invocations
- Tracking validator uptime per epoch

---

## Q5: Why is the Solana transaction size limited to exactly 1,232 bytes?

- It's an arbitrary constant chosen at genesis
- It matches the BPF instruction set's max stack frame
- ✅ It's the IPv6 minimum MTU of headers size
- It was set to match Ethereum's gas block limit at launch

---

## Q6: Why do you need to call `get_minimum_balance_for_rent_exemption` when creating a new account?

- Because Solana charges a flat account creation fee in lamports
- ✅ Because every new account must be pre-funded with enough lamports to be rent-exempt
- Because the System Program needs the value to calculate the account's PDA
- Because validators require a deposit to index the account in their memory pool

---

## Q7: How did Anatoly Yakovenko have the idea for Proof of History?
- During a 10-day silent meditation retreat
- Reading the Bitcoin whitepaper on the beach
- ✅ Staying up until 4am fueled by two coffees and a beer
- In the shower after a 100-mile bike ride


---

## Q8: Until Alpenglow is deployed, what IS Solana's actual consensus protocol?

- Proof of History
- Proof of Stake
- Proof of Work
- ✅ Tower BFT

---

## Q9: What is a Solana transaction's "recent blockhash" used for?

- To calculate the transaction fee
- To identify which validator should process the transaction
- To compress the list of account addresses
- ✅ To prevent replay attacks and set an expiration window

---

## Q10: In Solana's account model, who is the "owner" of an account?

- The holder of the private key for that address
- ✅ A program — only the owning program can modify the account's data
- Whoever paid the rent-exempt deposit
- The validator who last processed a transaction for that account

