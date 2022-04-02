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

// Нужно разработать контракт токена стандарта ERC20, который пересылает 5% с каждого 
// трансфера на отдельный контракт Ваульта (Vault). Токен и Ваульт должны быть Ownable. 
// Овнер ваульта может вызвать функцию withdraw(), чтобы снять токены себе на адрес. 
// Токен должен поддерживать whitelist - список адресов, которые не будут платить 5% комиссии за трансфер, 
// а также blacklist - список адресов, которым вообще запрещено совершать трансфер. 
// Овнер включён в whitelist с самого момента деплоя. Минтить токен может только один адрес,
//  который может быть в любой момент установлен овнером. У токена есть также публичная функция burn(),
//   которая позволяет любому пользователю сжигать свои токены в указанном количестве. 
//   Также, токен имеет функцию burnFrom(), которая позволяет сжечь токен в указанном количестве у 
//   указанного адреса, в случае, если есть аппрув 

// Желательно использование библиотеки OpenZeppelin. Для тестов использовать hardhat и js