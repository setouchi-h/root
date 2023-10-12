import { useContext, useEffect, useState } from "react"
import { Flex, Heading, Spinner, Text, Wrap, WrapItem } from "@chakra-ui/react"
import NftBox from "./NftBox"
import { RootContext, SmartAccountContext } from "../App"
import MiniNftBox from "./MiniNftBox"
import { Link } from "react-router-dom"

const Home: React.FC = () => {
  const { smartAccount } = useContext(SmartAccountContext)
  const { root } = useContext(RootContext)
  const [tokenId, setTokenId] = useState(0)
  const [tokenURI, setTokenURI] = useState("")
  const [tba, setTba] = useState<string>("")
  const [mitamas, setMitamas] = useState<number[]>([])
  const [isGetRootLoading, setIsGetRootLoading] = useState<boolean>(false)
  const [isGetMitamaLoading, setIsGetMitamaLoading] = useState<boolean>(false)

  const getRoot = async () => {
    setIsGetRootLoading(true)
    const tokenId = await root?.getTokenIdFromAddress(await smartAccount?.getSmartAccountAddress())
    setTokenId(tokenId.toNumber())
    if (tokenId.toNumber() === 0) {
      setIsGetRootLoading(false)
      return
    }
    const tokenUri = await root?.tokenURI(tokenId)
    setTokenURI(tokenUri)
    setIsGetRootLoading(false)
  }

  const getMitama = async () => {
    setIsGetMitamaLoading(true)
    const tba = await root?.getTbaFromTokenId(tokenId)
    if (tba === "0x0000000000000000000000000000000000000000") {
      setIsGetMitamaLoading(false)
      return
    }
    console.log(tba)
    setTba(tba)
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
    setIsGetMitamaLoading(false)
  }

  useEffect(() => {
    if (!smartAccount) return
    getRoot()
    if (!tokenId) return
    getMitama()
  }, [smartAccount, tokenId])

  return !isGetRootLoading ? (
    tokenId !== 0 ? (
      <>
        <NftBox tokenURI={tokenURI} tokenId={tokenId} />
        <Heading mt="5" ml="5" size="xl">
          分け御霊
        </Heading>
        {!isGetMitamaLoading ? (
          <Flex align="center" mt="2">
            {mitamas.length > 0 ? (
              <Wrap ml="5" mb="5">
                {mitamas.map((tokenId) => (
                  <WrapItem key={tokenId}>
                    <Link
                      to={"/transfer"}
                      state={{ tokenId: tokenId, tokenURI: tokenURI, tbaAddr: tba }}
                    >
                      <MiniNftBox tokenURI={tokenURI} tokenId={tokenId} />
                    </Link>
                  </WrapItem>
                ))}
              </Wrap>
            ) : (
              <Flex width="100vw" justify="center" mt="2" mb="10">
                <Text>You do NOT have 分け御霊</Text>
              </Flex>
            )}
          </Flex>
        ) : (
          <Flex justify="center" align="center" mt="2">
            <Spinner />
          </Flex>
        )}
      </>
    ) : (
      <Flex direction="column" justify="center" align="center" height="100vh" width="100vw">
        <Text>You do NOT have root NFT</Text>
        <Text>root保有者から御霊を分けてもらってください。</Text>
      </Flex>
    )
  ) : (
    <Flex justify="center" align="center" height="100vh" width="100vw">
      <Spinner size="xl" />
    </Flex>
  )
}
export default Home
