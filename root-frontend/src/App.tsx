// import "./App.css"
import { ChakraProvider } from "@chakra-ui/react"
import "@biconomy/web3-auth/dist/src/style.css"
import Layout from "./components/Layout"
import { createContext, useState } from "react"
import { BiconomySmartAccount } from "@biconomy/account"
import { ethers } from "ethers"
import { BrowserRouter } from "react-router-dom"

export const SmartAccountContext = createContext<{
  smartAccount: BiconomySmartAccount | null
  setSmartAccount: React.Dispatch<React.SetStateAction<BiconomySmartAccount | null>>
}>({ smartAccount: null, setSmartAccount: () => {} })

export const ProviderContext = createContext<{
  provider: ethers.providers.Web3Provider | null
  setProvider: React.Dispatch<React.SetStateAction<ethers.providers.Web3Provider | null>>
}>({ provider: null, setProvider: () => {} })

export const RootContext = createContext<{
  root: ethers.Contract | null
  setRoot: React.Dispatch<React.SetStateAction<ethers.Contract | null>>
}>({ root: null, setRoot: () => {} })

function App() {
  const [smartAccount, setSmartAccount] = useState<BiconomySmartAccount | null>(null)
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [root, setRoot] = useState<ethers.Contract | null>(null)

  return (
    <ChakraProvider>
      <BrowserRouter>
        <SmartAccountContext.Provider value={{ smartAccount, setSmartAccount }}>
          <ProviderContext.Provider value={{ provider, setProvider }}>
            <RootContext.Provider value={{ root, setRoot }}>
              <Layout />
            </RootContext.Provider>
          </ProviderContext.Provider>
        </SmartAccountContext.Provider>
      </BrowserRouter>
    </ChakraProvider>
  )
}

export default App
