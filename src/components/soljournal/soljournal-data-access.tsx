"use client";

import { getSoljournalProgram, getSoljournalProgramId } from "@project/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { Cluster, PublicKey } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { useCluster } from "../cluster/cluster-data-access";
import { useAnchorProvider } from "../solana/solana-provider";
import { useTransactionToast } from "../ui/ui-layout";

interface CreateEntryType {
  owner: PublicKey;
  title: string;
  message: string;
}

export function useSoljournalProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getSoljournalProgramId(cluster.network as Cluster),
    [cluster],
  );
  const program = useMemo(
    () => getSoljournalProgram(provider, programId),
    [provider, programId],
  );

  const accounts = useQuery({
    queryKey: ["soljournal", "all", { cluster }],
    queryFn: () => program.account.journalEntryState.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ["get-program-account", { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const createEntry = useMutation<string, Error, CreateEntryType>({
    mutationKey: ["soljournal", "create", { cluster }],
    mutationFn: async ({ title, message, owner }) => {
      const [journalEntryAddress] = await PublicKey.findProgramAddress(
        [Buffer.from(title), owner.toBuffer()],
        programId,
      );

      return program.methods
        .createEntry(title, message)
        .accounts({ journalEntry: journalEntryAddress })
        .rpc();
    },
    onError: () => toast.error("Failed to initialize account"),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    createEntry,
  };
}

export function useSoljournalProgramAccount({
  account
}: {
  account: PublicKey;
}) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { programId, program, accounts } = useSoljournalProgram();

  const accountQuery = useQuery({
    queryKey: ["soljournal", "fetch", { cluster, account }],
    queryFn: () => program.account.journalEntryState.fetch(account),
  });

  const updateEntry = useMutation<string, Error, CreateEntryType>({
    mutationKey: ["soljournal", "update", { cluster }],
    mutationFn: async ({ title, message, owner }) => {
      const [journalEntryAddress] = await PublicKey.findProgramAddress(
        [Buffer.from(title), owner.toBuffer()],
        programId,
      );

      return program.methods
        .updateEntry(title, message)
        .accounts({ journalEntry: journalEntryAddress })
        .rpc();
    },
    onError: () => toast.error("Failed to update account"),
  });
  
  const deleteEntry = useMutation({
    mutationKey: ["soljournal", "delete", { cluster, account }],
    mutationFn: async (title: string) => 
      program.methods.deleteEntry(title).accounts({journalEntry: account}).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
    onError: () => toast.error("Failed to update account"),
  });

  

  return {
    accountQuery,
    updateEntry,
    deleteEntry
  };
}
