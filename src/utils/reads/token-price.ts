import { BigInt, Address } from "@graphprotocol/graph-ts";
import { TokenDataStream } from "../../../generated/templates/LendingPool/TokenDataStream";

export function readTokenPrice(oracleAddress: Address, tokenAddress: Address): BigInt | null {
  let contract = TokenDataStream.bind(oracleAddress);
  let result = contract.try_latestRoundData(tokenAddress);
  return result.reverted ? null : result.value.value1;
}
