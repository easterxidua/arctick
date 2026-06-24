// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
function transfer(
address to,
uint256 amount
) external returns (bool);

function transferFrom(
    address from,
    address to,
    uint256 amount
) external returns (bool);

function balanceOf(
    address account
) external view returns (uint256);

}

contract Vault {

IERC20 public immutable usdc;

address public owner;

// keyHash => balance
mapping(bytes32 => uint256)
    private balances;

event Deposit(
    bytes32 indexed keyHash,
    uint256 amount
);

event Withdraw(
    bytes32 indexed keyHash,
    address indexed recipient,
    uint256 amount
);

event BridgeCredit(
    bytes32 indexed keyHash,
    uint256 amount
);

modifier onlyOwner() {
    require(
        msg.sender == owner,
        "not owner"
    );
    _;
}

constructor(
    address usdcAddress
) {
    usdc = IERC20(usdcAddress);
    owner = msg.sender;
}

// ----------------------------------
// DEPOSIT
// ----------------------------------

function deposit(
    bytes32 keyHash,
    uint256 amount
) external {

    require(
        amount > 0,
        "invalid amount"
    );

    require(
        usdc.transferFrom(
            msg.sender,
            address(this),
            amount
        ),
        "transfer failed"
    );

    balances[keyHash] += amount;

    emit Deposit(
        keyHash,
        amount
    );
}

// ----------------------------------
// WITHDRAW
// ----------------------------------

function withdraw(
    bytes32 keyHash,
    uint256 amount,
    address recipient
) external {

    require(
        amount > 0,
        "invalid amount"
    );

    require(
        balances[keyHash] >= amount,
        "insufficient balance"
    );

    balances[keyHash] -= amount;

    require(
        usdc.transfer(
            recipient,
            amount
        ),
        "withdraw failed"
    );

    emit Withdraw(
        keyHash,
        recipient,
        amount
    );
}

// ----------------------------------
// BRIDGE CREDIT
// ----------------------------------

function creditBridgeDeposit(
    bytes32 keyHash,
    uint256 amount
)
    external
    onlyOwner
{
    require(
        amount > 0,
        "invalid amount"
    );

    balances[keyHash] += amount;

    emit BridgeCredit(
        keyHash,
        amount
    );
}

// ----------------------------------
// VIEWS
// ----------------------------------

function getBalance(
    bytes32 keyHash
)
    external
    view
    returns (uint256)
{
    return balances[keyHash];
}

function vaultUSDCBalance()
    external
    view
    returns (uint256)
{
    return usdc.balanceOf(
        address(this)
    );
}

// ----------------------------------
// ADMIN
// ----------------------------------

function transferOwnership(
    address newOwner
)
    external
    onlyOwner
{
    owner = newOwner;
}

}