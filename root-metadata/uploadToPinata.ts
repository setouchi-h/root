const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")
require("dotenv").config()

const pinataApiKey = process.env.PINATA_API_KEY || ""
const pinataSecretKey = process.env.PINATA_SECRET_KEY || ""
const pinata = pinataSDK(pinataApiKey, pinataSecretKey)

export async function storeImages(imagesFilePath: string) {
  const fullImagesPath = path.resolve(imagesFilePath)
  const files = fs.readdirSync(fullImagesPath)
  let responses: any[] = []
  for (const fileIndex in files) {
    const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${files[fileIndex]}`)
    try {
      const response = await pinata.pinFileToIPFS(readableStreamForFile)
      responses.push(response)
    } catch (error) {
      console.log(error)
    }
  }
  return { responses, files }
}

export async function storeTokenUriMetadata(metadata: Object) {
  try {
    const response = await pinata.pinJSONToIPFS(metadata)
    return response
  } catch (error) {
    console.log(error)
  }
  return null
}
