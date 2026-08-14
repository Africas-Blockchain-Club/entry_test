const { expect } = require("chai");
const { ethers, network } = require("hardhat");

// Marks are encoded in each test title as [n]. See grading/grade.js.
// Total for this file: 25 marks.

const ENTRY = ethers.parseEther("0.01");
const ONE_DAY = 24 * 60 * 60;

async function fastForwardOneDay() {
  await network.provider.send("evm_increaseTime", [ONE_DAY + 1]);
  await network.provider.send("evm_mine");
}

describe("PART 2: DecentralisedRaffle", function () {
  let raffle, owner, alice, bob, carol;

  beforeEach(async function () {
    [owner, alice, bob, carol] = await ethers.getSigners();
    raffle = await ethers.deployContract("DecentralisedRaffle");
    await raffle.waitForDeployment();
  });

  // --- Entering -----------------------------------------------------------

  it("[3] accepts an entry of 0.01 ETH, adds it to the pot, and emits RaffleEntered", async function () {
    await expect(raffle.connect(alice).enterRaffle({ value: ENTRY }))
      .to.emit(raffle, "RaffleEntered")
      .withArgs(alice.address, 1);

    expect(await raffle.getPot()).to.equal(ENTRY);
    expect(await raffle.getEntryCount(alice.address)).to.equal(1n);
    expect(await raffle.getUniquePlayerCount()).to.equal(1n);
  });

  it("[2] rejects an entry below the minimum", async function () {
    await expect(raffle.connect(alice).enterRaffle({ value: ethers.parseEther("0.009") })).to.be
      .reverted;
  });

  it("[3] counts every entry, so repeat entries improve the odds", async function () {
    await raffle.connect(alice).enterRaffle({ value: ENTRY });
    await raffle.connect(alice).enterRaffle({ value: ENTRY });
    await raffle.connect(bob).enterRaffle({ value: ENTRY });

    expect(await raffle.getEntryCount(alice.address)).to.equal(2n);
    expect(await raffle.getPlayerCount()).to.equal(3n); // total entries
    expect(await raffle.getUniquePlayerCount()).to.equal(2n); // distinct addresses
  });

  // --- Circuit breaker ----------------------------------------------------

  it("[3] blocks entries while paused, and emits RafflePaused", async function () {
    await expect(raffle.connect(owner).pause()).to.emit(raffle, "RafflePaused");
    expect(await raffle.isPaused()).to.equal(true);

    await expect(raffle.connect(alice).enterRaffle({ value: ENTRY })).to.be.reverted;
  });

  it("[1] only the owner can pause", async function () {
    await expect(raffle.connect(alice).pause()).to.be.reverted;
  });

  it("[2] unpausing lets entries resume, and emits RaffleUnpaused", async function () {
    await raffle.connect(owner).pause();
    await expect(raffle.connect(owner).unpause()).to.emit(raffle, "RaffleUnpaused");

    expect(await raffle.isPaused()).to.equal(false);
    await raffle.connect(alice).enterRaffle({ value: ENTRY });
    expect(await raffle.getPot()).to.equal(ENTRY);
  });

  // --- Drawing ------------------------------------------------------------

  it("[3] refuses to draw before 24 hours have passed", async function () {
    await raffle.connect(alice).enterRaffle({ value: ENTRY });
    await raffle.connect(bob).enterRaffle({ value: ENTRY });
    await raffle.connect(carol).enterRaffle({ value: ENTRY });

    await expect(raffle.connect(owner).selectWinner()).to.be.reverted;
  });

  it("[2] refuses to draw with fewer than 3 unique players", async function () {
    await raffle.connect(alice).enterRaffle({ value: ENTRY });
    await raffle.connect(alice).enterRaffle({ value: ENTRY });
    await raffle.connect(bob).enterRaffle({ value: ENTRY });
    await fastForwardOneDay();

    await expect(raffle.connect(owner).selectWinner()).to.be.reverted;
  });

  it("[1] only the owner can draw", async function () {
    await raffle.connect(alice).enterRaffle({ value: ENTRY });
    await raffle.connect(bob).enterRaffle({ value: ENTRY });
    await raffle.connect(carol).enterRaffle({ value: ENTRY });
    await fastForwardOneDay();

    await expect(raffle.connect(alice).selectWinner()).to.be.reverted;
  });

  it("[4] pays 90% of the pot to one of the players and empties the contract", async function () {
    const players = [alice, bob, carol];
    for (const p of players) {
      await raffle.connect(p).enterRaffle({ value: ENTRY });
    }
    await fastForwardOneDay();

    const pot = await raffle.getPot();
    const expectedPrize = (pot * 90n) / 100n;

    const before = [];
    for (const p of players) {
      before.push(await ethers.provider.getBalance(p.address));
    }

    await expect(raffle.connect(owner).selectWinner()).to.emit(raffle, "WinnerSelected");

    // exactly one player must have received the prize; none of them sent a
    // transaction, so no gas muddies the comparison
    let winners = 0;
    for (let i = 0; i < players.length; i++) {
      const gained = (await ethers.provider.getBalance(players[i].address)) - before[i];
      if (gained === expectedPrize) winners++;
      else expect(gained).to.equal(0n);
    }
    expect(winners).to.equal(1);

    // the owner's 10% must leave too - nothing may be stranded in the contract
    expect(await ethers.provider.getBalance(await raffle.getAddress())).to.equal(0n);
  });

  it("[1] resets itself for the next round", async function () {
    for (const p of [alice, bob, carol]) {
      await raffle.connect(p).enterRaffle({ value: ENTRY });
    }
    await fastForwardOneDay();
    await raffle.connect(owner).selectWinner();

    expect(await raffle.raffleId()).to.equal(2n);
    expect(await raffle.getPlayerCount()).to.equal(0n);
    expect(await raffle.getUniquePlayerCount()).to.equal(0n);
    expect(await raffle.getPot()).to.equal(0n);
  });
});
