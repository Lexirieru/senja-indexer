import { BigInt, Address } from "@graphprotocol/graph-ts";
import { Pool, PoolMetrics } from "../../generated/schema";
import { syncPoolFromContract, ZERO_ADDRESS } from "../utils";

export function updatePoolAPY(
  pool: Pool,
  timestamp: BigInt,
  blockNumber: BigInt
): void {
  let routerAddress = Address.fromBytes(pool.router);
  
  if (!routerAddress.equals(ZERO_ADDRESS)) {
    syncPoolFromContract(pool, routerAddress);
  }

  pool.lastAccruedAt = timestamp;

  let snapshotId = pool.id + "-" + timestamp.toString();
  let snapshot = new PoolMetrics(snapshotId);
  snapshot.pool = pool.id;
  snapshot.supplyAPY = pool.supplyAPY;
  snapshot.borrowAPY = pool.borrowAPY;
  snapshot.utilizationRate = pool.utilizationRate;
  snapshot.supplyAssets = pool.supplyAssets;
  snapshot.borrowAssets = pool.borrowAssets;
  snapshot.timestamp = timestamp;
  snapshot.blockNumber = blockNumber;
  snapshot.save();

  pool.save();
}
