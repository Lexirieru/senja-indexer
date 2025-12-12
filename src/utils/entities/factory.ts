import { BigInt, Address } from "@graphprotocol/graph-ts";
import { PoolFactory } from "../../../generated/schema";

export function getOrCreateFactory(factoryAddress: Address): PoolFactory {
  let factory = PoolFactory.load(factoryAddress.toHexString());
  if (factory == null) {
    factory = new PoolFactory(factoryAddress.toHexString());
    factory.address = factoryAddress;
    factory.poolCount = BigInt.fromI32(0);
    factory.createdAt = BigInt.fromI32(0);
  }
  return factory as PoolFactory;
}
