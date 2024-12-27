'use client'

import { getSoljournalProgram, getSoljournalProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useSoljournalProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getSoljournalProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getSoljournalProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['soljournal', 'all', { cluster }],
    queryFn: () => program.account.soljournal.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['soljournal', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ soljournal: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useSoljournalProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useSoljournalProgram()

  const accountQuery = useQuery({
    queryKey: ['soljournal', 'fetch', { cluster, account }],
    queryFn: () => program.account.soljournal.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['soljournal', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ soljournal: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['soljournal', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ soljournal: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['soljournal', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ soljournal: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['soljournal', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ soljournal: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
