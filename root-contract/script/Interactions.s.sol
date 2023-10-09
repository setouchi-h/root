// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {DevOpsTools} from "lib/foundry-devops/src/DevOpsTools.sol";
import {Root} from "../src/Root.sol";
import {ERC6551Account} from "../src/ERC6551Account.sol";
import {ERC6551Registry} from "../src/ERC6551Registry.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

contract MintRoot is Script {
    function mintRootUsingConfig(address root) public {
        HelperConfig helperConfig = new HelperConfig();
        (,,,,, uint256 deployerKey) = helperConfig.activeNetworkConfig();
        mintRoot(root, deployerKey);
    }

    function mintRoot(address root, uint256 deployerKey) public {
        vm.startBroadcast(deployerKey);
        Root(root).ownerMint(msg.sender, 1);
        vm.stopBroadcast();
    }

    function run() external {
        address root = DevOpsTools.get_most_recent_deployment("Root", block.chainid);
        mintRootUsingConfig(root);
    }
}

contract CreateTokenBoundAccount is Script {
    uint256 public intitalTokenId = 1;

    function createTokenBoundAccountUsingConfig(address registry, address root, uint256 tokenId) public {
        HelperConfig helperConfig = new HelperConfig();
        (,, address implementation, uint256 salt, bytes memory initData, uint256 deployerKey) =
            helperConfig.activeNetworkConfig();
        createTokenBoundAccount(registry, implementation, root, tokenId, salt, initData, deployerKey);
    }

    function createTokenBoundAccount(
        address registry,
        address implementation,
        address tokenContract,
        uint256 tokenId,
        uint256 salt,
        bytes memory initData,
        uint256 deployerKey
    ) public {
        vm.startBroadcast(deployerKey);
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
    address public RECEIVER = makeAddr("receiver");

    function transferRoot(address root) public {
        vm.startBroadcast();
        Root(root).transferFrom(msg.sender, RECEIVER, 1);
        vm.stopBroadcast();
    }

    function run() external {
        address root = DevOpsTools.get_most_recent_deployment("Root", block.chainid);
        transferRoot(root);
    }
}
