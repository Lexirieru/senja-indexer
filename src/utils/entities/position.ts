import { BigInt, Address } from "@graphprotocol/graph-ts";
import { Position } from "../../../generated/schema";

export function getOrCreateUserPosition(
  userId: string,
  positionAddress: Address,
  poolId: string,
  timestamp: BigInt
): Position {
  let positionId = userId + "-" + poolId;
  let userPosition = Position.load(positionId);
  if (userPosition == null) {
    userPosition = new Position(positionId);
    userPosition.user = userId;
    userPosition.pool = poolId;
    userPosition.address = positionAddress;
    userPosition.isActive = true;
    userPosition.createdAt = timestamp;
    userPosition.updatedAt = timestamp;
  }
  return userPosition as Position;
}
