// Router event handlers (placeholder file)
// Most events are now handled in lending-pool-handlers.ts

import { createEventID, getOrCreateUser } from "./utils";

// Router event handlers will be added here when Router ABI events are available
// These are placeholders based on the schema

/*
export function handleEmergencyPositionReset(event: EmergencyPositionResetEvent): void {
  let user = getOrCreateUser(event.params.user);
  let emergencyPositionReset = new EmergencyPositionReset(createEventID(event));
  
  emergencyPositionReset.user = user.id;
  emergencyPositionReset.router = event.address;
  emergencyPositionReset.timestamp = event.block.timestamp;
  emergencyPositionReset.blockNumber = event.block.number;
  emergencyPositionReset.transactionHash = event.transaction.hash;
  emergencyPositionReset.save();
}

export function handlePositionLiquidated(event: PositionLiquidatedEvent): void {
  let user = getOrCreateUser(event.params.user);
  let positionLiquidated = new PositionLiquidatedEvent(createEventID(event));
  
  positionLiquidated.user = user.id;
  positionLiquidated.router = event.address;
  positionLiquidated.sharesRemoved = event.params.sharesRemoved;
  positionLiquidated.debtRepaid = event.params.debtRepaid;
  positionLiquidated.timestamp = event.block.timestamp;
  positionLiquidated.blockNumber = event.block.number;
  positionLiquidated.transactionHash = event.transaction.hash;
  positionLiquidated.save();
}
*/