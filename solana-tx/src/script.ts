import {
    Connection,
  Keypair,
  Message,
  MessageV0,
  PublicKey,
  Transaction,
  TransactionInstruction,
  VersionedMessage,
  VersionedTransaction,
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


type Context = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    txData: any
    type: string
    instructions: TransactionInstruction[]
    cluster: string
  }

export async function deserializeTransaction() {
    const messageInput = document.getElementById('messageInput') as HTMLInputElement
    const message = messageInput.value
    const clusterInput = document.getElementById('cluster') as HTMLInputElement
    const cluster = clusterInput.value || 'https://api.devnet.solana.com'
    console.log('cluster: ' + cluster)

    const messageParsed = await parseAndDeserialize(message, cluster)
  
    const messageOutput = document.getElementById('messageOutput')
    if (!messageOutput) {
        console.error(`Element 'messageOutput' not found!`)
        return
    }
    messageOutput.innerHTML = messageParsed
  }

  async function parseAndDeserialize(data: string, cluster: string): Promise<string> {
    let parsedData: Context | undefined = undefined
    try {
      const decoded: Buffer = Buffer.from(data, 'base64')
      const msg = Message.from(decoded)
      const accountsMeta = parseTransactionAccounts(msg, undefined)
      const instructions = msg.instructions.map(ix =>
        compiledInstructionToInstruction(ix, accountsMeta)
      )
      parsedData = { txData: msg, type: 'normal', instructions, cluster }
    } catch (e) {
      console.log(
        'Failed deserialize normal transaction: ' + (e as Error).message
      )
    }

    try {
      const decoded: Buffer = Buffer.from(data, 'base64')
      const vMsg = VersionedMessage.deserialize(decoded)
      const accountsMeta = parseTransactionAccounts(vMsg, undefined) // TODO: probably this is not correct
      const instructions = vMsg.compiledInstructions.map(ix =>
        compiledInstructionToInstruction(ix, accountsMeta)
      )
      parsedData = { txData: vMsg, type: 'versioned', instructions, cluster }
    } catch (e) {
      console.log(
        'Failed deserialize versioned transaction: ' + (e as Error).message
      )
    }

    try {
      const decoded: InstructionData = getInstructionDataFromBase64(data)
      parsedData = {
        txData: decoded,
        type: 'spl-gov',
        instructions: [toTransactionInstruction(decoded)],
        cluster
      }
    } catch (e) {
      console.log(
        'Failed deserialize spl gov transaction: ' + (e as Error).message
      )
    }

    if (parsedData === undefined) {
      throw new Error('Failed to deserialize transaction data')
    }

    return await doLog(parsedData)
  }
  
  async function doLog(context: Context): Promise<string> {
    console.log('Transaction type: ' + context.type)
  
    const result = YAML.stringify(context.txData, replacer)
    console.log(result.trimEnd())
  
    const { legacy, version0 } = await asDumpTransactionMessage(
      context
    )

    let output = ''
    output += '<h4>solana base64 dump-transaction-message for legacy inspector:</h4>'
    output += '<p><code>' + legacy + '</code></p>'
    output += '<h4>solana base64 dump-transaction-message for version0 inspector:</h4>'
    output += '<p><code>' + version0 + '</code></p>'
    output += '<h4>solana base64 dump-transaction-message for spl-gov:</h4>'
    for (const ix of context.instructions) {
      output += '<p><code>' + serializeInstructionToBase64(ix) + '</code></p>'
    }
    return output
  }
  
  function toTransactionInstruction(
    intructionData: InstructionData
  ): TransactionInstruction {
    return new TransactionInstruction({
      keys: intructionData.accounts,
      programId: intructionData.programId,
      data: Buffer.from(intructionData.data),
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

    const connection = new Connection(context.cluster, 'confirmed')
    const blockhash = await connection.getLatestBlockhash()
    const ixes = context.instructions
    const feePayer = PublicKey.unique()
  
    // usable at https://anchor.so/tx/inspector or https://tribeca.so/tx/inspector
    const legacyTransaction = new Transaction({
      feePayer,
      blockhash: blockhash.blockhash,
      lastValidBlockHeight: blockhash.lastValidBlockHeight,
    }).add(...ixes)
    const legacy = legacyTransaction.serializeMessage().toString('base64')
  
    // usable at https://explorer.solana.com/tx/inspector
    const msg = MessageV0.compile({
      payerKey: feePayer,
      instructions: ixes,
      recentBlockhash: blockhash.blockhash,
    })
    const versionedTransaction = new VersionedTransaction(msg)
    const version0 = Buffer.from(versionedTransaction.serialize()).toString(
      'base64'
    )
    return { legacy, version0 }
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
      if (value.equals(PublicKey.default)) {
        return null // system program is used as null key
      }
      return value.toBase58()
    }
    if (
      typeof key === 'string' &&
      (key as string).startsWith('reserved') &&
      Array.isArray(value)
    ) {
      return [value.length]
    }
    return value
  }