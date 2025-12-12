import { BigInt, Address } from "@graphprotocol/graph-ts";
import { UserPoolBalance } from "../../generated/schema";
import { getTokenDecimals } from "./tokens";
import { SCALE_1E18, SCALE_1E4, getDecimalScale } from "./constants";
import {
  readTokenDataStreamAddress,
  readTokenPrice,
  readLTV,
  readUserBorrowShares,
  readUserSupplyShares
} from "./reads";

// ============================================
// CALCULATION FUNCTIONS
// ============================================

export function calculateUserBorrowAssets(
  userBorrowShares: BigInt,
  totalBorrowAssets: BigInt,
  totalBorrowShares: BigInt
): BigInt {
  if (totalBorrowShares.equals(BigInt.fromI32(0))) {
    return BigInt.fromI32(0);
  }
  return userBorrowShares.times(totalBorrowAssets).div(totalBorrowShares);
}

export function calculateUserSupplyAssets(
  userSupplyShares: BigInt,
  totalSupplyAssets: BigInt,
  totalSupplyShares: BigInt
): BigInt {
  if (totalSupplyShares.equals(BigInt.fromI32(0))) {
    return BigInt.fromI32(0);
  }
  return userSupplyShares.times(totalSupplyAssets).div(totalSupplyShares);
}

export function calculateHealthFactor(
  collateralAmount: BigInt,
  ltv: BigInt,
  userBorrowAssets: BigInt,
  priceRatio: BigInt,
  collateralDecimals: i32,
  borrowDecimals: i32
): BigInt {
  if (userBorrowAssets.equals(BigInt.fromI32(0))) {
    return BigInt.fromI32(0);
  }

  let collateralScale = getDecimalScale(collateralDecimals);
  let borrowScale = getDecimalScale(borrowDecimals);

  let collateralValue = collateralAmount
    .times(priceRatio)
    .times(borrowScale)
    .div(collateralScale)
    .div(SCALE_1E18);

  let healthFactor = collateralValue
    .times(ltv)
    .times(SCALE_1E4)
    .div(userBorrowAssets)
    .div(SCALE_1E18);

  return healthFactor;
}

// ============================================
// MAIN UPDATE FUNCTION
// ============================================

export function updateUserHealthFactor(
  balance: UserPoolBalance,
  poolAddress: Address,
  routerAddress: Address,
  userAddress: Address,
  collateralToken: Address,
  borrowToken: Address,
  totalBorrowAssets: BigInt,
  totalBorrowShares: BigInt,
  totalSupplyAssets: BigInt,
  totalSupplyShares: BigInt
): void {
  let ltv = readLTV(routerAddress);
  if (ltv !== null) {
    balance.ltv = ltv;
  }

  let userBorrowShares = readUserBorrowShares(routerAddress, userAddress);
  let userSupplyShares = readUserSupplyShares(routerAddress, userAddress);

  if (userBorrowShares !== null) {
    balance.currentBorrowShares = userBorrowShares;
    balance.currentBorrowAssets = calculateUserBorrowAssets(
      userBorrowShares,
      totalBorrowAssets,
      totalBorrowShares
    );
  }

  if (userSupplyShares !== null) {
    balance.currentSupplyShares = userSupplyShares;
    balance.currentSupplyAssets = calculateUserSupplyAssets(
      userSupplyShares,
      totalSupplyAssets,
      totalSupplyShares
    );
  }

  let oracleAddress = readTokenDataStreamAddress();
  let priceRatio = SCALE_1E18;

  if (oracleAddress !== null) {
    balance.oracleAddress = oracleAddress;

    let collateralPrice = readTokenPrice(oracleAddress, collateralToken);
    let borrowPrice = readTokenPrice(oracleAddress, borrowToken);

    if (collateralPrice !== null) balance.collateralPrice = collateralPrice;
    if (borrowPrice !== null) balance.borrowPrice = borrowPrice;

    if (collateralPrice !== null && borrowPrice !== null && !borrowPrice.equals(BigInt.fromI32(0))) {
      priceRatio = collateralPrice.times(SCALE_1E18).div(borrowPrice);
    }
  }

  balance.priceRatio = priceRatio;

  let collateralDecimals = getTokenDecimals(collateralToken);
  let borrowDecimals = getTokenDecimals(borrowToken);
  let collateralScale = getDecimalScale(collateralDecimals);
  let borrowScale = getDecimalScale(borrowDecimals);

  balance.collateralValue = balance.currentCollateral
    .times(priceRatio)
    .times(borrowScale)
    .div(collateralScale)
    .div(SCALE_1E18);

  if (ltv !== null) {
    balance.healthFactor = calculateHealthFactor(
      balance.currentCollateral,
      ltv,
      balance.currentBorrowAssets,
      priceRatio,
      collateralDecimals,
      borrowDecimals
    );
  }
}
