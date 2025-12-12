import { Address } from "@graphprotocol/graph-ts";
import { LendingPool } from "../../../generated/templates/LendingPool/LendingPool";

export function readRouterAddress(lendingPoolAddress: Address): Address | null {
  let contract = LendingPool.bind(lendingPoolAddress);
  let result = contract.try_router();
  return result.reverted ? null : result.value;
}
