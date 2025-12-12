import { InterestRateModelSet as InterestRateModelSetEvent } from "../../generated/templates/LendingPool/LendingPool";
import { getOrCreatePool } from "../utils";
import { updatePoolAPY } from "./common";

export function handleInterestRateModelSet(event: InterestRateModelSetEvent): void {
  let pool = getOrCreatePool(event.address);
  updatePoolAPY(pool, event.block.timestamp, event.block.number);
}
