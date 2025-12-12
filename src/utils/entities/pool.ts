import { BigInt, Address } from "@graphprotocol/graph-ts";
import { Pool } from "../../../generated/schema";
import { ZERO_ADDRESS } from "../constants";
import { readRouterAddress } from "../reads";
import { getOrCreateFactory } from "./factory";

export function getOrCreatePool(poolAddress: Address): Pool {
  let pool = Pool.load(poolAddress.toHexString());
  if (pool == null) {
    let factory = getOrCreateFactory(ZERO_ADDRESS);
    
    pool = new Pool(poolAddress.toHexString());
    pool.address = poolAddress;
    pool.factory = factory.id;
    
    let routerAddress = readRouterAddress(poolAddress);
    pool.router = routerAddress !== null ? routerAddress : ZERO_ADDRESS;
    
    pool.collateralToken = ZERO_ADDRESS;
    pool.borrowToken = ZERO_ADDRESS;
    pool.ltv = BigInt.fromI32(0);
    
    pool.depositsTotal = BigInt.fromI32(0);
    pool.withdrawalsTotal = BigInt.fromI32(0);
    pool.borrowsTotal = BigInt.fromI32(0);
    pool.repaysTotal = BigInt.fromI32(0);
    pool.swapsTotal = BigInt.fromI32(0);
    pool.depositsCurrent = BigInt.fromI32(0);
    pool.withdrawalsCurrent = BigInt.fromI32(0);
    pool.borrowsCurrent = BigInt.fromI32(0);
    pool.repaysCurrent = BigInt.fromI32(0);
    pool.swapsCurrent = BigInt.fromI32(0);
    
    pool.supplyAssets = BigInt.fromI32(0);
    pool.supplyShares = BigInt.fromI32(0);
    pool.liquidity = BigInt.fromI32(0);
    pool.borrowAssets = BigInt.fromI32(0);
    pool.borrowShares = BigInt.fromI32(0);
    pool.utilizationRate = BigInt.fromI32(0);
    pool.supplyAPY = BigInt.fromI32(0);
    pool.borrowAPY = BigInt.fromI32(0);
    pool.supplyRate = BigInt.fromI32(0);
    pool.borrowRate = BigInt.fromI32(0);
    pool.lastAccruedAt = BigInt.fromI32(0);
    pool.createdAt = BigInt.fromI32(0);
    pool.save();
  }
  return pool as Pool;
}
