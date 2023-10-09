// import "./App.css"
import "@fontsource/noto-serif-jp"
import "@fontsource-variable/noto-sans-jp"
import { ChakraProvider } from "@chakra-ui/react"
import "@Biconomy/web3-auth/dist/src/style.css"
import theme from "./theme"
import Layout from "./components/Layout"
import { createContext, useState } from "react"
import { BiconomySmartAccount } from "@biconomy/account"
import { ethers } from "ethers"
import { BrowserRouter } from "react-router-dom"

export const SmartAccountContext = createContext<{
  smartAccount: BiconomySmartAccount | null
  setSmartAccount: React.Dispatch<React.SetStateAction<BiconomySmartAccount | null>>
}>({ smartAccount: null, setSmartAccount: () => {} })

export const RootContext = createContext<{
  root: ethers.Contract | null
  setRoot: React.Dispatch<React.SetStateAction<ethers.Contract | null>>
}>({ root: null, setRoot: () => {} })

function App() {
  const [smartAccount, setSmartAccount] = useState<BiconomySmartAccount | null>(null)
  const [root, setRoot] = useState<ethers.Contract | null>(null)

  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <SmartAccountContext.Provider value={{ smartAccount, setSmartAccount }}>
          <RootContext.Provider value={{ root, setRoot }}>
            <Layout />
          </RootContext.Provider>
        </SmartAccountContext.Provider>
      </BrowserRouter>
    </ChakraProvider>
  )
}

export default App
