import { BigInt, Address } from "@graphprotocol/graph-ts";
import { Pool } from "../../generated/schema";
import { SCALED_PERCENTAGE } from "./constants";
import { 
  readTotalSupplyAssets, 
  readTotalBorrowAssets,
  readTotalSupplyShares,
  readTotalBorrowShares,
  readUtilizationRate, 
  readBorrowRate, 
  readSupplyRate,
  readLTV
} from "./reads";

export function syncPoolFromContract(pool: Pool, routerAddress: Address): void {
  let ltv = readLTV(routerAddress);
  if (ltv !== null) pool.ltv = ltv;

  let totalSupplyAssets = readTotalSupplyAssets(routerAddress);
  if (totalSupplyAssets !== null) pool.supplyAssets = totalSupplyAssets;

  let totalBorrowAssets = readTotalBorrowAssets(routerAddress);
  if (totalBorrowAssets !== null) pool.borrowAssets = totalBorrowAssets;

  let totalSupplyShares = readTotalSupplyShares(routerAddress);
  if (totalSupplyShares !== null) pool.supplyShares = totalSupplyShares;

  let totalBorrowShares = readTotalBorrowShares(routerAddress);
  if (totalBorrowShares !== null) pool.borrowShares = totalBorrowShares;

  pool.liquidity = pool.supplyAssets.minus(pool.borrowAssets);

  let utilizationRate = readUtilizationRate(routerAddress);
  if (utilizationRate !== null) pool.utilizationRate = utilizationRate;

  let borrowRate = readBorrowRate(routerAddress);
  if (borrowRate !== null) {
    pool.borrowRate = borrowRate;
    pool.borrowAPY = borrowRate;
  }

  if (borrowRate !== null && utilizationRate !== null) {
    let supplyAPY = borrowRate.times(utilizationRate).div(SCALED_PERCENTAGE);
    pool.supplyRate = supplyAPY;
    pool.supplyAPY = supplyAPY;
  } else {
    let supplyRate = readSupplyRate(routerAddress);
    if (supplyRate !== null) {
      pool.supplyRate = supplyRate;
      pool.supplyAPY = supplyRate;
    }
  }
}
