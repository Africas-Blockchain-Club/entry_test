# Blockchain Developer Entry Test (3-Hour Challenge)

Welcome. You have **3 hours**.

This test assumes you have worked through **[Cyfrin Updraft - Blockchain
Basics](https://updraft.cyfrin.io/courses/blockchain-basics)** and have written
some Solidity. Nothing here goes beyond that. There are no oracles to integrate,
no Chainlink VRF, no Foundry - just Hardhat, two straightforward contracts, and
eight multiple-choice questions drawn directly from the course.

> [!IMPORTANT]
> **Read this whole file before you write any code.** It is not long, and
> everything you need is in it. Following instructions precisely is part of what
> is being assessed - the marker reads specific lines in specific files, and if
> you change their shape it cannot award you the marks.

---

## Do these eight steps, in this order

| # | Step | Time |
|---|---|---|
| 1 | Fork this repo and **turn on Actions in your fork** | 2 min |
| 2 | Clone your fork and install | 5 min |
| 3 | Check the toolchain works | 2 min |
| 4 | Answer Part A - all 8 questions **and** the reasoning boxes | 40 min |
| 5 | Build `FreelanceBountyBoard.sol`, pushing as you go | 55 min |
| 6 | Build `DecentralisedRaffle.sol`, pushing as you go | 50 min |
| 7 | Fill in `PartB_Design.md` and `PartB_Tests.md`, write your own test | 20 min |
| 8 | Final push, then check your score in the Actions tab | 5 min |

Each step is spelled out below. **Do not skip step 1** - without it you get no
score all morning.

---

### Step 1: Fork, then turn on Actions

Fork this repository to your own GitHub account.

> [!CAUTION]
> **GitHub switches off Actions in every new fork.** Until you turn them back
> on, nothing is marked and you will see no score all morning. Nobody can do
> this for you.
>
> 1. Open **your fork** on github.com - the copy under **your own username**,
>    not this one.
> 2. Click the **Actions** tab, along the top next to Code, Issues and Pull
>    requests.
> 3. A yellow banner appears: *"Workflows aren't being run on this forked
>    repository."*
> 4. Click the green button: **"I understand my workflows, go ahead and enable
>    them."**
>
> Once, at the start. Every push after that is marked automatically. If there is
> no banner, Actions are already on - push something and check a run appears.

### Step 2: Clone your fork and install

```bash
git clone [YOUR_FORK_URL]
cd entry_test
npm install
```

Clone **your fork**, not this repository. If you clone this one you cannot push,
and nothing you write will ever be marked.

### Step 3: Check the toolchain works

```bash
npx hardhat compile
```

It must print **"Compiled 2 Solidity files successfully"**. If it does, you are
set up - everything else is already configured.

`npx hardhat test` will **fail** right now, and that is correct: the skeletons
are empty, so the example tests have nothing to pass against. They turn green as
you implement.

### Step 4: Part A - the eight questions (40 marks)

Open **`PartA_MCQ_Answers.md`**. Eight questions on blockchain fundamentals:
gas, consensus, oracles, rollups, wallets, and two that feed straight into the
code you are about to write.

**Do this before you code.** Questions 7 and 8 tell you how to build parts of
Part B.

For each question:

1. Put **a single letter** on the `**Your Answer:**` line, exactly like this:

   ```
   **Your Answer:** B
   ```

   No brackets, no explanation on that line. The marker reads that line
   literally - anything else scores zero for the question.

2. Write **two or three sentences** in the reasoning box underneath.

The letters are worth **24 marks**, the reasoning another **16**.

> [!WARNING]
> **Your answers lock on the first push where all eight are filled in.** Decide
> on all eight, then push them together. Changing them afterwards will not
> change your score.

### Step 5: `FreelanceBountyBoard.sol` (part of the 50 code marks)

Register freelancers, post bounties that hold ETH, apply, submit work, approve
and pay. Numbered TODOs are in the file.

> [!WARNING]
> **Do not rename the functions or events.** The marker calls them by their
> exact signatures. Add anything you like alongside them, but leave the given
> ones exactly as they are.

**Commit and push every 15-30 minutes.** Each push re-marks your work and shows
which tests now pass. That is the fastest feedback you will get, and we read
your commit history to understand how you work.

### Step 6: `DecentralisedRaffle.sol` (the rest of the 50 code marks)

Enter with 0.01 ETH, multiple entries allowed, pause and unpause, draw a winner
after 24 hours, split the pot 90/10.

**On the randomness** - you are **allowed** to do this the simple way:

```solidity
uint256 index = uint256(
    keccak256(abi.encodePacked(block.timestamp, block.prevrandao))
) % players.length;
```

It is not secure, and we know it. Doing it properly needs Chainlink VRF, which
is out of scope for three hours. What you **must** do is explain in
`PartB_Design.md` who can manipulate it and how. Understanding why it is broken
is what is being tested, not the ability to fix it. A working shortcut with an
honest explanation scores full marks; the same shortcut described as "secure"
scores zero for that section.

If you are still stuck on `FreelanceBountyBoard.sol` when you reach this step's
time slot, **move on to the raffle anyway**. Partial marks on both contracts
beat one perfect contract and one empty one.

### Step 7: The two documents and your own test (10 marks)

- **`PartB_Design.md`** - its **Randomness** section is worth **4 marks**.
- **`PartB_Tests.md`** - its **Thinking Like An Attacker** section is worth
  **3 marks**.
- **One test of your own** in `test/`, which passes, is worth **3 marks**. Copy
  the pattern from `test/example.test.js`.

> [!IMPORTANT]
> Honesty is marked as a positive here. "I ran out of time and here is what I
> would have done", or "yes, this attack works against my code and here is the
> fix", earns marks. Claiming something is secure when it is not earns zero.

### Step 8: Final push, then check your score

```bash
git add -A
git commit -m "final submission"
git push
```

Then open the **Actions** tab in your fork, click the newest run, and read the
score table on the summary page. Every test is listed with the marks it carries
and, when it fails, the reason.

---

## Marks

Scored out of 100. Everything is marked automatically - there is no human
marker.

| Section | Marks | How it is marked | When |
|---|---|---|---|
| Part A - 8 MCQ letters | 24 | 3 per correct letter | On every push |
| Part A - your reasoning | 16 | 2 per question, read and marked | After you submit |
| Part B - your two contracts | 50 | A test suite, marks shown per test | On every push |
| `PartB_Design.md` randomness section | 4 | Read and marked | After you submit |
| `PartB_Tests.md` attacker section | 3 | Read and marked | After you submit |
| Your own test | 3 | One test file of yours that passes | On every push |

**77 of the 100 marks appear on every push**, so you always know where you
stand. The other 23 are for your written answers and are added after submission.

> [!IMPORTANT]
> **Places are limited and we take the strongest submissions.** There is no
> score at which you can stop and coast - you are measured against the other
> people in the room, so use the full three hours.

> [!IMPORTANT]
> Do not skip the written boxes because they are marked later. A blank box
> scores zero, and there are **23 marks** in them - more than a fifth of the
> assessment. Two or three honest sentences per box is enough.

---

## The Auto-Marker

**Every push to your fork is marked automatically.** A GitHub Action compiles
your contracts, runs the marking test suite, and posts a scored breakdown to the
Actions tab.

Push early and often - a failing test with an error message is the fastest
feedback you will get.

Three things to know:

- **Your MCQ answers lock on the first push that has all eight filled in.** They
  are marked from that commit, so changing them later does nothing.
- **The marking tests live in `grading/`.** You are welcome to read them - they
  are the precise specification for what your contracts must do. Editing them
  achieves nothing: your work is re-marked against the original suite.
- **Your written marks show as "pending"** in your fork and are added after you
  submit.

**Seeing no runs at all?** You skipped Step 1. Go back and enable Actions on
your fork.

**To run the marker locally, exactly as the Action does:**

```bash
npm run build
npx hardhat --config hardhat.grading.config.js test > grading/report.json
npm run grade
```

---

## Prerequisites

- **Node.js v20+** and npm
- **Git** configured (`git config user.name "Your Name"`)
- **VS Code** with a Solidity extension (Juan Blanco or Nomic Foundation)
- A GitHub account

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

Where the assessment asks about testnets, faucets or gas prices (Part A
Question 2, and the deployment sections of `PartB_Design.md`), those are
**written questions**. You answer them in prose. You never have to actually do
it.

---

## File Structure

```
entry_test/
├── contracts/
│   ├── FreelanceBountyBoard.sol   # Complete this (Step 5)
│   └── DecentralisedRaffle.sol    # Complete this (Step 6)
├── test/
│   └── example.test.js            # Worked example - write yours alongside it
├── grading/                       # The marking suite. Read it; don't edit it.
├── PartA_MCQ_Answers.md           # 8 questions (Step 4)
├── PartB_Design.md                # Your design decisions (Step 7)
├── PartB_Tests.md                 # Your test plan (Step 7)
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
- **Compile often.** A contract that does not compile scores zero on all 50 code
  marks, no matter how good the logic is.
- **Commit every 15-30 minutes.** It triggers a fresh score each time, and we
  read your commit history to understand how you work.
- **Finish something in both contracts.** Two partial contracts beat one perfect
  one.
- **Be honest in the written sections.** "I ran out of time and here is what I
  would have done" earns marks. Overclaiming loses them.

**All the best.**
