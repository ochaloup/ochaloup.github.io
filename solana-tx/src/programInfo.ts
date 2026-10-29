import { PublicKey } from '@solana/web3.js'
import base58 from 'bs58'
import { inflate } from 'pako'

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
const PMP_ENCODING_BASE58 = 2
const PMP_ENCODING_BASE64 = 3
const PMP_DATA_SOURCE_EXTERNAL = 2

export type DeployInfo = {
  lastDeploySlot: number
  upgradeAuthority: string | null
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
      payload = inflate(payload)
    } catch {
      return undefined
    }
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
