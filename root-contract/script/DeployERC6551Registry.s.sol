// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {ERC6551Registry} from "../src/ERC6551Registry.sol";

contract DeployERC6551Registry is Script {
    function run() external returns (address) {
        vm.startBroadcast();
        ERC6551Registry registry = new ERC6551Registry();
        vm.stopBroadcast();
        return address(registry);
    }
}
