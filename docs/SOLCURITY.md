# Using the Solcurity Standard in This Assessment

[The Solcurity Standard](https://github.com/transmissions11/solcurity) is an
opinionated security and code-quality checklist for Solidity, derived from work
by BoringCrypto, Mudit Gupta, Runtime Verification and ConsenSys Diligence. It
is the reference this assessment marks against.

Each item has a stable ID. **Cite the ID whenever you make a security claim.**

| Prefix | Section | Example |
|---|---|---|
| `V` | Variables | `V3` - Can it be `immutable`? |
| `S` | Structs | `S2` - Are its fields packed together? |
| `F` | Functions | `F6` - Is checks-before-effects followed? (SWC-107) |
| `M` | Modifiers | `M1` - Are no storage updates made? |
| `C` | Code | `C9` - Don't use `blockhash()` for randomness (SWC-120) |
| `X` | External calls | `X3` - Would it be harmful if the call reentered? |
| `E` | Events | `E2` - Is the actor included as an indexed field? |
| `T` | Contract | `T2` - Are events emitted for every storage mutation? |
| `P` | Project | `P5` - Run Slither/Solhint and review all findings |
| `D` | DeFi | `D3` - Don't use an AMM spot price as an oracle |

---

## The Review Approach Solcurity Recommends

Apply this to your own code before you submit:

1. Read the spec (this repo's README) and build a mental model of what the
   contracts should look like **before** reading the skeletons.
2. Skim for architecture. Note anything surprising.
3. Write a threat model: who are the actors, and what does each of them want?
4. Walk backward from every point where value moves - `call`, `transfer`,
   `send`, `delegatecall`, `selfdestruct` - and confirm each is guarded.
5. Check every external-contract interaction and the assumptions behind it.
6. Do a line-by-line pass.
7. Re-review from the perspective of each actor in your threat model.
8. Look at your test coverage and go deeper where it is thin.
9. Run Slither/Solhint and review the output.

---

## The Items That Matter Most Here

These are the ones this assessment is built around. Knowing them is the point.

**Value transfer and reentrancy**

- `F6` - checks before effects (SWC-107)
- `X3`, `X4` - harm from reentry into this or another function
- `C48` - document why a reentrancy lock is needed
- `C33` - use `call{value: ...}("")`, not `transfer`/`send` (SWC-134)
- `C26` - a recipient with a reverting fallback can cause DoS (SWC-113)
- `X5` - check the result of the call and handle errors (SWC-104)

**Randomness and time**

- `C9` - never use `blockhash()` and friends for randomness (SWC-120)
- `C4` - `block.timestamp` only for long intervals (SWC-116)
- `C5` - never use `block.number` as elapsed time
- `C16` - private data is not private (SWC-136)

**Oracles and external data**

- `D1` - check your assumptions about what other contracts return
- `D3` - no AMM spot prices as oracles
- `D5` - sanity checks against price manipulation
- `X2` - a reverting external call can cause DoS

**Arithmetic**

- `C24` - always multiply before dividing
- `C47` - where precision is lost, ensure it benefits the right actor, and
  document it
- `C44` - `unchecked` only where over/underflow is impossible; comment the saving
- `C22`, `C23` - comparison and logical operators, off-by-one

**Access control and validation**

- `F5` - validate all parameters, even from trusted callers
- `F9` - correct modifiers applied
- `C32` - never use `tx.origin` for authorisation (SWC-115)
- `F17` - use an explicit `initialized` flag, not `owner == address(0)`

**Gas and DoS**

- `C3` - unbounded loops and arrays (SWC-128)
- `V2`, `V3` - `constant` and `immutable`
- `V6`, `V7` - storage packing
- `C2` - repeated reads of the same storage slot

**Events and documentation**

- `T2` - emit an event for every storage-mutating function
- `E1`, `E2`, `E5` - index the actors and IDs you will need to query on
- `C39` - comment the "why", not the "what"
- `F14` - if a function is intentionally unsafe, give it an unwieldy name

**Project hygiene**

- `P2` - unit test everything
- `P3` - fuzz as much as possible
- `P5` - run Slither/Solhint and review every finding

---

## What "Applying" the Checklist Looks Like

Not this:

> I made the contract secure and followed best practices.

This:

> `withdraw` sends ETH with `call` and checks the returned bool (`C33`, `X5`).
> State is zeroed before the call, so reentry finds an empty balance (`F6`). I
> did not add a `nonReentrant` lock because the only external call is the last
> statement and no other function reads the balance mid-flight - if I added a
> second payout path I would add the lock and document it (`C48`).

And this, which also scores:

> `pickWinner_UNSAFE_BlockHashRandomness` (`F14`) derives the index from
> `block.prevrandao`. A validator proposing the block can withhold or reorder to
> influence the draw (`C9`). With more time I would move to Chainlink VRF with a
> request/fulfil split and a CALCULATING state that blocks entries in between.

---

## Full Checklist

The complete Solcurity Standard, with every item, is at
<https://github.com/transmissions11/solcurity>. Read it in full before you start
reviewing your own code - it takes about fifteen minutes and it is the single
highest-leverage thing you can do in this assessment.
