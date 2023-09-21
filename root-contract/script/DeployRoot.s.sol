// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {Root} from "../src/Root.sol";

contract DeployRoot is Script {
    function run() external returns (address) {
        vm.startBroadcast();
        Root root = new Root("ipfs://QmdiKMjiabg7YPE5zcgqxDWuCJoP1y7MJSoBhGWsS7AFcu");
        vm.stopBroadcast();
        return address(root);
    }
}
