import assert from 'node:assert/strict'
import { test } from 'node:test'

import { PublicKey } from '@solana/web3.js'
import base58 from 'bs58'
import { deflate } from 'pako'

import {
  decodeProgramMetadata,
  findSection,
  parseElfHeader,
  parseLoaderV4Header,
  parseProgramAccount,
  parseProgramDataHeader,
  parseSectionHeaders,
  parseSecurityTxt,
  programMetadataAddress,
} from './programInfo.ts'

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
