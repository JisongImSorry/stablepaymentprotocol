import { useState } from 'react'
import StableTokenABI from './cusd-abi.json'
import MinipayNFTABI from './minipay-nft.json'
import ABI from './abi.json'
import {
  createPublicClient,
  createWalletClient,
  custom,
  getContract,
  http,
  parseEther,
  stringToHex,
  parseTransaction,
  parseAbiItem,
  decodeEventLog,
} from 'viem'
import { celoAlfajores } from 'viem/chains'
import { stableTokenABI } from '@celo/abis'

const publicClient = createPublicClient({
  chain: celoAlfajores,
  transport: http(),
})

const cUSDTokenAddress = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1' // Testnet
const MINIPAY_NFT_CONTRACT = '0xE8F4699baba6C86DA9729b1B0a1DA1Bd4136eFeF' // Testnet
const CONTRACT_ADDRESS = '0x3179D34ab87077cd61ce30b94F568fd02d59eEAC'

export const useWeb3 = () => {
  const [address, setAddress] = useState<string | null>(null)

  const getUserAddress = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      let walletClient = createWalletClient({
        transport: custom(window.ethereum),
        chain: celoAlfajores,
      })

      let [address] = await walletClient.getAddresses()
      setAddress(address)
    }
  }

  const sendCUSD = async (to: string, amount: string) => {
    let walletClient = createWalletClient({
      transport: custom(window.ethereum),
      chain: celoAlfajores,
    })

    let [address] = await walletClient.getAddresses()

    const amountInWei = parseEther(amount)

    try {
      const tx = await walletClient.writeContract({
        address: cUSDTokenAddress,
        abi: StableTokenABI.abi,
        functionName: 'transfer',
        account: address,
        args: [to, amountInWei],
      })
      let receipt = await publicClient.waitForTransactionReceipt({
        hash: tx,
      })

      return receipt
    } catch (e) {
      return null
    }
  }

  const mintMinipayNFT = async () => {
    let walletClient = createWalletClient({
      transport: custom(window.ethereum),
      chain: celoAlfajores,
    })

    // 1. Order 생성
    // 2. Order -> ToAddress, TokenAmount
    // 3. Server -> Receipt
    let [address] = await walletClient.getAddresses()

    const tx = await walletClient.writeContract({
      address: MINIPAY_NFT_CONTRACT,
      abi: MinipayNFTABI.abi,
      functionName: 'safeMint',
      account: address,
      args: [
        address,
        'https://cdn-production-opera-website.operacdn.com/staticfiles/assets/images/sections/2023/hero-top/products/minipay/minipay__desktop@2x.a17626ddb042.webp',
      ],
    })

    const receipt = await publicClient.waitForTransactionReceipt({
      hash: tx,
    })

    return receipt
  }

  const getNFTs = async () => {
    let walletClient = createWalletClient({
      transport: custom(window.ethereum),
      chain: celoAlfajores,
    })

    const minipayNFTContract = getContract({
      abi: MinipayNFTABI.abi,
      address: MINIPAY_NFT_CONTRACT,
      client: publicClient,
    })

    const [address] = await walletClient.getAddresses()
    const nfts: any = await minipayNFTContract.read.getNFTsByAddress([address])

    let tokenURIs: string[] = []

    for (let i = 0; i < nfts.length; i++) {
      const tokenURI: string = (await minipayNFTContract.read.tokenURI([
        nfts[i],
      ])) as string
      tokenURIs.push(tokenURI)
    }
    return tokenURIs
  }

  const signTransaction = async () => {
    let walletClient = createWalletClient({
      transport: custom(window.ethereum),
      chain: celoAlfajores,
    })

    let [address] = await walletClient.getAddresses()

    const res = await walletClient.signMessage({
      account: address,
      message: stringToHex('Signing in for DecentraRoad'),
    })

    return res
  }

  const checkIfGood = async (from: string, to: string, asd: any) => {
    let a = decodeEventLog(asd)

    if (from === (a.args as any).from! && to === (a.args as any).to) {
      return true
    } else return false
  }

  return {
    address,
    getUserAddress,
    sendCUSD,
    mintMinipayNFT,
    getNFTs,
    signTransaction,
    checkIfGood,
    parseTransaction,
    publicClient,
  }
}
