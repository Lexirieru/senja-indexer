import { Address } from "@graphprotocol/graph-ts";
import { LendingPool as LendingPoolFactory } from "../../../generated/LendingPoolFactory/LendingPool";
import { FACTORY_ADDRESS } from "../constants";

export function readTokenDataStreamAddress(): Address | null {
  let factoryContract = LendingPoolFactory.bind(FACTORY_ADDRESS);
  let result = factoryContract.try_tokenDataStream();
  if (result.reverted) return null;
  return result.value;
}
