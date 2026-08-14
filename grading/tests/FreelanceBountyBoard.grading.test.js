const { expect } = require("chai");
const { ethers } = require("hardhat");

// Marks are encoded in each test title as [n]. See grading/grade.js.
// Total for this file: 25 marks.

describe("PART 1: FreelanceBountyBoard", function () {
  let board, employer, alice, bob;
  const REWARD = ethers.parseEther("1");

  beforeEach(async function () {
    [employer, alice, bob] = await ethers.getSigners();
    board = await ethers.deployContract("FreelanceBountyBoard");
    await board.waitForDeployment();
  });

  // --- Registration -------------------------------------------------------

  it("[3] registers a freelancer, records the skill, and emits FreelancerRegistered", async function () {
    await expect(board.connect(alice).registerFreelancer("solidity"))
      .to.emit(board, "FreelancerRegistered")
      .withArgs(alice.address, "solidity");

    expect(await board.isRegistered(alice.address)).to.equal(true);
    expect(await board.getSkill(alice.address)).to.equal("solidity");
  });

  it("[2] rejects a duplicate registration", async function () {
    await board.connect(alice).registerFreelancer("solidity");
    await expect(board.connect(alice).registerFreelancer("solidity")).to.be.reverted;
  });

  it("[1] rejects an empty skill", async function () {
    await expect(board.connect(alice).registerFreelancer("")).to.be.reverted;
  });

  // --- Posting a bounty ---------------------------------------------------

  it("[4] posts a bounty, holds the ETH, and emits BountyPosted", async function () {
    await expect(board.connect(employer).postBounty("Build a website", "solidity", { value: REWARD }))
      .to.emit(board, "BountyPosted")
      .withArgs(1, employer.address, REWARD);

    expect(await board.bountyCount()).to.equal(1n);
    expect(await ethers.provider.getBalance(await board.getAddress())).to.equal(REWARD);

    const bounty = await board.getBounty(1);
    expect(bounty[0]).to.equal(employer.address); // employer
    expect(bounty[1]).to.equal("Build a website"); // description
    expect(bounty[2]).to.equal("solidity"); // skillRequired
    expect(bounty[3]).to.equal(REWARD); // amount
    expect(Number(bounty[4])).to.equal(0); // Status.Open
  });

  it("[1] rejects a bounty posted with no ETH", async function () {
    await expect(board.connect(employer).postBounty("Free work", "solidity", { value: 0 })).to.be
      .reverted;
  });

  // --- Applying -----------------------------------------------------------

  it("[3] lets a freelancer with the right skill apply, and emits AppliedForBounty", async function () {
    await board.connect(alice).registerFreelancer("solidity");
    await board.connect(employer).postBounty("Build a website", "solidity", { value: REWARD });

    await expect(board.connect(alice).applyForBounty(1))
      .to.emit(board, "AppliedForBounty")
      .withArgs(1, alice.address);

    expect(await board.hasApplied(1, alice.address)).to.equal(true);
  });

  it("[2] rejects a duplicate application", async function () {
    await board.connect(alice).registerFreelancer("solidity");
    await board.connect(employer).postBounty("Build a website", "solidity", { value: REWARD });
    await board.connect(alice).applyForBounty(1);

    await expect(board.connect(alice).applyForBounty(1)).to.be.reverted;
  });

  it("[1] rejects an applicant whose skill does not match", async function () {
    await board.connect(bob).registerFreelancer("design");
    await board.connect(employer).postBounty("Build a website", "solidity", { value: REWARD });

    await expect(board.connect(bob).applyForBounty(1)).to.be.reverted;
  });

  // --- Submitting ---------------------------------------------------------

  it("[3] records submitted work, moves the bounty to Submitted, and emits WorkSubmitted", async function () {
    await board.connect(alice).registerFreelancer("solidity");
    await board.connect(employer).postBounty("Build a website", "solidity", { value: REWARD });
    await board.connect(alice).applyForBounty(1);

    await expect(board.connect(alice).submitWork(1, "https://github.com/alice/work"))
      .to.emit(board, "WorkSubmitted")
      .withArgs(1, alice.address, "https://github.com/alice/work");

    const bounty = await board.getBounty(1);
    expect(Number(bounty[4])).to.equal(1); // Status.Submitted
  });

  // --- Paying -------------------------------------------------------------

  it("[3] pays the freelancer on approval and marks the bounty Completed", async function () {
    await board.connect(alice).registerFreelancer("solidity");
    await board.connect(employer).postBounty("Build a website", "solidity", { value: REWARD });
    await board.connect(alice).applyForBounty(1);
    await board.connect(alice).submitWork(1, "https://github.com/alice/work");

    const before = await ethers.provider.getBalance(alice.address);
    await expect(board.connect(employer).approveAndPay(1, alice.address))
      .to.emit(board, "BountyPaid")
      .withArgs(1, alice.address, REWARD);
    const after = await ethers.provider.getBalance(alice.address);

    // alice sent no transaction here, so she pays no gas: exact comparison is safe
    expect(after - before).to.equal(REWARD);
    expect(await ethers.provider.getBalance(await board.getAddress())).to.equal(0n);

    const bounty = await board.getBounty(1);
    expect(Number(bounty[4])).to.equal(2); // Status.Completed
  });

  it("[1] does not let anyone except the employer approve", async function () {
    await board.connect(alice).registerFreelancer("solidity");
    await board.connect(employer).postBounty("Build a website", "solidity", { value: REWARD });
    await board.connect(alice).applyForBounty(1);
    await board.connect(alice).submitWork(1, "https://github.com/alice/work");

    await expect(board.connect(bob).approveAndPay(1, alice.address)).to.be.reverted;
  });

  it("[1] SECURITY: cannot pay the same bounty twice", async function () {
    await board.connect(alice).registerFreelancer("solidity");
    await board.connect(employer).postBounty("Build a website", "solidity", { value: REWARD });
    await board.connect(alice).applyForBounty(1);
    await board.connect(alice).submitWork(1, "https://github.com/alice/work");
    await board.connect(employer).approveAndPay(1, alice.address);

    await expect(board.connect(employer).approveAndPay(1, alice.address)).to.be.reverted;
  });
});
