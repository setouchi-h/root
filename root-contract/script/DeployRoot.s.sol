// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {HelperConfig} from "./HelperConfig.s.sol";
import {Root} from "../src/Root.sol";

contract DeployRoot is Script {
    function deployRootUsingConfig() public returns (address) {
        HelperConfig helperConfig = new HelperConfig();
        (string memory uri, address erc6551Registry, address implementation,,,) = helperConfig.activeNetworkConfig();
        address root = deployRoot(uri, erc6551Registry, implementation);
        return root;
    }

    function deployRoot(string memory uri, address erc6551Registry, address implementation) public returns (address) {
        vm.startBroadcast();
        Root root = new Root(uri, erc6551Registry, implementation);
        vm.stopBroadcast();
        return address(root);
    }

    function run() external returns (address) {
        address root = deployRootUsingConfig();
        return root;
    }
}
