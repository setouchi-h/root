import { Card, CardBody, Flex, Heading, Image } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"

type MiniNftBoxProps = {
  tokenURI: string
  tokenId: number
}

const MiniNftBox: React.FC<MiniNftBoxProps> = ({ tokenURI, tokenId }) => {
  const [imageURI, setImageURI] = useState<string>("")
  const [tokenName, setTokenName] = useState<string>("")

  const updateURI = async (tokenURI: string) => {
    // using the image tag from the tokenURI, get the image
    if (tokenURI) {
      // IPFS Gateway: A server that will return IPFS files from a "normal" URL
      const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
      const tokenURIResponse = await (await fetch(requestURL)).json()
      const imageURI = tokenURIResponse.image
      const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
      setImageURI(imageURIURL)
      setTokenName(tokenURIResponse.name)
    }
  }

  useEffect(() => {
    updateURI(tokenURI)
  }, [tokenURI])

  return (
    <Card width="150px" justify="center" align="center">
      <CardBody>
        <Image src={imageURI} />
        <Flex justify="center" align="center">
          <Heading size="md" mt="2">
            {tokenName} #{tokenId}
          </Heading>
        </Flex>
      </CardBody>
    </Card>
  )
}
export default MiniNftBox
