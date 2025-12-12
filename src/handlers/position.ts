import { CreatePosition as CreatePositionEvent } from "../../generated/templates/LendingPool/LendingPool";
import { PositionCreatedEvent } from "../../generated/schema";
import { Position as PositionTemplate } from "../../generated/templates";
import { createEventID, getOrCreatePool, getOrCreateUser, getOrCreateUserPosition } from "../utils";

export function handleCreatePosition(event: CreatePositionEvent): void {
  let pool = getOrCreatePool(event.address);
  let user = getOrCreateUser(event.params.user);
  let createPosition = new PositionCreatedEvent(createEventID(event));

  let userPosition = getOrCreateUserPosition(
    user.id,
    event.params.positionAddress,
    pool.id,
    event.block.timestamp
  );
  userPosition.updatedAt = event.block.timestamp;
  userPosition.save();

  createPosition.user = user.id;
  createPosition.pool = pool.id;
  createPosition.position = event.params.positionAddress;
  createPosition.timestamp = event.block.timestamp;
  createPosition.blockNumber = event.block.number;
  createPosition.transactionHash = event.transaction.hash;
  createPosition.save();

  PositionTemplate.create(event.params.positionAddress);
}
