import { useContext, useEffect, useState } from "react"
import { Text } from "@chakra-ui/react"
import NftBox from "./NftBox"
import { RootContext, SmartAccountContext } from "../App"

type HomeProps = {}

const Home: React.FC<HomeProps> = () => {
  const { smartAccount } = useContext(SmartAccountContext)
  const { root } = useContext(RootContext)
  const [balance, setBalance] = useState(0)
  const [tokenURI, setTokenURI] = useState("")

  const getNft = async () => {
    console.log("getNft")
    const balance = await root?.balanceOf("0x8eBD4fAa4fcEEF064dCaEa48A3f75d0D0A3ba3f2")
    const tokenUri = await root?.tokenURI(1)
    setBalance(balance)
    console.log(balance)
    setTokenURI(tokenUri)
    console.log(tokenUri)
  }

  useEffect(() => {
    if (!smartAccount) return
    getNft()
  }, [smartAccount])

  useEffect(() => {}, [])

  return balance > 0 ? <NftBox tokenURI={tokenURI} /> : <Text>You do NOT have NFT</Text>
}
export default Home
