import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Soljournal} from '../target/types/soljournal'

describe('soljournal', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Soljournal as Program<Soljournal>

  const soljournalKeypair = Keypair.generate()

  it('Initialize Soljournal', async () => {
    await program.methods
      .initialize()
      .accounts({
        soljournal: soljournalKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([soljournalKeypair])
      .rpc()

    const currentCount = await program.account.soljournal.fetch(soljournalKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Soljournal', async () => {
    await program.methods.increment().accounts({ soljournal: soljournalKeypair.publicKey }).rpc()

    const currentCount = await program.account.soljournal.fetch(soljournalKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Soljournal Again', async () => {
    await program.methods.increment().accounts({ soljournal: soljournalKeypair.publicKey }).rpc()

    const currentCount = await program.account.soljournal.fetch(soljournalKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Soljournal', async () => {
    await program.methods.decrement().accounts({ soljournal: soljournalKeypair.publicKey }).rpc()

    const currentCount = await program.account.soljournal.fetch(soljournalKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set soljournal value', async () => {
    await program.methods.set(42).accounts({ soljournal: soljournalKeypair.publicKey }).rpc()

    const currentCount = await program.account.soljournal.fetch(soljournalKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the soljournal account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        soljournal: soljournalKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.soljournal.fetchNullable(soljournalKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
