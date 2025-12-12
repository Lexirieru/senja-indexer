import { BigInt, Address } from "@graphprotocol/graph-ts";
import { PoolRouter } from "../../../generated/templates/LendingPool/PoolRouter";

export function readTotalBorrowShares(routerAddress: Address): BigInt | null {
  let contract = PoolRouter.bind(routerAddress);
  let result = contract.try_totalBorrowShares();
  return result.reverted ? null : result.value;
}
