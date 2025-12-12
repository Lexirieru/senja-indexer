import {
  SupplyLiquidity as SupplyLiquidityEvent,
  WithdrawLiquidity as WithdrawLiquidityEvent,
} from "../../generated/templates/LendingPool/LendingPool";
import { LiquiditySuppliedEvent, LiquidityWithdrawnEvent } from "../../generated/schema";
import { createEventID, getOrCreatePool, getOrCreateUser, getOrCreateUserPoolBalance } from "../utils";
import { updatePoolAPY } from "./common";

export function handleSupplyLiquidity(event: SupplyLiquidityEvent): void {
  let pool = getOrCreatePool(event.address);
  let user = getOrCreateUser(event.params.user);
  let supplyLiquidity = new LiquiditySuppliedEvent(createEventID(event));

  user.depositsTotal = user.depositsTotal.plus(event.params.amount);
  user.depositsCurrent = user.depositsCurrent.plus(event.params.amount);
  user.save();

  let userPoolBalance = getOrCreateUserPoolBalance(user.id, pool, event.block.timestamp);
  userPoolBalance.currentSupplyAssets = userPoolBalance.currentSupplyAssets.plus(event.params.amount);
  userPoolBalance.currentSupplyShares = userPoolBalance.currentSupplyShares.plus(event.params.shares);
  userPoolBalance.lastUpdated = event.block.timestamp;
  userPoolBalance.save();

  pool.depositsTotal = pool.depositsTotal.plus(event.params.amount);
  pool.depositsCurrent = pool.depositsCurrent.plus(event.params.amount);

  updatePoolAPY(pool, event.block.timestamp, event.block.number);

  supplyLiquidity.user = user.id;
  supplyLiquidity.pool = pool.id;
  supplyLiquidity.amount = event.params.amount;
  supplyLiquidity.shares = event.params.shares;
  supplyLiquidity.timestamp = event.block.timestamp;
  supplyLiquidity.blockNumber = event.block.number;
  supplyLiquidity.transactionHash = event.transaction.hash;
  supplyLiquidity.save();
}

export function handleWithdrawLiquidity(event: WithdrawLiquidityEvent): void {
  let pool = getOrCreatePool(event.address);
  let user = getOrCreateUser(event.params.user);
  let withdrawLiquidity = new LiquidityWithdrawnEvent(createEventID(event));

  user.withdrawalsTotal = user.withdrawalsTotal.plus(event.params.amount);
  user.withdrawalsCurrent = user.withdrawalsCurrent.plus(event.params.amount);
  user.depositsCurrent = user.depositsCurrent.minus(event.params.amount);
  user.save();

  let userPoolBalance = getOrCreateUserPoolBalance(user.id, pool, event.block.timestamp);
  userPoolBalance.currentSupplyAssets = userPoolBalance.currentSupplyAssets.minus(event.params.amount);
  userPoolBalance.currentSupplyShares = userPoolBalance.currentSupplyShares.minus(event.params.shares);
  userPoolBalance.lastUpdated = event.block.timestamp;
  userPoolBalance.save();

  pool.withdrawalsTotal = pool.withdrawalsTotal.plus(event.params.amount);
  pool.withdrawalsCurrent = pool.withdrawalsCurrent.plus(event.params.amount);
  pool.depositsCurrent = pool.depositsCurrent.minus(event.params.amount);

  updatePoolAPY(pool, event.block.timestamp, event.block.number);

  withdrawLiquidity.user = user.id;
  withdrawLiquidity.pool = pool.id;
  withdrawLiquidity.amount = event.params.amount;
  withdrawLiquidity.shares = event.params.shares;
  withdrawLiquidity.timestamp = event.block.timestamp;
  withdrawLiquidity.blockNumber = event.block.number;
  withdrawLiquidity.transactionHash = event.transaction.hash;
  withdrawLiquidity.save();
}
