# Blockchain Development Resources

Everything in this assessment is covered by the two courses below. Start there.

---

## The Two Courses This Assessment Is Built On

### 1. Cyfrin Updraft - Blockchain Basics

- **[Course](https://updraft.cyfrin.io/courses/blockchain-basics)** | **[Repo](https://github.com/Cyfrin/blockchain-basics-cu)**

The sections that map directly onto Part A:

| Section | Lessons that matter here |
|---|---|
| What is a Blockchain? | The Oracle Problem; The Purpose of Smart Contracts; What is the EVM |
| Sending Transactions | What is a Wallet; Introduction to Gas |
| Blockchain Architecture | Introduction to Signatures; Gas in Depth (EIP-1559); The Lifecycle of a Transaction; Account Abstraction; Blockchain Vulnerabilities |
| Blockchain Use Cases | Tokens; Centralized vs Decentralized Exchanges; Decentralized Governance |
| Scalability | L1s, L2s and Rollups; Centralized Sequencers; Rollup Stages |

Supporting material from the course repo:

- **[Demo site](https://demos.updraft.cyfrin.io/)** - signatures, PoS, and DeFi, interactively
- **[Cyfrin Tools](https://tools.cyfrin.io/)** - gas estimation, unit conversion, ABI encode/decode, hashing
- **[Blockchain Demo](https://andersbrownworth.com/blockchain/)** - hashes, blocks, and chains visualised
- **[Bitcoin Whitepaper](https://bitcoin.org/bitcoin.pdf)** | **[Ethereum Whitepaper](https://ethereum.org/en/whitepaper/)**
- **[EIP-1559 explained](https://www.youtube.com/watch?v=MGemhK9t44Q)** - needed for Part A Q2
- **[Wei / Gwei / ETH converter](https://eth-converter.com/)**
- Cyfrin write-ups on the attacks named in the course: [replay](https://www.cyfrin.io/blog/replay-attack-in-ethereum), [Sybil](https://www.cyfrin.io/blog/understanding-sybil-attacks-in-blockchain-and-smart-contracts), [double-spending](https://www.cyfrin.io/blog/understanding-double-spending-in-blockchain)

### 2. The Solcurity Standard

- **[Checklist](https://github.com/transmissions11/solcurity)** | **[How we use it](./SOLCURITY.md)**

Read it end to end before reviewing your own code. Cite the IDs in your answers.

---

## Solidity Development

- **[Cyfrin Updraft - Foundry Fundamentals](https://updraft.cyfrin.io/courses/foundry)** | **[Repo](https://github.com/Cyfrin/foundry-full-course-cu)**
- **[Solidity Docs](https://docs.soliditylang.org/)** - complete language reference
- **[Solidity by Example](https://solidity-by-example.org/)** - practical snippets
- **[OpenZeppelin Docs](https://docs.openzeppelin.com/)** - audited contract libraries
- **[Foundry Book](https://book.getfoundry.sh/)** - `forge test`, fuzzing, invariants, coverage
- **[Remix IDE](https://remix.ethereum.org/)** - browser-based, useful when tooling fights you

---

## Oracles & Randomness

Background for Part A Questions 3 and 7, and for the randomness section of your
design document. **You do not integrate any of these** - the raffle uses the
block-data shortcut, and you explain its weakness in writing.

- **[The blockchain oracle problem](https://blog.chain.link/what-is-the-blockchain-oracle-problem/)** - start here, it answers Q3
- **[Chainlink VRF](https://docs.chain.link/vrf)** - what you would use instead of block data, and why
- **[Chainlink Data Feeds](https://docs.chain.link/data-feeds)** - how a price actually reaches a contract
- **[The blockchain oracle problem](https://blog.chain.link/what-is-the-blockchain-oracle-problem/)**
- **[Hybrid smart contracts](https://blog.chain.link/hybrid-smart-contracts-explained/)**

---

## Security Resources

### Best Practices

- **[The Solcurity Standard](https://github.com/transmissions11/solcurity)** - the marking reference
- **[Consensys Smart Contract Best Practices](https://consensys.github.io/smart-contract-best-practices/)**
- **[SWC Registry](https://swcregistry.io/)** - the SWC numbers Solcurity cites
- **[Not So Smart Contracts](https://github.com/crytic/not-so-smart-contracts)** - vulnerability examples with code

### Practice

- **[Ethernaut](https://ethernaut.openzeppelin.com/)** - levels 9 (King), 10 (Reentrancy) and 12 (Privacy) map onto this assessment
- **[Damn Vulnerable DeFi](https://www.damnvulnerabledefi.xyz/)** - oracle and flash-loan attacks
- **[CodeHawks](https://codehawks.com/)** - live auditing competitions

### Audit Reading

- **[Rekt News](https://rekt.news/)** - post-mortems of real exploits
- **[Trail of Bits blog](https://blog.trailofbits.com/)**
- **[Solodit](https://solodit.xyz/)** - searchable database of audit findings

---

## Analysis Tools

- **[Slither](https://github.com/crytic/slither)** - static analysis (Solcurity `P5`)
- **[Solhint](https://github.com/protofire/solhint)** - linter
- **[Echidna](https://github.com/crytic/echidna)** - property-based fuzzer
- **[Mythril](https://github.com/ConsenSys/mythril)** - symbolic execution (`P4`)

---

## Testnets (background only - NOT needed for this assessment)

> [!IMPORTANT]
> **You do not need a testnet, a faucet, a wallet or any test ETH to complete
> this assessment.** Everything runs on the local Hardhat network, which gives
> you 20 pre-funded accounts automatically. This section is here because the
> course covers it and Part A asks about it in writing - not because you have to
> do any of it.

The Cyfrin courses use **Sepolia**. Goerli and Mumbai are deprecated - do not use
them.

| Network | Chain ID | Faucets | Explorer |
|---|---|---|---|
| Sepolia | 11155111 | [Chainlink](https://faucets.chain.link/sepolia), [Google Cloud](https://cloud.google.com/application/web3/faucet/ethereum/sepolia), [Alchemy](https://sepoliafaucet.com/) | [Etherscan](https://sepolia.etherscan.io/) |
| ZKsync Sepolia | 300 | [Docs](https://docs.zksync.io/build/tooling/network-faucets.html) | [ZKsync explorer](https://sepolia.explorer.zksync.io/) |

The Chainlink faucet does not require a mainnet ETH balance. Faucet URLs change
often - if one is dead, check the [Chainlink faucets page](https://faucets.chain.link)
for the current list.

---

## Communities

- **[Cyfrin Discord](https://discord.gg/cyfrin)** - the course community
- **[Updraft course discussions](https://github.com/Cyfrin/blockchain-basics-cu/discussions)**
- **[Ethereum Stack Exchange](https://ethereum.stackexchange.com/)**

Cyfrin's [how to ask a question](https://github.com/Cyfrin/blockchain-basics-cu/blob/main/how-to-ask-a-question.md)
guide is worth five minutes before you post anywhere.

---

## Important Reminders

> **Security first.** Every vulnerability costs real money. Solcurity exists so
> you do not have to rediscover each class of bug the expensive way.

> **Test thoroughly.** Testnets before mainnet, always. Write the adversarial
> test, not just the happy path.

> **AI gets things wrong.** The course says this plainly. Use it for speed, then
> verify against the documentation. Unverified AI output in your submission is
> visible and it costs you marks.

> **Stay current.** Faucets, feed addresses and testnets change. Documentation
> beats a year-old tutorial.
