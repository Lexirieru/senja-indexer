import { BigInt, Address } from "@graphprotocol/graph-ts";
import { User } from "../../../generated/schema";

export function getOrCreateUser(userAddress: Address): User {
  let user = User.load(userAddress.toHexString());
  if (user == null) {
    user = new User(userAddress.toHexString());
    user.address = userAddress;
    user.depositsTotal = BigInt.fromI32(0);
    user.withdrawalsTotal = BigInt.fromI32(0);
    user.borrowsTotal = BigInt.fromI32(0);
    user.repaysTotal = BigInt.fromI32(0);
    user.swapsTotal = BigInt.fromI32(0);
    user.depositsCurrent = BigInt.fromI32(0);
    user.withdrawalsCurrent = BigInt.fromI32(0);
    user.borrowsCurrent = BigInt.fromI32(0);
    user.repaysCurrent = BigInt.fromI32(0);
    user.swapsCurrent = BigInt.fromI32(0);
  }
  return user as User;
}
