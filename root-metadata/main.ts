const { storeImages, storeTokenUriMetadata } = require("./uploadToPinata")
const fs = require("fs")
let pre_json: Metadata = require("../data/pre_json")

type Metadata = {
  name: string
  image: string
  description: string
  attributes: {
    trait_type: string
    value: string
  }[]
}

const imageLocation = "./data/img/"
let tokenUris: string[] = ["ipfs://QmdiKMjiabg7YPE5zcgqxDWuCJoP1y7MJSoBhGWsS7AFcu"]

async function main() {
  tokenUris = []
  const { responses: imageUploadResponses, files } = await storeImages(imageLocation)
  for (const imageUploadResponseIndex in imageUploadResponses) {
    pre_json.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`
    console.log(`Uploading ${pre_json.name} to IPFS...`)
    const metadataUploadResponse = await storeTokenUriMetadata(pre_json)
    tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
  }
  console.log("Token URIs uploaded! They are:")
  console.log(tokenUris)
  return tokenUris
}

main()
