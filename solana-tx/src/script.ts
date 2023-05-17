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
import * as base64 from "base64-js";


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
        return doLogError("Internal error: 'messageOutput' element not found")
    }
    messageOutput.innerHTML = messageParsed
  }

  async function parseAndDeserialize(data: string, cluster: string): Promise<string> {
    let parsedData: Context | undefined = undefined
    try {
      const decoded: Buffer = decode(data)
      const msg = Message.from(decoded)
      const accountsMeta = parseTransactionAccounts(msg, undefined)
      const instructions = msg.instructions.map(ix =>
        compiledInstructionToInstruction(ix, accountsMeta)
      )
      parsedData = { txData: msg, type: 'legacy', instructions, cluster }
    } catch (e) {
      console.log(
        'Failed deserialize legacy transaction: ' + (e as Error).message
      )
    }

    if (!parsedData || !parsedData.instructions.length) {
      try {
        const decoded: Buffer = decode(data)
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
    }

    if (!parsedData || !parsedData.instructions.length) {
      try {
        const decoded: InstructionData = getInstructionDataFromBase64(data)
        parsedData = {
          txData: decoded,
          type: 'splgov',
          instructions: [toTransactionInstruction(decoded)],
          cluster
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
      '<a href="https://anchor.so/tx/inspector?message=' + encodeURIComponent(legacy) + '">anchor.so/tx/inspector</a>' +
      '</h4>'
    output += '<p><code>' + legacy + '</code></p>'
    output += '<h4>solana base64 dump-transaction-message for version0 inspector: ' +
      '<a href="https://explorer.solana.com/tx/inspector?message=' + encodeURIComponent(version0) + '">explorer.solana.com/tx/inspector</a>' +
      '</h4>'
    output += '<p><code>' + version0 + '</code></p>'
    output += '<h4>solana base64 dump-transaction-message for spl-gov:</h4>'
    for (const ix of context.instructions) {
      output += '<p><code>' + serializeInstructionToBase64(ix) + '</code></p>'
    }
    output += '<h4>YAML output:</h4>'
    output += '<p><pre><code>' + YAML.stringify(context.txData, replacer).trimEnd() + '</code></pre></p>'

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
    if (value instanceof Buffer) {

      return value.toString('base64')
    }
    if (value instanceof Array && Array.isArray(value) && value.every(item => typeof item === "number")) {
      return Buffer.from(value as number[]).toString('base64')
    }
    return value
  }

  function decode(data: string): Buffer {
    return Buffer.from(base64.toByteArray(data));
  }
