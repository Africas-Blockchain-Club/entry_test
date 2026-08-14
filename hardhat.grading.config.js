require("@nomicfoundation/hardhat-toolbox");

/**
 * Config used by the auto-marker only.
 *
 * It points Hardhat at grading/tests instead of test/, and emits machine
 * readable JSON on stdout so grading/grade.js can turn it into a score.
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
    tests: "./grading/tests",
  },
  mocha: {
    reporter: "json",
    timeout: 60000,
  },
};
