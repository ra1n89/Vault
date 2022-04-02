//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vault is Token {
    Token token;

    constructor() {}

    function withdraw(
        address _token,
        address to,
        uint256 amount
    ) public onlyOwner {
        address owner = owner();
        amount = Token(_token).balanceOf(_token);
        transfer(owner, amount);
    }
}
