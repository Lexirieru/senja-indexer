import { BigInt, Address } from "@graphprotocol/graph-ts";
import { PoolRouter } from "../../../generated/templates/LendingPool/PoolRouter";

export function readTotalBorrowAssets(routerAddress: Address): BigInt | null {
  let contract = PoolRouter.bind(routerAddress);
  let result = contract.try_totalBorrowAssets();
  return result.reverted ? null : result.value;
}
