import { BigInt, Address } from "@graphprotocol/graph-ts";
import { Pool, UserPoolBalance } from "../../../generated/schema";
import { getTokenSymbol } from "../tokens";

export function getOrCreateUserPoolBalance(
  userId: string,
  pool: Pool,
  timestamp: BigInt
): UserPoolBalance {
  let balanceId = userId + "-" + pool.id;
  let balance = UserPoolBalance.load(balanceId);
  if (balance == null) {
    balance = new UserPoolBalance(balanceId);
    balance.user = userId;
    balance.pool = pool.id;
    
    balance.borrowToken = pool.borrowToken;
    balance.borrowTokenSymbol = getTokenSymbol(Address.fromBytes(pool.borrowToken));
    balance.collateralToken = pool.collateralToken;
    balance.collateralTokenSymbol = getTokenSymbol(Address.fromBytes(pool.collateralToken));
    
    balance.currentSupplyAssets = BigInt.fromI32(0);
    balance.currentSupplyShares = BigInt.fromI32(0);
    balance.currentBorrowAssets = BigInt.fromI32(0);
    balance.currentBorrowShares = BigInt.fromI32(0);
    balance.currentCollateral = BigInt.fromI32(0);
    
    balance.healthFactor = BigInt.fromI32(0);
    balance.ltv = BigInt.fromI32(0);
    balance.collateralValue = BigInt.fromI32(0);
    
    balance.createdAt = timestamp;
    balance.lastUpdated = timestamp;
  }
  return balance as UserPoolBalance;
}
