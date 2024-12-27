// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import SoljournalIDL from '../target/idl/soljournal.json'
import type { Soljournal } from '../target/types/soljournal'

// Re-export the generated IDL and type
export { Soljournal, SoljournalIDL }

// The programId is imported from the program IDL.
export const SOLJOURNAL_PROGRAM_ID = new PublicKey(SoljournalIDL.address)

// This is a helper function to get the Soljournal Anchor program.
export function getSoljournalProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...SoljournalIDL, address: address ? address.toBase58() : SoljournalIDL.address } as Soljournal, provider)
}

// This is a helper function to get the program ID for the Soljournal program depending on the cluster.
export function getSoljournalProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Soljournal program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return SOLJOURNAL_PROGRAM_ID
  }
}
