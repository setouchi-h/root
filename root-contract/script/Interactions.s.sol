// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {DevOpsTools} from "lib/foundry-devops/src/DevOpsTools.sol";
import {Root} from "../src/Root.sol";
import {ERC6551Account} from "../src/ERC6551Account.sol";
import {ERC6551Registry} from "../src/ERC6551Registry.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

contract MintRoot is Script {
    function mintRoot(address root) public {
        vm.startBroadcast();
        Root(root).ownerMint(msg.sender, 1);
        vm.stopBroadcast();
    }

    function run() external {
        address root = DevOpsTools.get_most_recent_deployment("Root", block.chainid);
        mintRoot(root);
    }
}

contract CreateTokenBoundAccount is Script {
    uint256 public intitalTokenId = 1;

    function createTokenBoundAccountUsingConfig(address registry, address root, uint256 tokenId) public {
        HelperConfig helperConfig = new HelperConfig();
        (,, address implementation, uint256 salt, bytes memory initData,) = helperConfig.activeNetworkConfig();
        createTokenBoundAccount(registry, implementation, root, tokenId, salt, initData);
    }

    function createTokenBoundAccount(
        address registry,
        address implementation,
        address tokenContract,
        uint256 tokenId,
        uint256 salt,
        bytes memory initData
    ) public {
        vm.startBroadcast();
        ERC6551Registry(registry).createAccount(implementation, block.chainid, tokenContract, tokenId, salt, initData);
        vm.stopBroadcast();
    }

    function run() external {
        address root = DevOpsTools.get_most_recent_deployment("Root", block.chainid);
        address registry = DevOpsTools.get_most_recent_deployment("ERC6551Registry", block.chainid);
        createTokenBoundAccountUsingConfig(registry, root, intitalTokenId);
    }
}

// TODO: transfer
contract TransferRoot is Script {
    function run() external {
        address root = DevOpsTools.get_most_recent_deployment("Root", block.chainid);
    }
}
