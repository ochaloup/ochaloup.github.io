# Solana mainnet RPC snapshot, 2026-10-02

Queried `https://api.mainnet-beta.solana.com` at slot 452726847 (epoch 1047). Feature ids from `anza-xyz/agave` master, `feature-set/src/lib.rs`. Activation slot read from each feature account, time from `getBlockTime`.

| Feature | Feature id | Mainnet status |
| --- | --- | --- |
| SIMD-0096 Reward full priority fee to validators | 3opE3EzAKnUftUDURkzMgwpNgimBAypW1mNDYH4x4Zg7 | Active, slot 320112000 (epoch 741), 2025-02-12T06:59:08Z |
| SIMD-0256 Raise block limit to 60M | 6oMCUgfY6BzZ6jwB681J6ju5Bh6CjVXbd7NeWYqiXBSu | Active, slot 355104000 (epoch 822), 2025-07-23T00:47:31Z |
| SIMD-0286 Raise block limit to 100M | P1BCUMpAC7V2GRBRiJCNUgpMyWZhoqt3LKo712ePqsz | Active, slot 435888000 (epoch 1009), 2026-07-29T05:31:09Z |
| SIMD-0326 Alpenglow | A1pengvuM6JEcyNuTnMqepBKhwHE3N6PmUrdATGawhJS | No feature account: not activated |
| SIMD-0123 Block Revenue Sharing | DSroRTaL5zozFw5yRYpaCTjeND1mSxxsnAeSi5vhELUv | No feature account: not activated |

`getVoteAccounts` at epoch 1047 (slot 452726988): 671 current and 13 delinquent vote accounts, 683 with active stake, 440,810,473 SOL active stake. Nakamoto coefficient 18: the 18 largest vote accounts hold more than 1/3 of active stake. Counted per vote account, not per operator.
