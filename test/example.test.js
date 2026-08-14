const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * A worked example, so you have a pattern to copy.
 *
 * Run everything in this folder with:   npx hardhat test
 *
 * The auto-marker ignores this folder entirely - it runs its own suite from
 * grading/tests. Write your own tests here.
 */
describe("Example: how a Hardhat test is put together", function () {
  let board, employer, alice;

  // beforeEach runs before every `it`, giving each test a fresh contract
  beforeEach(async function () {
    [employer, alice] = await ethers.getSigners();
    board = await ethers.deployContract("FreelanceBountyBoard");
    await board.waitForDeployment();
  });

  it("records a freelancer's skill when they register", async function () {
    // connect(alice) makes alice the msg.sender
    await board.connect(alice).registerFreelancer("solidity");

    expect(await board.isRegistered(alice.address)).to.equal(true);
    expect(await board.getSkill(alice.address)).to.equal("solidity");
  });

  it("emits an event when a bounty is posted", async function () {
    const reward = ethers.parseEther("1"); // 1 ETH, in wei

    await expect(board.connect(employer).postBounty("Fix my site", "solidity", { value: reward }))
      .to.emit(board, "BountyPosted")
      .withArgs(1, employer.address, reward);
  });

  it("reverts when someone registers twice", async function () {
    await board.connect(alice).registerFreelancer("solidity");

    // `to.be.reverted` passes when the transaction fails for any reason
    await expect(board.connect(alice).registerFreelancer("design")).to.be.reverted;
  });

  // Useful things to know for the raffle:
  //
  //   move time forward 24 hours (needed before selectWinner):
  //     await network.provider.send("evm_increaseTime", [24 * 60 * 60 + 1]);
  //     await network.provider.send("evm_mine");
  //
  //   read an account's ETH balance:
  //     await ethers.provider.getBalance(alice.address)
  //
  //   read the contract's balance:
  //     await ethers.provider.getBalance(await raffle.getAddress())
});
