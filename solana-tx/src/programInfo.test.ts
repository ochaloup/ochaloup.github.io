import assert from 'node:assert/strict'
import { test } from 'node:test'

import { PublicKey } from '@solana/web3.js'

import {
  parseLoaderV4Header,
  parseProgramAccount,
  parseProgramDataHeader,
  parseSecurityTxt,
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

const SECURITY_TXT_BEGIN = Buffer.from('=======BEGIN SECURITY.TXT V1=======\0')
const SECURITY_TXT_END = Buffer.from('=======END SECURITY.TXT V1=======\0')

function securityTxtBody(fields: Record<string, string>): Buffer {
  const body = Object.entries(fields)
    .map(([key, value]) => `${key}\0${value}\0`)
    .join('')
  return Buffer.concat([
    SECURITY_TXT_BEGIN,
    Buffer.from(body),
    SECURITY_TXT_END,
  ])
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

test('parseSecurityTxt reads fields as camelCase', () => {
  const data = Buffer.concat([
    Buffer.alloc(100, 7),
    securityTxtBody({
      name: 'Marinade Liquid Staking',
      project_url: 'https://marinade.finance',
      source_code: 'https://github.com/marinade-finance/liquid-staking-program',
      source_release: 'v2.1.0',
      preferred_languages: 'en',
    }),
    Buffer.alloc(50, 7),
  ])
  assert.deepEqual(parseSecurityTxt(data), {
    name: 'Marinade Liquid Staking',
    projectUrl: 'https://marinade.finance',
    sourceCode: 'https://github.com/marinade-finance/liquid-staking-program',
    sourceRelease: 'v2.1.0',
    preferredLanguages: 'en',
  })
})

test('parseSecurityTxt drops a dangling key', () => {
  const data = Buffer.concat([
    SECURITY_TXT_BEGIN,
    Buffer.from('name\0X\0policy\0'),
    SECURITY_TXT_END,
  ])
  assert.deepEqual(parseSecurityTxt(data), { name: 'X' })
})

test('parseSecurityTxt rejects missing markers', () => {
  assert.equal(parseSecurityTxt(Buffer.alloc(0)), undefined)
  assert.equal(parseSecurityTxt(Buffer.alloc(100, 7)), undefined)
  assert.equal(
    parseSecurityTxt(
      Buffer.concat([SECURITY_TXT_BEGIN, Buffer.from('name\0X\0')]),
    ),
    undefined,
  )
})

test('parseLoaderV4Header rejects unknown status and short data', () => {
  assert.equal(parseLoaderV4Header(loaderV4Header(1, 3)), undefined)
  assert.equal(
    parseLoaderV4Header(loaderV4Header(1, 1).subarray(0, 47)),
    undefined,
  )
})
