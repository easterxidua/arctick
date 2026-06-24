// contracts/Vault.sol

pragma solidity ^0.8.20;

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

contract Vault {

    IERC20 public usdc;

    address public owner;

    mapping(bytes32 => uint256)
    public balances;

    constructor(
        address usdcAddress
    ) {
        usdc = IERC20(
            usdcAddress
        );

        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "not owner"
        );
        _;
    }

    function deposit(
        bytes32 keyHash,
        uint256 amount
    )
        external
        onlyOwner
    {
        balances[keyHash] += amount;
    }

    function withdraw(
        bytes32 keyHash,
        uint256 amount,
        address recipient
    )
        external
        onlyOwner
    {
        require(
            balances[keyHash] >= amount,
            "insufficient"
        );

        balances[keyHash] -= amount;

        usdc.transfer(
            recipient,
            amount
        );
    }

    function getBalance(
        bytes32 keyHash
    )
        external
        view
        returns(uint256)
    {
        return balances[keyHash];
    }
}