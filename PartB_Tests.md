# Part B: Test Scenarios Guide

**Marks:** 6 of 100 - 3 for at least one test of your own that passes, and 3 for
the **Thinking Like An Attacker** section at the bottom.

The auto-marker already runs its own test suite against your contracts. This
section is about whether *you* can think like a tester.

**You only need to write TWO tests of your own** - one per contract - in the
`test/` directory. There is a worked example in `test/example.test.js` you can
copy from. Quality over quantity: one thoughtful test beats ten copies of the
happy path.

Run them with:

```bash
npx hardhat test
```

---

## Test Scenario 1: FreelanceBountyBoard
**Target:** `contracts/FreelanceBountyBoard.sol`

### 1.1 The test I wrote

- **Test file and name:**
- **What it checks:**
- **Steps:**
- **Expected result:**
- **Does it pass?** [yes / no / partly]

### 1.2 A scenario I did NOT have time to test

Describe one thing that could go wrong with this contract that neither you nor
the auto-marker checked. You do not have to write the code - just show you can
see the gap.

[Write your response here]

---

## Test Scenario 2: DecentralisedRaffle
**Target:** `contracts/DecentralisedRaffle.sol`

### 2.1 The test I wrote

- **Test file and name:**
- **What it checks:**
- **Steps:**
- **Expected result:**
- **Does it pass?** [yes / no / partly]

### 2.2 The hard one

Testing a raffle is awkward because the winner changes every run. **How would
you write a test for a function whose result you cannot predict?** What can you
assert that is true no matter who wins?

(Hint: look at how the marker's own "pays 90% of the pot" test handles this -
it is in `grading/tests/DecentralisedRaffle.grading.test.js` and you are welcome
to read it.)

[Write your response here]

---

## Thinking Like An Attacker (3 marks)

Pick **one** of your two contracts. If you wanted to steal from it or break it,
what would you try first?

- **Contract:**
- **My attack:**
- **Does it work against my implementation?** [yes / no / not sure]
- **If it works, what would fix it?**

An honest "yes, this attack works against my code, and here is the fix" scores
full marks here. Claiming your contract is perfect scores nothing.

[Write your response here]

---

## Checklist

- [ ] At least one test of my own in `test/`
- [ ] `npx hardhat test` runs without crashing
- [ ] I filled in the attacker section above
