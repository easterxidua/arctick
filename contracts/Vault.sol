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

    // keyHash => remaining ticket balance
    mapping(bytes32 => uint256)
        private balances;

    // total outstanding ticket balances
    uint256 public totalAllocated;

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

    event TicketCreated(
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
    // DEPOSIT LIQUIDITY
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

        emit Deposit(
            keyHash,
            amount
        );
    }

    // ----------------------------------
    // CREATE TICKET
    // ----------------------------------

    function createTicket(
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

        uint256 availableLiquidity =
            usdc.balanceOf(address(this))
            - totalAllocated;

        require(
            availableLiquidity >= amount,
            "insufficient liquidity"
        );

        balances[keyHash] += amount;

        totalAllocated += amount;

        emit TicketCreated(
            keyHash,
            amount
        );
    }

    // ----------------------------------
    // WITHDRAW
    // ----------------------------------

    function withdraw(
        string calldata secret,
        uint256 amount,
        address recipient
    ) external {

        require(
            amount > 0,
            "invalid amount"
        );

        bytes32 keyHash =
            keccak256(
                abi.encodePacked(secret)
            );

        require(
            balances[keyHash] >= amount,
            "insufficient ticket balance"
        );

        balances[keyHash] -= amount;

        totalAllocated -= amount;

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

        uint256 availableLiquidity =
            usdc.balanceOf(address(this))
            - totalAllocated;

        require(
            availableLiquidity >= amount,
            "insufficient liquidity"
        );

        balances[keyHash] += amount;

        totalAllocated += amount; totalAllocated -= amount;

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

    function availableLiquidity()
        external
        view
        returns (uint256)
    {
        return
            usdc.balanceOf(address(this))
            - totalAllocated;
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
        require(
            newOwner != address(0),
            "zero address"
        );

        owner = newOwner;
    }
}