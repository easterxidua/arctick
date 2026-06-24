pragma solidity ^0.8.20;

import "../contracts/Vault.sol";
import "forge-std/Script.sol";

contract DeployVault is Script {

    function run() external {

        vm.startBroadcast();

        new Vault(
            0x3600000000000000000000000000000000000000
        );

        vm.stopBroadcast();
    }
}