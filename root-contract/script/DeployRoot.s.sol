// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {HelperConfig} from "./HelperConfig.s.sol";
import {Root} from "../src/Root.sol";
import {ERC6551Account} from "../src/ERC6551Account.sol";
import {ERC6551Registry} from "../src/ERC6551Registry.sol";

contract DeployRoot is Script {
    function deployRootUsingConfig() public returns (address, address, address) {
        HelperConfig helperConfig = new HelperConfig();
        (string memory uri, address erc6551Registry, address implementation,,,) = helperConfig.activeNetworkConfig();
        address root = deployRoot(uri, erc6551Registry, implementation);
        return (root, erc6551Registry, implementation);
    }

    function deployRoot(string memory uri, address erc6551Registry, address implementation) public returns (address) {
        vm.startBroadcast();
        Root root = new Root(uri, erc6551Registry, implementation);
        vm.stopBroadcast();
        return address(root);
    }

    function run() external returns (Root, ERC6551Registry, ERC6551Account) {
        (address root, address erc6551Registry, address implementation) = deployRootUsingConfig();
        return (Root(root), ERC6551Registry(erc6551Registry), ERC6551Account(payable(implementation)));
    }
}
