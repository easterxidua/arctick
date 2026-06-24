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

mapping(address =>
    mapping(bytes32 => uint256)
) private balances;

mapping(address => uint256)
    private totalBalances;

    event Deposit(
        address indexed user,
        bytes32 indexed keyHash,
        uint256 amount
    );

    event Withdraw(
        address indexed user,
        bytes32 indexed keyHash,
        uint256 amount
    );

    event BridgeCredit(
        address indexed user,
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

    // --------------------------------------------------
    // DIRECT ARC DEPOSIT
    // --------------------------------------------------

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

balances[msg.sender][keyHash]
    += amount;

totalBalances[msg.sender]
    += amount;

        emit Deposit(
            msg.sender,
            keyHash,
            amount
        );
    }

    // --------------------------------------------------
    // WITHDRAW
    // --------------------------------------------------

    function withdraw(
        bytes32 keyHash,
        uint256 amount
    ) external {

        require(
            amount > 0,
            "invalid amount"
        );

        require(
            balances[msg.sender][keyHash]
                >= amount,
            "insufficient balance"
        );

balances[msg.sender][keyHash]
    -= amount;

totalBalances[msg.sender]
    -= amount;

        require(
            usdc.transfer(
                msg.sender,
                amount
            ),
            "withdraw failed"
        );

        emit Withdraw(
            msg.sender,
            keyHash,
            amount
        );
    }

    // --------------------------------------------------
    // BRIDGE CREDIT
    // --------------------------------------------------
    // Called by backend AFTER bridge completes.
    // Assumes bridge already delivered USDC
    // to this contract address.
    // --------------------------------------------------

    function creditBridgeDeposit(
        address user,
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

balances[user][keyHash]
    += amount;

totalBalances[user]
    += amount;

        emit BridgeCredit(
            user,
            keyHash,
            amount
        );
    }

    // --------------------------------------------------
    // VIEWS
    // --------------------------------------------------

function getBalance(
    address user,
    bytes32 keyHash
)
    external
    view
    returns (uint256)
{
    return balances[user][keyHash];
}

function getTotalBalance(
    address user
)
    external
    view
    returns (uint256)
{
    return totalBalances[user];
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

    // --------------------------------------------------
    // ADMIN
    // --------------------------------------------------

    function transferOwnership(
        address newOwner
    )
        external
        onlyOwner
    {
        owner = newOwner;
    }
}