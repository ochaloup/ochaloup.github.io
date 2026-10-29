import { PublicKey } from '@solana/web3.js'
import base58 from 'bs58'
import { Inflate } from 'pako'

import type { AccountInfo, Connection } from '@solana/web3.js'

export const BPF_LOADER_UPGRADEABLE_ID =
  'BPFLoaderUpgradeab1e11111111111111111111111'
export const LOADER_V4_ID = 'LoaderV411111111111111111111111111111111111'
export const PROGRAM_METADATA_PROGRAM_ID = new PublicKey(
  'ProgM6JCCvbYkfKqJYHePx4xxSUSqJp7rh8Lyv7nk7S',
)
export const PROGRAM_DATA_ELF_OFFSET = 45
export const LOADER_V4_ELF_OFFSET = 48
const LOADER_V4_FINALIZED = 2
const SECURITY_TXT_BEGIN = '=======BEGIN SECURITY.TXT V1=======\0'
const SECURITY_TXT_END = '=======END SECURITY.TXT V1=======\0'
const ELF_HEADER_LENGTH = 64
const SECTION_HEADER_LENGTH = 64
const ELF_MAGIC = '\x7fELF'
const PMP_METADATA_DISCRIMINATOR = 2
const PMP_DATA_OFFSET = 96
const PMP_ENCODING_NONE = 0
const PMP_ENCODING_BASE58 = 2
const PMP_ENCODING_BASE64 = 3
const PMP_DATA_SOURCE_EXTERNAL = 2
const MAX_INFLATED_LENGTH = 10 * 1024 * 1024
const OTTERSEC_STATUS_URL = 'https://verify.osec.io/status/'
const OTTERSEC_TIMEOUT_MS = 5000
const PROGRAM_INFO_CONCURRENCY = 1
const MAINNET_GENESIS_HASH = '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d'
const mainnetChecks = new WeakMap<Connection, Promise<boolean>>()
const OTTERSEC_FIELDS = [
  ['repo_url', 'repoUrl'],
  ['commit', 'commit'],
  ['last_verified_at', 'lastVerifiedAt'],
  ['message', 'message'],
] as const

export type DeployInfo = {
  lastDeploySlot: number
  upgradeAuthority: string | null
}

export type VerifiedBuild = {
  isVerified: boolean
  repoUrl?: string
  commit?: string
  lastVerifiedAt?: string
  message?: string
}

export type ProgramInfo = {
  name?: string
  loader: string
  programData?: string
  upgradeAuthority?: string | null
  lastDeploySlot?: number
  metadata?: unknown
  verifiedBuild?: VerifiedBuild
} & Record<string, unknown>

export type ProgramInfoCache = Map<string, Promise<ProgramInfo | undefined>>

type ProgramInfoParts = {
  loader: string
  programData?: string
  deploy?: DeployInfo
  securityTxt?: Record<string, string>
  metadata?: unknown
  verifiedBuild?: VerifiedBuild
}

export type ElfHeader = { shoff: number; shnum: number; shstrndx: number }

export type SectionHeader = { nameOffset: number; offset: number; size: number }

function toBuffer(data: Uint8Array): Buffer {
  return Buffer.from(data.buffer, data.byteOffset, data.byteLength)
}

export function parseProgramAccount(data: Uint8Array): string | undefined {
  const buf = toBuffer(data)
  if (buf.length < 36 || buf.readUInt32LE(0) !== 2) {
    return undefined
  }
  return base58.encode(buf.subarray(4, 36))
}

export function parseProgramDataHeader(
  data: Uint8Array,
): DeployInfo | undefined {
  const buf = toBuffer(data)
  if (buf.length < PROGRAM_DATA_ELF_OFFSET || buf.readUInt32LE(0) !== 3) {
    return undefined
  }
  return {
    lastDeploySlot: Number(buf.readBigUInt64LE(4)),
    upgradeAuthority:
      buf[12] === 1
        ? base58.encode(buf.subarray(13, PROGRAM_DATA_ELF_OFFSET))
        : null,
  }
}

export function parseLoaderV4Header(data: Uint8Array): DeployInfo | undefined {
  const buf = toBuffer(data)
  if (buf.length < LOADER_V4_ELF_OFFSET) {
    return undefined
  }
  const status = Number(buf.readBigUInt64LE(40))
  if (status > LOADER_V4_FINALIZED) {
    return undefined
  }
  return {
    lastDeploySlot: Number(buf.readBigUInt64LE(0)),
    upgradeAuthority:
      status === LOADER_V4_FINALIZED
        ? null
        : base58.encode(buf.subarray(8, 40)),
  }
}

export function parseElfHeader(data: Uint8Array): ElfHeader | undefined {
  const buf = toBuffer(data)
  if (
    buf.length < ELF_HEADER_LENGTH ||
    buf.toString('latin1', 0, 4) !== ELF_MAGIC ||
    buf[4] !== 2 ||
    buf[5] !== 1 ||
    buf.readUInt16LE(0x3a) !== SECTION_HEADER_LENGTH
  ) {
    return undefined
  }
  const shnum = buf.readUInt16LE(0x3c)
  const shstrndx = buf.readUInt16LE(0x3e)
  if (shnum === 0 || shstrndx >= shnum) {
    return undefined
  }
  return { shoff: Number(buf.readBigUInt64LE(0x28)), shnum, shstrndx }
}

export function parseSectionHeaders(
  data: Uint8Array,
  shnum: number,
): SectionHeader[] | undefined {
  const buf = toBuffer(data)
  if (buf.length < shnum * SECTION_HEADER_LENGTH) {
    return undefined
  }
  return Array.from({ length: shnum }, (_, i) => {
    const at = i * SECTION_HEADER_LENGTH
    return {
      nameOffset: buf.readUInt32LE(at),
      offset: Number(buf.readBigUInt64LE(at + 0x18)),
      size: Number(buf.readBigUInt64LE(at + 0x20)),
    }
  })
}

export function findSection(
  sections: SectionHeader[],
  shstrtab: Uint8Array,
  name: string,
): SectionHeader | undefined {
  const buf = toBuffer(shstrtab)
  return sections.find(section => {
    if (section.nameOffset >= buf.length) {
      return false
    }
    const end = buf.indexOf(0, section.nameOffset)
    return (
      buf.toString('latin1', section.nameOffset, end < 0 ? buf.length : end) ===
      name
    )
  })
}

export function programMetadataAddress(
  program: PublicKey,
  seed: string,
): PublicKey {
  const seed16 = Buffer.alloc(16)
  seed16.write(seed, 0, 'utf-8')
  const [pda] = PublicKey.findProgramAddressSync(
    [program.toBuffer(), seed16],
    PROGRAM_METADATA_PROGRAM_ID,
  )
  return pda
}

function inflateCapped(data: Uint8Array): Uint8Array {
  const inflator = new Inflate()
  const chunks: Uint8Array[] = []
  let size = 0
  inflator.onData = chunk => {
    size += chunk.length
    if (size > MAX_INFLATED_LENGTH) {
      throw new Error(`Inflated data exceeds ${MAX_INFLATED_LENGTH} bytes`)
    }
    chunks.push(chunk)
  }
  inflator.push(data, true)
  if (inflator.err) {
    throw new Error(inflator.msg)
  }
  return Buffer.concat(chunks)
}

export function decodeProgramMetadata(data: Uint8Array): string | undefined {
  const buf = toBuffer(data)
  if (buf.length <= PMP_DATA_OFFSET || buf[0] !== PMP_METADATA_DISCRIMINATOR) {
    return undefined
  }
  const dataLength = buf.readUInt32LE(87)
  if (PMP_DATA_OFFSET + dataLength > buf.length) {
    return undefined
  }
  let payload: Uint8Array = buf.subarray(
    PMP_DATA_OFFSET,
    PMP_DATA_OFFSET + dataLength,
  )
  if (buf[86] === PMP_DATA_SOURCE_EXTERNAL) {
    return base58.encode(payload.subarray(0, 32))
  }
  if (buf[84] === 1 || buf[84] === 2) {
    try {
      payload = inflateCapped(payload)
    } catch {
      return undefined
    }
  }
  if (buf[83] === PMP_ENCODING_NONE) {
    return toBuffer(payload).toString('hex')
  }
  if (buf[83] === PMP_ENCODING_BASE58) {
    return base58.encode(payload)
  }
  if (buf[83] === PMP_ENCODING_BASE64) {
    return toBuffer(payload).toString('base64')
  }
  return new TextDecoder().decode(payload)
}

export function parseSecurityTxt(
  data: Uint8Array,
): Record<string, string> | undefined {
  const buf = toBuffer(data)
  const begin = buf.indexOf(SECURITY_TXT_BEGIN)
  if (begin < 0) {
    return undefined
  }
  const start = begin + SECURITY_TXT_BEGIN.length
  const end = buf.indexOf(SECURITY_TXT_END, start)
  if (end < 0) {
    return undefined
  }
  const parts = buf.subarray(start, end).toString('utf-8').split('\0')
  if (parts.at(-1) === '') {
    parts.pop()
  }
  const fields: Record<string, string> = {}
  for (let i = 0; i + 1 < parts.length; i += 2) {
    const key = parts[i].replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
    fields[key] = parts[i + 1]
  }
  return fields
}

export function toVerifiedBuild(json: unknown): VerifiedBuild | undefined {
  if (
    typeof json !== 'object' ||
    json === null ||
    !('is_verified' in json) ||
    typeof json.is_verified !== 'boolean'
  ) {
    return undefined
  }
  const result: VerifiedBuild = { isVerified: json.is_verified }
  for (const [from, to] of OTTERSEC_FIELDS) {
    const value: unknown = (json as Record<string, unknown>)[from]
    if (typeof value === 'string' && value !== '') {
      result[to] = value
    }
  }
  return result
}

export function composeProgramInfo({
  loader,
  programData,
  deploy,
  securityTxt,
  metadata,
  verifiedBuild,
}: ProgramInfoParts): ProgramInfo {
  const { name, ...securityFields } = securityTxt ?? {}
  const onChain = {
    loader,
    programData,
    upgradeAuthority: deploy?.upgradeAuthority,
    lastDeploySlot: deploy?.lastDeploySlot,
  }
  // first spread fixes the key order, the second keeps security.txt from overriding on-chain facts
  return {
    name,
    ...onChain,
    ...securityFields,
    ...onChain,
    metadata,
    verifiedBuild,
  }
}

export function fetchSlice(
  connection: Connection,
  account: PublicKey,
  offset: number,
  length: number,
): Promise<AccountInfo<Buffer> | null> {
  return connection.getAccountInfo(account, { dataSlice: { offset, length } })
}

export async function fetchRodata(
  connection: Connection,
  account: PublicKey,
  elfOffset: number,
  elfHeader: Uint8Array,
): Promise<Uint8Array | undefined> {
  const elf = parseElfHeader(elfHeader)
  if (!elf) {
    return undefined
  }
  const table = await fetchSlice(
    connection,
    account,
    elfOffset + elf.shoff,
    elf.shnum * SECTION_HEADER_LENGTH,
  )
  const sections = table && parseSectionHeaders(table.data, elf.shnum)
  if (!sections) {
    return undefined
  }
  const strtab = sections[elf.shstrndx]
  const shstrtab = await fetchSlice(
    connection,
    account,
    elfOffset + strtab.offset,
    strtab.size,
  )
  const rodata = shstrtab && findSection(sections, shstrtab.data, '.rodata')
  if (!rodata) {
    return undefined
  }
  const body = await fetchSlice(
    connection,
    account,
    elfOffset + rodata.offset,
    rodata.size,
  )
  return body?.data
}

function isMainnet(connection: Connection): Promise<boolean> {
  let check = mainnetChecks.get(connection)
  if (check === undefined) {
    check = connection
      .getGenesisHash()
      .then(hash => hash === MAINNET_GENESIS_HASH)
    mainnetChecks.set(connection, check)
  }
  return check
}

async function loadVerifiedBuild(
  connection: Connection,
  programId: string,
): Promise<VerifiedBuild | undefined> {
  if (!(await isMainnet(connection))) {
    return undefined
  }
  const res = await fetch(OTTERSEC_STATUS_URL + programId, {
    signal: AbortSignal.timeout(OTTERSEC_TIMEOUT_MS),
  })
  return res.ok ? toVerifiedBuild(await res.json()) : undefined
}

/**
 * OtterSec verifies mainnet deployments only, so other clusters get no status.
 */
export function fetchVerifiedBuild(
  connection: Connection,
  programId: string,
): Promise<VerifiedBuild | undefined> {
  return orUndefined(
    loadVerifiedBuild(connection, programId),
    `OtterSec verified build of ${programId}`,
  )
}

async function orUndefined<T>(
  promise: Promise<T>,
  what: string,
): Promise<T | undefined> {
  try {
    return await promise
  } catch (e) {
    console.warn(`Cannot load ${what}`, e)
    return undefined
  }
}

async function fetchSecurityTxt(
  connection: Connection,
  account: PublicKey,
  elfOffset: number,
  elfHeader: Uint8Array,
): Promise<Record<string, string> | undefined> {
  const rodata = await orUndefined(
    fetchRodata(connection, account, elfOffset, elfHeader),
    `security.txt of ${account.toBase58()}`,
  )
  return rodata && parseSecurityTxt(rodata)
}

async function fetchMetadata(
  connection: Connection,
  program: PublicKey,
): Promise<unknown> {
  const account = await orUndefined(
    connection.getAccountInfo(programMetadataAddress(program, 'security')),
    `Program Metadata security of ${program.toBase58()}`,
  )
  const text = account && decodeProgramMetadata(account.data)
  if (text === undefined || text === null) {
    return undefined
  }
  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

async function fetchProgramDataParts(
  connection: Connection,
  programData: PublicKey,
): Promise<Pick<ProgramInfoParts, 'deploy' | 'securityTxt'>> {
  const head = await orUndefined(
    fetchSlice(
      connection,
      programData,
      0,
      PROGRAM_DATA_ELF_OFFSET + ELF_HEADER_LENGTH,
    ),
    `programdata ${programData.toBase58()}`,
  )
  if (!head) {
    return {}
  }
  return {
    deploy: parseProgramDataHeader(head.data),
    securityTxt: await fetchSecurityTxt(
      connection,
      programData,
      PROGRAM_DATA_ELF_OFFSET,
      head.data.subarray(PROGRAM_DATA_ELF_OFFSET),
    ),
  }
}

async function fetchUpgradeableParts(
  connection: Connection,
  program: PublicKey,
  data: Buffer,
): Promise<ProgramInfoParts> {
  const loader = BPF_LOADER_UPGRADEABLE_ID
  const programData = parseProgramAccount(data)
  if (programData === undefined) {
    return { loader }
  }
  const [programDataParts, metadata, verifiedBuild] = await Promise.all([
    fetchProgramDataParts(connection, new PublicKey(programData)),
    fetchMetadata(connection, program),
    fetchVerifiedBuild(connection, program.toBase58()),
  ])
  return { loader, programData, ...programDataParts, metadata, verifiedBuild }
}

async function fetchLoaderV4Parts(
  connection: Connection,
  program: PublicKey,
  data: Buffer,
): Promise<ProgramInfoParts> {
  const [securityTxt, metadata, verifiedBuild] = await Promise.all([
    fetchSecurityTxt(
      connection,
      program,
      LOADER_V4_ELF_OFFSET,
      data.subarray(LOADER_V4_ELF_OFFSET),
    ),
    fetchMetadata(connection, program),
    fetchVerifiedBuild(connection, program.toBase58()),
  ])
  return {
    loader: LOADER_V4_ID,
    deploy: parseLoaderV4Header(data),
    securityTxt,
    metadata,
    verifiedBuild,
  }
}

async function loadProgramInfo(
  connection: Connection,
  programId: string,
): Promise<ProgramInfo | undefined> {
  const program = new PublicKey(programId)
  const account = await fetchSlice(
    connection,
    program,
    0,
    LOADER_V4_ELF_OFFSET + ELF_HEADER_LENGTH,
  )
  if (account === null) {
    console.warn(`Program account ${programId} not found`)
    return undefined
  }
  const loader = account.owner.toBase58()
  if (loader === BPF_LOADER_UPGRADEABLE_ID) {
    return composeProgramInfo(
      await fetchUpgradeableParts(connection, program, account.data),
    )
  }
  if (loader === LOADER_V4_ID) {
    return composeProgramInfo(
      await fetchLoaderV4Parts(connection, program, account.data),
    )
  }
  return composeProgramInfo({ loader })
}

/**
 * Loads program info once per programId; the promise never rejects.
 */
export function getProgramInfo(
  cache: ProgramInfoCache,
  connection: Connection,
  programId: string,
): Promise<ProgramInfo | undefined> {
  let info = cache.get(programId)
  if (info === undefined) {
    info = loadProgramInfo(connection, programId).catch((e: unknown) => {
      console.warn(`Cannot load program info of ${programId}`, e)
      return undefined
    })
    cache.set(programId, info)
  }
  return info
}

/**
 * Loads program info of each distinct programId, at most `concurrency` programs at a time.
 */
export async function getProgramInfos(
  connection: Connection,
  programIds: string[],
  concurrency = PROGRAM_INFO_CONCURRENCY,
): Promise<Map<string, ProgramInfo | undefined>> {
  const cache: ProgramInfoCache = new Map()
  const queue = [...new Set(programIds)]
  const worker = async () => {
    for (let id = queue.shift(); id !== undefined; id = queue.shift()) {
      await getProgramInfo(cache, connection, id)
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker))
  const infos = new Map<string, ProgramInfo | undefined>()
  for (const [id, info] of cache) {
    infos.set(id, await info)
  }
  return infos
}
