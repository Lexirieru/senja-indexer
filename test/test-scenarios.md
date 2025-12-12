# Test Scenarios

## Scenario 1: Initial Pool State (No Borrows)

**Condition:** Pool has supply but no borrows

**Expected Results:**
| Field | Expected Value | Reason |
|-------|---------------|--------|
| `supplyAssets` | > 0 | Users have supplied |
| `borrowAssets` | 0 | No borrows yet |
| `utilizationRate` | 0 | 0 / supplyAssets = 0 |
| `borrowAPY` | 0 or base rate | Depends on interest model |
| `supplyAPY` | 0 | No interest from borrowers |

**Current Status:** ✅ Working as expected

---

## Scenario 2: After First Borrow

**Condition:** User borrows from pool

**Expected Results:**
| Field | Expected Value | Reason |
|-------|---------------|--------|
| `borrowAssets` | > 0 | User borrowed |
| `utilizationRate` | > 0 | borrowAssets / supplyAssets |
| `borrowAPY` | > 0 | Rate increases with utilization |
| `supplyAPY` | > 0 | Suppliers earn interest |

**Query to verify:**
```graphql
{
  pools {
    id
    supplyAssets
    borrowAssets
    utilizationRate
    borrowAPY
    supplyAPY
  }
}
```

---

## Scenario 3: High Utilization

**Condition:** borrowAssets close to supplyAssets

**Expected Results:**
| Field | Expected Value | Reason |
|-------|---------------|--------|
| `utilizationRate` | ~8000-9000 (80-90%) | High utilization |
| `borrowAPY` | High | Rate curve increases |
| `supplyAPY` | High | More interest distributed |
| `liquidity` | Low | supplyAssets - borrowAssets |

---

## Scenario 4: Repay Debt

**Condition:** User repays borrowed amount

**Expected Results:**
| Field | Change | Reason |
|-------|--------|--------|
| `borrowAssets` | ↓ Decrease | Debt repaid |
| `utilizationRate` | ↓ Decrease | Less borrowed |
| `borrowAPY` | ↓ Decrease | Lower utilization |
| `liquidity` | ↑ Increase | More available |

---

## Scenario 5: Withdraw Liquidity

**Condition:** User withdraws supplied liquidity

**Expected Results:**
| Field | Change | Reason |
|-------|--------|--------|
| `supplyAssets` | ↓ Decrease | Supply withdrawn |
| `utilizationRate` | ↑ Increase | Same borrow, less supply |
| `borrowAPY` | ↑ Increase | Higher utilization |
| `liquidity` | ↓ Decrease | Less available |

---

## APY Calculation Reference

**Utilization Rate:**
```
utilizationRate = borrowAssets / supplyAssets * 100%
```

**Borrow Rate (typical curve):**
```
if utilization <= 80%:
  borrowRate = baseRate + (utilization * slope1)
else:
  borrowRate = baseRate + (80% * slope1) + ((utilization - 80%) * slope2)
```

**Supply Rate:**
```
supplyRate = borrowRate * utilizationRate * (1 - reserveFactor)
```

---

## On-Chain Test Steps

### Step 1: Query Initial State
```graphql
{
  pools {
    id
    borrowAssets
    supplyAssets
    borrowAPY
    supplyAPY
    utilizationRate
  }
}
```

### Step 2: Perform Borrow Transaction
- Connect wallet to dApp
- Select pool
- Borrow amount

### Step 3: Wait for Subgraph Sync
- Wait ~30-60 seconds for Goldsky to index new block

### Step 4: Query Updated State
```graphql
{
  pools {
    id
    borrowAssets
    supplyAssets
    borrowAPY
    supplyAPY
    utilizationRate
  }
  debtBorrowedEvents(first: 1, orderBy: timestamp, orderDirection: desc) {
    amount
    timestamp
    transactionHash
  }
}
```

### Step 5: Verify
- `borrowAssets` increased
- `utilizationRate` > 0
- `borrowAPY` > 0 (maybe)
- `supplyAPY` > 0 (maybe)
