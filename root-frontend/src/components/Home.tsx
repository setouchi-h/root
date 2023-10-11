import { useContext, useEffect, useState } from "react"
import { Flex, Heading, Spinner, Text, Wrap, WrapItem } from "@chakra-ui/react"
import NftBox from "./NftBox"
import { RootContext, SmartAccountContext } from "../App"
import MiniNftBox from "./MiniNftBox"
import { Link } from "react-router-dom"
import ERC6551AccountProxyAbi from "../../constants/ERC6551AccountProxy.json"
import { ethers } from "ethers"

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
    const tokenUri = await root?.tokenURI(tokenId)
    setTokenURI(tokenUri)
    setIsGetRootLoading(false)
  }

  const getMitama = async () => {
    setIsGetMitamaLoading(true)
    const tba = await root?.getTbaFromTokenId(tokenId)
    if (tba === "0x0000000000000000000000000000000000000000") return
    console.log(tba)
    setTba(tba)
    // const headers = new Headers()
    // headers.append("Content-Type", "application/json")
    // if (import.meta.env.VITE_BICONOMY_DASHBOARD_AUTH_KEY) {
    //   headers.append("authToken", import.meta.env.VITE_BICONOMY_DASHBOARD_AUTH_KEY)
    // }
    // if (import.meta.env.VITE_BICONOMY_API_KEY) {
    //   headers.append("apiKey", import.meta.env.VITE_BICONOMY_API_KEY)
    // }
    // fetch("https://paymaster-dashboard-backend.prod.biconomy.io/api/v2/public/sdk/smart-contract", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     name: "TBA",
    //     address: tba,
    //     abi: JSON.stringify(ERC6551AccountProxyAbi),
    //     whitelistedMethods: ["fallback"],
    //   }),
    //   headers: headers,
    // })
    //   .then(async (response) => {
    //     const data = await response.json()
    //     if (data.statusCode === 400) {
    //       return
    //     }
    //     return data
    //   })
    //   .then((json) => console.log(json))
    //   .catch((err) => {
    //     console.log(err)
    //   })
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
        <Heading mt="5" ml="5" size="xl">
          根（ROOT）
        </Heading>
        <NftBox tokenURI={tokenURI} tokenId={tokenId} />
        <Heading mt="5" ml="5" size="xl">
          分け御霊
        </Heading>
        {!isGetMitamaLoading ? (
          <Flex align="center" justify="center" mt="2">
            {mitamas.length > 0 ? (
              <Wrap ml="5">
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
              <Flex justify="center" align="center" mt="2">
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
      <Flex justify="center" align="center" height="100vh" width="100vw">
        <Text>You do NOT have Root NFT</Text>
      </Flex>
    )
  ) : (
    <Flex justify="center" align="center" height="100vh" width="100vw">
      <Spinner size="xl" />
    </Flex>
  )
}
export default Home
