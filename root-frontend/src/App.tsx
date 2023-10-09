// import "./App.css"
import "@fontsource/noto-serif-jp"
import "@fontsource-variable/noto-sans-jp"
import { ChakraProvider } from "@chakra-ui/react"
import "@Biconomy/web3-auth/dist/src/style.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import theme from "./theme"
import Home from "./components/Home"
import User from "./components/User"
import Layout from "./components/Layout"

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" Component={Home} />
            <Route path="/user" element={<User />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ChakraProvider>
  )
}

export default App
