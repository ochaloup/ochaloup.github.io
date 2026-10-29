import assert from 'node:assert/strict'
import { mock, test } from 'node:test'

import { PublicKey } from '@solana/web3.js'
import base58 from 'bs58'
import { deflate } from 'pako'

import {
  BPF_LOADER_UPGRADEABLE_ID,
  LOADER_V4_ID,
  composeProgramInfo,
  decodeProgramMetadata,
  findSection,
  getProgramInfo,
  parseElfHeader,
  parseLoaderV4Header,
  parseProgramAccount,
  parseProgramDataHeader,
  parseSectionHeaders,
  parseSecurityTxt,
  programMetadataAddress,
  toVerifiedBuild,
} from './programInfo.ts'

import type { Connection } from '@solana/web3.js'

const PROGRAM_DATA = new PublicKey(
  '4PQH9YmfuKrVyZaibkLYpJZPv2FPaybhq2GAuBcWMSBf',
)
const AUTHORITY = new PublicKey('551FBXSXdhcRDDkdcb3ThDRg84Mwe5Zs6YjJ1EEoyzBp')

function u16le(n: number): Buffer {
  const buf = Buffer.alloc(2)
  buf.writeUInt16LE(n)
  return buf
}

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

function sectionHeader(nameOffset: number, offset: number, size: number) {
  const entry = Buffer.alloc(64)
  entry.writeUInt32LE(nameOffset, 0)
  entry.writeBigUInt64LE(BigInt(offset), 0x18)
  entry.writeBigUInt64LE(BigInt(size), 0x20)
  return entry
}

function buildElf(sections: { name: string; body: Buffer }[]): Buffer {
  const names = [...sections.map(s => s.name), '.shstrtab']
  const shstrtab = Buffer.from('\0' + names.map(n => n + '\0').join(''))
  const entries = [sectionHeader(0, 0, 0)]
  let offset = 64
  let nameOffset = 1
  for (const [i, body] of [...sections.map(s => s.body), shstrtab].entries()) {
    entries.push(sectionHeader(nameOffset, offset, body.length))
    nameOffset += names[i].length + 1
    offset += body.length
  }
  const header = Buffer.concat([
    Buffer.from([0x7f, 0x45, 0x4c, 0x46, 2, 1, 1]),
    Buffer.alloc(0x28 - 7),
    u64le(offset),
    Buffer.alloc(0x3a - 0x30),
    u16le(64),
    u16le(entries.length),
    u16le(entries.length - 1),
  ])
  return Buffer.concat([
    header,
    ...sections.map(s => s.body),
    shstrtab,
    ...entries,
  ])
}

const FIXTURE_TEXT = { name: '.text', body: Buffer.alloc(4096) }
const FIXTURE_RODATA = {
  name: '.rodata',
  body: Buffer.concat([
    Buffer.alloc(200, 7),
    securityTxtBody({ name: 'Fixture', project_url: 'https://x' }),
    Buffer.alloc(50, 7),
  ]),
}
const FIXTURE_SHSTRTAB_LENGTH = '\0.text\0.rodata\0.shstrtab\0'.length

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

test('ELF parsers locate .rodata with security.txt', () => {
  const elf = buildElf([FIXTURE_TEXT, FIXTURE_RODATA])
  const rodataOffset = 64 + 4096
  const shstrtabOffset = rodataOffset + FIXTURE_RODATA.body.length
  const shoff = shstrtabOffset + FIXTURE_SHSTRTAB_LENGTH
  const header = parseElfHeader(elf.subarray(0, 64))
  assert.deepEqual(header, { shoff, shnum: 4, shstrndx: 3 })

  const sections = parseSectionHeaders(elf.subarray(shoff), 4)
  assert.ok(sections)
  assert.deepEqual(sections[2], {
    nameOffset: 7,
    offset: rodataOffset,
    size: FIXTURE_RODATA.body.length,
  })
  assert.deepEqual(sections[3], {
    nameOffset: 15,
    offset: shstrtabOffset,
    size: FIXTURE_SHSTRTAB_LENGTH,
  })
  const shstrtab = elf.subarray(
    shstrtabOffset,
    shstrtabOffset + FIXTURE_SHSTRTAB_LENGTH,
  )
  const rodata = findSection(sections, shstrtab, '.rodata')
  assert.ok(rodata)
  assert.equal(rodata, sections[2])
  assert.equal(findSection(sections, shstrtab, '.nope'), undefined)
  assert.deepEqual(
    parseSecurityTxt(elf.subarray(rodataOffset, rodataOffset + rodata.size)),
    { name: 'Fixture', projectUrl: 'https://x' },
  )
})

test('parseElfHeader rejects malformed headers', () => {
  const header = buildElf([FIXTURE_RODATA]).subarray(0, 64)
  assert.ok(parseElfHeader(header))
  const corrupt = (at: number, bytes: Buffer) => {
    const copy = Buffer.from(header)
    bytes.copy(copy, at)
    return parseElfHeader(copy)
  }
  assert.equal(corrupt(0, Buffer.from([0])), undefined)
  assert.equal(corrupt(4, Buffer.from([1])), undefined)
  assert.equal(corrupt(5, Buffer.from([2])), undefined)
  assert.equal(corrupt(0x3a, u16le(40)), undefined)
  assert.equal(corrupt(0x3c, u16le(0)), undefined)
  assert.equal(corrupt(0x3e, u16le(3)), undefined)
  assert.equal(parseElfHeader(header.subarray(0, 63)), undefined)
})

test('parseSectionHeaders and findSection handle truncated data', () => {
  assert.equal(parseSectionHeaders(Buffer.alloc(64 * 3 - 1), 3), undefined)
  const sections = [{ nameOffset: 100, offset: 0, size: 0 }]
  assert.equal(findSection(sections, Buffer.from('\0.rodata\0'), ''), undefined)
})

const SECURITY_PROGRAM = new PublicKey(
  '4X79YRjz9KNMhdjdxXg2ZNTS3YnMGYdwJkBHnezMJwr3',
)
const SECURITY_PDA = '13Pko8Hbdp5ceaibfFw1BLRJZagXdHVhDWBhBGaXyFuG'
const SECURITY_PDA_DATA = Buffer.from(
  'AjRJb5BEycKIjrBuYiLzP6UeoS3HGC5DV0zCSfPAeYr8aUZW+aWnpon3XqnV65yqkYOIKBqoFVxs+2ulZ+5UxgMBAXNlY3VyaXR5AAAAAAAAAAABAgEA8QAAAAAAAAAAeJydkEFLAzEQhe/9FWHP7qZ43JOlCPakdC3iaZnNjmkkuxNmEqWI/91uokKvvQXm5X0f72ulVAVpdJFYqlZVD+AH4rm6WQ5CiQ32jB5BcDmDMShSG5ojk68/1s1ts74IGxpz8hhjkFZr6+IxDY2hSacgbkSS/0ct5GGGmj9BR0bUE7hZBybLMIm+hBVKYHxDZhz780+bwGLWxl/jQN6Z0zX8wdNQ+N399rDfPb8201hKFwEwMYPOCR+pFTSJXTzdlarG2j89ekcT+8T+ConSMcOUFzzkgHrsVJcTav+yadUmj6K2ZRT1VMaqVt8/0o+cKg==',
  'base64',
)

function pmpAccount(
  payload: Uint8Array,
  {
    encoding = 1,
    compression = 0,
    dataSource = 0,
    dataLength = payload.length,
  } = {},
): Buffer {
  const header = Buffer.alloc(96)
  header[0] = 2
  header.write('security', 67, 'utf-8')
  header[83] = encoding
  header[84] = compression
  header[86] = dataSource
  header.writeUInt32LE(dataLength, 87)
  return Buffer.concat([header, payload])
}

test('programMetadataAddress derives the canonical PDA', () => {
  assert.equal(
    programMetadataAddress(
      new PublicKey('ProgM6JCCvbYkfKqJYHePx4xxSUSqJp7rh8Lyv7nk7S'),
      'idl',
    ).toBase58(),
    '9zzVPVwZojagC4mBCMrTi17Zu9KvXKoTvqnBL1vxYDyM',
  )
  assert.equal(
    programMetadataAddress(SECURITY_PROGRAM, 'security').toBase58(),
    SECURITY_PDA,
  )
})

test('decodeProgramMetadata reads a mainnet security account', () => {
  const text = decodeProgramMetadata(SECURITY_PDA_DATA)
  assert.ok(text)
  const json: unknown = JSON.parse(text)
  assert.ok(typeof json === 'object' && json !== null && 'name' in json)
})

test('decodeProgramMetadata decodes compression and encodings', () => {
  const json = '{"name":"X"}'
  assert.equal(decodeProgramMetadata(pmpAccount(Buffer.from(json))), json)
  assert.equal(
    decodeProgramMetadata(pmpAccount(deflate(json), { compression: 2 })),
    json,
  )
  const raw = Buffer.from([1, 2, 3, 250])
  assert.equal(
    decodeProgramMetadata(pmpAccount(raw, { encoding: 2 })),
    base58.encode(raw),
  )
  assert.equal(
    decodeProgramMetadata(pmpAccount(raw, { encoding: 3 })),
    raw.toString('base64'),
  )
  const external = SECURITY_PROGRAM.toBuffer()
  assert.equal(
    decodeProgramMetadata(pmpAccount(external, { dataSource: 2 })),
    SECURITY_PROGRAM.toBase58(),
  )
})

test('decodeProgramMetadata rejects malformed accounts', () => {
  const json = Buffer.from('{"name":"X"}')
  assert.equal(
    decodeProgramMetadata(pmpAccount(json, { dataLength: json.length + 1 })),
    undefined,
  )
  const wrongDiscriminator = pmpAccount(json)
  wrongDiscriminator[0] = 1
  assert.equal(decodeProgramMetadata(wrongDiscriminator), undefined)
  assert.equal(decodeProgramMetadata(pmpAccount(Buffer.alloc(0))), undefined)
  assert.equal(
    decodeProgramMetadata(pmpAccount(json, { compression: 2 })),
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

const OTTERSEC_STATUS = {
  is_verified: true,
  message: 'On chain program verified',
  on_chain_hash: 'aa',
  executable_hash: 'aa',
  repo_url: 'https://github.com/x/y',
  commit: '',
  last_verified_at: '2024-01-26T07:53:47',
  is_frozen: false,
  is_closed: false,
}

test('toVerifiedBuild maps OtterSec status', () => {
  assert.deepEqual(toVerifiedBuild(OTTERSEC_STATUS), {
    isVerified: true,
    repoUrl: 'https://github.com/x/y',
    lastVerifiedAt: '2024-01-26T07:53:47',
    message: 'On chain program verified',
  })
  assert.equal(toVerifiedBuild('nope'), undefined)
  assert.equal(toVerifiedBuild({ is_verified: 'yes' }), undefined)
})

test('composeProgramInfo orders keys and drops missing parts', () => {
  const info = composeProgramInfo({
    loader: BPF_LOADER_UPGRADEABLE_ID,
    programData: PROGRAM_DATA.toBase58(),
    deploy: { lastDeploySlot: 1, upgradeAuthority: null },
    securityTxt: { name: 'X', projectUrl: 'https://x' },
    metadata: { name: 'M' },
    verifiedBuild: { isVerified: false },
  })
  assert.deepEqual(Object.keys(info), [
    'name',
    'loader',
    'programData',
    'upgradeAuthority',
    'lastDeploySlot',
    'projectUrl',
    'metadata',
    'verifiedBuild',
  ])
  assert.equal(info.upgradeAuthority, null)
  assert.deepEqual(composeProgramInfo({ loader: LOADER_V4_ID }), {
    loader: LOADER_V4_ID,
  })
})

type FakeAccount = { owner: string; data: Buffer }
type DataSlice = { offset: number; length: number }
type Call = { pubkey: string; dataSlice?: DataSlice }

function fakeConnection(accounts: Map<string, FakeAccount>) {
  const calls: Call[] = []
  const connection = {
    getAccountInfo: (pubkey: PublicKey, config?: { dataSlice?: DataSlice }) => {
      const key = pubkey.toBase58()
      calls.push({ pubkey: key, dataSlice: config?.dataSlice })
      const account = accounts.get(key)
      if (account === undefined) {
        return Promise.resolve(null)
      }
      const slice = config?.dataSlice
      const data = slice
        ? account.data.subarray(
            Math.min(slice.offset, account.data.length),
            slice.offset + slice.length,
          )
        : account.data
      return Promise.resolve({
        owner: new PublicKey(account.owner),
        data,
        executable: false,
        lamports: 0,
      })
    },
  } as unknown as Connection
  return { connection, calls }
}

function key(n: number): PublicKey {
  return new PublicKey(Buffer.alloc(32, n))
}

function stubFetch(status: number, body: unknown = null) {
  mock.method(globalThis, 'fetch', () =>
    Promise.resolve(new Response(JSON.stringify(body), { status })),
  )
}

const ELF = buildElf([FIXTURE_TEXT, FIXTURE_RODATA])
const RODATA_OFFSET = 64 + 4096
const SHSTRTAB_OFFSET = RODATA_OFFSET + FIXTURE_RODATA.body.length
const SHOFF = SHSTRTAB_OFFSET + FIXTURE_SHSTRTAB_LENGTH
const TOKEN_LOADER = 'BPFLoader2111111111111111111111111111111111'
const UPGRADEABLE = key(1)
const UPGRADEABLE_DATA = key(2)
const V4 = key(3)
const V4_FINAL = key(4)
const NO_RODATA = key(5)
const NO_RODATA_DATA = key(6)
const TRUNCATED = key(7)
const TRUNCATED_DATA = key(8)
const TOKEN = key(9)

function programAccount(programData: PublicKey): FakeAccount {
  return {
    owner: BPF_LOADER_UPGRADEABLE_ID,
    data: Buffer.concat([u32le(2), programData.toBuffer()]),
  }
}

function programDataAccount(elf: Buffer): FakeAccount {
  return {
    owner: BPF_LOADER_UPGRADEABLE_ID,
    data: Buffer.concat([programDataHeader(1), elf]),
  }
}

const ACCOUNTS = new Map<string, FakeAccount>([
  [UPGRADEABLE.toBase58(), programAccount(UPGRADEABLE_DATA)],
  [UPGRADEABLE_DATA.toBase58(), programDataAccount(ELF)],
  [
    programMetadataAddress(UPGRADEABLE, 'security').toBase58(),
    {
      owner: 'ProgM6JCCvbYkfKqJYHePx4xxSUSqJp7rh8Lyv7nk7S',
      data: pmpAccount(Buffer.from('{"name":"Meta"}')),
    },
  ],
  [
    V4.toBase58(),
    { owner: LOADER_V4_ID, data: Buffer.concat([loaderV4Header(7, 1), ELF]) },
  ],
  [
    V4_FINAL.toBase58(),
    { owner: LOADER_V4_ID, data: Buffer.concat([loaderV4Header(7, 2), ELF]) },
  ],
  [NO_RODATA.toBase58(), programAccount(NO_RODATA_DATA)],
  [NO_RODATA_DATA.toBase58(), programDataAccount(buildElf([FIXTURE_TEXT]))],
  [TRUNCATED.toBase58(), programAccount(TRUNCATED_DATA)],
  [TRUNCATED_DATA.toBase58(), programDataAccount(ELF.subarray(0, SHOFF + 10))],
  [TOKEN.toBase58(), { owner: TOKEN_LOADER, data: Buffer.alloc(10) }],
])

const DEPLOYED = {
  upgradeAuthority: AUTHORITY.toBase58(),
  lastDeploySlot: 433290841,
}

test('getProgramInfo reads an upgradeable program with small slices', async t => {
  t.after(() => mock.restoreAll())
  stubFetch(200, OTTERSEC_STATUS)
  const { connection, calls } = fakeConnection(ACCOUNTS)
  const info = await getProgramInfo(
    new Map(),
    connection,
    UPGRADEABLE.toBase58(),
  )
  assert.deepEqual(info, {
    name: 'Fixture',
    loader: BPF_LOADER_UPGRADEABLE_ID,
    programData: UPGRADEABLE_DATA.toBase58(),
    ...DEPLOYED,
    projectUrl: 'https://x',
    metadata: { name: 'Meta' },
    verifiedBuild: toVerifiedBuild(OTTERSEC_STATUS),
  })
  assert.equal(calls.length, 6)
  assert.deepEqual(
    calls.filter(c => c.dataSlice === undefined).map(c => c.pubkey),
    [programMetadataAddress(UPGRADEABLE, 'security').toBase58()],
  )
  const programDataCalls = calls.filter(
    c => c.pubkey === UPGRADEABLE_DATA.toBase58(),
  )
  assert.deepEqual(
    programDataCalls.map(c => c.dataSlice?.offset),
    [0, 45 + SHOFF, 45 + SHSTRTAB_OFFSET, 45 + RODATA_OFFSET],
  )
  assert.ok(programDataCalls.every(c => (c.dataSlice?.length ?? 0) < 4096))
})

test('getProgramInfo reads a loader-v4 program from its own account', async t => {
  t.after(() => mock.restoreAll())
  stubFetch(404)
  const { connection, calls } = fakeConnection(ACCOUNTS)
  assert.deepEqual(await getProgramInfo(new Map(), connection, V4.toBase58()), {
    name: 'Fixture',
    loader: LOADER_V4_ID,
    upgradeAuthority: AUTHORITY.toBase58(),
    lastDeploySlot: 7,
    projectUrl: 'https://x',
  })
  assert.equal(calls.length, 5)
  assert.deepEqual(
    calls.filter(c => c.pubkey === V4.toBase58()).map(c => c.dataSlice?.offset),
    [0, 48 + SHOFF, 48 + SHSTRTAB_OFFSET, 48 + RODATA_OFFSET],
  )
  const finalized = await getProgramInfo(
    new Map(),
    connection,
    V4_FINAL.toBase58(),
  )
  assert.equal(finalized?.upgradeAuthority, null)
})

test('getProgramInfo keeps deploy info without security.txt', async t => {
  t.after(() => mock.restoreAll())
  stubFetch(404)
  const { connection, calls } = fakeConnection(ACCOUNTS)
  assert.deepEqual(
    await getProgramInfo(new Map(), connection, NO_RODATA.toBase58()),
    {
      loader: BPF_LOADER_UPGRADEABLE_ID,
      programData: NO_RODATA_DATA.toBase58(),
      ...DEPLOYED,
    },
  )
  assert.equal(calls.length, 5)
  assert.deepEqual(
    await getProgramInfo(new Map(), connection, TRUNCATED.toBase58()),
    {
      loader: BPF_LOADER_UPGRADEABLE_ID,
      programData: TRUNCATED_DATA.toBase58(),
      ...DEPLOYED,
    },
  )
})

test('getProgramInfo shows only the loader of other programs', async t => {
  t.after(() => mock.restoreAll())
  stubFetch(404)
  const { connection, calls } = fakeConnection(ACCOUNTS)
  assert.deepEqual(
    await getProgramInfo(new Map(), connection, TOKEN.toBase58()),
    { loader: TOKEN_LOADER },
  )
  assert.equal(calls.length, 1)
})

test('getProgramInfo caches per programId and never rejects', async t => {
  t.after(() => mock.restoreAll())
  stubFetch(404)
  const { connection, calls } = fakeConnection(ACCOUNTS)
  const cache = new Map()
  const first = getProgramInfo(cache, connection, UPGRADEABLE.toBase58())
  const second = getProgramInfo(cache, connection, UPGRADEABLE.toBase58())
  assert.equal(first, second)
  await first
  assert.equal(calls.length, 6)

  assert.equal(
    await getProgramInfo(new Map(), connection, key(42).toBase58()),
    undefined,
  )
  assert.equal(
    await getProgramInfo(new Map(), connection, 'not-a-key'),
    undefined,
  )
  const failing = {
    getAccountInfo: () => Promise.reject(new Error('rpc down')),
  } as unknown as Connection
  assert.equal(
    await getProgramInfo(new Map(), failing, UPGRADEABLE.toBase58()),
    undefined,
  )
})
