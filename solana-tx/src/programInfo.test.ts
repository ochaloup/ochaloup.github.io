import assert from 'node:assert/strict'
import { test } from 'node:test'

import { PublicKey } from '@solana/web3.js'

import {
  parseLoaderV4Header,
  parseProgramAccount,
  parseProgramDataHeader,
} from './programInfo.ts'

const PROGRAM_DATA = new PublicKey(
  '4PQH9YmfuKrVyZaibkLYpJZPv2FPaybhq2GAuBcWMSBf',
)
const AUTHORITY = new PublicKey('551FBXSXdhcRDDkdcb3ThDRg84Mwe5Zs6YjJ1EEoyzBp')

function u32le(n: number): Buffer {
  const buf = Buffer.alloc(4)
  buf.writeUInt32LE(n)
  return buf
}

function u64le(n: number): Buffer {
  const buf = Buffer.alloc(8)
  buf.writeBigUInt64LE(BigInt(n))
  return buf
}

function programDataHeader(authorityTag: number): Buffer {
  return Buffer.concat([
    u32le(3),
    u64le(433290841),
    Buffer.from([authorityTag]),
    AUTHORITY.toBuffer(),
  ])
}

function loaderV4Header(slot: number, status: number): Buffer {
  return Buffer.concat([u64le(slot), AUTHORITY.toBuffer(), u64le(status)])
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

test('parseProgramDataHeader reads slot and authority', () => {
  assert.deepEqual(
    parseProgramDataHeader(Buffer.concat([programDataHeader(1), u64le(0)])),
    { lastDeploySlot: 433290841, upgradeAuthority: AUTHORITY.toBase58() },
  )
  assert.deepEqual(parseProgramDataHeader(programDataHeader(0)), {
    lastDeploySlot: 433290841,
    upgradeAuthority: null,
  })
})

test('parseProgramDataHeader rejects other states and short data', () => {
  const programAccount = programDataHeader(1)
  programAccount.writeUInt32LE(2, 0)
  assert.equal(parseProgramDataHeader(programAccount), undefined)
  assert.equal(
    parseProgramDataHeader(programDataHeader(1).subarray(0, 44)),
    undefined,
  )
})

test('parseLoaderV4Header reads slot and authority by status', () => {
  const deployed = {
    lastDeploySlot: 431987340,
    upgradeAuthority: AUTHORITY.toBase58(),
  }
  assert.deepEqual(
    parseLoaderV4Header(
      Buffer.concat([loaderV4Header(431987340, 1), u64le(0)]),
    ),
    deployed,
  )
  assert.deepEqual(parseLoaderV4Header(loaderV4Header(431987340, 0)), deployed)
  assert.deepEqual(parseLoaderV4Header(loaderV4Header(431987340, 2)), {
    lastDeploySlot: 431987340,
    upgradeAuthority: null,
  })
})

test('parseLoaderV4Header rejects unknown status and short data', () => {
  assert.equal(parseLoaderV4Header(loaderV4Header(1, 3)), undefined)
  assert.equal(
    parseLoaderV4Header(loaderV4Header(1, 1).subarray(0, 47)),
    undefined,
  )
})
