import { BigInt, Address } from "@graphprotocol/graph-ts";
import { PoolRouter } from "../../../generated/templates/LendingPool/PoolRouter";

export function readUserBorrowShares(routerAddress: Address, userAddress: Address): BigInt | null {
  let contract = PoolRouter.bind(routerAddress);
  let result = contract.try_userBorrowShares(userAddress);
  return result.reverted ? null : result.value;
}
