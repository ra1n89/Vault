const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token", function () {

  let bob,
    alice,
    token,
    vault;

  before(async () => {
    [bob, alice] = await ethers.getSigners();
  });

  beforeEach(async () => {
    const Vault = await ethers.getContractFactory("Vault");
    vault = await Vault.deploy();
    await vault.deployed();

    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy(vault.address);
    await token.deployed();
  })

  it('Vault and minter should be not zero addresses', async function () {
    expect(await token.vault() != 0x0000000000000000000000000000000000000000);
    expect(await token.minter() != 0x0000000000000000000000000000000000000000);
  });

  it('Only minter can mint tokens', async function () {
    const amountToMint = 100;
    await token.mint(alice.address, amountToMint);
    await expect(token.connect(alice).mint(alice.address, amountToMint)).to.revertedWith("only Minter can mint");
  });

  it('Should change minter and he can mint tokens', async function () {
    const amountToMint = 100;
    await token.changeMinter(alice.address);
    expect(await token.minter()).to.be.equal(alice.address);
    await token.connect(alice).mint(alice.address, amountToMint);
    await expect(token.mint(alice.address, amountToMint)).to.revertedWith("only Minter can mint");
  });

  it('Should mint certain amount tokens on certain address', async function () {
    const amountToMint = 100;
    await token.mint(alice.address, amountToMint);
    expect(await token.balanceOf(alice.address)).to.be.equal(amountToMint);
  });

  it('Should revert if user is at blacklist', async function () {
    const amountToTransfer = 100;
    await token.transfer(alice.address, amountToTransfer);
    await token.addToBlackList(alice.address);
    await expect(token.connect(alice).transfer(alice.address, amountToTransfer)).to.be.revertedWith('You are in blackList');
  });

  it('Should transfer tokens and send fee to Vault contract if user is not owner, and he is not at blacklist and whitelist', async function () {
    const amountToTransfer = 100;
    const fee = 5;
    const amountFee = (fee * amountToTransfer) / 100;
    await token.transfer(alice.address, amountToTransfer);
    await token.connect(alice).transfer(alice.address, amountToTransfer);
    expect(await token.balanceOf(alice.address)).to.be.equal(amountToTransfer - amountFee);
    expect(await token.balanceOf(vault.address)).to.be.equal(amountFee);
  });

  it('Should transfer tokens without fee if user is owner or he is at whitelist', async function () {
    const amountToTransfer = 100;
    await token.transfer(alice.address, amountToTransfer);
    expect(await token.balanceOf(alice.address)).to.be.equal(amountToTransfer);
    expect(await token.balanceOf(vault.address)).to.be.equal(0);
    await token.addToWhiteList(alice.address);
    await token.connect(alice).transfer(alice.address, amountToTransfer);
    expect(await token.balanceOf(alice.address)).to.be.equal(amountToTransfer);
    expect(await token.balanceOf(vault.address)).to.be.equal(0);
  });

  it('Should burn tokens', async function () {
    const amountToTransfer = 100;
    const amountToBurn = 100;
    await token.transfer(alice.address, amountToTransfer);
    await token.connect(alice).burn(amountToBurn);
    expect(await token.balanceOf(alice.address)).to.be.equal(amountToTransfer - amountToBurn);
  });

  it('Should burn tokens if function burnFrom called', async function () {
    const ownerBalance = 10000;
    const amountToBurn = 100;
    await token.approve(alice.address, amountToBurn);
    await token.connect(alice).burnFrom(bob.address, amountToBurn);
    expect(await token.balanceOf(bob.address)).to.be.equal(ownerBalance - amountToBurn);
  });

  it('Should only owner withdraw tokens', async function () {
    const amountToTransfer = 100;
    await token.transfer(alice.address, amountToTransfer);
    await token.connect(alice).transfer(alice.address, amountToTransfer);
    await expect(vault.connect(alice).withdraw(token.address)).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it('Should owner withdraw tokens to his address', async function () {
    const ownerBalance = 10000;
    const amountToTransfer = 100;
    const fee = 5;
    const amountFee = (fee * amountToTransfer) / 100;
    await token.transfer(alice.address, amountToTransfer);
    expect(await token.balanceOf(bob.address)).to.be.equal(ownerBalance - amountToTransfer);
    await token.connect(alice).transfer(alice.address, amountToTransfer);
    await vault.withdraw(token.address);
    expect(await token.balanceOf(bob.address)).to.be.equal(ownerBalance - amountToTransfer + amountFee);
    expect(await token.balanceOf(vault.address)).to.be.equal(0);
  });
});
