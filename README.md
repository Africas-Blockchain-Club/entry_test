# Blockchain Developer Entry Test (3-Hour Challenge)

Welcome. You have **3 hours**.

This test assumes you have worked through **[Cyfrin Updraft - Blockchain
Basics](https://updraft.cyfrin.io/courses/blockchain-basics)** and have written
some Solidity. Nothing here goes beyond that. There are no oracles to integrate,
no Chainlink VRF, no Foundry - just Hardhat, two straightforward contracts, and
eight multiple-choice questions drawn directly from the course.

> [!IMPORTANT]
> Complete **BOTH** PART 1 (Freelance Bounty Board) and PART 2 (Decentralised
> Raffle). Half of one is worth more than all of neither.

---

## Marks

The assessment is scored out of 100, and everything is marked automatically.

| Section | Marks | How it is marked | When |
|---|---|---|---|
| Part A - 8 MCQ answers | 24 | 3 per correct letter | On every push |
| Part B - your two contracts | 50 | A test suite, marks shown per test | On every push |
| Your own test | 3 | One test file of yours that passes | On every push |
| Written reasoning | 23 | Read and marked | After you submit |

**77 of the 100 marks appear on every push**, so you always know where you
stand. The remaining 23 are for your written reasoning and are marked after
submission.

> [!IMPORTANT]
> **Places are limited and we take the strongest submissions.** There is no
> score at which you can stop and coast - you are measured against the other
> people in the room, so use the full three hours.

> [!IMPORTANT]
> Do not skip the reasoning boxes because they are marked later. A blank box
> scores zero, and there are **23 marks** in them - more than a fifth of the
> assessment. Two or three honest sentences per box is enough.
>
> Honesty is marked as a positive. "I ran out of time and here is what I would
> have done", or "yes, this attack works against my code", earns marks.
> Claiming something is secure when it is not earns zero.

---

## The Auto-Marker

**Every push to your fork is marked automatically.** A GitHub Action compiles
your contracts, runs the marking test suite, and posts a scored breakdown.

To see it: push, then open the **Actions** tab in your fork → click the newest
run → the score table is on the summary page. Each test is listed with the marks
it carries and, when it fails, the reason.

Use it. Push early and often - a failing test with a message is the fastest
feedback you will get.

Three things to know:

- **Your MCQ answers lock on the first push that has all eight filled in.**
  They are marked from that commit, so changing them later does nothing. Decide
  on all eight, then push them together. Until then the Action tells you it is
  not yet locked.
- **The marking tests live in `grading/`.** You are welcome to read them - they
  are the precise specification for what your contracts must do. Editing them
  achieves nothing: the assessor re-runs the original suite against your code.
- **Your reasoning marks show as "pending"** in your fork and are filled in
  after you submit.

**Seeing no runs at all?** You have not enabled Actions on your fork yet - go
back to Step 1 of Getting Started. This is the single most common reason a
candidate gets to lunchtime with no score.

---

## Prerequisites

- **Node.js v20+** and npm
- **Git** configured (`git config user.name "Your Name"`)
- **VS Code** with a Solidity extension (Juan Blanco or Nomic Foundation)
- A GitHub/GitLab account

### What you do NOT need

> [!IMPORTANT]
> **No wallet. No MetaMask. No faucet. No testnet. No real or test ETH. You are
> not deploying anything.**

Everything runs on the local Hardhat network on your own machine. When you run
`npx hardhat test`, Hardhat spins up a temporary blockchain in memory and hands
you **20 test accounts, each preloaded with 10,000 fake ETH**. That is where the
ETH in the tests comes from:

```js
const [owner, alice, bob] = await ethers.getSigners(); // already funded
await raffle.connect(alice).enterRaffle({ value: ethers.parseEther("0.01") });
```

Nothing touches a public network, so nothing costs anything and nothing can go
wrong with a faucet. The chain is thrown away when the test run ends.

If you want to deploy to Sepolia afterwards out of curiosity, you are welcome
to - but it earns no marks and you should not spend assessment time on it.

Where the assessment asks about testnets, faucets or gas prices (Part A
Question 2, and the deployment sections of `PartB_Design.md`), those are
**written questions**. You answer them in prose. You never have to actually do
it.

---

## Getting Started

### Step 1: Fork, then TURN ON ACTIONS

Fork this repository to your own account.

> [!CAUTION]
> **GitHub switches off Actions in every new fork.** Until you turn them back
> on, nothing is marked and you will see no score all morning. Do this first.
>
> 1. Go to **your fork** on github.com (not this repo - the one under your own
>    username).
> 2. Click the **Actions** tab, along the top next to Code, Issues and Pull
>    requests.
> 3. A yellow banner appears across the top: *"Workflows aren't being run on
>    this forked repository."*
> 4. Click the green button: **"I understand my workflows, go ahead and enable
>    them."**
>
> That is it - once, at the start. Every push after that is marked
> automatically. If you do not see the banner, Actions are already on; push
> something and check that a run appears.

### Step 2: Clone and install

```bash
# Clone YOUR fork
git clone [YOUR_FORK_URL]
cd entry_test

# Install
npm install

# Check the toolchain works before you change anything
npx hardhat compile
```

That must print "Compiled 2 Solidity files successfully". If it does, you are
set up - everything else is already configured, and there is nothing to download
beyond `npm install`.

`npx hardhat test` will **fail** at this point, and that is correct: the
skeletons are empty, so the example tests in `test/` have nothing to pass
against. Those failures turn green as you implement.

**To run the marker locally, exactly as the Action does:**

```bash
npm run build
npx hardhat --config hardhat.grading.config.js test > grading/report.json
npm run grade
```

That prints your code score and writes `grading/report.md`.

---

## What To Do

### Part A: MCQ (`PartA_MCQ_Answers.md`) - 40 marks

Eight questions on blockchain fundamentals: gas, consensus, oracles, rollups,
wallets, and two that connect to the code you are about to write.

Put a single letter on each `**Your Answer:**` line - the marker reads that line
literally:

```
**Your Answer:** B
```

Then write two or three sentences of reasoning underneath. The letters are worth
24 marks and the reasoning another 16, so do not skip a box even when the answer
is obvious.

**Do this first.** Questions 7 and 8 tell you how to build parts of Part B.

### Part B: The Contracts and documents - 60 marks

Two skeletons in `contracts/`, each with numbered TODOs:

1. `FreelanceBountyBoard.sol` - register freelancers, post bounties holding ETH,
   apply, submit work, approve and pay.
2. `DecentralisedRaffle.sol` - enter with 0.01 ETH, multiple entries allowed,
   pause/unpause, draw a winner after 24 hours and split the pot 90/10.

> [!WARNING]
> **Do not rename the functions or events.** The auto-marker calls them by their
> exact signatures. Add whatever you like alongside them, but leave the given
> ones as they are.

The tests are worth 50. Then fill in `PartB_Design.md` (its Randomness section
is worth 4) and `PartB_Tests.md` (its attacker section is worth 3), and write at
least one test of your own in `test/` (worth 3 - there is a worked example there
to copy from).

---

## A Note On Randomness

The raffle needs to pick a winner. You are **allowed** to do this the simple
way:

```solidity
uint256 index = uint256(
    keccak256(abi.encodePacked(block.timestamp, block.prevrandao))
) % players.length;
```

This is not secure, and we know it. Doing it properly needs Chainlink VRF, which
is out of scope for three hours.

What you must do is **explain in `PartB_Design.md` who can manipulate it and
how**. Understanding why it is broken is the thing being tested here, not the
ability to fix it. A working shortcut plus an honest explanation scores full
marks. A working shortcut described as "secure" scores zero for that section.

---

## Suggested Timing

| Time | Task |
|---|---|
| 0:00 - 0:40 | Part A. All eight questions, with reasoning. |
| 0:40 - 1:40 | `FreelanceBountyBoard.sol`. Push when the first tests go green. |
| 1:40 - 2:30 | `DecentralisedRaffle.sol`. |
| 2:30 - 2:50 | `PartB_Design.md` and `PartB_Tests.md`. |
| 2:50 - 3:00 | Write your two tests, final push, check the Actions tab. |

If you are stuck on one contract at the 1:40 mark, **move on**. Partial marks
across both beats one perfect contract.

---

## File Structure

```
entry_test/
├── contracts/
│   ├── FreelanceBountyBoard.sol   # Complete this (PART 1)
│   └── DecentralisedRaffle.sol    # Complete this (PART 2)
├── test/
│   └── example.test.js            # Worked example - write yours alongside it
├── grading/                       # The marking suite. Read it; don't edit it.
├── PartA_MCQ_Answers.md           # 8 questions
├── PartB_Design.md                # Your design decisions
├── PartB_Tests.md                 # Your test plan
├── hardhat.config.js
└── docs/
    ├── SOLIDITY-PATTERNS.md       # Code patterns you will need. Start here.
    ├── SOLCURITY.md               # Security checklist (reference, optional)
    ├── GIT-WORKFLOW.md
    └── RESOURCES.md
```

---

## Tips

- **Read `docs/SOLIDITY-PATTERNS.md` before you start coding.** Checks-effects-
  interactions, access control, and events are all in there with working code.
- **Read the grading tests.** They are the spec. Nothing is hidden from you.
- **Compile often.** A contract that does not compile scores zero on all 40 code
  marks, no matter how good the logic is.
- **Commit every 15-30 minutes.** We read your commit history to understand how
  you work, and it triggers a fresh score each time.
- **Be honest in the written sections.** "I ran out of time and here is what I
  would have done" earns marks. Overclaiming loses them.

**All the best.**
