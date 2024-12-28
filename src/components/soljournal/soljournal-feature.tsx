'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'
import { AppHero, ellipsify } from '../ui/ui-layout'
import { ExplorerLink } from '../cluster/cluster-ui'
import { useSoljournalProgram } from './soljournal-data-access'
import { SoljournalCreate, SoljournalList } from './soljournal-ui'

export default function SoljournalFeature() {
  const { publicKey } = useWallet()
  const { programId } = useSoljournalProgram()

  return publicKey ? (
    <div>
      <AppHero
        title="Soljournal"
        subtitle={
          'Create new Journal, delete them etc.'
        }
      >
        <p className="mb-6">
          Journal Program Address <ExplorerLink path={`account/${programId}`} label={ellipsify(programId.toString())} />
        </p>
        <SoljournalCreate />
      </AppHero>
      <SoljournalList />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  )
}
