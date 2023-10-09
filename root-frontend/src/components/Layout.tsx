import React from "react"
import { useState, useEffect, useRef } from "react"
import { ChakraProvider, Flex, Text } from "@chakra-ui/react"
import "@Biconomy/web3-auth/dist/src/style.css"
import SocialLogin from "@biconomy/web3-auth"
import { ChainId } from "@biconomy/core-types"
import { ethers } from "ethers"
import {
  BiconomySmartAccount,
  BiconomySmartAccountConfig,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account"
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster"
import Header from "../components/Header"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import theme from "../theme"
import networkConfig from "../../constants/networkMapping.json"
import rootAbi from "../../constants/Root.json"
import { contractAddressesInterface } from "../types/networkAddress"

type LayoutProps = {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const paymaster: IPaymaster = new BiconomyPaymaster({
    paymasterUrl: import.meta.env.VITE_PAYMASTER_URL,
  })

  const [smartAccount, setSmartAccount] = useState<any>(null)
  const [interval, enableInterval] = useState(false)
  const sdkRef = useRef<SocialLogin | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [provider, setProvider] = useState<any>(null)

  useEffect(() => {
    let configureLogin: any
    if (interval) {
      configureLogin = setInterval(() => {
        if (!!sdkRef.current?.provider) {
          setupSmartAccount()
          clearInterval(configureLogin)
        }
      }, 1000)
    }
  }, [interval])

  async function login() {
    if (!sdkRef.current) {
      const socialLoginSDK = new SocialLogin()
      const signature1 = await socialLoginSDK.whitelistUrl("http://127.0.0.1:5173/")
      const signature2 = await socialLoginSDK.whitelistUrl("http://localhost:5173/")
      await socialLoginSDK.init({
        chainId: ethers.utils.hexValue(ChainId.POLYGON_MUMBAI).toString(),
        network: "testnet",
        whitelistUrls: {
          "http://127.0.0.1:5173/": signature1,
          "http://localhost:5173/": signature2,
        },
      })
      sdkRef.current = socialLoginSDK
    }
    if (!sdkRef.current.provider) {
      sdkRef.current.showWallet()
      enableInterval(true)
    } else {
      setupSmartAccount()
    }
  }

  async function setupSmartAccount() {
    if (!sdkRef?.current?.provider) return
    sdkRef.current.hideWallet()
    setLoading(true)
    const web3Provider = new ethers.providers.Web3Provider(sdkRef.current.provider)
    setProvider(web3Provider)

    try {
      const biconomySmartAccountConfig: BiconomySmartAccountConfig = {
        signer: web3Provider.getSigner(),
        chainId: ChainId.POLYGON_MUMBAI,
        paymaster: paymaster,
      }
      let biconomySmartAccount = new BiconomySmartAccount(biconomySmartAccountConfig)
      biconomySmartAccount = await biconomySmartAccount.init()
      console.log("owner: ", biconomySmartAccount.owner)
      console.log("address: ", await biconomySmartAccount.getSmartAccountAddress())
      console.log(
        "deployed: ",
        await biconomySmartAccount.isAccountDeployed(
          await biconomySmartAccount.getSmartAccountAddress()
        )
      )

      setSmartAccount(biconomySmartAccount)
      setLoading(false)
    } catch (err) {
      console.log("error setting up smart account... ", err)
    }
  }

  const logout = async () => {
    if (!sdkRef.current) {
      console.error("Web3Modal not initialized.")
      return
    }
    await sdkRef.current.logout()
    sdkRef.current.hideWallet()
    setSmartAccount(null)
    enableInterval(false)
  }

  /** コントラクトの作成 */
  const addresses: contractAddressesInterface = networkConfig
  const chainId = ChainId.POLYGON_MUMBAI.toString()
  const rootAddr = addresses[chainId].Root[0]
  const root = new ethers.Contract(rootAddr, rootAbi, provider)

  return (
    <>
      <Header login={login} logout={logout} smartAccount={smartAccount} isLoading={loading} />
      {smartAccount ? (
        <main>{children}</main>
      ) : (
        <Flex justify="center" align="center" height="100vh" width="100vw">
          <Text>Your wallet is not connected!</Text>
        </Flex>
      )}
    </>
  )
}
export default Layout
