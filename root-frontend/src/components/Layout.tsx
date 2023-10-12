import React, { createContext, useContext } from "react"
import { useState, useEffect, useRef } from "react"
import { Flex, Spinner, Text } from "@chakra-ui/react"
import SocialLogin from "@biconomy/web3-auth"
import { ChainId } from "@biconomy/core-types"
import { ethers } from "ethers"
import {
  BiconomySmartAccount,
  BiconomySmartAccountConfig,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account"
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster"
import Header from "./Header"
import { Route, Routes } from "react-router-dom"
import networkConfig from "../constants/networkMapping.json"
import rootAbi from "../constants/Root.json"
import { contractAddressesInterface } from "../types/networkAddress"
import Home from "./Home"
import User from "./User"
import { ProviderContext, RootContext, SmartAccountContext } from "../App"
import Transfer from "./Transfer"
import { Bundler, IBundler } from "@biconomy/bundler"

export const LogoutContext = createContext<{
  logout: () => void
}>({ logout: () => {} })

const paymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl: import.meta.env.VITE_PAYMASTER_URL,
})

const bundler: IBundler = new Bundler({
  bundlerUrl:
    "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
  chainId: ChainId.POLYGON_MUMBAI,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
})

const Layout: React.FC = () => {
  const { smartAccount, setSmartAccount } = useContext(SmartAccountContext)
  const { provider, setProvider } = useContext(ProviderContext)
  const { setRoot } = useContext(RootContext)
  const [interval, enableInterval] = useState(false)
  const sdkRef = useRef<SocialLogin | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

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
    setLoading(true)
    if (!sdkRef.current) {
      const socialLoginSDK = new SocialLogin()
      const signature1 = await socialLoginSDK.whitelistUrl("http://127.0.0.1:5173/")
      const signature2 = await socialLoginSDK.whitelistUrl("http://localhost:5173/")
      const signature3 = await socialLoginSDK.whitelistUrl("https://root-nezu.vercel.app/")
      await socialLoginSDK.init({
        chainId: ethers.utils.hexValue(ChainId.POLYGON_MUMBAI).toString(),
        network: "testnet",
        whitelistUrls: {
          "http://127.0.0.1:5173/": signature1,
          "http://localhost:5173/": signature2,
          "https://root-nezu.vercel.app/": signature3,
        },
      })
      sdkRef.current = socialLoginSDK
    }
    if (!sdkRef.current.provider) {
      sdkRef.current.showWallet()
      enableInterval(true)
      setLoading(false)
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
        bundler: bundler,
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

  useEffect(() => {
    /** コントラクトの作成 */
    if (!provider) return
    const addresses: contractAddressesInterface = networkConfig
    const chainId = ChainId.POLYGON_MUMBAI.toString()
    const rootAddr = addresses[chainId].Root[0]
    const root = new ethers.Contract(rootAddr, rootAbi, provider)
    setRoot(root)
  }, [provider])

  return (
    <>
      <LogoutContext.Provider value={{ logout: logout }}>
        <Header login={login} smartAccount={smartAccount} isLoading={loading} />
        {!loading ? (
          <Flex mt="50" align="center" justify="center">
            {smartAccount ? (
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/user" element={<User />} />
                  <Route path="/transfer" element={<Transfer />} />
                </Routes>
              </main>
            ) : (
              <Flex justify="center" align="center" height="100vh" width="100vw">
                <Text>Please Login</Text>
              </Flex>
            )}
          </Flex>
        ) : (
          <Flex justify="center" align="center" height="100vh" width="100vw">
            <Spinner size="xl" />
          </Flex>
        )}
      </LogoutContext.Provider>
    </>
  )
}
export default Layout
