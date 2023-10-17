// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {Root} from "../src/Root.sol";
import {ERC6551Registry} from "../src/ERC6551Registry.sol";
import {ERC6551Account} from "../src/ERC6551Account.sol";

contract HelperConfig is Script {
    struct NetworkConfig {
        string uri;
        address erc6551Registry;
        address implementation;
        uint256 salt;
        bytes initData;
        uint256 deployerKey;
    }

    uint256 public constant DEFAULT_ANVIL_EKY = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
    NetworkConfig public activeNetworkConfig;

    constructor() {
        if (block.chainid == 11155111) {
            activeNetworkConfig = getSepoliaConfig();
        } else if (block.chainid == 80001) {
            activeNetworkConfig = getMumbaiConfig();
        } else if (block.chainid == 137) {
            activeNetworkConfig = getPolygonConfig();
        } else {
            activeNetworkConfig = getOrCreateAnvilConfig();
        }
    }

    // TODO: 更新
    function getSepoliaConfig() public view returns (NetworkConfig memory) {
        return NetworkConfig({
            uri: "ipfs://QmbfzGYYSZzyJcpk4QVbtSjY2u928p3nbMb3XbGXKZcB1v",
            erc6551Registry: address(0),
            implementation: address(0),
            salt: 0,
            initData: "",
            deployerKey: vm.envUint("PRIVATE_KEY")
        });
    }

    function getMumbaiConfig() public view returns (NetworkConfig memory) {
        return NetworkConfig({
            uri: "ipfs://QmbfzGYYSZzyJcpk4QVbtSjY2u928p3nbMb3XbGXKZcB1v",
            erc6551Registry: 0x8C6865E81B87967ef9B08Ead0336AAe6F4438647,
            implementation: 0x05521E56B8456e78750E705BAae0525D6198172B,
            salt: 0,
            initData: "",
            deployerKey: vm.envUint("PRIVATE_KEY")
        });
    }

    function getPolygonConfig() public view returns (NetworkConfig memory) {
        return NetworkConfig({
            uri: "ipfs://QmbfzGYYSZzyJcpk4QVbtSjY2u928p3nbMb3XbGXKZcB1v",
            erc6551Registry: 0x8Fb20557F702cBd71D6725bd2bFbDFe033114a65,
            implementation: 0xc743258B8009d55BBD0733E57d1Ae2CdDB49507d,
            salt: 0,
            initData: "",
            deployerKey: vm.envUint("PRIVATE_KEY")
        });
    }

    function getOrCreateAnvilConfig() public returns (NetworkConfig memory) {
        if (activeNetworkConfig.erc6551Registry != address(0)) {
            return activeNetworkConfig;
        }

        vm.startBroadcast();
        ERC6551Registry registry = new ERC6551Registry();
        ERC6551Account baseAccount = new ERC6551Account();
        vm.stopBroadcast();

        return NetworkConfig({
            uri: "ipfs://QmbfzGYYSZzyJcpk4QVbtSjY2u928p3nbMb3XbGXKZcB1v",
            erc6551Registry: address(registry),
            implementation: address(baseAccount),
            salt: 0,
            initData: "",
            deployerKey: DEFAULT_ANVIL_EKY
        });
    }
}
