// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {Root} from "../src/Root.sol";
import {ERC6551Account} from "../src/ERC6551Account.sol";

contract HelperConfig is Script {
    struct NetworkConfig {
        address implementation;
        address tokenContract;
        uint256 tokenId;
        uint256 salt;
        bytes initData;
        uint256 deployerKey;
    }

    uint256 public constant DEFAULT_ANVIL_EKY = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
    NetworkConfig public activeNetworkConfig;

    constructor() {
        if (block.chainid == 11155111) {
            activeNetworkConfig = getSepoliaConfig();
        } else {
            activeNetworkConfig = getOrCreateAnvilConfig();
        }
    }

    function getSepoliaConfig() public view returns (NetworkConfig memory) {
        return NetworkConfig({
            implementation: address(0),
            tokenContract: address(0),
            tokenId: 0,
            salt: 0,
            initData: "",
            deployerKey: vm.envUint("PRIVATE_KEY")
        });
    }

    function getOrCreateAnvilConfig() public returns (NetworkConfig memory) {
        if (activeNetworkConfig.implementation != address(0) && activeNetworkConfig.tokenContract != address(0)) {
            return activeNetworkConfig;
        }

        vm.startBroadcast();
        ERC6551Account baseAccount = new ERC6551Account();
        Root root = new Root("ipfs://QmdiKMjiabg7YPE5zcgqxDWuCJoP1y7MJSoBhGWsS7AFcu");
        Root(root).mintNft();
        vm.stopBroadcast();

        return NetworkConfig({
            implementation: address(baseAccount),
            tokenContract: address(root),
            tokenId: 1,
            salt: 0,
            initData: "",
            deployerKey: DEFAULT_ANVIL_EKY
        });
    }
}
