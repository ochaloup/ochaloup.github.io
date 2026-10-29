/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, no-param-reassign, sonarjs/no-duplicate-string, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call */

import { decodeIdlAccount } from '@coral-xyz/anchor/dist/cjs/idl'
import { utf8 } from '@coral-xyz/anchor/dist/cjs/utils/bytes'
import {
  compiledInstructionToInstruction,
  parseTransactionAccounts,
} from '@debridge-finance/solana-transaction-parser'
import {
  getInstructionDataFromBase64,
  serializeInstructionToBase64,
} from '@solana/spl-governance'
import {
  Connection,
  Keypair,
  MessageV0,
  PublicKey,
  Transaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedMessage,
  VersionedTransaction,
} from '@solana/web3.js'
import {
  SolanaFMParser,
  checkIfInstructionParser,
  checkIfEventParser,
  ParserType,
} from '@solanafm/explorer-kit'
import { addIdlToMap, getProgramIdl } from '@solanafm/explorer-kit-idls'
import base64 from 'base64-js'
import BN from 'bn.js'
import base58 from 'bs58'
import { inflate } from 'pako'
import YAML from 'yaml'

import splGovernanceIdl from './idl/gov.json'
import {
  decodeProgramMetadata,
  getProgramInfos,
  programMetadataAddress,
} from './programInfo'

import type { ProgramInfo } from './programInfo'
import type { InstructionData } from '@solana/spl-governance'
import type { CompiledInnerInstruction } from '@solana/web3.js'
import type { ParserOutput } from '@solanafm/explorer-kit'
import type { IdlItem } from '@solanafm/explorer-kit-idls'

const COMMITMENT = 'confirmed'
const PROGRAM_INFO_LOADING = 'loading...'
const PROGRAM_INFO_UNAVAILABLE = 'not available (see browser console)'
const PROGRAM_INFO_DEADLINE_MS = 4000

// Local IDL registry for programs not covered by Explorer Kit's API
const LOCAL_IDL_REGISTRY: Map<string, any> = new Map([
  ['GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw', splGovernanceIdl],
  ['GovMaiHfpVPw8BAM1mbdzgmSZYDw2tdP32J2fapoQoYs', splGovernanceIdl],
])

type TransactionType = 'legacy' | 'versioned' | 'from-chain' | 'splgov'

type InnerInstructionGroup = {
  index: number // parent instruction index (0-based)
  instructions: TransactionInstruction[]
}

type TransactionContext = {
  txData: any
  type: TransactionType
  instructions: TransactionInstruction[]
  connection: Connection
  innerInstructions?: InnerInstructionGroup[]
  logMessages?: string[]
}

type EventContext = {
  programId: string
  data: string
  idl: IdlItem | null
}

type IdlCache = Map<string, Promise<IdlItem | null>>

type ExplorerKitData = {
  programId: string
  program?: ProgramInfo | string
  name: string | undefined
  data: any
}

type ExplorerKitTransactionData = ExplorerKitData & {
  ixNumber: number
  innerInstructions?: ExplorerKitData[]
}

// A random account (found randomly as a first such account via clicking in explorer)
// owned by System Program that exists on all three networks (devnet, testnet, mainnet)
// We need an account to exists to not getting 'Simulation Failure:AccountNotFound'
export const RANDOM_FEE_PAYER = new PublicKey(
  '2z9vpFpzn12nTrw3YUQBipBA2kSSc876Hy6KoeforKcf',
)

export const MESSAGE_HTML_ELEMENT_ID = 'messageInput'
export const MESSAGE_URL_NAME = 'message'
export const CLUSTER_HTML_ELEMENT_ID = 'clusterInput'
export const CLUSTER_URL_NAME = 'cluster'
export const PROGRAM_ID_HTML_ELEMENT_ID = 'programIdInput'
export const PROGRAM_ID_URL_NAME = 'program'

// --------------- MAIN SCREEN INITIALIZATION ----------------

export function fillHtmlInputState(
  document: Document,
  searchParams: URLSearchParams,
  searchParamKey: string,
  htmlElementId: string,
) {
  let searchParamValue = searchParams.get(searchParamKey)
  if (searchParamValue) {
    const decodedSearchParamValue = window.decodeURIComponent(searchParamValue)
    const htmlElement = document.getElementById(htmlElementId)
    if (
      !htmlElement ||
      !(
        htmlElement instanceof HTMLTextAreaElement ||
        htmlElement instanceof HTMLInputElement
      )
    ) {
      console.error(`Cannot find getElementById('${htmlElementId}') element`)
    } else {
      htmlElement.value = decodedSearchParamValue
    }
  } else {
    console.log(`No ${searchParamKey} parameter found in URL`)
  }
}

export function loadWindowState(document: Document) {
  let searchParams = new URLSearchParams(document.location.search)
  fillHtmlInputState(
    document,
    searchParams,
    MESSAGE_URL_NAME,
    MESSAGE_HTML_ELEMENT_ID,
  )
  fillHtmlInputState(
    document,
    searchParams,
    CLUSTER_URL_NAME,
    CLUSTER_HTML_ELEMENT_ID,
  )
  fillHtmlInputState(
    document,
    searchParams,
    PROGRAM_ID_URL_NAME,
    PROGRAM_ID_HTML_ELEMENT_ID,
  )
}

// --------------- MAIN SCREEN PROCESSING ----------------

export function handleWindowState(document: Document) {
  processOutput(document, '<i>Loading...</i>')
  let searchParams = ''

  const messageElement = document.getElementById(MESSAGE_HTML_ELEMENT_ID)
  if (!messageElement || !(messageElement instanceof HTMLTextAreaElement)) {
    console.error(
      `Cannot find getElementById('${MESSAGE_HTML_ELEMENT_ID}') element`,
    )
  } else {
    const message = messageElement.value
    if (message) {
      searchParams = MESSAGE_URL_NAME + '=' + window.encodeURIComponent(message)
    }
  }

  let clusterElement = document.getElementById(CLUSTER_HTML_ELEMENT_ID)
  if (!clusterElement || !(clusterElement instanceof HTMLInputElement)) {
    console.error(
      `Cannot find getElementById('${CLUSTER_HTML_ELEMENT_ID}') element`,
    )
  } else {
    const cluster = clusterElement.value
    if (cluster) {
      if (searchParams) {
        searchParams += '&'
      }
      searchParams +=
        CLUSTER_URL_NAME + '=' + window.encodeURIComponent(cluster)
    }
    window.history.replaceState(
      undefined,
      document.title,
      window.location.pathname + '?' + searchParams,
    )
  }

  let programIdElement = document.getElementById(PROGRAM_ID_HTML_ELEMENT_ID)
  if (!programIdElement || !(programIdElement instanceof HTMLInputElement)) {
    console.error(
      `Cannot find getElementById('${PROGRAM_ID_HTML_ELEMENT_ID}') element`,
    )
  } else {
    const programId = programIdElement.value
    if (programId) {
      if (searchParams) {
        searchParams += '&'
      }
      searchParams +=
        PROGRAM_ID_URL_NAME + '=' + window.encodeURIComponent(programId)
    }
    window.history.replaceState(
      undefined,
      document.title,
      window.location.pathname + '?' + searchParams,
    )
  }
}

function processInput(document: Document): {
  message: string
  cluster: string
} {
  const messageInput = document.getElementById(
    MESSAGE_HTML_ELEMENT_ID,
  ) as HTMLInputElement
  const message = messageInput.value
  const clusterInput = document.getElementById(
    CLUSTER_HTML_ELEMENT_ID,
  ) as HTMLInputElement
  const cluster = clusterInput.value || 'https://api.devnet.solana.com'
  console.log('cluster: ' + cluster)
  return { message, cluster }
}

function processOutput(document: Document, outMessage: string): void {
  const messageOutput = document.getElementById('messageOutput')
  if (!messageOutput) {
    doLogError("Internal error: 'messageOutput' element not found")
    return
  }
  messageOutput.innerHTML = outMessage
}

export async function deserializeTransaction(document: Document) {
  const { message, cluster } = processInput(document)
  const messageParsed = await parseAndDeserializeTransaction(
    message,
    cluster,
    output => processOutput(document, output),
  )
  processOutput(document, messageParsed)
}

export async function deserializeEvent(document: Document) {
  const { message: data, cluster } = processInput(document)
  const output = await parseAndDeserializeEvent(document, cluster, data, out =>
    processOutput(document, out),
  )
  processOutput(document, output)
}

// --------------- ALL WORK METHODS ----------------

async function parseAndDeserializeTransaction(
  data: string,
  cluster: string,
  onProgress: (output: string) => void,
): Promise<string> {
  let parsedData: TransactionContext | undefined = undefined
  if (!data || data.trim() === '') {
    return doLogError('<b style="color:red;">Transaction data is empty</b>')
  }

  let connection: Connection | undefined = undefined
  try {
    connection = new Connection(cluster, COMMITMENT)
  } catch (e) {
    return doLogError(
      'Failed to connect to cluster: ' + cluster,
      (e as Error).message,
    )
  }

  // Let's check if the input string is URI encoded, if so then decode it
  data = decodeIfUriEncoded(data)

  // --- Is it base58 data, maybe a transaction signature?
  {
    let decoded: Buffer | undefined
    try {
      decoded = decode58(data)
      console.log('Decoded base58 length: ' + decoded.length)
    } catch (e) {
      console.log('Failed deserialize base58 data: ' + (e as Error).message)
    }
    if (decoded) {
      try {
        if (decoded.length === 64) {
          const transactionResponse = await connection.getTransaction(data, {
            commitment: COMMITMENT,
            maxSupportedTransactionVersion: 1,
          })
          if (transactionResponse) {
            const msg = transactionResponse.transaction.message
            const accountsMeta = parseTransactionAccounts(
              msg,
              transactionResponse.meta?.loadedAddresses,
            )
            const instructions = msg.compiledInstructions.map(ix =>
              compiledInstructionToInstruction(ix, accountsMeta),
            )
            const innerInstructions = (
              transactionResponse.meta?.innerInstructions ?? []
            ).map((group: CompiledInnerInstruction): InnerInstructionGroup => ({
              index: group.index,
              instructions: group.instructions.map(ix =>
                compiledInstructionToInstruction(ix, accountsMeta),
              ),
            }))
            parsedData = {
              txData: msg,
              type: 'from-chain',
              instructions,
              connection,
              innerInstructions,
              logMessages: transactionResponse.meta?.logMessages ?? undefined,
            }
          }
        }
      } catch (e) {
        console.log(
          'Failed to load/deserialize base58 data as transaction from chain: ' +
            (e as Error).message,
        )
      }
      try {
        if (!parsedData || !parsedData.instructions.length) {
          // maybe the base58 input is directly the transaction message
          const decodedInstructions = await decodeIfTransaction(
            decoded,
            connection,
          )
          parsedData = { ...decodedInstructions, connection }
        }
      } catch (e) {
        console.log(
          'Failed deserialize base58 data as transaction message: ' +
            (e as Error).message,
        )
      }
    }
  }

  // --- Is it base64 transaction data?
  if (!parsedData || !parsedData.instructions.length) {
    try {
      const decoded: Buffer = decode64(data)
      console.log('Decoded base64 length: ' + decoded.length)
      const decodedInstructions = await decodeIfTransaction(decoded, connection)
      parsedData = { ...decodedInstructions, connection }
    } catch (e) {
      console.log(
        'Failed deserialize base64 transaction message: ' +
          (e as Error).message,
      )
    }
  }

  // --- Is it borsh SPL Gov multisig transaction data?
  if (!parsedData || !parsedData.instructions.length) {
    try {
      const decoded: InstructionData = getInstructionDataFromBase64(data)
      parsedData = {
        txData: decoded,
        type: 'splgov',
        instructions: [toTransactionInstruction(decoded)],
        connection,
      }
    } catch (e) {
      console.error(e)
      console.log(
        'Failed deserialize spl gov transaction: ' + (e as Error).message,
      )
    }
  }

  if (!parsedData) {
    return (
      '<b style="color:red;">Failed to deserialize provided data</b>' +
      `<p style='margin-left: 30px;'><code>${data}</code></p>`
    )
  } else {
    try {
      return await doLogTransactionContext(parsedData, onProgress)
    } catch (e) {
      console.error(e)
      console.error(YAML.stringify(parsedData.txData, replacer).trimEnd())
      return doLogError(
        'Failed to process deserialized transaction data.',
        (e as Error).message,
      )
    }
  }
}

async function parseAndDeserializeEvent(
  document: Document,
  cluster: string,
  data: string,
  onProgress: (output: string) => void,
): Promise<string> {
  const programIdInput = document.getElementById(PROGRAM_ID_HTML_ELEMENT_ID)
  if (!programIdInput || !(programIdInput instanceof HTMLInputElement)) {
    return doLogError(
      `Internal error: '${PROGRAM_ID_HTML_ELEMENT_ID}' element not found`,
    )
  }
  const programId = programIdInput.value
  if (!programId || programId.trim() === '') {
    return doLogError('Program ID is required')
  }

  let connection: Connection | undefined = undefined
  try {
    connection = new Connection(cluster, COMMITMENT)
  } catch (e) {
    return doLogError(
      'Failed to connect to cluster: ' + cluster,
      (e as Error).message,
    )
  }

  const idl = await loadIdl(
    connection,
    programId,
    await getSlotOrDefault(connection),
  )
  const parsedLines: ExplorerKitData[] = []
  for (let line of data.split('\n')) {
    line = line.trim()
    if (!line || line === '') {
      // empty line - skip
      continue
    }
    const programDataIndex = line.indexOf('Program data:')
    if (line.includes('>') && programDataIndex < 0) {
      // line starting with '>' but not 'Program data:' - skip
      continue
    }
    if (programDataIndex >= 0) {
      line = line.substring(programDataIndex + 'Program data:'.length).trim()
    }
    let explorerKitParsed: ExplorerKitData | undefined
    try {
      console.log(
        `Parsing event data with Explorer Kit for program: ${programId}`,
      )
      explorerKitParsed = parseEventByExplorerKit({
        data: line,
        idl,
        programId,
      })
    } catch (e) {
      console.error('Failed to parse event data with Explorer Kit', e)
    }

    if (explorerKitParsed?.name === undefined) {
      const cpiEvent = parseAsTransactionCpiData(line)
      console.log(
        "Failed to get parsed event, let's check if the data could be Anchor CPI event",
        'data',
        cpiEvent,
      )
      if (cpiEvent) {
        explorerKitParsed = parseEventByExplorerKit({
          data: cpiEvent,
          idl,
          programId,
        })
      }
    }

    const parsed = explorerKitParsed ?? {
      name: undefined,
      data: 'Failed to load and parse',
    }
    parsedLines.push({
      programId,
      program: PROGRAM_INFO_LOADING,
      name: parsed.name,
      data: parsed.data,
    })
  }

  const render = () =>
    '<h4>Parsed:</h4>' +
    parsedLines
      .map(
        parsed =>
          '<p><pre><code>' +
          escapeHtml(YAML.stringify(parsed, replacer).trimEnd()) +
          '</code></pre></p>',
      )
      .join('')
  onProgress(render())
  await attachProgramInfo(parsedLines, connection)
  return render()
}

/**
 * Check the log data to be transaction Anchor CPI event:
 * Expected data format (just strange format of juggling with base64 and base58):
 *  < cpi event discriminator | event name discriminator | event data >
 * If matches cpi event discriminator
 * < event name | event data> base64 formatted is returned
 * otherwise null is returned.
 */
function parseAsTransactionCpiData(log: string): string | null {
  let encodedLog: Buffer
  try {
    // verification if log is transaction cpi data encoded with base58
    encodedLog = decode58(log)
  } catch (_e) {
    try {
      encodedLog = decode64(log)
    } catch (e) {
      console.error(
        'Failed to decode CPI log data either being base58 or base64',
        e,
      )
      return null
    }
  }

  const eventIxTag: bigint = BigInt('0x1d9acb512ea545e4')
  const eventIxBuffer = Buffer.alloc(8)
  eventIxBuffer.writeBigInt64LE(eventIxTag, 0)
  const disc = encodedLog.subarray(0, 8)
  if (disc.equals(eventIxBuffer)) {
    // after CPI tag data follows in format of standard event
    return base64.fromByteArray(encodedLog.subarray(8))
  } else {
    return null
  }
}

function decodeIfUriEncoded(str: string): string {
  const uriEncodedPattern = /%[0-9A-Fa-f]{2}/g
  while (uriEncodedPattern.test(str)) {
    str = decodeURIComponent(str)
  }
  return str
}

const MESSAGE_DECODERS: [string, (data: Buffer) => VersionedMessage][] = [
  ['transaction', data => VersionedTransaction.deserialize(data).message],
  ['transaction message', data => VersionedMessage.deserialize(data)],
]

async function decodeIfTransaction(
  data: Buffer,
  connection: Connection,
): Promise<{
  type: TransactionType
  txData: VersionedMessage
  instructions: TransactionInstruction[]
}> {
  for (const [kind, decode] of MESSAGE_DECODERS) {
    let vMsg: VersionedMessage
    try {
      vMsg = decode(data)
    } catch (e) {
      console.log(`Not a ${kind}: ` + (e as Error).message)
      continue
    }
    if (vMsg.compiledInstructions.length === 0) {
      console.log(`No instructions found in ${kind}`)
      continue
    }
    return {
      type: vMsg.version === 'legacy' ? 'legacy' : 'versioned',
      txData: vMsg,
      instructions: await decompileVersionedMessage(vMsg, connection),
    }
  }
  throw new Error('Data is not a valid transaction message')
}

async function decompileVersionedMessage(
  vMsg: VersionedMessage,
  connection: Connection,
): Promise<TransactionInstruction[]> {
  const addressLookupTableAccounts = await Promise.all(
    vMsg.addressTableLookups.map(async ({ accountKey }) => {
      const { value } = await connection.getAddressLookupTable(accountKey)
      if (!value) {
        throw new Error(
          `Address lookup table ${accountKey.toBase58()} not found at ${connection.rpcEndpoint}`,
        )
      }
      return value
    }),
  )
  return TransactionMessage.decompile(vMsg, { addressLookupTableAccounts })
    .instructions
}

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function doLogError(message: string, whatever?: any): string {
  let errOutput = '<b style="color:red;">' + message + '</b>'
  if (whatever) {
    errOutput += `<p style='margin-left: 30px;'><code>${whatever}</code></p>`
  }
  return errOutput
}

async function simulateForContext(
  context: TransactionContext,
): Promise<{ logMessages?: string[] }> {
  try {
    const blockhash = await context.connection.getLatestBlockhash()
    const msg = MessageV0.compile({
      payerKey: RANDOM_FEE_PAYER,
      instructions: context.instructions,
      recentBlockhash: blockhash.blockhash,
    })
    const tx = new VersionedTransaction(msg)
    const result = await context.connection.simulateTransaction(tx, {
      sigVerify: false,
      replaceRecentBlockhash: true,
    })
    return { logMessages: result.value.logs ?? undefined }
  } catch (e) {
    console.warn('Simulation failed:', (e as Error).message)
    return {}
  }
}

async function doLogTransactionContext(
  context: TransactionContext,
  onProgress: (output: string) => void,
): Promise<string> {
  console.log('Transaction type: ' + context.type)
  const { legacyBase64, version0Base64, version0Base58 } =
    await asDumpTransactionMessage(context)

  let output = ''
  // --- LEGACY BASE 64
  output +=
    '<h4>solana base64 dump-transaction-message for legacy inspector: ' +
    getHref('https://anchor.so/tx/inspector', legacyBase64) +
    ', ' +
    getHref('https://tribeca.so/tx/inspector', legacyBase64) +
    '</h4>'
  output += '<p><code>' + legacyBase64 + '</code></p>'
  // --- VERSION 0 BASE 64
  output +=
    '<h4>solana base64 dump-transaction-message for version0 inspector: ' +
    getHref('https://explorer.solana.com/tx/inspector', version0Base64) +
    ', ' +
    getHref('https://solana.fm/inspector', version0Base64) +
    '</h4>'
  output += '<p><code>' + version0Base64 + '</code></p>'
  // --- VERSION 0 BASE 58
  output += '<h4>solana base58 dump-transaction-message:</h4> '
  output += '<p><code>' + version0Base58 + '</code></p>'
  // --- SPL GOV BASE 64
  output +=
    '<h4>solana base64 dump-transaction-instruction-messages for spl-gov:</h4>'
  for (const ix of context.instructions) {
    output += '<p><code>' + serializeInstructionToBase64(ix) + '</code></p>'
  }
  output += `<h4>Transaction ${context.type} (YAML format):</h4>`
  output +=
    '<p><pre><code>' +
    escapeHtml(YAML.stringify(context.txData, replacer).trimEnd()) +
    '</code></pre></p>'

  // For non-chain paths, try simulation to get logs
  if (context.type !== 'from-chain' && !context.logMessages) {
    const simResult = await simulateForContext(context)
    if (simResult.logMessages) {
      context.logMessages = simResult.logMessages
    }
  }

  const parsedExplorerKit = await parseTransactionByExplorerKit(context)
  let logs = ''
  if (context.logMessages && context.logMessages.length > 0) {
    logs +=
      '<h4>Logs:</h4>' +
      '<p><pre><code>' +
      escapeHtml(context.logMessages.join('\n')) +
      '</code></pre></p>'
  }
  const render = () =>
    output +
    '<h4>Parsed:</h4>' +
    '<p><pre><code>' +
    escapeHtml(
      YAML.stringify(parsedExplorerKit, replacer, {
        aliasDuplicateObjects: false,
      }).trimEnd(),
    ) +
    '</code></pre></p>' +
    logs

  onProgress(render())
  await attachProgramInfo(
    [
      ...parsedExplorerKit,
      ...parsedExplorerKit.flatMap(ix => ix.innerInstructions ?? []),
    ],
    context.connection,
  )
  return render()
}

async function attachProgramInfo(
  parsed: ExplorerKitData[],
  connection: Connection,
): Promise<void> {
  const infos = await getProgramInfos(
    connection,
    parsed.map(item => item.programId),
    AbortSignal.timeout(PROGRAM_INFO_DEADLINE_MS),
  )
  for (const item of parsed) {
    item.program = infos.get(item.programId) ?? PROGRAM_INFO_UNAVAILABLE
  }
}

function getHref(hostname: string, message: string) {
  return `<a style="font-size: 80%;" target="_blank" href="${hostname}?message=${encodeURIComponent(message)}">${hostname}</a>`
}

function toTransactionInstruction(
  instructionData: InstructionData,
): TransactionInstruction {
  return new TransactionInstruction({
    keys: instructionData.accounts,
    programId: instructionData.programId,
    data: Buffer.from(instructionData.data),
  })
}

/**
 * Helper function to print instruction in base64 format
 * that's not for SPL Gov multisig(!) but it can be used to get the txn parsed
 * by the Solana transaction inspector
 */
export async function asDumpTransactionMessage(
  context: TransactionContext,
): Promise<{
  legacyBase64: string
  version0Base64: string
  version0Base58: string
}> {
  const iXes = context.instructions
  const blockhash = await context.connection.getLatestBlockhash()

  // usable at https://anchor.so/tx/inspector or https://tribeca.so/tx/inspector
  const legacyTransaction = new Transaction({
    feePayer: RANDOM_FEE_PAYER,
    blockhash: blockhash.blockhash,
    lastValidBlockHeight: blockhash.lastValidBlockHeight,
  }).add(...iXes)
  const legacyBase64 = legacyTransaction.serializeMessage().toString('base64')

  // usable at https://explorer.solana.com/tx/inspector
  const msg = MessageV0.compile({
    payerKey: RANDOM_FEE_PAYER,
    instructions: iXes,
    recentBlockhash: blockhash.blockhash,
  })
  // const versionedTransaction = new VersionedTransaction(msg)
  const version0Base64 = Buffer.from(msg.serialize()).toString('base64')
  const version0Base58 = base58.encode(msg.serialize()).toString()

  return { legacyBase64, version0Base64, version0Base58 }
}

export async function anchorIdlAddress(
  programAddress: PublicKey,
): Promise<PublicKey> {
  const [pdaProgramAddress] = PublicKey.findProgramAddressSync(
    [],
    programAddress,
  )
  const seedAddress = await PublicKey.createWithSeed(
    pdaProgramAddress,
    'anchor:idl',
    programAddress,
  )
  return seedAddress
}

export async function getAnchorIdl(
  connection: Connection,
  programAddress: PublicKey,
): Promise<string | null> {
  // Try old format: anchor:idl seed-based address
  const idlAddress = await anchorIdlAddress(programAddress)
  const accountInfo = await connection.getAccountInfo(idlAddress)
  if (accountInfo !== null) {
    try {
      const idlAccount = decodeIdlAccount(accountInfo.data.slice(8)) // chop off discriminator
      const inflatedIdl = inflate(idlAccount.data)
      const idlString = utf8.decode(inflatedIdl)
      console.debug('Anchor IDL found (old format):', idlAddress.toBase58())
      return JSON.parse(idlString)
    } catch (e) {
      console.warn(
        `Cannot decode anchor IDL ${idlAddress.toBase58()} for program: ${programAddress.toBase58()}`,
        e,
      )
    }
  }

  // Try new format: Program Metadata program (Anchor 0.31+)
  const pmpAddress = programMetadataAddress(programAddress, 'idl')
  const pmpInfo = await connection.getAccountInfo(pmpAddress)
  if (pmpInfo !== null) {
    try {
      const idlString = decodeProgramMetadata(pmpInfo.data)
      if (idlString === undefined) {
        throw new Error('Program Metadata account data cannot be decoded')
      }
      console.debug('Anchor IDL found (PMP format):', pmpAddress.toBase58())
      return JSON.parse(idlString)
    } catch (e) {
      console.warn(
        `Cannot decode PMP IDL ${pmpAddress.toBase58()} for program: ${programAddress.toBase58()}`,
        e,
      )
    }
  }

  console.warn(
    `No on-chain IDL found for program: ${programAddress.toBase58()}`,
  )
  return null
}

async function getSlotOrDefault(connection: Connection): Promise<number> {
  try {
    return await connection.getSlot(COMMITMENT)
  } catch {
    const slot = 273_134_000 // slot at date: 2024-06-24
    console.warn(
      `Cannot get slot from cluster: ${connection.rpcEndpoint}, ` +
        `using some recent slot ${slot} as default slot`,
    )
    return slot
  }
}

async function loadIdl(
  connection: Connection,
  programId: string,
  slot: number,
): Promise<IdlItem | null> {
  let repoMap: Map<string, any> | undefined = undefined
  try {
    const anchorIdl = await getAnchorIdl(connection, new PublicKey(programId))
    if (anchorIdl !== null) {
      repoMap = addIdlToMap(new Map(), programId, anchorIdl, 0)
    }
  } catch (e) {
    console.warn(
      `Cannot load anchor IDL for program: ${programId} from cluster: ${connection.rpcEndpoint}`,
      e,
    )
  }
  const localIdl = LOCAL_IDL_REGISTRY.get(programId)
  if (localIdl) {
    repoMap = addIdlToMap(repoMap ?? new Map(), programId, localIdl, 0)
  }
  try {
    const idl = await getProgramIdl(programId, { slotContext: slot }, repoMap)
    if (idl) {
      console.log(`ExplorerKit found IDL for: ${programId} [${idl.idlType}]`)
    }
    return idl
  } catch (e) {
    console.warn(`Cannot load IDL for program: ${programId}`, e)
    return null
  }
}

function getIdl(
  cache: IdlCache,
  connection: Connection,
  programId: string,
  slot: number,
): Promise<IdlItem | null> {
  let idl = cache.get(programId)
  if (idl === undefined) {
    idl = loadIdl(connection, programId, slot)
    cache.set(programId, idl)
  }
  return idl
}

function parseOneInstruction(
  ix: TransactionInstruction,
  idl: IdlItem | null,
): { name: string | undefined; data: any } {
  const programId = ix.programId.toBase58()
  if (idl) {
    try {
      const parser = new SolanaFMParser(idl, programId)
      const instructionParser = parser.createParser(ParserType.INSTRUCTION)
      if (instructionParser && checkIfInstructionParser(instructionParser)) {
        const parsed = instructionParser.parseInstructions(
          base58.encode(ix.data),
          ix.keys.map(k => k.pubkey.toBase58()),
        )
        if (parsed) {
          return { name: parsed.name, data: parsed.data }
        }
      }
    } catch (e) {
      console.warn(
        `Cannot parse instruction of program: ${programId} via SolanaFM parser`,
        e,
      )
    }
  }
  // Fallback: detect Anchor built-in IDL management instructions (not in any IDL)
  const anchorIdlParsed = tryParseAnchorIdlInstruction(ix)
  if (anchorIdlParsed) {
    return anchorIdlParsed
  }
  return { name: undefined, data: 'failed to parse' }
}

// Anchor IDL_IX_TAG: 0x0a69e9a778bcf440 (little-endian)
const ANCHOR_IDL_IX_TAG = Buffer.from([
  0x40, 0xf4, 0xbc, 0x78, 0xa7, 0xe9, 0x69, 0x0a,
])
const ANCHOR_IDL_VARIANTS = [
  'IdlCreate',
  'IdlCreateBuffer',
  'IdlWrite',
  'IdlSetBuffer',
  'IdlSetAuthority',
  'IdlClose',
  'IdlResize',
]

function tryParseAnchorIdlInstruction(
  ix: TransactionInstruction,
): { name: string; data: any } | null {
  if (ix.data.length < 9) return null
  const tag = Buffer.from(ix.data.slice(0, 8))
  if (!tag.equals(ANCHOR_IDL_IX_TAG)) return null
  const variant = ix.data[8]
  const name = ANCHOR_IDL_VARIANTS[variant] ?? `IdlUnknown(${variant})`
  const accounts: Record<string, string> = {}
  ix.keys.forEach((k, i) => {
    accounts[`account_${i}`] = k.pubkey.toBase58()
  })
  return { name, data: accounts }
}

export async function parseTransactionByExplorerKit(
  context: TransactionContext,
): Promise<ExplorerKitTransactionData[]> {
  const result: ExplorerKitTransactionData[] = []
  const idlCache: IdlCache = new Map()
  const slot = await getSlotOrDefault(context.connection)
  let ixNumber = 0

  for (const ix of context.instructions) {
    ixNumber++
    const programId = ix.programId.toBase58()
    const parsed = parseOneInstruction(
      ix,
      await getIdl(idlCache, context.connection, programId, slot),
    )

    // Parse inner CPI instructions for this top-level instruction
    const innerGroup = context.innerInstructions?.find(
      g => g.index === ixNumber - 1,
    )
    let parsedInner: ExplorerKitData[] | undefined = undefined
    if (innerGroup && innerGroup.instructions.length > 0) {
      parsedInner = []
      for (const innerIx of innerGroup.instructions) {
        const innerProgramId = innerIx.programId.toBase58()
        const innerParsed = parseOneInstruction(
          innerIx,
          await getIdl(idlCache, context.connection, innerProgramId, slot),
        )
        parsedInner.push({
          programId: innerProgramId,
          program: PROGRAM_INFO_LOADING,
          name: innerParsed.name,
          data: innerParsed.data,
        })
      }
    }

    result.push({
      programId,
      program: PROGRAM_INFO_LOADING,
      ixNumber,
      name: parsed.name,
      data: parsed.data,
      innerInstructions: parsedInner,
    })
  }
  return result
}

export function parseEventByExplorerKit({
  programId,
  data,
  idl,
}: EventContext): ExplorerKitData {
  // Checks if SFMIdlItem is defined, if not you will not be able to initialize the parser layout
  let parsedEvent: ParserOutput | null = null
  if (idl) {
    const parser = new SolanaFMParser(idl, programId)
    const eventParser = parser.createParser(ParserType.EVENT)
    if (eventParser && checkIfEventParser(eventParser)) {
      parsedEvent = eventParser.parseEvents(data)
    }
  }

  let result: ExplorerKitData
  if (parsedEvent !== null) {
    result = { programId, name: parsedEvent.name, data: parsedEvent.data }
  } else {
    result = { programId, name: undefined, data: 'Failed to load and parse' }
  }
  return result
}

/**
 * Helper function to print better in YAML.
 */
export function replacer(key: unknown, value: unknown): unknown {
  if (value instanceof BN) {
    try {
      return (value as BN).toNumber()
    } catch (_e) {
      return (value as BN).toString()
    }
  }
  if (value instanceof Keypair) {
    value = value.publicKey
  }
  if (value instanceof PublicKey) {
    return value.toBase58()
  }
  if (
    typeof key === 'string' &&
    key.startsWith('reserved') &&
    Array.isArray(value)
  ) {
    return [value.length]
  }
  if (value instanceof Buffer) {
    return value.toString('base64')
  }
  if (value instanceof Uint8Array) {
    return Buffer.from(value).toString('base64')
  }
  if (
    value instanceof Array &&
    Array.isArray(value) &&
    value.every(item => typeof item === 'number')
  ) {
    return Buffer.from(value).toString('base64')
  }
  return value
}

function decode64(data: string): Buffer {
  return Buffer.from(base64.toByteArray(data))
}

function decode58(data: string): Buffer {
  return Buffer.from(base58.decode(data))
}
