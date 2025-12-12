import { Address } from "@graphprotocol/graph-ts";
import {
  BorrowDebt as BorrowDebtEvent,
  RepayByPosition as RepayByPositionEvent,
} from "../../generated/templates/LendingPool/LendingPool";
import { DebtBorrowedEvent, DebtRepaidEvent } from "../../generated/schema";
import { createEventID, getOrCreatePool, getOrCreateUser, getOrCreateUserPoolBalance, updateUserHealthFactor } from "../utils";
import { updatePoolAPY } from "./common";

export function handleBorrowDebt(event: BorrowDebtEvent): void {
  let pool = getOrCreatePool(event.address);
  let user = getOrCreateUser(event.params.user);
  let borrowDebt = new DebtBorrowedEvent(createEventID(event));

  user.borrowsTotal = user.borrowsTotal.plus(event.params.amount);
  user.borrowsCurrent = user.borrowsCurrent.plus(event.params.amount);
  user.save();

  let userPoolBalance = getOrCreateUserPoolBalance(user.id, pool, event.block.timestamp);
  userPoolBalance.currentBorrowAssets = userPoolBalance.currentBorrowAssets.plus(event.params.amount);
  userPoolBalance.currentBorrowShares = userPoolBalance.currentBorrowShares.plus(event.params.shares);
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

  pool.borrowsTotal = pool.borrowsTotal.plus(event.params.amount);
  pool.borrowsCurrent = pool.borrowsCurrent.plus(event.params.amount);

  updatePoolAPY(pool, event.block.timestamp, event.block.number);

  borrowDebt.user = user.id;
  borrowDebt.pool = pool.id;
  borrowDebt.amount = event.params.amount;
  borrowDebt.shares = event.params.shares;
  borrowDebt.chainId = event.params.chainId;
  borrowDebt.addExecutorLzReceiveOption = event.params.addExecutorLzReceiveOption;
  borrowDebt.timestamp = event.block.timestamp;
  borrowDebt.blockNumber = event.block.number;
  borrowDebt.transactionHash = event.transaction.hash;
  borrowDebt.save();
}

export function handleRepayByPosition(event: RepayByPositionEvent): void {
  let pool = getOrCreatePool(event.address);
  let user = getOrCreateUser(event.params.user);
  let repayByPosition = new DebtRepaidEvent(createEventID(event));

  user.repaysTotal = user.repaysTotal.plus(event.params.amount);
  user.repaysCurrent = user.repaysCurrent.plus(event.params.amount);
  user.borrowsCurrent = user.borrowsCurrent.minus(event.params.amount);
  user.save();

  let userPoolBalance = getOrCreateUserPoolBalance(user.id, pool, event.block.timestamp);
  userPoolBalance.currentBorrowAssets = userPoolBalance.currentBorrowAssets.minus(event.params.amount);
  userPoolBalance.currentBorrowShares = userPoolBalance.currentBorrowShares.minus(event.params.shares);
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

  pool.repaysTotal = pool.repaysTotal.plus(event.params.amount);
  pool.repaysCurrent = pool.repaysCurrent.plus(event.params.amount);
  pool.borrowsCurrent = pool.borrowsCurrent.minus(event.params.amount);

  updatePoolAPY(pool, event.block.timestamp, event.block.number);

  repayByPosition.user = user.id;
  repayByPosition.pool = pool.id;
  repayByPosition.amount = event.params.amount;
  repayByPosition.shares = event.params.shares;
  repayByPosition.timestamp = event.block.timestamp;
  repayByPosition.blockNumber = event.block.number;
  repayByPosition.transactionHash = event.transaction.hash;
  repayByPosition.save();
}
