const { expect } = require("chai");
const { parseEther, formatEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("UBI", function () {
  let provider;
  let owner;
  let backend;
  let sub1;
  let sub2;
  let addrs;
  let ubi;

  beforeEach(async () => {
    provider = ethers.provider;
    const ubiFactory = await ethers.getContractFactory("UBI");
    [owner, backend, sub1, sub2, ...addrs] = await ethers.getSigners();

    ubi = await ubiFactory.deploy(backend.address);
    await ubi.deployed();
  });

  it("Should have working donations", async () => {
    await ubi.donate({value: parseEther("1")});
    expect(await provider.getBalance(ubi.address)).to.equal(parseEther("1"));
  });

  it("Should disallow distribution by non-backends", async () => {
    await expect(ubi.distribute()).to.be.reverted;
  });

  it("Should disallow setting monthly income by non-owners", async () => {
    await expect(ubi.connect(sub1).setMonthlyIncome(parseEther("0.1"))).to.be.reverted;
  });

  it("Should fail distribution if not enough for everybody", async () => {
    await ubi.connect(sub1).subscribe();
    await ubi.connect(sub2).subscribe();
    await expect(ubi.connect(backend).distribute()).to.be.reverted;
  });

  it("Should allow subscriptions and distribution", async () => {
    await ubi.donate({value: parseEther("1")});
    await ubi.connect(sub1).subscribe();
    await ubi.connect(sub2).subscribe();

    const initialBalance1 = await provider.getBalance(sub1.address);
    const initialBalance2 = await provider.getBalance(sub2.address);
    const monthlyIncome = await ubi.getMonthlyIncome();

    await ubi.connect(backend).distribute();

    expect(await provider.getBalance(sub1.address)).to.equal(initialBalance1.add(monthlyIncome));
    expect(await provider.getBalance(sub2.address)).to.equal(initialBalance2.add(monthlyIncome));
  });
});
