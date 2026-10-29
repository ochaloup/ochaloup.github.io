import assert from 'node:assert/strict'
import { test } from 'node:test'

import { PublicKey } from '@solana/web3.js'

import { parseProgramAccount } from './programInfo.ts'

const PROGRAM_DATA = new PublicKey(
  '4PQH9YmfuKrVyZaibkLYpJZPv2FPaybhq2GAuBcWMSBf',
)

function u32le(n: number): Buffer {
  const buf = Buffer.alloc(4)
  buf.writeUInt32LE(n)
  return buf
}

test('parseProgramAccount reads the programdata address', () => {
  const data = Buffer.concat([u32le(2), PROGRAM_DATA.toBuffer()])
  assert.equal(parseProgramAccount(data), PROGRAM_DATA.toBase58())
})

test('parseProgramAccount rejects other states and short data', () => {
  assert.equal(
    parseProgramAccount(Buffer.concat([u32le(1), PROGRAM_DATA.toBuffer()])),
    undefined,
  )
  assert.equal(
    parseProgramAccount(
      Buffer.concat([u32le(2), PROGRAM_DATA.toBuffer()]).subarray(0, 35),
    ),
    undefined,
  )
})
