import { PublicKey } from '@solana/web3.js'
import base58 from 'bs58'

export const BPF_LOADER_UPGRADEABLE_ID =
  'BPFLoaderUpgradeab1e11111111111111111111111'
export const LOADER_V4_ID = 'LoaderV411111111111111111111111111111111111'
export const PROGRAM_METADATA_PROGRAM_ID = new PublicKey(
  'ProgM6JCCvbYkfKqJYHePx4xxSUSqJp7rh8Lyv7nk7S',
)
export const PROGRAM_DATA_ELF_OFFSET = 45
export const LOADER_V4_ELF_OFFSET = 48
const LOADER_V4_FINALIZED = 2

export type DeployInfo = {
  lastDeploySlot: number
  upgradeAuthority: string | null
}

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
