import { ethereum } from "@graphprotocol/graph-ts";

/**
 * Create a unique event ID from block number and log index
 * @param event - The ethereum event
 * @returns Unique event ID string
 */
export function createEventID(event: ethereum.Event): string {
  return event.block.number
    .toString()
    .concat("-")
    .concat(event.logIndex.toString());
}
