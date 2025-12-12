import { BigInt } from "@graphprotocol/graph-ts";
import { LendingPoolCreated as LendingPoolCreatedEvent } from "../../generated/LendingPoolFactory/LendingPoolFactory";
import { PoolCreatedEvent } from "../../generated/schema";
import { LendingPool as LendingPoolTemplate } from "../../generated/templates";
import { createEventID, getOrCreateFactory, getOrCreatePool } from "../utils";

export function handlePoolCreated(event: LendingPoolCreatedEvent): void {
  let factory = getOrCreateFactory(event.address);
  let pool = getOrCreatePool(event.params.lendingPool);
  let poolCreated = new PoolCreatedEvent(createEventID(event));

  factory.poolCount = factory.poolCount.plus(BigInt.fromI32(1));
  factory.save();

  pool.factory = factory.id;
  pool.collateralToken = event.params.collateralToken;
  pool.borrowToken = event.params.borrowToken;
  pool.createdAt = event.block.timestamp;
  pool.save();

  poolCreated.pool = event.params.lendingPool;
  poolCreated.collateralToken = event.params.collateralToken;
  poolCreated.borrowToken = event.params.borrowToken;
  poolCreated.ltv = event.params.ltv;
  poolCreated.timestamp = event.block.timestamp;
  poolCreated.blockNumber = event.block.number;
  poolCreated.transactionHash = event.transaction.hash;
  poolCreated.save();

  LendingPoolTemplate.create(event.params.lendingPool);
}
