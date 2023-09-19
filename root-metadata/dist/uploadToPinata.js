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
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeTokenUriMetadata = exports.storeImages = void 0;
const pinataSDK = require("@pinata/sdk");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const pinataApiKey = process.env.PINATA_API_KEY || "";
const pinataSecretKey = process.env.PINATA_SECRET_KEY || "";
const pinata = pinataSDK(pinataApiKey, pinataSecretKey);
function storeImages(imagesFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const fullImagesPath = path.resolve(imagesFilePath);
        const files = fs.readdirSync(fullImagesPath);
        let responses = [];
        for (const fileIndex in files) {
            const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${files[fileIndex]}`);
            try {
                const response = yield pinata.pinFileToIPFS(readableStreamForFile);
                responses.push(response);
            }
            catch (error) {
                console.log(error);
            }
        }
        return { responses, files };
    });
}
exports.storeImages = storeImages;
function storeTokenUriMetadata(metadata) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield pinata.pinJSONToIPFS(metadata);
            return response;
        }
        catch (error) {
            console.log(error);
        }
        return null;
    });
}
exports.storeTokenUriMetadata = storeTokenUriMetadata;
