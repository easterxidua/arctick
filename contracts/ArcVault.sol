// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function transfer(
        address to,
        uint256 amount
    ) external returns(bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns(bool);
}

contract ArcVault {

    IERC20 public immutable usdc;

    struct Vault {
        uint256 balance;
    }

    mapping(bytes32 => Vault) public vaults;

    event Deposited(
        bytes32 indexed keyHash,
        uint256 amount
    );

    event Withdrawn(
        bytes32 indexed keyHash,
        uint256 amount,
        address receiver
    );

    constructor(address usdcAddress) {
        usdc = IERC20(usdcAddress);
    }

    function deposit(
        bytes32 keyHash,
        uint256 amount
    ) external {

        require(
            amount > 0,
            "amount=0"
        );

        bool success =
            usdc.transferFrom(
                msg.sender,
                address(this),
                amount
            );

        require(
            success,
            "transfer failed"
        );

        vaults[keyHash].balance += amount;

        emit Deposited(
            keyHash,
            amount
        );
    }

    function withdraw(
        bytes32 keyHash,
        uint256 amount
    ) external {

        Vault storage v =
            vaults[keyHash];

        require(
            v.balance >= amount,
            "insufficient"
        );

        v.balance -= amount;

        bool success =
            usdc.transfer(
                msg.sender,
                amount
            );

        require(
            success,
            "transfer failed"
        );

        emit Withdrawn(
            keyHash,
            amount,
            msg.sender
        );
    }

    function getBalance(
        bytes32 keyHash
    )
        external
        view
        returns(uint256)
    {
        return vaults[keyHash].balance;
    }
}