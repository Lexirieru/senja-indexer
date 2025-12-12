import { BigInt, Address } from "@graphprotocol/graph-ts";
import { PoolRouter } from "../../../generated/templates/LendingPool/PoolRouter";

export function readUtilizationRate(routerAddress: Address): BigInt | null {
  let contract = PoolRouter.bind(routerAddress);
  let result = contract.try_getUtilizationRate();
  return result.reverted ? null : result.value;
}
