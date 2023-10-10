import { useContext, useEffect, useState } from "react"
import { Flex, Heading, Text, Wrap, WrapItem } from "@chakra-ui/react"
import NftBox from "./NftBox"
import { RootContext, SmartAccountContext } from "../App"
import MiniNftBox from "./MiniNftBox"
import { Link } from "react-router-dom"

const Home: React.FC = () => {
  const { smartAccount } = useContext(SmartAccountContext)
  const { root } = useContext(RootContext)
  const [tokenId, setTokenId] = useState(0)
  const [tokenURI, setTokenURI] = useState("")
  const [mitamas, setMitamas] = useState<number[]>([])

  const getRoot = async () => {
    const tokenId = await root?.getTokenIdFromAddress(await smartAccount?.getSmartAccountAddress())
    setTokenId(tokenId.toNumber())
    const tokenUri = await root?.tokenURI(tokenId)
    setTokenURI(tokenUri)
  }

  const getMitama = async () => {
    const tba = await root?.getTbaFromTokenId(tokenId)
    const startId = (await root?.getTokenIdFromAddress(tba))?.toNumber()
    const tempData: number[] = []
    let currentId = startId

    for (let i = 0; i < 3; i++) {
      const owner = await root?.ownerOf(currentId)

      if (owner === tba) {
        tempData.push(currentId)
      }

      currentId++
    }

    setMitamas(tempData)
  }

  useEffect(() => {
    if (!smartAccount) return
    getRoot()
    getMitama()
  }, [smartAccount])

  useEffect(() => {
    if (!tokenId) return
    getMitama()
  }, [tokenId])

  return tokenId !== 0 ? (
    <>
      <Heading mt="5" ml="5" size="xl">
        根（ROOT）
      </Heading>
      <NftBox tokenURI={tokenURI} tokenId={tokenId} />
      <Heading mt="5" ml="5" size="xl">
        分け御霊
      </Heading>
      <Flex align="center" justify="center" mt="2">
        <Wrap ml="5">
          {mitamas.map((tokenId) => (
            <WrapItem>
              <Link to={"/transfer"} state={{ tokenId: tokenId }}>
                <MiniNftBox key={tokenId} tokenURI={tokenURI} tokenId={tokenId} />
              </Link>
            </WrapItem>
          ))}
        </Wrap>
      </Flex>
    </>
  ) : (
    <Flex justify="center" align="center" height="100vh" width="100vw">
      <Text>You do NOT have NFT</Text>
    </Flex>
  )
}
export default Home
