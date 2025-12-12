import { Address } from "@graphprotocol/graph-ts";
import { SwapTokenByPosition as SwapTokenByPositionEvent } from "../../generated/templates/LendingPool/LendingPool";
import { TokenSwappedEvent } from "../../generated/schema";
import { createEventID, getOrCreatePool, getOrCreateUser, getOrCreateUserPoolBalance, updateUserHealthFactor } from "../utils";

export function handleSwapTokenByPosition(event: SwapTokenByPositionEvent): void {
  let pool = getOrCreatePool(event.address);
  let user = getOrCreateUser(event.params.user);
  let swapToken = new TokenSwappedEvent(createEventID(event));

  user.swapsTotal = user.swapsTotal.plus(event.params.amountIn);
  user.swapsCurrent = user.swapsCurrent.plus(event.params.amountIn);
  user.save();

  pool.swapsTotal = pool.swapsTotal.plus(event.params.amountIn);
  pool.swapsCurrent = pool.swapsCurrent.plus(event.params.amountIn);

  let userPoolBalance = getOrCreateUserPoolBalance(user.id, pool, event.block.timestamp);
  
  let collateralToken = Address.fromBytes(pool.collateralToken);
  let borrowToken = Address.fromBytes(pool.borrowToken);
  let tokenIn = event.params.tokenIn;
  let tokenOut = event.params.tokenOut;

  // Swap collateral → borrow token (repay with collateral)
  if (tokenIn.equals(collateralToken) && tokenOut.equals(borrowToken)) {
    userPoolBalance.currentCollateral = userPoolBalance.currentCollateral.minus(event.params.amountIn);
  }
  
  // Swap borrow token → collateral (leverage)
  if (tokenIn.equals(borrowToken) && tokenOut.equals(collateralToken)) {
    userPoolBalance.currentCollateral = userPoolBalance.currentCollateral.plus(event.params.amountOut);
  }

  userPoolBalance.lastUpdated = event.block.timestamp;
  
  let routerAddress = Address.fromBytes(pool.router);
  updateUserHealthFactor(
    userPoolBalance,
    event.address,
    routerAddress,
    event.params.user,
    collateralToken,
    borrowToken,
    pool.borrowAssets,
    pool.borrowShares,
    pool.supplyAssets,
    pool.supplyShares
  );
  
  userPoolBalance.save();
  pool.save();

  swapToken.user = user.id;
  swapToken.pool = pool.id;
  swapToken.tokenIn = event.params.tokenIn;
  swapToken.tokenOut = event.params.tokenOut;
  swapToken.amountIn = event.params.amountIn;
  swapToken.amountOut = event.params.amountOut;
  swapToken.timestamp = event.block.timestamp;
  swapToken.blockNumber = event.block.number;
  swapToken.transactionHash = event.transaction.hash;
  swapToken.save();
}
