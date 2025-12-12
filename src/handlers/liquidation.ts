import { Liquidation as LiquidationEvent } from "../../generated/templates/LendingPool/LendingPool";
import { PositionLiquidatedEvent } from "../../generated/schema";
import { createEventID, getOrCreatePool, getOrCreateUser } from "../utils";

export function handleLiquidation(event: LiquidationEvent): void {
  let pool = getOrCreatePool(event.address);
  let borrower = getOrCreateUser(event.params.borrower);
  let liquidation = new PositionLiquidatedEvent(createEventID(event));

  liquidation.borrower = borrower.id;
  liquidation.pool = pool.id;
  liquidation.borrowToken = event.params.borrowToken;
  liquidation.collateralToken = event.params.collateralToken;
  liquidation.borrowAssets = event.params.userBorrowAssets;
  liquidation.borrowerCollateral = event.params.borrowerCollateral;
  liquidation.liquidationAllocation = event.params.liquidationAllocation;
  liquidation.collateralToLiquidator = event.params.collateralToLiquidator;
  liquidation.timestamp = event.block.timestamp;
  liquidation.blockNumber = event.block.number;
  liquidation.transactionHash = event.transaction.hash;
  liquidation.save();
}
