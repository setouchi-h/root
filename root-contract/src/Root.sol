// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Root is ERC721 {
    error Root__NonExistentToken();
    error Root__NotTransferable();

    uint256 private s_tokenCounter;
    string private s_tokenUri;
    mapping(uint256 => bool) private s_isNoTransferable;

    constructor(string memory tokenUri) ERC721("Root", "ROOT") {
        s_tokenCounter = 0;
        s_tokenUri = tokenUri;
    }

    function mintNft() public {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter++;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (!_exists(tokenId)) {
            revert Root__NonExistentToken();
        }

        return s_tokenUri;
    }

    // Non transferable

    // all transfer functions
    function _transfer(address from, address to, uint256 tokenId) internal override {
        if (s_isNoTransferable[tokenId]) {
            revert Root__NotTransferable();
        }
        super._transfer(from, to, tokenId);
        s_isNoTransferable[tokenId] = true;
    }

    // approve functions
    function approve(address to, uint256 tokenId) public override {
        if (s_isNoTransferable[tokenId]) {
            revert Root__NotTransferable();
        }
        super.approve(to, tokenId);
    }

    function setApprovalForAll(address, /* operator */ bool /* approved */ ) public pure override {
        revert Root__NotTransferable();
    }
}
