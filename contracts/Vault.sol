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

mapping(bytes32 => address)
    public ticketCreator;

mapping(address => uint256)
    public vaultBalance;

mapping(address => uint256)
    public allocatedBalance;

event Deposit(
    address indexed depositor,
    bytes32 indexed keyHash,
    uint256 amount
);

event Withdraw(
    address indexed caller,
    bytes32 indexed keyHash,
    address indexed recipient,
    uint256 amount
);

event BridgeCredit(
    address indexed user,
    bytes32 indexed keyHash,
    uint256 amount
);

event TicketCreated(
    address indexed creator,
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
    msg.sender,
    keyHash,
    amount
);
    }

    // ----------------------------------
    // CREATE TICKET
    // ----------------------------------

    function createTicket(
        bytes32 keyHash,
        uint256 amount,
        address creator
    )
        external
        onlyOwner
    {
        require(
            amount > 0,
            "invalid amount"
        );

uint256 availableLiquidity =
    vaultBalance[creator]
    - allocatedBalance[creator];

require(
    availableLiquidity >= amount,
    "insufficient user liquidity"
);
        
if (
    ticketCreator[keyHash]
    == address(0)
) {
    ticketCreator[keyHash]
        = msg.sender;
}

ticketCreator[keyHash]
    = creator;
    
balances[keyHash] += amount;

allocatedBalance[creator] += amount;

ticketCreator[keyHash] = creator;

emit TicketCreated(
    creator,
    keyHash,
    amount
);
    }

function ticketBalance(
    bytes32 keyHash
)
    external
    view
    returns (uint256)
{
    return balances[keyHash];
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

address creator =
    ticketCreator[keyHash];

require(
    creator != address(0),
    "ticket not found"
);

balances[keyHash] -= amount;

allocatedBalance[creator] -= amount;

vaultBalance[creator] -= amount;

        require(
            usdc.transfer(
                recipient,
                amount
            ),
            "withdraw failed"
        );

emit Withdraw(
    msg.sender,
    keyHash,
    recipient,
    amount
);
    }

function availableUserLiquidity(
    address user
)
    external
    view
    returns (uint256)
{
    return
        vaultBalance[user]
        - allocatedBalance[user];
}

    // ----------------------------------
    // BRIDGE CREDIT
    // ----------------------------------

function creditBridgeDeposit(
    address user,
    bytes32 keyHash,
    uint256 amount
)
    external
    onlyOwner
{
    require(
        user != address(0),
        "invalid user"
    );

    require(
        amount > 0,
        "invalid amount"
    );

    vaultBalance[user] += amount;

    emit BridgeCredit(
        user,
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