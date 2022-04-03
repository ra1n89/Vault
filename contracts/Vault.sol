//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vault is Ownable {
    Token token;
    uint256 amount;

    function withdraw(address _token) public onlyOwner {
        address owner = owner();
        amount = Token(_token).balanceOf(address(this));
        Token(_token).transfer(owner, amount);
    }
}
