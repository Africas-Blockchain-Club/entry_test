# Solidity Security Patterns

**Essential security patterns for smart contract development**

---

## 1. Checks-Effects-Interactions Pattern

**Problem:** Reentrancy attacks can drain contract funds

**Solution:** Always follow this order:
1. **Checks** - Validate conditions
2. **Effects** - Update state
3. **Interactions** - Call external contracts

### Bad Example (Vulnerable)

```solidity
function withdraw(uint256 amount) public {
    // Interaction BEFORE state change = VULNERABLE!
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
    
    balances[msg.sender] -= amount;  // Too late!
}
```

### Good Example (Secure)

```solidity
function withdraw(uint256 amount) public {
    // 1. CHECKS
    require(balances[msg.sender] >= amount, "Insufficient balance");
    
    // 2. EFFECTS
    balances[msg.sender] -= amount;
    
    // 3. INTERACTIONS
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
}
```

---

## 2. Access Control

**Problem:** Anyone can call sensitive functions

**Solution:** Use modifiers to restrict access

### Basic Owner Pattern

```solidity
address public owner;

constructor() {
    owner = msg.sender;
}

modifier onlyOwner() {
    require(msg.sender == owner, "Not authorized");
    _;
}

function sensitiveFunction() public onlyOwner {
    // Only owner can call this
}
```

### Role-Based Access Control

```solidity
mapping(address => bool) public admins;

modifier onlyAdmin() {
    require(admins[msg.sender], "Not admin");
    _;
}

function addAdmin(address newAdmin) public onlyOwner {
    admins[newAdmin] = true;
}
```

---

## 3. Input Validation

**Problem:** Invalid inputs can break contract logic

**Solution:** Always validate inputs with `require`

### Examples

```solidity
function registerWorker(string memory skill) public {
    // Validate non-empty string
    require(bytes(skill).length > 0, "Skill cannot be empty");
    require(bytes(skill).length <= 50, "Skill name too long");
    
    // Validate not already registered
    require(!isRegistered[msg.sender], "Already registered");
    
    // Now safe to proceed
    workers[msg.sender] = skill;
    isRegistered[msg.sender] = true;
}

function postGig(string memory description) public payable {
    // Validate payment
    require(msg.value > 0, "Must send ETH");
    require(msg.value >= MIN_GIG_AMOUNT, "Amount too low");
    
    // Validate description
    require(bytes(description).length > 0, "Description required");
    
    // Proceed...
}
```

---

## 4. Reentrancy Guard

**Problem:** Reentrancy attacks via fallback functions

**Solution:** Use a mutex lock

### Implementation

```solidity
bool private locked;

modifier noReentrancy() {
    require(!locked, "No reentrancy");
    locked = true;
    _;
    locked = false;
}

function withdraw(uint256 amount) public noReentrancy {
    require(balances[msg.sender] >= amount);
    balances[msg.sender] -= amount;
    
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
}
```

### Using OpenZeppelin

```solidity
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MyContract is ReentrancyGuard {
    function withdraw(uint256 amount) public nonReentrant {
        // Safe from reentrancy
    }
}
```

---

## 5. Circuit Breaker (Pause)

**Problem:** Need emergency stop in case of attack

**Solution:** Implement pause/unpause functionality

### Implementation

```solidity
bool public paused;

modifier whenNotPaused() {
    require(!paused, "Contract is paused");
    _;
}

modifier whenPaused() {
    require(paused, "Contract is not paused");
    _;
}

function pause() public onlyOwner whenNotPaused {
    paused = true;
    emit Paused(msg.sender);
}

function unpause() public onlyOwner whenPaused {
    paused = false;
    emit Unpaused(msg.sender);
}

function enter() public payable whenNotPaused {
    // Only works when not paused
}
```

---

## 6. Safe Math (Overflow Prevention)

**Problem:** Integer overflow/underflow

**Solution:** Use Solidity 0.8+ (built-in checks) or SafeMath

### Solidity 0.8+ (Automatic)

```solidity
// Solidity 0.8+ automatically checks for overflow
uint256 balance = 100;
balance += 200;  // Safe!
balance -= 50;   // Safe!
```

### Explicit Unchecked (Use Carefully)

```solidity
// Only use unchecked when you're SURE it's safe
unchecked {
    counter++;  // Slightly cheaper gas, but no overflow protection
}
```

---

## 7. Pull Over Push (Withdrawal Pattern)

**Problem:** Sending ETH can fail and block execution

**Solution:** Let users withdraw instead of pushing payments

###  Bad (Push Pattern)

```solidity
function distributeRewards(address[] memory winners) public {
    for (uint i = 0; i < winners.length; i++) {
        // If one fails, all fail!
        payable(winners[i]).transfer(reward);
    }
}
```

### Good (Pull Pattern)

```solidity
mapping(address => uint256) public pendingWithdrawals;

function recordWinner(address winner, uint256 amount) internal {
    pendingWithdrawals[winner] += amount;
}

function withdraw() public {
    uint256 amount = pendingWithdrawals[msg.sender];
    require(amount > 0, "No funds");
    
    pendingWithdrawals[msg.sender] = 0;
    
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
}
```

---

## 8. Events for Transparency

**Problem:** Hard to track contract activity

**Solution:** Emit events for important actions

### Best Practices

```solidity
// Define events
event WorkerRegistered(address indexed worker, string skill);
event GigPosted(uint256 indexed gigId, address indexed employer, uint256 bounty);
event PaymentReleased(uint256 indexed gigId, address indexed worker, uint256 amount);

function registerWorker(string memory skill) public {
    workers[msg.sender] = skill;
    
    // Emit event
    emit WorkerRegistered(msg.sender, skill);
}

function approveAndPay(uint256 gigId, address worker) public {
    // ... payment logic
    
    emit PaymentReleased(gigId, worker, amount);
}
```

---

## 9. Gas Optimisation

### Use `calldata` for Read-Only Arrays

```solidity
// Expensive
function process(uint256[] memory data) public {
    // ...
}

// Cheaper
function process(uint256[] calldata data) public {
    // ...
}
```

### Pack Storage Variables

```solidity
// Bad (uses 3 storage slots)
struct Gig {
    uint256 bounty;      // 32 bytes
    address employer;    // 20 bytes
    bool isActive;       // 1 byte
}

// Good (uses 2 storage slots)
struct Gig {
    address employer;    // 20 bytes
    bool isActive;       // 1 byte  } Same slot!
    uint88 bounty;       // 11 bytes } 
}
```

---

## 10. Consuming an Oracle Safely

**Problem:** The chain cannot see off-chain truth. A price has to be delivered by
an external contract, and that contract can be stale, wrong, or unavailable.

### Bad Example (spot price as oracle)

```solidity
// Manipulable with a flash loan in a single transaction. Solcurity D3.
function ethPrice() public view returns (uint256) {
    (uint112 r0, uint112 r1, ) = pair.getReserves();
    return (uint256(r1) * 1e18) / uint256(r0);
}
```

### Good Example (decentralised feed, validated)

```solidity
uint256 private constant MAX_FEED_AGE = 3 hours;

function getPrice() public view returns (uint256) {
    (, int256 answer, , uint256 updatedAt, ) = priceFeed.latestRoundData();

    // D1/D5: never trust the return values blindly
    if (answer <= 0) revert InvalidPrice();
    if (block.timestamp - updatedAt > MAX_FEED_AGE) revert StalePrice();

    // Feed reports 8 decimals; scale to 18 to match wei. C24: scale, then divide.
    return uint256(answer) * 1e10;
}
```

Pick `MAX_FEED_AGE` from the feed's published heartbeat, not from intuition.

---

## 11. Randomness

**Problem:** Every value on-chain is public and deterministic. Anything you can
read, an attacker read first.

### Bad Example (SWC-120, Solcurity C9)

```solidity
// The proposer can withhold or reorder the block. Any caller can compute
// the same value in the same block and only enter when it favours them.
uint256 winner = uint256(
    keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender))
) % players.length;
```

### Good Options

1. **Verifiable randomness (Chainlink VRF)** - request in one transaction,
   receive in a callback. Lock the contract into a `CALCULATING` state between
   the two so nobody can enter once the request is in flight.
2. **Commit-reveal** - participants submit `keccak256(secret, salt)` first, then
   reveal. Combine the revealed secrets. Requires a penalty for non-revealers,
   or the last revealer can decide the outcome by staying silent.

Never mix a manipulable source into an otherwise sound one and assume the sound
half wins.

---

## 12. Common Vulnerabilities Checklist

### Before Submitting, Check:

- [ ] Used checks-effects-interactions pattern (`F6`)
- [ ] All privileged functions carry the right modifier (`F9`)
- [ ] All inputs validated, even from trusted callers (`F5`)
- [ ] No reentrancy vulnerabilities; lock documented if used (`X3`, `X4`, `C48`)
- [ ] Events emitted for every storage mutation, actors indexed (`T2`, `E2`)
- [ ] Used `call` instead of `transfer`, and checked the return (`C33`, `X5`)
- [ ] Randomness is not derived from block data (`C9`)
- [ ] External/oracle return values sanity-checked (`D1`, `D5`)
- [ ] Multiply before divide; rounding direction justified (`C24`, `C47`)
- [ ] No unbounded loops or arrays (`C3`)
- [ ] `constant`/`immutable` used where possible (`V2`, `V3`)
- [ ] Tested with edge cases, plus at least one adversarial test (`P2`, `P3`)

---

## Quick Security Reference

| Vulnerability | Protection | Solcurity |
|--------------|------------|-----------|
| Reentrancy | Checks-Effects-Interactions + ReentrancyGuard | `F6`, `C48` |
| Unauthorized access | `onlyOwner` / role modifier | `F9`, `C32` |
| Integer overflow | Solidity 0.8+ checked math | `C1` |
| Failed transfers | Use `call` + check return value | `C33`, `X5` |
| Denial of service | Pull over push; bound your loops | `C26`, `C3` |
| Predictable randomness | VRF or commit-reveal | `C9` |
| Price manipulation | Decentralised feed + staleness checks | `D3`, `D5` |
| Front-running | Commit-reveal scheme | `F7` |

---

## Additional Resources

- [The Solcurity Standard](https://github.com/transmissions11/solcurity) - the checklist this assessment marks against
- [Cyfrin Updraft](https://updraft.cyfrin.io/) - Blockchain Basics and Solidity courses
- [Solidity Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [SWC Registry](https://swcregistry.io/) - Smart Contract Weakness Classification
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/) - Audited implementations

---

**Remember:** Security is not optional. Every vulnerability can cost real money!
