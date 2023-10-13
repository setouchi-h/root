// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {DeployRoot} from "../../script/DeployRoot.s.sol";
import {ERC6551Account} from "../../src/ERC6551Account.sol";
import {ERC6551Registry} from "../../src/ERC6551Registry.sol";
import {Root} from "../../src/Root.sol";

contract ERC6551AccountTest is Test {
    DeployRoot deployer;
    ERC6551Account implementation;
    ERC6551Registry erc6551Registry;
    Root root;

    uint256 constant INITIAL_TOKEN_ID = 1;
    address public RECIEVER = makeAddr("reciever");

    function setUp() public {
        deployer = new DeployRoot();
        (root, erc6551Registry, implementation) = deployer.run();
    }

    function testTransferFromViaExecute() public {
        address owner = msg.sender;
        console.log(owner);
        console.log(root.ownerOf(INITIAL_TOKEN_ID));
        address tba = root.getTbaFromTokenId(INITIAL_TOKEN_ID);
        console.log(ERC6551Account(payable(tba)).owner());
        vm.prank(owner);
        ERC6551Account(payable(tba)).execute(
            address(root), 0, abi.encodeWithSignature("transferFrom(address,address,uint256)", tba, RECIEVER, 2), 0
        );
        assertEq(root.totalSupply(), 7);
    }
}
