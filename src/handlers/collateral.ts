import { Address } from "@graphprotocol/graph-ts";
import {
  SupplyCollateral as SupplyCollateralEvent,
  WithdrawCollateral as WithdrawCollateralEvent,
} from "../../generated/templates/LendingPool/LendingPool";
import { CollateralSuppliedEvent, CollateralWithdrawnEvent } from "../../generated/schema";
import { createEventID, getOrCreatePool, getOrCreateUser, getOrCreateUserPoolBalance, updateUserHealthFactor } from "../utils";

export function handleSupplyCollateral(event: SupplyCollateralEvent): void {
  let pool = getOrCreatePool(event.address);
  let user = getOrCreateUser(event.params.user);
  let supplyCollateral = new CollateralSuppliedEvent(createEventID(event));

  let userPoolBalance = getOrCreateUserPoolBalance(user.id, pool, event.block.timestamp);
  userPoolBalance.currentCollateral = userPoolBalance.currentCollateral.plus(event.params.amount);
  userPoolBalance.lastUpdated = event.block.timestamp;
  
  let routerAddress = Address.fromBytes(pool.router);
  updateUserHealthFactor(
    userPoolBalance,
    event.address,
    routerAddress,
    event.params.user,
    Address.fromBytes(pool.collateralToken),
    Address.fromBytes(pool.borrowToken),
    pool.borrowAssets,
    pool.borrowShares,
    pool.supplyAssets,
    pool.supplyShares
  );
  
  userPoolBalance.save();

  supplyCollateral.user = user.id;
  supplyCollateral.pool = pool.id;
  supplyCollateral.position = event.params.positionAddress;
  supplyCollateral.amount = event.params.amount;
  supplyCollateral.timestamp = event.block.timestamp;
  supplyCollateral.blockNumber = event.block.number;
  supplyCollateral.transactionHash = event.transaction.hash;
  supplyCollateral.save();
}

export function handleWithdrawCollateral(event: WithdrawCollateralEvent): void {
  let pool = getOrCreatePool(event.address);
  let user = getOrCreateUser(event.params.user);
  let withdrawCollateral = new CollateralWithdrawnEvent(createEventID(event));

  let userPoolBalance = getOrCreateUserPoolBalance(user.id, pool, event.block.timestamp);
  userPoolBalance.currentCollateral = userPoolBalance.currentCollateral.minus(event.params.amount);
  userPoolBalance.lastUpdated = event.block.timestamp;
  
  let routerAddress = Address.fromBytes(pool.router);
  updateUserHealthFactor(
    userPoolBalance,
    event.address,
    routerAddress,
    event.params.user,
    Address.fromBytes(pool.collateralToken),
    Address.fromBytes(pool.borrowToken),
    pool.borrowAssets,
    pool.borrowShares,
    pool.supplyAssets,
    pool.supplyShares
  );
  
  userPoolBalance.save();

  withdrawCollateral.user = user.id;
  withdrawCollateral.pool = pool.id;
  withdrawCollateral.amount = event.params.amount;
  withdrawCollateral.timestamp = event.block.timestamp;
  withdrawCollateral.blockNumber = event.block.number;
  withdrawCollateral.transactionHash = event.transaction.hash;
  withdrawCollateral.save();
}
