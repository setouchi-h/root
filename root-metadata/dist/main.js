"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { storeImages, storeTokenUriMetadata } = require("./uploadToPinata");
const fs = require("fs");
let pre_json = require("../data/pre_json");
const imageLocation = "./data/img/";
let tokenUris = [];
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        tokenUris = [];
        const { responses: imageUploadResponses, files } = yield storeImages(imageLocation);
        for (const imageUploadResponseIndex in imageUploadResponses) {
            pre_json.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`;
            console.log(`Uploading ${pre_json.name} to IPFS...`);
            const metadataUploadResponse = yield storeTokenUriMetadata(pre_json);
            tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`);
        }
        console.log("Token URIs uploaded! They are:");
        console.log(tokenUris);
        return tokenUris;
    });
}
main();
