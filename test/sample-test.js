const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token", function () {

  let bob;
  let alice;
  let token;
  let vault;

  before(async () => {

    [bob, alice] = await ethers.getSigners();
    
    const Vault = await ethers.getContractFactory("Vault");
    vault = await Vault.deploy();
    await vault.deployed();
    console.log(vault.address)
    
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy(vault.address);
    await token.deployed();
    console.log(token.address)

    

  });


  it('Checking a contract is deployed', async function () {
    token.transfer(alice.address, 100)
    console.log(await token.balanceOf(alice.address))
    console.log(await token.balanceOf(vault.address))
  });

  it('Checking a contract is deployed', async function () {
    await vault.withdraw(token.address);
    console.log("vault", await token.balanceOf(vault.address))
    console.log("owner", await token.balanceOf(bob.address))
  });

});
