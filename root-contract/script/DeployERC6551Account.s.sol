// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {ERC6551Account} from "../src/ERC6551Account.sol";

contract DeployERC6551Account is Script {
    function run() external returns (address) {
        vm.startBroadcast();
        ERC6551Account account = new ERC6551Account();
        vm.stopBroadcast();
        return address(account);
    }
}
