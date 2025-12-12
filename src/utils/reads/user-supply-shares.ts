import { BigInt, Address } from "@graphprotocol/graph-ts";
import { PoolRouter } from "../../../generated/templates/LendingPool/PoolRouter";

export function readUserSupplyShares(routerAddress: Address, userAddress: Address): BigInt | null {
  let contract = PoolRouter.bind(routerAddress);
  let result = contract.try_userSupplyShares(userAddress);
  return result.reverted ? null : result.value;
}
