import { BigInt } from "@graphprotocol/graph-ts";

// ========================================
// SCALE CONSTANTS
// ========================================

export const SCALE_1E18 = BigInt.fromString("1000000000000000000");
export const SCALE_1E4 = BigInt.fromI32(10000);
export const SCALED_PERCENTAGE = BigInt.fromI32(10000);

// ========================================
// DECIMAL SCALE HELPER
// ========================================

export function getDecimalScale(decimals: i32): BigInt {
  if (decimals == 6) return BigInt.fromString("1000000");
  if (decimals == 8) return BigInt.fromString("100000000");
  if (decimals == 18) return SCALE_1E18;
  
  let scale = BigInt.fromI32(1);
  for (let i = 0; i < decimals; i++) {
    scale = scale.times(BigInt.fromI32(10));
  }
  return scale;
}
