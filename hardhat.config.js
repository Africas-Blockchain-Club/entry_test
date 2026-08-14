require("@nomicfoundation/hardhat-toolbox");

/**
 * Everyday config: `npx hardhat test` runs YOUR tests in test/.
 * The auto-marker uses hardhat.grading.config.js instead.
 */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
  },
};
