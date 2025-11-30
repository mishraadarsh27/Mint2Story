import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { sepolia } from 'wagmi/chains'
import type { Chain } from 'wagmi'

// WalletConnect project ID from env
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string | undefined

export const hasValidProjectId = Boolean(
  projectId && typeof projectId === 'string' && projectId.length > 0
)

// Primary chain configuration (Sepolia)
export const chains = [sepolia] as [Chain, ...Chain[]]

const metadata = {
  name: 'Mint2Story',
  description: 'Transform your stories into on-chain IP assets',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://mint2story.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// wagmi config used app-wide
export const config = defaultWagmiConfig({
  chains,
  projectId: projectId ?? 'missing_project_id',
  metadata
})

// Initialize Web3Modal at root import time
// We must initialize this even if projectId is missing to prevent useWeb3Modal hook from crashing
createWeb3Modal({
  wagmiConfig: config,
  projectId: projectId ?? 'missing_project_id',
  chains
})
