require("@nomicfoundation/hardhat-toolbox");

/**
 * Used by the auto-marker to run YOUR tests in test/ and check at least one of
 * them passes. Same as hardhat.config.js, but reports machine readable JSON.
 */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  paths: { sources: "./contracts", tests: "./test" },
  mocha: { reporter: "json", timeout: 60000 },
};
