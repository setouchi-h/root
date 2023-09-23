// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721A} from "erc721a/contracts/ERC721A.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC6551Registry} from "../src/ERC6551Registry.sol";

contract Root is ERC721A, Ownable {
    error Root__NonExistentToken();
    error Root__NotTransferable();

    uint256 private constant MINT_AMOUNT = 3;
    uint256 private constant SALT = 0;
    address private immutable i_erc6551Registry;
    address private immutable i_erc6551Account;
    string private s_tokenUri;
    mapping(uint256 => bool) private s_isNoTransferable;

    constructor(string memory tokenUri, address erc6551registry, address erc6551Account) ERC721A("Root", "ROOT") {
        s_tokenUri = tokenUri;
        i_erc6551Registry = erc6551registry;
        i_erc6551Account = erc6551Account;
        _mintERC2309(msg.sender, 1);
    }

    function ownerMint(address to, uint256 amount) external onlyOwner {
        _safeMint(to, amount);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (!_exists(tokenId)) {
            revert Root__NonExistentToken();
        }

        return s_tokenUri;
    }

    function _startTokenId() internal view virtual override returns (uint256) {
        return 1;
    }

    // Non transferable

    // all transfer functions
    function transferFrom(address from, address to, uint256 tokenId) public payable override {
        if (s_isNoTransferable[tokenId]) {
            revert Root__NotTransferable();
        }
        s_isNoTransferable[tokenId] = true;
        super.transferFrom(from, to, tokenId);
        address tba = ERC6551Registry(i_erc6551Registry).createAccount(
            i_erc6551Account, block.chainid, address(this), tokenId, SALT, ""
        );
        _safeMint(tba, MINT_AMOUNT);
    }

    // approve functions
    function approve(address to, uint256 tokenId) public payable override {
        if (s_isNoTransferable[tokenId]) {
            revert Root__NotTransferable();
        }
        super.approve(to, tokenId);
    }

    function setApprovalForAll(address, /* operator */ bool /* approved */ ) public pure override {
        revert Root__NotTransferable();
    }
}
