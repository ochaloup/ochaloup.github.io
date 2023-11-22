import {
  Connection,
  Keypair,
  Message,
  MessageV0,
  PublicKey,
  Transaction,
  TransactionInstruction,
  VersionedMessage,
} from '@solana/web3.js'
import YAML from 'yaml'
import {
  InstructionData,
  getInstructionDataFromBase64,
  serializeInstructionToBase64,
} from '@solana/spl-governance'
import {
  compiledInstructionToInstruction,
  parseTransactionAccounts,
} from '@debridge-finance/solana-transaction-parser'
import BN from 'bn.js'
import  base64 from "base64-js"
import  base58  from 'bs58'
import { SolanaFMParser, checkIfInstructionParser, ParserType, ParserOutput } from "@solanafm/explorer-kit"
import { addIdlToMap, getProgramIdl } from "@solanafm/explorer-kit-idls"
import { decodeIdlAccount } from '@coral-xyz/anchor/dist/cjs/idl';
import { utf8 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import {inflate} from 'pako'

const COMMITMENT = 'confirmed'
type Context = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    txData: any
    type: string
    instructions: TransactionInstruction[]
    connection: Connection
  }
type ExplorerKitTransactionData = {
  programId: string,
  ixNumber: number
  name: string
  data: any
}

// A random account (found randomly as a first such account via clicking in explorer)
// owned by System Program that exists on all three networks (devnet, testnet, mainnet)
// We need an account to exists to not getting 'Simulation Failure:AccountNotFound'
export const RANDOM_FEE_PAYER = new PublicKey("2z9vpFpzn12nTrw3YUQBipBA2kSSc876Hy6KoeforKcf")

export async function deserializeTransaction() {
    const messageInput = document.getElementById('messageInput') as HTMLInputElement
    const message = messageInput.value
    const clusterInput = document.getElementById('cluster') as HTMLInputElement
    const cluster = clusterInput.value || 'https://api.devnet.solana.com'
    console.log('cluster: ' + cluster)

    const messageParsed = await parseAndDeserialize(message, cluster)
  
    const messageOutput = document.getElementById('messageOutput')
    if (!messageOutput) {
        return doLogError("Internal error: 'messageOutput' element not found")
    }
    messageOutput.innerHTML = messageParsed
  }

  async function parseAndDeserialize(data: string, cluster: string): Promise<string> {
    let parsedData: Context | undefined = undefined

    let connection: Connection | undefined = undefined
    try {
      connection = new Connection(cluster, COMMITMENT)
    } catch (e) {
      return doLogError('Failed to connect to cluster: ' + cluster, e.message)
    }

    // Let's check if the input string is URI encoded, if so then decode it
    data = decodeIfUriEncoded(data)

    // --- Is it transaction signature?
    try {
      const decoded: Buffer = decode58(data)
      if (decoded.length === 64) {
        const transactionResponse = await connection.getTransaction(data, { commitment: COMMITMENT, maxSupportedTransactionVersion: 0 })
        if (transactionResponse) {
          const msg = transactionResponse.transaction.message
          const accountsMeta = parseTransactionAccounts(msg, transactionResponse.meta.loadedAddresses)
          const instructions = msg.compiledInstructions.map(ix =>
            compiledInstructionToInstruction(ix, accountsMeta)
          )
          parsedData = { txData: msg, type: 'from-chain', instructions, connection }
        } else {
          console.log("Cannot find transaction with signature: " + data + " in cluster: " + cluster)
        }
      }
    } catch (e) {
      console.log(
        'Failed deserialize transaction signature: ' + (e as Error).message
      )
    }

    // --- Is it base64 legacy transaction data?
    if (!parsedData || !parsedData.instructions.length) {
      try {
        const decoded: Buffer = decode64(data)
        const msg = Message.from(decoded)
        const accountsMeta = parseTransactionAccounts(msg, undefined)
        const instructions = msg.instructions.map(ix =>
          compiledInstructionToInstruction(ix, accountsMeta)
        )
        parsedData = { txData: msg, type: 'legacy', instructions, connection }
      } catch (e) {
        console.log(
          'Failed deserialize legacy transaction: ' + (e as Error).message
        )
      }
    }

    // --- Is it base64 versioned0 transaction data?
    if (!parsedData || !parsedData.instructions.length) {
      try {
        const decoded: Buffer = decode64(data)
        const vMsg = VersionedMessage.deserialize(decoded)
        const accountsMeta = parseTransactionAccounts(vMsg, undefined) // TODO: probably this is not correct
        const instructions = vMsg.compiledInstructions.map(ix =>
          compiledInstructionToInstruction(ix, accountsMeta)
        )
        parsedData = { txData: vMsg, type: 'versioned', instructions, connection }
      } catch (e) {
        console.log(
          'Failed deserialize versioned transaction: ' + (e as Error).message
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
          connection
        }
      } catch (e) {
        console.error(e)
        console.log(
          'Failed deserialize spl gov transaction: ' + (e as Error).message
        )
      }
    }

    if (!parsedData) {
      return '<b style="color:red;">Failed to deserialize transaction data</b>' + `<p style='margin-left: 30px;'><code>${data}</code></p>`
    } else {
      try {
        return await doLog(parsedData)
      } catch (e) {
        console.error(e)
        console.error(YAML.stringify(parsedData.txData, replacer).trimEnd())
        return doLogError('Failed to print transaction data', e.message)
      }
    }
  }

  function decodeIfUriEncoded(str: string): string {
    const uriEncodedPattern = /%[0-9A-Fa-f]{2}/g
    while (uriEncodedPattern.test(str)) {
      str = decodeURIComponent(str)
    }
    return str
  }

  function doLogError(message: string, whatever?: any): string {
    let errOutput = '<b style="color:red;">' + message + '</b>'
    if (whatever) {
      errOutput += `<p style='margin-left: 30px;'><code>${whatever}</code></p>`
    }
    return errOutput
  }
  
  async function doLog(context: Context): Promise<string> {
    console.log('Transaction type: ' + context.type)
    const { legacy, version0 } = await asDumpTransactionMessage(
      context
    )

    let output = ''
    output += '<h4>solana base64 dump-transaction-message for legacy inspector: ' +
      getHref('https://anchor.so/tx/inspector', legacy) + ', ' + getHref('https://tribeca.so/tx/inspector', legacy) +
      '</h4>'
    output += '<p><code>' + legacy + '</code></p>'
    output += '<h4>solana base64 dump-transaction-message for version0 inspector: ' +
      getHref('https://explorer.solana.com/tx/inspector', version0) + '</h4>'
    output += '<p><code>' + version0 + '</code></p>'
    output += '<h4>solana base64 dump-transaction-messages for spl-gov:</h4>'
    for (const ix of context.instructions) {
      output += '<p><code>' + serializeInstructionToBase64(ix) + '</code></p>'
    }
    output += `<h4>Transaction ${context.type} (YAML format):</h4>`
    output += '<p><pre><code>' + YAML.stringify(context.txData, replacer).trimEnd() + '</code></pre></p>'

    const parsedExplorerKit = await parseExplorerKit(context)
    output += `<h4>Parsed with <a href="https://github.com/solana-fm/explorer-kit">ExplorerKit</a>:</h4>`
    output += '<p><pre><code>' + YAML.stringify(parsedExplorerKit, replacer).trimEnd() + '</code></pre></p>'

    return output
  }

  function getHref(hostname: string, message: string) {
    return `<a style="font-size: 80%;" target="_blank" href="${hostname}?message=${encodeURIComponent(message)}">${hostname}</a>`
  }
  
  function toTransactionInstruction(
    instructionData: InstructionData
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
    context: Context
  ): Promise<{ legacy: string, version0: string }> {
    const iXes = context.instructions
    const blockhash = await context.connection.getLatestBlockhash()
  
    // usable at https://anchor.so/tx/inspector or https://tribeca.so/tx/inspector
    const legacyTransaction = new Transaction({
      feePayer: RANDOM_FEE_PAYER,
      blockhash: blockhash.blockhash,
      lastValidBlockHeight: blockhash.lastValidBlockHeight,
    }).add(...iXes)
    const legacy = legacyTransaction.serializeMessage().toString('base64')
  
    // usable at https://explorer.solana.com/tx/inspector
    const msg = MessageV0.compile({
      payerKey: RANDOM_FEE_PAYER,
      instructions: iXes,
      recentBlockhash: blockhash.blockhash,
    })
    // const versionedTransaction = new VersionedTransaction(msg)
    const version0 = Buffer.from(msg.serialize()).toString(
      'base64'
    )

    return { legacy, version0 }
  }

export async function anchorIdlAddress(programAddress: PublicKey): Promise<PublicKey> {
  const [pdaProgramAddress,] = PublicKey.findProgramAddressSync(
    [],
    programAddress
  );
  const seedAddress = await PublicKey.createWithSeed(
    pdaProgramAddress,
    'anchor:idl',
    programAddress
  );
  return seedAddress
}

export async function getAnchorIdl(context: Context, programAddress: PublicKey): Promise<string | null> {
  const idlAddress = await anchorIdlAddress(programAddress)
  const accountInfo = await context.connection.getAccountInfo(idlAddress)
  if (accountInfo === null) {
    console.warn(`Cannot load data of anchor IDL ${idlAddress} for program: ${programAddress.toBase58()}`)
    return null
  }
  try {
    const idlAccount = decodeIdlAccount(accountInfo.data.slice(8)); // chop off discriminator
    const inflatedIdl = inflate(idlAccount.data);
    const idlString = utf8.decode(inflatedIdl);
    console.debug("Anchor IDL found:", idlAddress.toBase58())
    return JSON.parse(idlString)
  } catch (e) {
    console.warn(`Cannot decode anchor IDL ${idlAddress} for program: ${programAddress.toBase58()}`, e)
    return null
  }
}

export async function parseExplorerKit(
  context: Context
): Promise<ExplorerKitTransactionData[]> {
  const result: ExplorerKitTransactionData[] = []
  let ixNumber = 0
  const slot = await context.connection.getSlot(COMMITMENT)

  for (const ix of context.instructions) {
    ixNumber++
    // https://github.com/solana-fm/explorer-kit/tree/main#-usage
    const programId = ix.programId.toBase58()

    // when we have anchor IDL from on-chain, let's put it into the SFMIdlItem as the most up-to-date
    const anchorIdl = await getAnchorIdl(context, ix.programId)
    let repoMap = undefined
    if (anchorIdl !== null) {
      repoMap = addIdlToMap(new Map(), ix.programId.toBase58(), anchorIdl, 0)
    }

    const SFMIdlItem = await getProgramIdl(programId, {slotContext: slot}, repoMap)
    // Checks if SFMIdlItem is defined, if not you will not be able to initialize the parser layout
    let parsedTx: ParserOutput | null = null
    if (SFMIdlItem) {
      console.log(`ExplorerKit found IDL for: ${programId} [${SFMIdlItem.idlType}]`)
      const parser = new SolanaFMParser(SFMIdlItem, programId)
      const instructionParser = parser.createParser(ParserType.INSTRUCTION)
      if (instructionParser && checkIfInstructionParser(instructionParser)) {
          // Parse the transaction
          parsedTx = instructionParser.parseInstructions(base58.encode(ix.data), ix.keys.map(k => k.pubkey.toBase58()))
          // console.log(SFMIdlItem.idlSlotVersion, SFMIdlItem.idl)
      }
    }
    if (parsedTx !== null) {
      result.push({ programId, ixNumber, name: parsedTx.name, data: parsedTx.data })
    } else {
      result.push({ programId, ixNumber, name: 'unknown', data: 'failed to parse'})
    }
  }
  return result
}

/**
 * Helper function to print better in YAML.
 */
export function replacer(key: unknown, value: unknown) {
  if (value instanceof BN) {
    try {
      return (value as BN).toNumber()
    } catch (e) {
      return value.toString()
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
    (key as string).startsWith('reserved') &&
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
  if (value instanceof Array && Array.isArray(value) && value.every(item => typeof item === "number")) {
    return Buffer.from(value as number[]).toString('base64')
  }
  return value
}

function decode64(data: string): Buffer {
  return Buffer.from(base64.toByteArray(data))
}

function decode58(data: string): Buffer {
  return Buffer.from(base58.decode(data))
}
