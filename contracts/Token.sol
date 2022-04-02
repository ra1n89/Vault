//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Token is ERC20Burnable, Ownable {
    address vault;
    address minter;

    mapping(address => bool) whiteAndBlackList;

    constructor(address _vault) ERC20("Gold", "GLD") {
        minter = owner();
        vault = _vault;
        _mint(owner(), 10000);
        whiteAndBlackList[owner()] = true;
    }

    function changeMinter(address _newMinter) public onlyOwner {
        minter = _newMinter;
    }

    function mint(address _to, uint256 _amount) public {
        require(minter == msg.sender, "only Minter can mint");
        _mint(_to, _amount);
    }

    

    function addToWhiteList(address _whiteListAddr, bool _whiteOrBlacklist)
        public
    {
        whiteAndBlackList[_whiteListAddr] = _whiteOrBlacklist;
    }

    function transfer(address to, uint256 amount)
        public
        override
        returns (bool)
    {
        address owner = owner();
       

        // if (
        //     whiteAndBlackList[msg.sender] != true ||
        //     whiteAndBlackList[msg.sender] != false
        // ) {
            if (msg.sender == vault) {
          console.log(owner);
          console.log(to);
          console.log(amount);
           _transfer(vault, to, amount);
                   
            } 
             uint16 fee = 5;
            uint256 amountFee = (fee * amount) / 100;
            _transfer(owner, to, amount - amountFee);
            _transfer(owner, vault, amountFee);
            
        //     return true;
        // } else {
        //     require(
        //         whiteAndBlackList[msg.sender] = true,
        //         "you are in the blacklist"
        //     );
        //     _transfer(owner, vault, amount);
        //          
    }

    // function balanceOf(address account) public view override returns (uint256){
    //   balanceOf(account);
    // }
}
