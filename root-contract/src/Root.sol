// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

contract Root is ERC721 {
    error Root__NonExistentToken();

    uint256 private s_tokenCounter;
    string private s_imageUri;

    constructor(string memory imageUri) ERC721("Root", "ROOT") {
        s_tokenCounter = 0;
        s_imageUri = imageUri;
    }

    function mintNft() public {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter++;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (!_exists(tokenId)) {
            revert Root__NonExistentToken();
        }

        return string(
            abi.encodePacked(
                _baseURI(),
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            '{"name": "',
                            name(),
                            unicode'", "description": "このNFTの所有権は、日々喜びを持ち、笑顔を絶やさない個人にのみ付与されます。本契約の下で、『日々喜びを持ち、笑顔を絶やさない個人』とは、精神的または感情的な状態が不安定でないことを含みます。この条件に違反した場合、本NFTの所有権は無効とされ、没収されます。", "attributes": [{"trait_type": "happiness", "value": 100}], "image": "',
                            s_imageUri,
                            '"}'
                        )
                    )
                )
            )
        );
    }
}
