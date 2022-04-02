const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token", function () {

  let bob;
  let alice;

  before(async () => {

    const [bob, alice] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy();
    await token.deployed();
    console.log(token.address)

    const Vault = await ethers.getContractFactory("Vault");
    const vault = await Vault.deploy();
    await vault.deployed();
    console.log(vault.address)

  });


  it('Checking a contract is deployed', async function () {
    const [bob, alice] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy();
    await token.deployed();
    token.transfer(alice.address, 100)
    console.log(await token.balanceOf(alice.address))
  });


});
