//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Token is ERC20Burnable, Ownable {
    address public vault;
    address public minter;

    mapping(address => bool) public whiteList;
    mapping(address => bool) public blackList;

    constructor(address _vault) ERC20("Gold", "GLD") {
        minter = owner();
        vault = _vault;
        _mint(owner(), 10000);
        whiteList[owner()] = true;
    }

    function changeMinter(address _newMinter)
        public
        onlyOwner
        returns (address)
    {
        minter = _newMinter;
        return minter;
    }

    function mint(address _to, uint256 _amount) public {
        require(minter == msg.sender, "only Minter can mint");
        _mint(_to, _amount);
    }

    function addToWhiteList(address _whiteListAddr) public {
        whiteList[_whiteListAddr] = true;
    }

    function addToBlackList(address _blackListAddr) public {
        blackList[_blackListAddr] = true;
    }

    function transfer(address to, uint256 amount)
        public
        override
        returns (bool)
    {
        require(blackList[msg.sender] != true, "You are in blackList");
        if (msg.sender == vault) {
            _transfer(vault, to, amount);
        } else if (whiteList[msg.sender] == false) {
            uint16 fee = 5;
            uint256 amountFee = (fee * amount) / 100;
            _transfer(msg.sender, to, amount - amountFee);
            _transfer(msg.sender, vault, amountFee);
        } else {
            _transfer(msg.sender, to, amount);
        }
        return true;
    }
}
